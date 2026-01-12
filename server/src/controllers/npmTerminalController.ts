import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

interface CommandConfig {
  key: string;
  cwd: string;
  command: string;
  args: string[];
  timeoutMs: number;
  description: string;
}

const repoRoot = path.resolve(process.cwd(), '..');

const COMMANDS: Record<string, CommandConfig> = {
  'client-dev': {
    key: 'client-dev',
    cwd: path.join(repoRoot, 'client'),
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'dev'],
    timeoutMs: 10000,
    description: 'Start client development server'
  },
  'server-dev': {
    key: 'server-dev',
    cwd: process.cwd(),
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'dev'],
    timeoutMs: 10000,
    description: 'Start server development'
  },
  'root-build': {
    key: 'root-build',
    cwd: repoRoot,
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'build'],
    timeoutMs: 120000,
    description: 'Build repository root'
  },
  'root-lint': {
    key: 'root-lint',
    cwd: repoRoot,
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'lint'],
    timeoutMs: 60000,
    description: 'Lint repository root'
  }
};

export const runNpmScript = (req: Request, res: Response) => {
  const { scriptKey } = req.body as { scriptKey?: string };

  if (!scriptKey || !COMMANDS[scriptKey]) {
    res.status(400).json({ success: false, error: 'Invalid or unsupported npm script.' });
    return;
  }

  const config = COMMANDS[scriptKey];
  const child = spawn(config.command, config.args, {
    cwd: config.cwd,
    env: { ...process.env },
    shell: process.platform === 'win32'
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
