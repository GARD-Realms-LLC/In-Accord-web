"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNpmScript = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const repoRoot = path_1.default.resolve(process.cwd(), '..');
const COMMANDS = {
    'client-dev': {
        key: 'client-dev',
        cwd: path_1.default.join(repoRoot, 'client'),
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
const runNpmScript = (req, res) => {
    const { scriptKey } = req.body;
    if (!scriptKey || !COMMANDS[scriptKey]) {
        res.status(400).json({ success: false, error: 'Invalid or unsupported npm script.' });
        return;
    }
    const config = COMMANDS[scriptKey];
    const child = (0, child_process_1.spawn)(config.command, config.args, {
        cwd: config.cwd,
        env: Object.assign({}, process.env),
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
exports.runNpmScript = runNpmScript;
