import { createStorage } from '../base/base.js';
import { StorageEnum } from '../base/enums.js';

export const catchFromCtxMenuStore = createStorage('catchfromcontextmenu', true, { storageEnum: StorageEnum.Local });
