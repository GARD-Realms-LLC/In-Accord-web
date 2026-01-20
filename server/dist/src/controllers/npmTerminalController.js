"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNpmScript = void 0;
const safeJson_1 = require("../lib/safeJson");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const repoRoot = path_1.default.resolve(process.cwd(), '..');
const isWindows = process.platform === 'win32';
const MAX_BUFFER_LINES = 200;
const POWERSHELL_BASE_ARGS = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command'];
const COMMANDS = {
    'client-dev': {
        key: 'client-dev',
        cwd: path_1.default.join(repoRoot, 'client'),
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
const processSnapshots = {};
const activeProcesses = {};
const PROCESS_SETTLE_DELAY_MS = 1200;
const ensureSnapshot = (scriptKey) => {
    if (!processSnapshots[scriptKey]) {
        processSnapshots[scriptKey] = { status: 'stopped', stdout: [], stderr: [] };
    }
    return processSnapshots[scriptKey];
};
const appendBufferedLines = (buffer, chunk) => {
    const text = chunk.toString();
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
    for (const line of lines) {
        buffer.push(line);
        if (buffer.length > MAX_BUFFER_LINES) {
            buffer.shift();
        }
    }
};
const terminateChild = (child) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => {
        let settled = false;
        const finalize = () => {
            if (settled)
                return;
            settled = true;
            resolve();
        };
        child.once('close', finalize);
        child.once('exit', finalize);
        if (isWindows && child.pid) {
            (0, child_process_1.spawn)('taskkill', ['/pid', child.pid.toString(), '/t', '/f']);
        }
        else {
            child.kill('SIGTERM');
        }
        setTimeout(() => {
            if (!child.killed) {
                child.kill('SIGKILL');
            }
        }, 5000).unref();
    });
});
const formatOutput = (snapshot) => ({
    stdout: snapshot.stdout.join('\n'),
    stderr: snapshot.stderr.join('\n')
});
const startPersistentProcess = (config) => {
    var _a;
    const existingSnapshot = ensureSnapshot(config.key);
    existingSnapshot.status = 'running';
    existingSnapshot.stdout = [];
    existingSnapshot.stderr = [];
    existingSnapshot.startedAt = new Date().toISOString();
    existingSnapshot.lastOutputAt = existingSnapshot.startedAt;
    const child = (0, child_process_1.spawn)(config.command, config.args, {
        cwd: config.cwd,
        env: Object.assign({}, process.env),
        shell: isWindows
    });
    existingSnapshot.pid = (_a = child.pid) !== null && _a !== void 0 ? _a : undefined;
    activeProcesses[config.key] = { scriptKey: config.key, child };
    child.stdout.on('data', (chunk) => {
        appendBufferedLines(existingSnapshot.stdout, chunk);
        existingSnapshot.lastOutputAt = new Date().toISOString();
    });
    child.stderr.on('data', (chunk) => {
        appendBufferedLines(existingSnapshot.stderr, chunk);
        existingSnapshot.lastOutputAt = new Date().toISOString();
    });
    child.on('error', (error) => {
        appendBufferedLines(existingSnapshot.stderr, error.message);
    });
    child.on('close', (code) => {
        existingSnapshot.status = 'stopped';
        existingSnapshot.exitCode = code !== null && code !== void 0 ? code : null;
        existingSnapshot.stoppedAt = new Date().toISOString();
        activeProcesses[config.key] = undefined;
    });
    return existingSnapshot;
};
const runOneShotCommand = (config, res) => {
    const child = (0, child_process_1.spawn)(config.command, config.args, {
        cwd: config.cwd,
        env: Object.assign({}, process.env),
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
    child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
    });
    child.on('error', (error) => {
        if (settled)
            return;
        clearTimeout(timeoutHandle);
        settled = true;
        res.status(500).json({ success: false, error: error.message, output: { stdout, stderr } });
    });
    child.on('close', (code) => {
        if (settled)
            return;
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
const respondWithSnapshot = (res, scriptKey, extras = {}) => {
    const { success } = extras, rest = __rest(extras, ["success"]);
    const snapshot = ensureSnapshot(scriptKey);
    return res.json(Object.assign({ success: typeof success === 'boolean' ? success : true, status: snapshot.status, output: formatOutput(snapshot), meta: {
            startedAt: snapshot.startedAt,
            stoppedAt: snapshot.stoppedAt,
            lastOutputAt: snapshot.lastOutputAt,
            exitCode: snapshot.exitCode,
            pid: snapshot.pid
        } }, rest));
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const listPortListeners = (port) => {
    try {
        if (isWindows) {
            const ps = (0, child_process_1.spawnSync)('powershell', [
                ...POWERSHELL_BASE_ARGS,
                `Get-NetTCPConnection -LocalPort ${port} -State Listen | Select-Object -ExpandProperty OwningProcess -Unique`
            ], { encoding: 'utf8' });
            if (ps.error)
                return [];
            const out = (ps.stdout || '').trim();
            if (!out)
                return [];
            return out.split(/\r?\n/).map((line) => parseInt(line.trim(), 10)).filter((pid) => Number.isFinite(pid) && pid > 0);
        }
        const proc = (0, child_process_1.spawnSync)('sh', ['-c', `lsof -ti tcp:${port} -s TCP:LISTEN`], { encoding: 'utf8' });
        const out = (proc.stdout || '').trim();
        if (!out)
            return [];
        return out.split(/\r?\n/).map((line) => parseInt(line.trim(), 10)).filter((pid) => Number.isFinite(pid) && pid > 0);
    }
    catch (_a) {
        return [];
    }
};
const killProcessesByPid = (pids) => {
    const killed = [];
    for (const pid of pids) {
        if (!pid)
            continue;
        try {
            if (isWindows) {
                (0, child_process_1.spawnSync)('powershell', [
                    ...POWERSHELL_BASE_ARGS,
                    `Stop-Process -Id ${pid} -Force -ErrorAction SilentlyContinue`
                ]);
            }
            else {
                (0, child_process_1.spawnSync)('kill', ['-9', String(pid)]);
            }
            killed.push(pid);
        }
        catch (_a) {
            // ignore errors per PID
        }
    }
    return killed;
};
const forceKillPortListeners = (port) => {
    if (!port)
        return [];
    const listeners = listPortListeners(port);
    if (!listeners.length)
        return [];
    return killProcessesByPid(listeners);
};
function parseLenientBody(req) {
    // Prefer already-parsed body
    const asBody = req.body;
    if (asBody && typeof asBody === 'object' && Object.keys(asBody).length) {
        // If client sent form-encoded body like raw={...}, express.urlencoded will produce { raw: '...'}.
        // If scriptKey is present, return as-is. Otherwise, if a single 'raw' field exists, try parsing it.
        if (typeof asBody.scriptKey === 'string' || typeof asBody.action === 'string')
            return asBody;
        if (typeof asBody.raw === 'string') {
            // continue parsing using the raw string payload below
            // reuse variable name 'payload' by falling through
            // note: do not return early
        }
        else {
            return asBody;
        }
    }
    // Try rawBody tolerant JSON parse
    // prefer explicit rawBody populated by our JSON middleware, fall back to body.raw
    const raw = req.rawBody || req.raw || (req.body && req.body.raw);
    if (!raw || typeof raw !== 'string')
        return {};
    // If raw starts with "raw=...", strip prefix
    let payload = raw;
    if (payload.startsWith('raw='))
        payload = payload.slice(4);
    // Try strict JSON parse first (use tolerant parser to avoid throwing)
    try {
        const strict = (0, safeJson_1.safeTryParseString)(payload);
        if (strict !== null)
            return strict;
    }
    catch (_a) {
        // Heuristic parse for patterns like {scriptKey:server-dev,action:status}
        const m = payload.match(/^\{\s*([\s\S]*)\s*\}$/);
        if (m) {
            const inner = m[1];
            const parts = inner.split(/\s*,\s*/g);
            const out = {};
            for (const part of parts) {
                const [k, v] = part.split(/\s*:\s*/);
                if (!k)
                    continue;
                const key = k.replace(/^"|"$/g, '').trim();
                let val = (v !== null && v !== void 0 ? v : '').trim();
                // strip surrounding quotes if present
                val = val.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
                out[key] = val;
            }
            return out;
        }
        // Fallback: attempt URLSearchParams parse (for form-encoded bodies)
        try {
            const params = new URLSearchParams(payload);
            const obj = {};
            for (const [k, v] of params.entries())
                obj[k] = v;
            return obj;
        }
        catch (_b) {
            return {};
        }
    }
}
const runNpmScript = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedBody = parseLenientBody(req);
    const { scriptKey, action } = parsedBody;
    if (!scriptKey || !COMMANDS[scriptKey]) {
        res.status(400).json({ success: false, error: 'Invalid or unsupported npm script.' });
        return;
    }
    const config = COMMANDS[scriptKey];
    const normalizedAction = action !== null && action !== void 0 ? action : (config.mode === 'persistent' ? 'start' : 'run');
    if (config.mode === 'persistent') {
        let pendingPortCleanupPids = [];
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
                    const extras = { message };
                    if (orphaned.length)
                        extras.forcedPids = orphaned;
                    respondWithSnapshot(res, scriptKey, extras);
                    return;
                }
                pendingPortCleanupPids = forceKillPortListeners(config.port);
            }
            else {
                yield terminateChild(managed.child);
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
            yield wait(PROCESS_SETTLE_DELAY_MS);
            const snapshot = ensureSnapshot(scriptKey);
            const isRunning = snapshot.status === 'running';
            const forcedNote = pendingPortCleanupPids.length && config.port
                ? ` Freed port ${config.port} by stopping ${pendingPortCleanupPids.length} process(es).`
                : '';
            const message = isRunning
                ? `${config.description} ${normalizedAction === 'restart' ? 'restarted' : 'started'}.${forcedNote}`
                : `${config.description} failed to ${normalizedAction === 'restart' ? 'restart' : 'start'}. Check output for details.${forcedNote}`;
            const extras = { success: isRunning, message };
            if (pendingPortCleanupPids.length) {
                extras.forcedPids = Array.from(new Set(pendingPortCleanupPids));
            }
            respondWithSnapshot(res, scriptKey, extras);
            return;
        }
        if (normalizedAction === 'stop') {
            const orphaned = forceKillPortListeners(config.port);
            const extras = { message: `${config.description} stopped.` };
            if (orphaned.length)
                extras.forcedPids = orphaned;
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
});
exports.runNpmScript = runNpmScript;
