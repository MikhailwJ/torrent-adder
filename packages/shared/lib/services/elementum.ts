import type { Server } from '@extension/storage';

export const elementumAdder = async function (server: Server, torrentdata: string, name: string) {
  const scheme = server.ssl ? 'https' : 'http';
  const apiUrl = scheme + '://' + server.host + ':' + server.port + '/playuri'; //"/torrents/add";
  const torrentName = name.length && name.length > 1 ? name : new Date().getTime();
  const xhr = new XMLHttpRequest();
  xhr.open('POST', apiUrl, true);
  xhr.onreadystatechange = function (data) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      RTA.displayResponse('Sent to Kodi', "'" + torrentName + "' added successfully.");
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      RTA.displayResponse('Failure', "Server didn't accept data:\n" + xhr.status + ': ' + xhr.responseText, true);
    }
  };

  // mostly stolen from https://github.com/igstan/ajax-file-upload/blob/master/complex/uploader.js
  const boundary = 'AJAX-----------------------' + new Date().getTime();
  xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
  let message = '';

  message += '--' + boundary + '\r\n';
  message += 'Content-Disposition: form-data; name="uri"' + '"\r\n';
  message += '\r\n';
  message += '\r\n';

  message += '--' + boundary + '\r\n';
  message += 'Content-Disposition: form-data; name="file"; filename="' + torrentName + '"\r\n';
  message += 'Content-Type: application/x-bittorrent\r\n\r\n';
  message += torrentdata + '\r\n';
  message += '--' + boundary + '--\r\n';

  xhr.sendAsBinary(message);

  return;
};
