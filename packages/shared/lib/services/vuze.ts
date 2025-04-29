import type { Server } from '@extension/storage';
import { displayResponse } from 'index.mjs';
import { json } from 'stream/consumers';
import { convertToBlob } from '../utils/convert-to-blob.js';
import { handleFetchError } from '../utils/handle-fetch-error.js';

export const vuzeRemoteAdder = function (server: Server, data: string) {
  if (data.substring(0, 7) == 'magnet:') target = 'rpc';
  else target = 'upload?paused=false';
  const apiUrl = 'http' + (server.ssl ? 's' : '') + '://' + server.host + ':' + server.port + '/transmission/' + target;

  // poke it a little so it gives us a sessionid cookie
  fetch(apiUrl)
    .then(response => {
      if (response.status != 200 && response.status != 409) {
        throw new Error('Unexpected status: ' + response.statusText);
      }
    })
    .then(() => {
      // construct and run the adding request
      let message;
      if (data.substring(0, 7) == 'magnet:') {
        message = JSON.stringify({ method: 'torrent-add', arguments: { paused: 'false', filename: data } });
      } else {
        const blobData = convertToBlob(data, 'application/x-bittorrent');

        message = new FormData();
        message.append('torrent_files[]', blobData, 'file.torrent');
      }

      fetch(apiUrl, {
        method: 'POST',
        body: message,
      })
        .then(handleFetchError)
        .then(response => response.text())
        .then(text => {
          if (/.*<h1>200: OK<\/h1>.*/.exec(text) || JSON.parse(text)['result'] == 'success') {
            displayResponse('Success', 'Torrent added successfully to ' + server.name + '.');
          } else {
            displayResponse('Failure', 'Torrent not added successfully.\n' + json.error, true);
          }
        })
        .catch(error => {
          displayResponse('Failure', 'Could not connect to ' + server.name + '\nError: ' + error.message, true);
        });
    })
    .catch(error => {
      displayResponse('Failure', 'Could not connect to ' + server.name + '\nError: ' + error.message, true);
    });
};

export const vuzeHtmlAdder = function (server, data) {
  function vhtml_handleResponse(data) {
    if (this.readyState == 4 && this.status == 200) {
      if (/.*loaded successfully.*/.exec(this.responseText)) {
        displayResponse('Success', 'Torrent added successfully.');
      } else {
        displayResponse('Failure', "Server didn't accept data:\n" + this.status + ': ' + this.responseText, true);
      }
    } else if (this.readyState == 4 && this.status != 200) {
      displayResponse(
        'Failure',
        'Server responded with an irregular HTTP error code:\n' + this.status + ': ' + this.responseText,
        true,
      );
    }
  }

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://' + server.host + ':' + server.port + '/index.tmpl?d=u&local=1', true);
  xhr.onreadystatechange = vhtml_handleResponse;

  if (data.substring(0, 7) == 'magnet:') {
    const mxhr = new XMLHttpRequest();
    mxhr.open(
      'GET',
      'http://' + server.host + ':' + server.port + '/index.tmpl?d=u&upurl=' + encodeURIComponent(data),
      true,
    );
    mxhr.onreadystatechange = vhtml_handleResponse;
    mxhr.send(message);
  } else {
    // mostly stolen from https://github.com/igstan/ajax-file-upload/blob/master/complex/uploader.js
    const boundary = 'AJAX-----------------------' + new Date().getTime();
    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
    var message = '--' + boundary + '\r\n';
    message += 'Content-Disposition: form-data; name="upfile_1"; filename="file.torrent"\r\n';
    message += 'Content-Type: application/x-bittorrent\r\n\r\n';
    message += data + '\r\n';
    message += '--' + boundary + '--\r\n';

    xhr.sendAsBinary(message);
  }
};

export const vuzeSwingAdder = function (server, data) {
  if (data.substring(0, 7) == 'magnet:') {
    displayResponse(
      'Client Failure',
      'sorry, no magnet/link adding support from vuze swing ui. try the vuze remote plugin.',
      true,
    );
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://' + server.host + ':' + server.port + '/upload.cgi', true);
  xhr.onreadystatechange = function (data) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (/.*Upload OK.*/.exec(xhr.responseText)) {
        displayResponse('Success', 'Torrent added successfully.');
      } else {
        displayResponse('Failure', "Server didn't accept data:\n" + xhr.status + ': ' + xhr.responseText, true);
      }
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      displayResponse(
        'Failure',
        'Server responded with an irregular HTTP error code:\n' + xhr.status + ': ' + xhr.responseText,
        true,
      );
    }
  };

  // mostly stolen from https://github.com/igstan/ajax-file-upload/blob/master/complex/uploader.js
  const boundary = 'AJAX-----------------------' + new Date().getTime();
  xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
  let message = '--' + boundary + '\r\n';
  message += 'Content-Disposition: form-data; name="upfile"; filename="file.torrent"\r\n';
  message += 'Content-Type: application/x-bittorrent\r\n\r\n';
  message += data + '\r\n';
  message += '--' + boundary + '--\r\n';

  xhr.sendAsBinary(message);
};
