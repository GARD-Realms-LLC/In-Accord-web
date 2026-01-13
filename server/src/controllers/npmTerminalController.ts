import { Request, Response } from 'express';
import { spawn, spawnSync, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

type ScriptMode = 'persistent' | 'oneshot';
type ScriptAction = 'start' | 'stop' | 'restart' | 'status' | 'run';

interface CommandConfig {
  key: string;
  cwd: string;
  command: string;
  args: string[];
  timeoutMs: number;
  description: string;
  mode: ScriptMode;
  port?: number;
}

interface ProcessSnapshot {
  status: 'running' | 'stopped';
  stdout: string[];
  stderr: string[];
  startedAt?: string;
  stoppedAt?: string;
  lastOutputAt?: string;
  exitCode?: number | null;
  pid?: number;
}

interface ManagedProcess {
  scriptKey: string;
  child: ChildProcessWithoutNullStreams;
}

const repoRoot = path.resolve(process.cwd(), '..');
const isWindows = process.platform === 'win32';
const MAX_BUFFER_LINES = 200;
const POWERSHELL_BASE_ARGS = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command'];

const COMMANDS: Record<string, CommandConfig> = {
  'client-dev': {
    key: 'client-dev',
    cwd: path.join(repoRoot, 'client'),
    command: isWindows ? 'npm.cmd' : 'npm',
    args: ['run', 'dev'],
    timeoutMs: 10000,
    description: 'Start client development server',
    mode: 'persistent',
    port: 3000
  },
  'server-dev': {
    key: 'server-dev',
    cwd: process.cwd(),
    command: isWindows ? 'npm.cmd' : 'npm',
    args: ['run', 'dev'],
    timeoutMs: 10000,
    description: 'Start server development',
    mode: 'persistent',
    port: 8000
  },
  'root-build': {
    key: 'root-build',
    cwd: repoRoot,
    command: isWindows ? 'npm.cmd' : 'npm',
    args: ['run', 'build'],
    timeoutMs: 120000,
    description: 'Build repository root',
    mode: 'oneshot'
  },
  'root-lint': {
    key: 'root-lint',
    cwd: repoRoot,
    command: isWindows ? 'npm.cmd' : 'npm',
    args: ['run', 'lint'],
    timeoutMs: 60000,
    description: 'Lint repository root',
    mode: 'oneshot'
  }
};

const processSnapshots: Record<string, ProcessSnapshot> = {};
const activeProcesses: Record<string, ManagedProcess | undefined> = {};
const PROCESS_SETTLE_DELAY_MS = 1200;

const ensureSnapshot = (scriptKey: string): ProcessSnapshot => {
  if (!processSnapshots[scriptKey]) {
    processSnapshots[scriptKey] = { status: 'stopped', stdout: [], stderr: [] };
  }
  return processSnapshots[scriptKey];
};

const appendBufferedLines = (buffer: string[], chunk: Buffer | string) => {
  const text = chunk.toString();
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  for (const line of lines) {
    buffer.push(line);
    if (buffer.length > MAX_BUFFER_LINES) {
      buffer.shift();
    }
  }
};

const terminateChild = async (child: ChildProcessWithoutNullStreams) => {
  await new Promise<void>((resolve) => {
    let settled = false;
    const finalize = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    child.once('close', finalize);
    child.once('exit', finalize);

    if (isWindows && child.pid) {
      spawn('taskkill', ['/pid', child.pid.toString(), '/t', '/f']);
    } else {
      child.kill('SIGTERM');
    }

    setTimeout(() => {
      if (!child.killed) {
        child.kill('SIGKILL');
      }
    }, 5000).unref();
  });
};

const formatOutput = (snapshot: ProcessSnapshot) => ({
  stdout: snapshot.stdout.join('\n'),
  stderr: snapshot.stderr.join('\n')
});

const startPersistentProcess = (config: CommandConfig) => {
  const existingSnapshot = ensureSnapshot(config.key);
  existingSnapshot.status = 'running';
  existingSnapshot.stdout = [];
  existingSnapshot.stderr = [];
  existingSnapshot.startedAt = new Date().toISOString();
  existingSnapshot.lastOutputAt = existingSnapshot.startedAt;

  const child = spawn(config.command, config.args, {
    cwd: config.cwd,
    env: { ...process.env },
    shell: isWindows
  }) as ChildProcessWithoutNullStreams;

  existingSnapshot.pid = child.pid ?? undefined;
  activeProcesses[config.key] = { scriptKey: config.key, child };

  child.stdout.on('data', (chunk: Buffer) => {
    appendBufferedLines(existingSnapshot.stdout, chunk);
    existingSnapshot.lastOutputAt = new Date().toISOString();
  });

  child.stderr.on('data', (chunk: Buffer) => {
    appendBufferedLines(existingSnapshot.stderr, chunk);
    existingSnapshot.lastOutputAt = new Date().toISOString();
  });

  child.on('error', (error) => {
    appendBufferedLines(existingSnapshot.stderr, error.message);
  });

  child.on('close', (code) => {
    existingSnapshot.status = 'stopped';
    existingSnapshot.exitCode = code ?? null;
    existingSnapshot.stoppedAt = new Date().toISOString();
    activeProcesses[config.key] = undefined;
  });

  return existingSnapshot;
};

const runOneShotCommand = (config: CommandConfig, res: Response) => {
  const child = spawn(config.command, config.args, {
    cwd: config.cwd,
    env: { ...process.env },
    shell: isWindows
  });

  let stdout = '';
  let stderr = '';
  let timedOut = false;
  let settled = false;

  const timeoutHandle = setTimeout(() => {
    timedOut = true;
    child.kill('SIGTERM');
  }, config.timeoutMs);

  child.stdout.on('data', (chunk: Buffer) => {
    stdout += chunk.toString();
  });

  child.stderr.on('data', (chunk: Buffer) => {
    stderr += chunk.toString();
  });

  child.on('error', (error) => {
    if (settled) return;
    clearTimeout(timeoutHandle);
    settled = true;
    res.status(500).json({ success: false, error: error.message, output: { stdout, stderr } });
  });

  child.on('close', (code) => {
    if (settled) return;
    clearTimeout(timeoutHandle);
    settled = true;
    res.json({
      success: timedOut || code === 0,
      exitCode: code,
      timedOut,
      output: { stdout, stderr },
      finishedAt: new Date().toISOString()
    });
  });
};

const respondWithSnapshot = (
  res: Response,
  scriptKey: string,
  extras: Record<string, unknown> & { success?: boolean } = {}
) => {
  const { success, ...rest } = extras;
  const snapshot = ensureSnapshot(scriptKey);
  return res.json({
    success: typeof success === 'boolean' ? success : true,
    status: snapshot.status,
    output: formatOutput(snapshot),
    meta: {
      startedAt: snapshot.startedAt,
      stoppedAt: snapshot.stoppedAt,
      lastOutputAt: snapshot.lastOutputAt,
      exitCode: snapshot.exitCode,
      pid: snapshot.pid
    },
    ...rest
  });
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const listPortListeners = (port: number): number[] => {
  try {
    if (isWindows) {
      const ps = spawnSync('powershell', [
        ...POWERSHELL_BASE_ARGS,
        `Get-NetTCPConnection -LocalPort ${port} -State Listen | Select-Object -ExpandProperty OwningProcess -Unique`
      ], { encoding: 'utf8' });
      if (ps.error) return [];
      const out = (ps.stdout || '').trim();
      if (!out) return [];
      return out.split(/\r?\n/).map((line) => parseInt(line.trim(), 10)).filter((pid) => Number.isFinite(pid) && pid > 0);
    }
    const proc = spawnSync('sh', ['-c', `lsof -ti tcp:${port} -s TCP:LISTEN`], { encoding: 'utf8' });
    const out = (proc.stdout || '').trim();
    if (!out) return [];
    return out.split(/\r?\n/).map((line) => parseInt(line.trim(), 10)).filter((pid) => Number.isFinite(pid) && pid > 0);
  } catch {
    return [];
  }
};

const killProcessesByPid = (pids: number[]): number[] => {
  const killed: number[] = [];
  for (const pid of pids) {
    if (!pid) continue;
    try {
      if (isWindows) {
        spawnSync('powershell', [
          ...POWERSHELL_BASE_ARGS,
          `Stop-Process -Id ${pid} -Force -ErrorAction SilentlyContinue`
        ]);
      } else {
        spawnSync('kill', ['-9', String(pid)]);
      }
      killed.push(pid);
    } catch {
      // ignore errors per PID
    }
  }
  return killed;
};

const forceKillPortListeners = (port?: number): number[] => {
  if (!port) return [];
  const listeners = listPortListeners(port);
  if (!listeners.length) return [];
  return killProcessesByPid(listeners);
};

export const runNpmScript = async (req: Request, res: Response) => {
  const { scriptKey, action } = req.body as { scriptKey?: string; action?: ScriptAction };

  if (!scriptKey || !COMMANDS[scriptKey]) {
    res.status(400).json({ success: false, error: 'Invalid or unsupported npm script.' });
    return;
  }

  const config = COMMANDS[scriptKey];
  const normalizedAction: ScriptAction = action ?? (config.mode === 'persistent' ? 'start' : 'run');

  if (config.mode === 'persistent') {
    let pendingPortCleanupPids: number[] = [];
    if (!['start', 'stop', 'restart', 'status'].includes(normalizedAction)) {
      res.status(400).json({ success: false, error: `Unsupported action "${normalizedAction}" for persistent script.` });
      return;
    }

    if (normalizedAction === 'status') {
      respondWithSnapshot(res, scriptKey, { message: `${config.description} status fetched.` });
      return;
    }

    if (normalizedAction === 'stop' || normalizedAction === 'restart') {
      const managed = activeProcesses[scriptKey];
      if (!managed) {
        ensureSnapshot(scriptKey).status = 'stopped';
        if (normalizedAction === 'stop') {
          const orphaned = forceKillPortListeners(config.port);
          const message = orphaned.length
            ? `${config.description} listeners cleared on port ${config.port}.`
            : `${config.description} is already stopped.`;
          const extras: Record<string, unknown> = { message };
          if (orphaned.length) extras.forcedPids = orphaned;
          respondWithSnapshot(res, scriptKey, extras);
          return;
        }
        pendingPortCleanupPids = forceKillPortListeners(config.port);
      } else {
        await terminateChild(managed.child);
      }
    }

    if (normalizedAction === 'start' || normalizedAction === 'restart') {
      if (normalizedAction === 'start' && activeProcesses[scriptKey]) {
        respondWithSnapshot(res, scriptKey, { message: `${config.description} is already running.`, alreadyRunning: true });
        return;
      }

      const portCleanupBeforeStart = forceKillPortListeners(config.port);
      if (portCleanupBeforeStart.length) {
        pendingPortCleanupPids = [...pendingPortCleanupPids, ...portCleanupBeforeStart];
      }

      startPersistentProcess(config);
      await wait(PROCESS_SETTLE_DELAY_MS);
      const snapshot = ensureSnapshot(scriptKey);
      const isRunning = snapshot.status === 'running';
      const forcedNote = pendingPortCleanupPids.length && config.port
        ? ` Freed port ${config.port} by stopping ${pendingPortCleanupPids.length} process(es).`
        : '';
      const message = isRunning
        ? `${config.description} ${normalizedAction === 'restart' ? 'restarted' : 'started'}.${forcedNote}`
        : `${config.description} failed to ${normalizedAction === 'restart' ? 'restart' : 'start'}. Check output for details.${forcedNote}`;
      const extras: Record<string, unknown> = { success: isRunning, message };
      if (pendingPortCleanupPids.length) {
        extras.forcedPids = Array.from(new Set(pendingPortCleanupPids));
      }

      respondWithSnapshot(res, scriptKey, extras);
      return;
    }

    if (normalizedAction === 'stop') {
      const orphaned = forceKillPortListeners(config.port);
      const extras: Record<string, unknown> = { message: `${config.description} stopped.` };
      if (orphaned.length) extras.forcedPids = orphaned;
      respondWithSnapshot(res, scriptKey, extras);
      return;
    }

    return;
  }

  if (normalizedAction !== 'run') {
    res.status(400).json({ success: false, error: `Unsupported action "${normalizedAction}" for script ${scriptKey}.` });
    return;
  }

  runOneShotCommand(config, res);
};
