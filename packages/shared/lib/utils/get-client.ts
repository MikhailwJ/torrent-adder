import { qBittorrentApi } from '../services/index.js';
import type { ServerSettings } from '@extension/storage';

export const getClient = (serverSettings: ServerSettings) => {
  switch (serverSettings.application) {
    // case 'biglybt':
    //     return new TransmissionApi(serverSettings);
    // case 'cloudtorrent':
    //     return new CloudTorrentApi(serverSettings);
    // case 'deluge':
    //     return new DelugeApi(serverSettings);
    // case 'flood':
    //     return new FloodApi(serverSettings);
    // case 'rutorrent':
    //     return new ruTorrentApi(serverSettings);
    // case 'tixati':
    //     return new TixatiApi(serverSettings);
    // case 'transmission':
    //     return new TransmissionApi(serverSettings);
    // case 'ttorrent':
    //     return new tTorrentApi(serverSettings);
    // case 'utorrent':
    //     return new uTorrentApi(serverSettings);
    // case 'vuze_remoteui':
    //     return new TransmissionApi(serverSettings);
    // case 'vuze_webui':
    //     return new VuzeWebUIApi(serverSettings);
    // case 'vuze_webui_100':
    //     return new VuzeWebUIApi({
    //         apiVersion: 1,
    //         ...serverSettings
    //     });
    case 'qbittorrent':
      return new qBittorrentApi(serverSettings);
    case 'qbittorrent_467':
      return new qBittorrentApi({
        apiVersion: 2,
        ...serverSettings,
      });
    case 'qbittorrent_404':
      return new qBittorrentApi({
        apiVersion: 1,
        ...serverSettings,
      });
  }

  throw new Error('No client found');
};
