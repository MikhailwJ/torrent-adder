import type { Server } from '@extension/storage';
import {
  vuzeSwingAdder,
  torrentfluxAdder,
  transmissionAdder,
  uTorrentAdder,
  ruTorrentAdder,
  vuzeHtmlAdder,
  vuzeRemoteAdder,
  buffaloAdder,
  qBittorrentAdder,
  delugeAdder,
  pyrtAdder,
  tixatiAdder,
  hadoukenAdder,
  nodeJSrTorrentAdder,
  synologyAdder,
  floodAdder,
  floodJesecAdder,
  qnapDownloadStationAdder,
  tTorrentAdder,
  qBittorrentV2Adder,
  rtorrentXmlRpcAdder,
  elementumAdder,
} from '../services/index.js';

export function dispatchTorrent(server: Server, data: string, name: string, label?: string, dir?: string) {
  switch (server.type) {
    case 'Vuze SwingUI':
      vuzeSwingAdder(server, data);
      break;
    case 'Torrentflux WebUI':
      torrentfluxAdder(server, data, name);
      break;
    case 'Transmission WebUI':
      transmissionAdder(server, data);
      break;
    case 'uTorrent WebUI':
      uTorrentAdder(server, data);
      break;
    case 'ruTorrent WebUI':
      ruTorrentAdder(server, data, label, dir);
      break;
    case 'Vuze HTML WebUI':
      vuzeHtmlAdder(server, data);
      break;
    case 'Bigly/Vuze Remote WebUI':
      vuzeRemoteAdder(server, data);
      break;
    case 'Buffalo WebUI (OLD!)':
      buffaloAdder(server, data, name);
      break;
    case 'qBittorrent WebUI':
      qBittorrentAdder(server, data, name, label, dir);
      break;
    case 'Deluge WebUI':
      delugeAdder(server, data, name);
      break;
    case 'pyrt WebUI':
      pyrtAdder(server, data, name);
      break;
    case 'Tixati WebUI':
      tixatiAdder(server, data, name);
      break;
    case 'Hadouken WebUI':
      hadoukenAdder(server, data, name);
      break;
    case 'NodeJS-rTorrent WebUI':
      nodeJSrTorrentAdder(server, data);
      break;
    case 'Synology WebUI':
      synologyAdder(server, data, name);
      break;
    case 'flood WebUI':
      floodAdder(server, data);
      break;
    case 'flood-jesec WebUI':
      floodJesecAdder(server, data);
      break;
    case 'QNAP DownloadStation':
      qnapDownloadStationAdder(server, data, name);
      break;
    case 'tTorrent WebUI':
      tTorrentAdder(server, data, name);
      break;
    case 'qBittorrent v4.1+ WebUI':
      qBittorrentV2Adder(server, data, name, label, dir);
      break;
    case 'rTorrent XML-RPC':
      rtorrentXmlRpcAdder(server, data);
      break;
    case 'Elementum WebUI':
      elementumAdder(server, data, name);
      break;
  }
}
