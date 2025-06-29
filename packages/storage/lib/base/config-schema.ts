import { z } from 'zod/v4';

export const ClientIdSchema = z.enum([
  'biglybt',
  'cloudtorrent',
  'deluge',
  'flood',
  'rutorrent',
  'synology',
  'tixati',
  'transmission',
  'ttorrent',
  'utorrent',
  'vuze_remoteui',
  'vuze_webui',
  'vuze_webui_100',
  'qbittorrent',
  'qbittorrent_467',
  'qbittorrent_404',
]);

export const ClientCapabilitySchema = z.enum(['httpAuth', 'label', 'path', 'paused', 'rss']);

export const ValuesSchema = z.object({
  '': z.string().optional(),
  Subfolder: z.string().optional(),
  NoSubfolder: z.string().optional(),
  httpAuth: z.string().optional(),
  loginForm: z.string().optional(),
});

export const ClientOptionSchema = z.object({
  name: z.string(),
  description: z.string(),
  values: ValuesSchema.optional(),
});

export const SelectedOptionsSchema = z
  .object({
    paused: z.boolean(),
    path: z.string(),
    label: z.string(),
    sequentialDownload: z.boolean(),
    firstLastPiecePrio: z.boolean(),
    skip_checking: z.boolean(),
    contentLayout: z.string(),
  })
  .partial();

export const ClientSchema = z.object({
  id: ClientIdSchema,
  name: z.string(),
  addressPlaceholder: z.string(),
  clientCapabilities: z.array(ClientCapabilitySchema).optional(),
  clientOptions: z.array(ClientOptionSchema).optional(),
});

export const ServerSettingsSchema = z
  .array(
    z.object({
      apiVersion: z.number().optional(),
      name: z.string().min(1, 'Required'),
      application: ClientIdSchema,
      hostname: z
        .string()
        .min(1, 'Required')
        .regex(/^(https?:\/\/)?([\w.-]+)(:\d+)?(\/.*)?$/, 'Invalid hostname'),
      username: z.string().min(1, 'Required'),
      password: z.string().min(1, 'Required'),
      directories: z.array(z.string()).optional(),
      clientOptions: SelectedOptionsSchema.optional(),
      httpAuth: z
        .object({
          username: z.string().min(1, 'Required'),
          password: z.string().min(1, 'Required'),
        })
        .optional(),
      defaultLabel: z.string().nullable().optional(),
      defaultDirectory: z.string().nullable().optional(),
    }),
  )
  .default([]);

export const ConfigSchema = z.object({
  currentServer: ClientIdSchema.optional(),
  addPaused: z.boolean().optional(),
  addAdvanced: z.boolean().optional().optional(),
  contextMenu: z.number().int().min(0, 'Required').max(2, 'Required').optional(),
  catchUrls: z.boolean().optional(),
  enableNotifications: z.boolean().optional(),
  labels: z.array(z.string()).optional(),
  matchRegExp: z.array(z.string()).optional(),
});

export type Client = z.infer<typeof ClientSchema>;
export type ClientId = z.infer<typeof ClientIdSchema>;
export type ClientOption = z.infer<typeof ClientOptionSchema>;
export type ClientCapability = z.infer<typeof ClientCapabilitySchema>;
export type SelectedOptions = z.infer<typeof SelectedOptionsSchema>;

export type Values = z.infer<typeof ValuesSchema>;

export type ServerSettings = z.infer<typeof ServerSettingsSchema>[number];
export type ConfigState = z.infer<typeof ConfigSchema>;
