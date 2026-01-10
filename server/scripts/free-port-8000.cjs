#!/usr/bin/env node
const { spawnSync } = require('child_process');
const os = require('os');

function listPidsWindows(port) {
  const ps = spawnSync('powershell', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-Command',
    `Get-NetTCPConnection -LocalPort ${port} -State Listen | Select-Object -ExpandProperty OwningProcess -Unique`
  ], { encoding: 'utf8' });
  if (ps.error) return { error: ps.error.message };
  const out = (ps.stdout || '').trim();
  const pids = out ? out.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(Number) : [];
  return { pids };
}

function stopPidWindows(pid) {
  spawnSync('powershell', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-Command',
    `Stop-Process -Id ${pid} -Force -ErrorAction SilentlyContinue`
  ]);
}

const port = 8000;
const kill = process.argv.includes('--kill');

if (os.platform() === 'win32') {
  const { pids, error } = listPidsWindows(port);
  if (error) {
    console.error('Failed to inspect port:', error);
    process.exit(1);
  }
  if (!pids || pids.length === 0) {
    console.log(`No process listening on port ${port}.`);
    process.exit(0);
  }
  console.log(`Processes on port ${port}:`, pids.join(', '));
  if (kill) {
    for (const pid of pids) {
      try { stopPidWindows(pid); console.log(`Stopped PID ${pid}.`); } catch {}
    }
  } else {
    console.log('\nRun with --kill to stop them:');
    console.log('  node scripts/free-port-8000.cjs --kill');
  }
} else {
  console.log('Non-Windows OS: please free port manually (e.g., lsof -i :8000).');
}
