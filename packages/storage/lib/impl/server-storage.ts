import { ConfigSchema, ServerSettingsSchema } from '../base/config-schema.js';
import { CLIENTS, createStorage, StorageEnum } from '../base/index.js';
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
    name: 'Vuze',
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

export const configStore = createStorage<ConfigState>('config', initConfig, {
  storageEnum: StorageEnum.Local,
  serialization: {
    serialize: value => (typeof value === 'string' ? value : JSON.stringify(value)),
    deserialize: async value => {
      const data = typeof value === 'string' ? JSON.parse(value) : value;
      return (await ConfigSchema.safeParseAsync(data)).data;
    },
  },
});

export const serverStore = createStorage<ServerSettings[]>('servers', initServers, {
  storageEnum: StorageEnum.Local,
  serialization: {
    serialize: value => (typeof value === 'string' ? value : JSON.stringify(value)),
    deserialize: async value => {
      const data = typeof value === 'string' ? JSON.parse(value) : value;
      return (await ServerSettingsSchema.safeParseAsync(data)).data;
    },
  },
});
