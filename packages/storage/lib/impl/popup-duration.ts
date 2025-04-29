import { createStorage } from '../base/base.js';
import { StorageEnum } from '../base/enums.js';

export const popupDurationStore = createStorage('popupduration', 2000, { storageEnum: StorageEnum.Local });
