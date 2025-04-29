import { createStorage } from '../base/base.js';
import { StorageEnum } from '../base/enums.js';

export const linksFoundIndicatorStore = createStorage('linksfoundindicator', true, { storageEnum: StorageEnum.Local });
