import { createStorage } from '../base/base.js';
import { StorageEnum } from '../base/enums.js';

export const linkMatchesStore = createStorage(
  'linkmatches',
  '([\\]\\[]|\\b|\\.)\\.torrent\\b([^\\-]|$)~torrents\\.php\\?action=download',
  { storageEnum: StorageEnum.Local },
);
