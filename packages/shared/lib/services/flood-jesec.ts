import type { Server } from '@extension/storage';
import { displayResponse } from 'index.mjs';
import { convertToBlob } from 'lib/utils/convert-to-blob.js';
import { handleFetchError } from 'lib/utils/handle-fetch-error.js';
import { text } from 'stream/consumers';

export const floodJesecAdder = function (server: Server, torrentdata: string) {
  const dir = server.floodjesecdirectory;
  const paused = server.floodjesecaddpaused;

  let apiUrl = (server.ssl ? 'https://' : 'http://') + server.host + ':' + server.port;

  fetch(apiUrl + '/api/auth/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ username: server.login, password: server.password }),
  })
    .then(handleFetchError)
    .then(response => response.json())
    .then(async function (json) {
      if (!json.success) {
        displayResponse('Failure', 'Login to ' + server.name + "'s WebUI failed.", true);
      } else {
        const fetchOpts = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        };
        if (torrentdata.substring(0, 7) == 'magnet:') {
          apiUrl += '/api/torrents/add-urls';
          fetchOpts.body = JSON.stringify({
            urls: [torrentdata],
            start: !paused,
            destination: dir ? dir : undefined,
            isBasePath: false,
            isCompleted: false,
          });
        } else {
          const dataBlob = convertToBlob(torrentdata, 'application/x-bittorrent');

          apiUrl += '/api/torrents/add-files';

          let b64file = await blobToBase64(dataBlob);
          b64file = b64file.substr(b64file.lastIndexOf(',') + 1);

          fetchOpts.body = JSON.stringify({
            tags: [],
            start: !paused,
            destination: dir ? dir : undefined,
            isBasePath: false,
            isCompleted: false,
            files: [b64file],
          });
        }

        fetch(apiUrl, fetchOpts)
          .then(handleFetchError)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              displayResponse('Success', 'Torrent added successfully.');
            } else {
              displayResponse('Failure', 'Torrent not added successfully:\n' + text);
            }
          })
          .catch(error => {
            displayResponse('Failure', 'Could not contact ' + server.name + '\nError: ' + error.message, true);
          });
      }
    })
    .catch(error => {
      displayResponse('Failure', 'Could not contact ' + server.name + '\nError: ' + error.message, true);
    });
};
