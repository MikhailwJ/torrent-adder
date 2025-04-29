import type { Server } from '@extension/storage';
import { displayResponse } from 'index.mjs';
import { handleFetchError } from 'lib/utils/handle-fetch-error.js';

export const qBittorrentAdder = function (
  server: Server,
  data: string,
  torrentname: string,
  label?: string,
  dir?: string,
) {
  let target;
  if (data.substring(0, 7) == 'magnet:') target = 'download';
  else target = 'upload';

  const rootUrl = (server.ssl ? 'https' : 'http') + '://' + server.host + ':' + server.port;

  // execute login request
  fetch(rootUrl + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: 'username=' + encodeURIComponent(server.login) + '&password=' + encodeURIComponent(server.password),
  })
    .then(handleFetchError)
    .then(response => response.text())
    .then(text => {
      if (text != 'Ok.') {
        displayResponse('Failure', 'Login to ' + server.name + "'s WebUI failed.", true);
      } else {
        // prepre post body
        const message = new FormData();

        if (data.substring(0, 7) == 'magnet:') {
          message.append('urls', data);
        } else {
          const ords = Array.prototype.map.call(data, function byteValue(x) {
            return x.charCodeAt(0) & 0xff;
          });
          const ui8a = new Uint8Array(ords);
          const dataBlob = new Blob([ui8a.buffer], { type: 'application/x-bittorrent' });
          const myName = torrentname.length && torrentname.length > 1 ? torrentname : new Date().getTime();
          message.append('fileselect[]', dataBlob, myName);
        }

        if (dir) {
          message.append('savepath', dir);
        }

        if (label) {
          message.append('category', label);
        }

        // add the torrent
        fetch(rootUrl + '/command/' + target, {
          method: 'POST',
          body: message,
        })
          .then(handleFetchError)
          .then(response => response.text())
          .then(addText => {
            if (addText != '' && addText != 'Ok.') {
              displayResponse('Failure', 'Adding the torrent failed:\n' + addText, true);
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

export const qBittorrentV2Adder = function (
  server: Server,
  data: string,
  torrentname: string,
  label?: string,
  dir?: string,
) {
  const rootUrl = (server.ssl ? 'https' : 'http') + '://' + server.host + ':' + server.port;

  // execute login request
  fetch(rootUrl + '/api/v2/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: 'username=' + encodeURIComponent(server.username!) + '&password=' + encodeURIComponent(server.password!),
  })
    .then(handleFetchError)
    .then(response => response.text())
    .then(text => {
      if (text != 'Ok.') {
        displayResponse('Failure', 'Login to ' + server.name + "'s WebUI failed.", true);
      } else {
        // prepre post body
        const message = new FormData();

        if (data.substring(0, 7) == 'magnet:') {
          message.append('urls', data);
        } else {
          const dataBlob = convertToBlob(data, 'application/x-bittorrent');
          const myName = torrentname.length && torrentname.length > 1 ? torrentname : new Date().getTime();
          message.append('fileselect[]', dataBlob, myName);
        }

        if (dir) {
          message.append('savepath', dir);
        }

        if (label) {
          message.append('category', label);
        }

        // add the torrent
        fetch(rootUrl + '/api/v2/torrents/add', {
          method: 'POST',
          body: message,
        })
          .then(handleFetchError)
          .then(response => response.text())
          .then(addText => {
            if (addText != 'Ok.') {
              displayResponse('Failure', 'Adding the torrent failed:\n' + addText, true);
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
