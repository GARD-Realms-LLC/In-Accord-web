"use client";

import { useEffect, useState, useRef } from 'react';

const Support = (props: Props) => {
  // Live chat messages
  const [messages, setMessages] = useState<{ id: string; author: 'You' | 'Support' | 'System'; text: string; time: string }[]>([
    { id: 'm1', author: 'System', text: 'Welcome to In-Accord support — how can we help today?', time: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // persist chat to localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('inaccord_chat') : null;
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { if (typeof window !== 'undefined') localStorage.setItem('inaccord_chat', JSON.stringify(messages)); } catch {}
  }, [messages]);

  const sendChat = () => {
    const txt = chatInput.trim();
    if (!txt) return;
    const msg = { id: 'u' + Math.random().toString(36).slice(2,9), author: 'You' as const, text: txt, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, msg]);
    setChatInput('');

    // simulate a support reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: 's' + Math.random().toString(36).slice(2,9), author: 'Support', text: 'Thanks — we received your message and will respond shortly.', time: new Date().toLocaleTimeString() }]);
    }, 900);
  };

  // Email form state
  const [emailName, setEmailName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const submitEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailName.trim() || !emailAddress.trim() || !emailMessage.trim()) { alert('Please fill name, email and message.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) { alert('Please provide a valid email.'); return; }
    // POST to server endpoint (mock)
    (async () => {
      try {
        const res = await fetch('/api/support/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: emailName, email: emailAddress, subject: emailSubject, message: emailMessage }) });
        if (!res.ok) throw new Error('Server error');
        alert('Email queued to support (mock).');
        setEmailName(''); setEmailAddress(''); setEmailSubject(''); setEmailMessage('');
      } catch (err) {
        alert('Failed to send email to support backend (mock).');
      }
    })();
  };

  // Discord invite
  const discordInvite = 'https://discord.gg/example-in-accord';
  const copyInvite = async () => {
    try { await navigator.clipboard.writeText(discordInvite); alert('Discord invite copied.'); } catch { alert('Copy failed.'); }
  };

  // GitHub token (optional) persisted to localStorage
  const [githubToken, setGithubToken] = useState('');
  useEffect(() => {
    try { const t = typeof window !== 'undefined' ? localStorage.getItem('inaccord_github_token') : null; if (t) setGithubToken(t); } catch {}
  }, []);
  useEffect(() => { try { if (typeof window !== 'undefined') localStorage.setItem('inaccord_github_token', githubToken); } catch {} }, [githubToken]);

  // GitHub Issues (realtime polling)
  const [issues, setIssues] = useState<any[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState('');
  const [showClosed, setShowClosed] = useState(true);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | null>(null);
  const [rateLimitReset, setRateLimitReset] = useState<number | null>(null);

  const fetchIssues = async () => {
    setIssuesLoading(true);
    try {
      const headers: any = { Accept: 'application/vnd.github.v3+json' };
      if (githubToken) headers.Authorization = `token ${githubToken}`;
      const res = await fetch('https://api.github.com/repos/GARD-Realms-LLC/In-Accord-web/issues?per_page=15&state=all', { headers });
      const remaining = res.headers.get('x-ratelimit-remaining');
      const reset = res.headers.get('x-ratelimit-reset');
      setRateLimitRemaining(remaining ? Number(remaining) : null);
      setRateLimitReset(reset ? Number(reset) : null);
      // handle rate limit exceeded
      if (res.status === 403 && remaining === '0') {
        const resetAt = reset ? Number(reset) * 1000 : Date.now() + 60000;
        const waitMs = Math.max(5000, resetAt - Date.now());
        setIssuesError('GitHub API rate limit exceeded — retrying soon.');
        setTimeout(() => fetchIssues(), waitMs + 1000);
        setIssuesLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data.filter((i: any) => !i.pull_request) : [];
      setIssues(list);
      setLastFetched(new Date().toLocaleTimeString());
      setIssuesError(null);
    } catch (err: any) {
      setIssuesError(err?.message || String(err));
    } finally {
      setIssuesLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    const iv = setInterval(fetchIssues, 30000); // poll every 30s
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Live Chat */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Live Chat</h2>
            <span className="text-sm text-gray-500">Support available 08:00–20:00 UTC</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 border rounded-md bg-gray-50 dark:bg-gray-900/30">
            {messages.map(m => (
              <div key={m.id} className={`mb-3 ${m.author === 'You' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] ${m.author === 'You' ? 'bg-blue-600 text-white' : m.author === 'Support' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-sm text-gray-500' } px-3 py-2 rounded-lg`}>{m.text}</div>
                <div className="text-xs text-gray-400 mt-1">{m.author} • {m.time}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="mt-3 flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChat(); }} placeholder="Type your message..." className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            <button onClick={sendChat} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Send</button>
          </div>
        </div>

        {/* Email Contact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-2">Email Support</h3>
          <form onSubmit={submitEmail} className="space-y-2">
            <input placeholder="Your name" value={emailName} onChange={e => setEmailName(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            <input placeholder="Your email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            <input placeholder="Subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            <textarea placeholder="Message" value={emailMessage} onChange={e => setEmailMessage(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 h-28" />
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Send Email</button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-500">Prefer an email? Send to <a href="mailto:support@in-accord.example" className="text-blue-600">support@in-accord.example</a></div>
        </div>
      </div>

      {/* Discord Area */}
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Discord Community</h3>
            <p className="text-sm text-gray-500">Join our Discord for real-time community support, announcements, and developer chat.</p>
            <div className="mt-2 text-sm text-gray-600">Invite: <span className="font-mono text-xs ml-2">{discordInvite}</span></div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <a href={discordInvite} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Open Discord</a>
            <button onClick={copyInvite} className="px-3 py-2 border rounded-lg text-sm">Copy Invite</button>
          </div>
        </div>
      </div>

      {/* Issues (GitHub) - realtime via polling */}
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold">Issues</h3>
              <p className="text-sm text-gray-500">Live list of recent issues from the GitHub repository (updates automatically).</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">Last: <span className="font-medium">{lastFetched || '—'}</span></div>
                <button onClick={() => fetchIssues()} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">Refresh</button>
                <button onClick={() => setShowClosed(s => !s)} className="px-3 py-2 border rounded-lg text-sm">{showClosed ? 'Hide Closed' : 'Show Closed'}</button>
                <div className="flex items-center gap-2">
                  <input value={githubToken} onChange={e => setGithubToken(e.target.value)} placeholder="GitHub token (optional)" className="px-2 py-1 border rounded-md text-sm bg-white dark:bg-gray-800" />
                </div>
              </div>
          </div>

          {issuesLoading && <div className="text-sm text-gray-500">Loading issues…</div>}
          {issuesError && <div className="text-sm text-red-500">Error loading issues: {issuesError}</div>}
          {(rateLimitRemaining !== null) && (
            <div className="text-sm text-gray-500 mt-2">Rate limit: <span className="font-medium">{rateLimitRemaining}</span>{rateLimitReset ? (<span> • resets at {new Date(rateLimitReset * 1000).toLocaleTimeString()}</span>) : null}</div>
          )}

          <ul className="space-y-2">
            {issues.filter((it: any) => showClosed || it.state === 'open').map((it: any) => (
              <li key={it.id} className="p-3 rounded-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <a href={it.html_url} target="_blank" rel="noreferrer" className="font-medium text-gray-900 dark:text-white">#{it.number} — {it.title}</a>
                    <div className="text-xs text-gray-500 mt-1">Opened by <a className="text-blue-600" href={it.user.html_url} target="_blank" rel="noreferrer">{it.user.login}</a> • {new Date(it.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${it.state === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{it.state}</div>
                    <div className="text-xs text-gray-400 mt-2">{it.comments} comments</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="text-center text-xs text-red-500 dark:text-red-400 pb-6">
        &copy; 2026 In-Accord | A GARD Realms LLC Company | Managed by: Doc Cowles.
      </footer>
    </div>
  );
};

export default Support;