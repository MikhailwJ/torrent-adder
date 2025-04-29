import { createStorage } from '../base/base.js';
import { StorageEnum } from '../base/enums.js';

export const showPopupsStore = createStorage('showpopups', true, { storageEnum: StorageEnum.Local });
