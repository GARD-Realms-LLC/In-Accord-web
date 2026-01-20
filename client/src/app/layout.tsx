import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from './ClientProviders';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "In-Accord",
  description: "The Premier Discord Customis and Control APP.",
};

// Inline script to set dark mode class before hydration
function setInitialDarkMode() {
  const code = `
    try {
      const ls = window.localStorage.getItem('darkMode');
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (ls === 'true' || (ls === null && system)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

// Inline script to monkey-patch fetch and sanitize malformed JSON-like bodies before sending.
function setSanitizeFetch() {
  const code = `
    (function(){
      function tryLenientParse(str){
        if(!str || typeof str !== 'string') return null;
        try{ return JSON.parse(str); }catch(e){}
        let s = str.trim();
        // handle form-encoded raw=... or raw:{...}
        const m = s.match(/^[^=]+=(.*)$/s);
        if(m) s = decodeURIComponent(m[1]);
        // quick heuristic: add quotes to unquoted keys: {key: -> {"key":
        s = s.replace(/([{,]\s*)([A-Za-z0-9_@\$\-]+)\s*:/g, '$1"$2":');
        // replace single quotes with double
        s = s.replace(/'/g,'\"');
        // quote unquoted string values (before , or })
        s = s.replace(/:\s*([A-Za-z0-9_@\$\-]+)(?=[,}\s])/g, ':"$1"');
        try{ return JSON.parse(s); }catch(e){}
        return null;
      }

      const _fetch = window.fetch.bind(window);
      window.fetch = function(input, init){
        try{
          const method = (init && init.method) ? init.method.toUpperCase() : 'GET';
          const headers = new Headers((init && init.headers) || {});
          const contentType = headers.get('content-type') || (init && init.body && typeof init.body === 'string' && init.body.trim().startsWith('{') ? 'application/json' : '');

          // If body is a string, try to lenient-parse and re-stringify it to valid JSON
          if(init && init.body && typeof init.body === 'string'){
            let bodyStr = init.body;
            // handle urlencoded like raw=... or key=value pairs
            if(contentType.includes('application/x-www-form-urlencoded')){
              try{
                const params = new URLSearchParams(bodyStr);
                if(params.has('raw')){
                  const raw = params.get('raw') || '';
                  const parsed = tryLenientParse(raw);
                  if(parsed !== null){
                    init.body = JSON.stringify(parsed);
                    headers.set('content-type','application/json');
                    init.headers = headers;
                  }
                }
              }catch(e){}
            }

            // If content-type is json or body looks like object, attempt lenient parse
            if((contentType && contentType.includes('json')) || bodyStr.trim().startsWith('{')){
              const parsed = tryLenientParse(bodyStr);
              if(parsed !== null){
                init.body = JSON.stringify(parsed);
                headers.set('content-type','application/json');
                init.headers = headers;
              }
            }
          }
        }catch(e){/* sanitize fail: fallthrough to original fetch */}
        return _fetch(input, init);
      };
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {setInitialDarkMode()}
        {setSanitizeFetch()}
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
