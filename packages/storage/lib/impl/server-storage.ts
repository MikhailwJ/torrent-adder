import { CLIENTS, ConfigSchema, createStorage, ServerSettingsSchema, StorageEnum } from '../base/index.js';
import type { ConfigState, ServerSettings } from '../base/index.js';

const initConfig = {
  currentServer: CLIENTS.qbittorrent.id,
  addPaused: false,
  addAdvanced: false,
  contextMenu: 1,
  catchUrls: true,
  enableNotifications: true,
  labels: [],
  matchRegExp: [],
};

const initServers = [
  {
    name: 'Default',
    application: CLIENTS.qbittorrent.id,
    hostname: 'torrent.mikhailwj.com',
    username: 'admin',
    password: 'rSdL7Z$69!t4',
    directories: [],
    clientOptions: {},
    httpAuth: undefined,
    defaultLabel: null,
    defaultDirectory: null,
  },
  {
    name: 'Default',
    application: CLIENTS.vuze_webui.id,
    hostname: '127.0.0.1:6883',
    username: 'login',
    password: 'password',
    directories: [],
    clientOptions: {},
    httpAuth: undefined,
    defaultLabel: null,
    defaultDirectory: null,
  },
];

export const configStore = createStorage<ConfigState>('servers', initConfig, {
  storageEnum: StorageEnum.Local,
  serialization: {
    serialize: value => (typeof value === 'string' ? value : JSON.stringify(value)),
    deserialize: value => {
      const data = typeof value === 'string' ? JSON.parse(value) : value;
      try {
        return ConfigSchema.parse(data);
      } catch {
        return initConfig;
      }
    },
  },
});

export const serverStore = createStorage<ServerSettings[]>('servers', initServers, {
  storageEnum: StorageEnum.Local,
  serialization: {
    serialize: value => (typeof value === 'string' ? value : JSON.stringify(value)),
    deserialize: value => {
      const data = typeof value === 'string' ? JSON.parse(value) : value;
      try {
        return ServerSettingsSchema.parse(data);
      } catch {
        return initServers;
      }
    },
  },
});
