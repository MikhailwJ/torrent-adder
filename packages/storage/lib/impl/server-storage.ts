import type { BaseStorage } from '../base/index.js';
import { createStorage } from '../base/base.js';
import { StorageEnum } from '../base/enums.js';
import { z } from 'zod';

export const SERVER_TYPES = [
  'Buffalo WebUI (OLD!)',
  'Deluge WebUI',
  'pyrt WebUI',
  'qBittorrent WebUI',
  'qBittorrent v4.1+ WebUI',
  'ruTorrent WebUI',
  'Torrentflux WebUI',
  'Transmission WebUI',
  'uTorrent WebUI',
  'Vuze SwingUI',
  'Vuze HTML WebUI',
  'Bigly/Vuze Remote WebUI',
  'Tixati WebUI',
  'Hadouken WebUI',
  'NodeJS-rTorrent WebUI',
  'Synology WebUI',
  'flood WebUI',
  'flood-jesec WebUI',
  'QNAP DownloadStation',
  'tTorrent WebUI',
  'rTorrent XML-RPC',
  'Elementum WebUI',
] as const;

export const ServerSchema = z.object({
  name: z.string().min(1, 'Required'),
  type: z.enum(SERVER_TYPES),
  host: z.string().optional(),
  port: z.string().optional(),
  ssl: z.boolean().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
  selected: z.boolean().optional(),
  rutorrentalwaysurl: z.boolean().optional(),
  delugerelativepath: z.boolean().optional(),
  floodjesecdirectory: z.string().optional(),
  floodjesecaddpaused: z.boolean().optional(),
});

export type Server = z.infer<typeof ServerSchema>;

export const serverStore: BaseStorage<Server[]> = createStorage(
  'servers',
  [
    {
      name: 'PRIMARY SERVER',
      host: 'torrent.mikhailwj.com',
      ssl: true,
      username: 'admin',
      password: 'rSdL7Z$69!t4',
      type: 'qBittorrent v4.1+ WebUI',
      selected: true,
    },
    {
      name: 'SECONDARY SERVER',
      host: '127.0.0.1:6883',
      ssl: false,
      username: 'login',
      password: 'password',
      type: 'Vuze SwingUI',
    },
  ] as Server[],
  { storageEnum: StorageEnum.Local },
);
