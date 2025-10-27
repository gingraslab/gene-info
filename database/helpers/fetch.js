const fetch = require('node-fetch');

const DEFAULT_HEADERS = {
  accept: 'application/json',
  'user-agent': 'gene-info/1.0',
};

async function fetchJson(url, opts = {}) {
  const { retries = 2, retryDelayMs = 500, headers = {}, ...rest } = opts;
  let lastErr;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { ...DEFAULT_HEADERS, ...headers }, ...rest });
      const text = await res.text();
      if (!res.ok) {
        if (attempt < retries && (res.status === 429 || (res.status >= 500 && res.status <= 599))) {
          await new Promise(r => setTimeout(r, retryDelayMs * Math.pow(2, attempt)));
          continue;
        }
        throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}\n${text.slice(0,300)}`);
      }
      try { return JSON.parse(text); }
      catch (e) { throw new Error(`Non-JSON from ${url}: ${text.slice(0,300)}`); }
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, retryDelayMs * Math.pow(2, attempt)));
        continue;
      }
    }
  }
  throw lastErr;
}

module.exports = fetchJson;

