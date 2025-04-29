import type { Server } from '@extension/storage';
import { dispatchTorrent } from './dispatch-torrent.js';
import { displayResponse } from 'index.mjs';
import { handleFetchError } from './handle-fetch-error.js';

export async function getTorrent(server: Server, url: string, label?: string, dir?: string, referer?: string) {
  if (url.substring(0, 7) == 'magnet:' || server.rutorrentalwaysurl) {
    dispatchTorrent(server, url, '', label, dir);
  } else {
    await fetch(url)
      .then(handleFetchError)
      .then(async function (response) {
        let name = 'file.torrent';
        if (response.url.match(/\/([^/]+.torrent)$/)) {
          const match = response.url.match(/\/([^/]+.torrent)$/)?.[1];
          if (match) name = match;
        }

        // mangling it as text so it works with the older (xhr-reliant) code.
        // could probably modernize the webui parts at some point.
        const fileDataBlob = await response.blob();
        const buf = await fileDataBlob.arrayBuffer();
        const ui8a = new Uint8Array(buf);
        const chunksize = 0x8000;
        const chunks = [];
        for (let i = 0; i < ui8a.length; i += chunksize) {
          chunks.push(String.fromCharCode(...ui8a.subarray(i, i + chunksize)));
        }
        const fileData = chunks.join('');

        // Real .torrent files will start "d8:announce" and no whitepace
        const peek = fileData.slice(0, 11);

        if (!peek || !peek.startsWith('d8:announce')) {
          let contentType = response.headers.get('Content-Type');
          if (contentType) {
            const semicolonPos = contentType.indexOf(';');
            contentType = contentType.slice(0, semicolonPos).trim();
          } else {
            contentType = 'unknown';
          }
          throw new Error('Received ' + contentType + ' content instead of a .torrent file');
        }

        dispatchTorrent(server, fileData, name, label, dir);
      })
      .catch(error => {
        displayResponse('Failure', 'Could not download torrent file.\nError: ' + error.message, true);
      });

    return { url, referer: referer ?? '' };
  }
  return { url: '', referer: '' };
}
