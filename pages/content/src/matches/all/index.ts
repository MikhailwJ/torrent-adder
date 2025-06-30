import { fetchTorrentListener } from '@src/fetch-torrent-listener';

console.log('[CEB] All content script loaded');

chrome.runtime.onMessage.addListener(fetchTorrentListener);
