import type { ClientId, Client } from './config-schema.js';

export const CLIENTS: Record<ClientId, Client> = {
  biglybt: {
    id: 'biglybt',
    name: 'BiglyBT',
    addressPlaceholder: 'http://127.0.0.1:9091/',
    clientCapabilities: ['paused', 'path', 'httpAuth'],
  },
  cloudtorrent: {
    id: 'cloudtorrent',
    name: 'Cloud Torrent',
    addressPlaceholder: 'http://127.0.0.1:3000/',
    clientCapabilities: ['httpAuth'],
  },
  deluge: {
    id: 'deluge',
    name: 'Deluge Web UI',
    addressPlaceholder: 'http://127.0.0.1:8112/',
    clientCapabilities: ['paused', 'label', 'path'],
  },
  flood: {
    id: 'flood',
    name: 'Flood',
    addressPlaceholder: 'http://127.0.0.1:3000/',
    clientCapabilities: ['paused', 'label', 'path'],
  },
  rutorrent: {
    id: 'rutorrent',
    name: 'ruTorrent',
    addressPlaceholder: 'http://127.0.0.1:80/',
    clientCapabilities: ['paused', 'label', 'path', 'rss', 'httpAuth'],
    clientOptions: [
      {
        name: 'authType',
        description: 'authType.Option',
        values: {
          httpAuth: 'authType.HttpAuthOption',
          loginForm: 'authType.LoginFormOption',
        },
      },
      {
        name: 'fast_resume',
        description: 'skipHashCheckOption',
      },
    ],
  },
  synology: {
    id: 'synology',
    name: 'Synology Download Station',
    addressPlaceholder: 'http://127.0.0.1:5001/',
    clientCapabilities: ['path'],
  },
  tixati: {
    id: 'tixati',
    name: 'Tixati',
    addressPlaceholder: 'http://127.0.0.1:8888/',
    clientCapabilities: ['paused', 'httpAuth'],
  },
  transmission: {
    id: 'transmission',
    name: 'Transmission',
    addressPlaceholder: 'http://127.0.0.1:9091/',
    clientCapabilities: ['paused', 'label', 'path', 'httpAuth'],
  },
  ttorrent: {
    id: 'ttorrent',
    name: 'tTorrent',
    addressPlaceholder: 'http://127.0.0.1:1080/',
    clientCapabilities: ['httpAuth'],
  },
  utorrent: {
    id: 'utorrent',
    name: 'µTorrent',
    addressPlaceholder: 'http://127.0.0.1:8112/gui/',
  },
  vuze_remoteui: {
    id: 'vuze_remoteui',
    name: 'Vuze Web Remote',
    addressPlaceholder: 'http://127.0.0.1:9091/',
    clientCapabilities: ['paused', 'path', 'httpAuth'],
  },
  vuze_webui: {
    id: 'vuze_webui',
    name: 'Vuze HTML Web UI',
    addressPlaceholder: 'http://127.0.0.1:6886/',
    clientCapabilities: ['httpAuth'],
  },
  vuze_webui_100: {
    id: 'vuze_webui_100',
    name: 'Vuze HTML Web UI (<1.0.0)',
    addressPlaceholder: 'http://127.0.0.1:6886/',
  },
  qbittorrent: {
    id: 'qbittorrent',
    name: 'qBittorrent',
    addressPlaceholder: 'http://127.0.0.1:8080/',
    clientCapabilities: ['paused', 'label', 'path', 'rss'],
    clientOptions: [
      {
        name: 'sequentialDownload',
        description: 'sequentialDownloadOption',
      },
      {
        name: 'firstLastPiecePrio',
        description: 'firstLastPiecePriorityOption',
      },
      {
        name: 'skip_checking',
        description: 'skipHashCheckOption',
      },
      {
        name: 'contentLayout',
        description: 'contentLayout.Option',
        values: {
          '': 'contentLayout.OriginalOption',
          Subfolder: 'contentLayout.SubfolderOption',
          NoSubfolder: 'contentLayout.NoSubfolderOption',
        },
      },
    ],
  },
  qbittorrent_467: {
    id: 'qbittorrent_467',
    name: 'qBittorrent (4.1.0 - 4.6.7)',
    addressPlaceholder: 'http://127.0.0.1:8080/',
    clientCapabilities: ['paused', 'label', 'path', 'rss'],
    clientOptions: [
      {
        name: 'sequentialDownload',
        description: 'sequentialDownloadOption',
      },
      {
        name: 'firstLastPiecePrio',
        description: 'firstLastPiecePriorityOption',
      },
      {
        name: 'skip_checking',
        description: 'skipHashCheckOption',
      },
      {
        name: 'contentLayout',
        description: 'contentLayout.Option',
        values: {
          '': 'contentLayout.OriginalOption',
          Subfolder: 'contentLayout.SubfolderOption',
          NoSubfolder: 'contentLayout.NoSubfolderOption',
        },
      },
    ],
  },
  qbittorrent_404: {
    id: 'qbittorrent_404',
    name: 'qBittorrent (3.2.0 - 4.0.4)',
    addressPlaceholder: 'http://127.0.0.1:8080/',
  },
} as const;
