const puppeteer = require('puppeteer');
(async () => {
  const logs = [];
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();

    page.on('console', msg => {
      try { logs.push({ type: 'console', text: msg.text(), args: msg.args().map(a=>String(a)) }); } catch(e) { logs.push({type:'console', text: String(msg) }) }
    });
    page.on('pageerror', err => logs.push({ type: 'pageerror', text: String(err && (err.stack || err)) }));
    page.on('requestfailed', req => logs.push({ type: 'requestfailed', url: req.url(), failure: req.failure() && req.failure().errorText }));

    try {
      await page.goto('http://localhost:3000/users', { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
      logs.push({ type: 'gotoError', text: String(e) });
    }

    try { await page.evaluate(() => new Promise(r => setTimeout(r, 5000))); } catch(e) { /* ignore */ }

    const snapshot = await page.evaluate(() => {
      const usersRoot = document.getElementById('users-root');
      const usersText = usersRoot ? usersRoot.innerText : null;
      const bodyText = document.body ? document.body.innerText.slice(0,4000) : null;
      const html = document.documentElement ? document.documentElement.innerHTML.slice(0,16000) : null;
      return { usersText, bodyText, htmlLength: html ? html.length : 0 };
    });

    console.log('---CAPTURE-START---');
    for (const l of logs) console.log(JSON.stringify(l));
    console.log('SNAPSHOT:' + JSON.stringify(snapshot));
    console.log('---CAPTURE-END---');

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Script error:', err);
    process.exit(2);
  }
})();
