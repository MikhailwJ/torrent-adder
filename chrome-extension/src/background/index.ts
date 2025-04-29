import 'webextension-polyfill';
import { linkMatchesStore, serverStore, themeStorage } from '@extension/storage';
import { getTorrent } from '@extension/shared';

themeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

let getTorrentLink = '';
let getTorrentLinkReferer = '';

chrome.tabs.onCreated.addListener(async tab => {
  const servers = await serverStore.get();
  const server = servers.find(server => server.selected) ?? servers[0];
  if (localStorage.getItem('catchfromnewtab') != 'true') return;
  const res = (await linkMatchesStore.get()).split('~');
  for (const mkey in res) {
    if (tab.url?.match(new RegExp(res[mkey], 'g'))) {
      const res = await getTorrent(server, tab.url);
      getTorrentLink = res.url;
      getTorrentLinkReferer = res.referer;
      break;
    }
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    let output = {};

    if (details.url === getTorrentLink && details.requestHeaders) {
      let foundReferer = false;
      let foundOrigin = false;

      for (let j = 0; j < (details.requestHeaders?.length ?? 0); ++j) {
        if (details.requestHeaders[j].name === 'Referer') {
          foundReferer = true;
          details.requestHeaders[j].value = getTorrentLinkReferer || details.url;
        }

        if (details.requestHeaders[j].name === 'Origin') {
          foundOrigin = true;
          details.requestHeaders[j].value = getTorrentLinkReferer || details.url;
        }

        if (foundReferer && foundOrigin) {
          break;
        }
      }

      if (!foundReferer) {
        details.requestHeaders.push({ name: 'Referer', value: getTorrentLinkReferer || details.url });
      }

      if (!foundOrigin) {
        details.requestHeaders.push({ name: 'Origin', value: getTorrentLinkReferer || details.url });
      }

      output = { requestHeaders: details.requestHeaders };

      getTorrentLink = '';
      getTorrentLinkReferer = '';
    }

    return output;
  },
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders', 'extraHeaders'],
);
