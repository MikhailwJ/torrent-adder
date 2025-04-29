import type { Server } from '@extension/storage';
import { handleFetchError } from '../utils/handle-fetch-error.js';
import { displayResponse } from 'index.mjs';

export const delugeAdder = function (server: Server, torrentdata: string, filename: string) {
  const rnd = Math.floor(Math.random() * 999999);

  const relPath = server.delugerelativepath == undefined ? '' : server.delugerelativepath;
  const scheme = server.ssl ? 'https' : 'http';
  const apiUrl = scheme + '://' + server.host + ':' + server.port + relPath + '/json';

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: rnd, method: 'auth.login', params: [server.password] }),
  })
    .then(handleFetchError)
    .then(response => response.json())
    .then(async json => {
      if (!json.result) {
        displayResponse('Failure', 'Login to ' + server.name + "'s WebUI failed.", true);
      } else {
        // prepare payload
        const message =
          torrentdata.substring(0, 7) == 'magnet:'
            ? JSON.stringify({ id: rnd + 1, method: 'core.add_torrent_magnet', params: [torrentdata, {}] })
            : JSON.stringify({
                id: rnd + 2,
                method: 'core.add_torrent_file',
                params: [filename, btoa(torrentdata), {}],
              });

        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: message,
        })
          .then(handleFetchError)
          .then(response => response.json())
          .then(json => {
            if (!json.result) {
              displayResponse('Failure', 'Adding the torrent failed:\n' + json.error.message, true);
            } else {
              displayResponse('Success', 'Torrent added successfully to ' + server.name + '.');
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
