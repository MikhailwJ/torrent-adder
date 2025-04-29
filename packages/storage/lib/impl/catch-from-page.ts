import { createStorage } from '../base/base.js';
import { StorageEnum } from '../base/enums.js';

export const catchFromPageStore = createStorage('catchfrompage', true, { storageEnum: StorageEnum.Local });
