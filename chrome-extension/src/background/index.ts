import { t } from '@extension/i18n';
import {
  getClient,
  getHostFilter,
  getMagnetUrlName,
  getTorrentName,
  isMagnetUrl,
  isTorrentUrl,
  regExpFromString,
  whitelist,
} from '@extension/shared';
import { CLIENTS, configStore, serverStore, themeStorage } from '@extension/storage';
import type { ConfigState, SelectedOptions, ServerSettings } from '@extension/storage';
import 'webextension-polyfill';

themeStorage.get().then(theme => {
  console.log('theme', theme);
});

let servers: ServerSettings[];
let config: ConfigState;

const init = async () => {
  servers = await serverStore.get();
  config = await configStore.get();
  if (config.contextMenu && isConfigured()) createContextMenu();
  // if (servers.length > 1) createServerSelectionContextMenu();
  createDefaultMenu();
  registerHandler();
};

init();

const getCurrentServer = () => servers.find(server => server.name === config.currentServer);
const isConfigured = () => getCurrentServer()?.hostname !== '';

/**
 * @type {RegExp[]}
 */
let regExpCache: RegExp[] = [];

chrome.storage.onChanged.addListener(() => {
  // Object.keys(changes).forEach(key => (config[key] = changes[key].newValue));

  regExpCache = config?.matchRegExp?.map(regExpStr => regExpFromString(regExpStr)).concat(whitelist) ?? [];

  removeContextMenu();

  if (config.contextMenu && isConfigured()) createContextMenu();

  if (servers.length > 1) createServerSelectionContextMenu();

  createDefaultMenu();
});

const addTorrent = async (url: string, tabId?: number | null, torrentOptions: Partial<SelectedOptions> = {}) => {
  const server = torrentOptions.server !== undefined ? torrentOptions.server : config.currentServer;
  const serverSettings = servers.find(s => s.name === server)!;

  const addTorrentOptions = {
    paused: false,
    path: serverSettings.defaultDirectory,
    label: serverSettings.defaultLabel,
    ...torrentOptions,
  };

  const connection = getClient(serverSettings);
  const networkErrors = ['NetworkError when attempting to fetch resource.'];

  try {
    if (isMagnetUrl(url)) {
      await connection.logIn();
      connection.addTorrentUrl(url, addTorrentOptions).then(() => {
        const torrentName = getMagnetUrlName(url);
        notification(t('torrentAddedNotification') + (torrentName ? ' ' + torrentName : ''));
        connection.logOut();
      });
    } else {
      const { torrent, torrentName } = await fetchTorrent(url, tabId);
      await connection.logIn();
      await connection.addTorrent(torrent, addTorrentOptions);
      notification(t('torrentAddedNotification') + (torrentName ? ' ' + torrentName : ''));
      connection.logOut();
    }
  } catch (error) {
    if (error instanceof Error) {
      connection.removeEventListeners();

      if (networkErrors.includes(error.message)) notification(t('torrentAddError', 'Network error'));
      else notification(error.message);
    }
  }
};

export async function fetchTorrent(url: string, tabId?: number | null) {
  if (!tabId || (await tabExists(tabId)) === false) {
    throw new Error(t('sourceTabDestroyedError'));
  }

  const response = await chrome.tabs.sendMessage(tabId, {
    type: 'fetchTorrent',
    url: url,
  });

  if (response instanceof Error) throw response;

  if (!response.ok) {
    throw new Error(t('torrentFetchError', response.status.toString() + ': ' + response.statusText));
  }

  if (
    response.content.type !== '' &&
    !response.content.type.match(/(application\/x-bittorrent|application\/octet-stream)/gi)
  ) {
    throw new Error(t('torrentParseError', 'Unknown type: ' + response.content.type));
  }

  const name = getTorrentName(response.content);
  return { torrent: response.content, torrentName: name };
}

async function addRssFeed(url: string) {
  const serverSettings = getCurrentServer()!;
  const connection = getClient(serverSettings);

  try {
    await connection.logIn();
    await connection.addRssFeed(url);
    notification(t('rssFeedAddedNotification'));
    connection.logOut();
  } catch (error) {
    if (error instanceof Error) {
      connection.removeEventListeners();
      notification(error.message);
    }
  }
}

function createServerSelectionContextMenu() {
  const context: ['browser_action' | 'page'] = ['browser_action'];

  if (config.contextMenu) context.push('page');

  const hasManyServers = servers.length > 3;

  if (hasManyServers) {
    chrome.contextMenus.create({
      id: 'current-server',
      title: t('serverSelect'),
      contexts: context,
    });
  }

  servers.forEach((server, id) => {
    chrome.contextMenus.create({
      id: 'current-server-' + id.toString(),
      parentId: hasManyServers ? 'current-server' : undefined,
      type: 'radio',
      checked: server.name === config.currentServer,
      title: server.name,
      contexts: context,
    });
  });

  chrome.contextMenus.create({
    type: 'separator',
    contexts: ['browser_action'],
  });
}

function createDefaultMenu() {
  chrome.contextMenus.create({
    id: 'catch-urls',
    type: 'checkbox',
    checked: config.catchUrls,
    title: t('catchUrlsOption'),
    contexts: ['browser_action'],
  });
  chrome.contextMenus.create({
    id: 'add-paused',
    type: 'checkbox',
    checked: config.addPaused,
    title: t('addPausedOption'),
    contexts: ['browser_action'],
  });
}

function createContextMenu() {
  const server = getCurrentServer();
  if (!server || !config) return;

  chrome.contextMenus.create({
    id: 'add-torrent',
    title: t('addTorrentAction'),
    contexts: ['link'],
  });

  const client = CLIENTS[server.application];

  if (config.contextMenu === 1 && client.clientCapabilities) {
    if (client.clientCapabilities.length > 1) {
      chrome.contextMenus.create({
        id: 'add-torrent-advanced',
        title: t('addTorrentAction') + ' (' + t('advancedModifier') + ')',
        contexts: ['link'],
      });
    }

    if (client.clientCapabilities.includes('paused')) {
      chrome.contextMenus.create({
        id: 'add-torrent-paused',
        title: t('addTorrentPausedAction'),
        contexts: ['link'],
      });
    }

    if (client.clientCapabilities.includes('label') && config.labels?.length) {
      chrome.contextMenus.create({
        id: 'add-torrent-label',
        title: t('addTorrentLabelAction'),
        contexts: ['link'],
      });

      config.labels.forEach((label, i) => {
        chrome.contextMenus.create({
          id: 'add-torrent-label-' + i,
          parentId: 'add-torrent-label',
          title: label,
          contexts: ['link'],
        });
      });
    }

    if (client.clientCapabilities.includes('path') && server.directories?.length) {
      chrome.contextMenus.create({
        id: 'add-torrent-path',
        title: t('addTorrentPathAction'),
        contexts: ['link'],
      });

      server.directories.forEach((directory, i) => {
        chrome.contextMenus.create({
          id: 'add-torrent-path-' + i,
          parentId: 'add-torrent-path',
          title: directory,
          contexts: ['link'],
        });
      });
    }

    if (servers.length > 1) {
      chrome.contextMenus.create({
        id: 'add-torrent-server',
        title: t('addTorrentServerAction'),
        contexts: ['link'],
      });

      servers.forEach((server, i) => {
        chrome.contextMenus.create({
          id: 'add-torrent-server-' + i.toString(),
          parentId: 'add-torrent-server',
          title: server.name,
          contexts: ['link'],
        });
      });
    }
  } else if (client.clientCapabilities) {
    if (client.clientCapabilities.includes('label') && config.labels?.length) {
      // chrome.contextMenus.create({
      //   contexts: ['link'],
      //   type: 'separator',
      // });

      config.labels.forEach((label, i) => {
        chrome.contextMenus.create({
          id: 'add-torrent-label-' + i,
          title: label,
          contexts: ['link'],
        });
      });
    }

    if (client.clientCapabilities.includes('path') && server.directories?.length) {
      // chrome.contextMenus.create({
      //   contexts: ['link'],
      //   type: 'separator',
      // });

      server.directories.forEach((directory, i) => {
        chrome.contextMenus.create({
          id: 'add-torrent-path-' + i,
          title: directory,
          contexts: ['link'],
        });
      });
    }
  }

  if (client.clientCapabilities && client.clientCapabilities.includes('rss')) {
    if (config.contextMenu === 1) {
      // chrome.contextMenus.create({
      //   contexts: ['link'],
      //   type: 'separator',
      // });
    }

    chrome.contextMenus.create({
      id: 'add-rss-feed',
      title: t('addRssFeedAction'),
      contexts: config.contextMenu === 1 ? ['selection', 'link'] : ['selection'],
    });
  }
}

const removeContextMenu = () => {
  chrome.contextMenus.removeAll();
};

function registerHandler() {
  if (!chrome.contextMenus?.onClicked) return;
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const currentServer = info.menuItemId.toString().match(/^current-server-(\d+)$/);
    const labelId = info.menuItemId.toString().match(/^add-torrent-label-(\d+)$/);
    const pathId = info.menuItemId.toString().match(/^add-torrent-path-(\d+)$/);
    const serverId = info.menuItemId.toString().match(/^add-torrent-server-(\d+)$/);

    const clientOptions = getCurrentServer()?.clientOptions || {};

    if (info.menuItemId === 'catch-urls') toggleURLCatching();
    if (info.menuItemId === 'add-paused') toggleAddPaused();
    if (!info.linkUrl) return;
    if (info.menuItemId === 'add-torrent')
      addTorrent(info.linkUrl, tab?.id, {
        paused: config.addPaused,
        ...clientOptions,
      });
    else if (info.menuItemId === 'add-torrent-paused')
      addTorrent(info.linkUrl, tab?.id, {
        paused: true,
        ...clientOptions,
      });
    else if (labelId)
      addTorrent(info.linkUrl, tab?.id, {
        paused: config.addPaused,
        label: config?.labels?.[~~labelId[1]],
        ...clientOptions,
      });
    else if (pathId)
      addTorrent(info.linkUrl, tab?.id, {
        paused: config.addPaused,
        path: getCurrentServer()?.directories?.[~~pathId[1]],
        ...clientOptions,
      });
    else if (serverId) {
      const selectedServerId = serverId[1];
      const selectedServer = servers.find(s => s.name === selectedServerId)!;
      const selectedClientOptions = selectedServer.clientOptions || {};

      addTorrent(info.linkUrl, tab?.id, {
        paused: config.addPaused,
        server: selectedServerId,
        ...selectedClientOptions,
      });
    } else if (info.menuItemId === 'add-torrent-advanced')
      addAdvancedDialog(info.linkUrl, !isMagnetUrl(info.linkUrl) ? tab?.id : undefined);
    else if (currentServer) configStore.set(v => ({ ...v, currentServer: currentServer[1] }));
    else if (info.menuItemId === 'add-rss-feed') addRssFeed((info.linkUrl || info.selectionText?.trim()) ?? '');
  });

  chrome.action?.onClicked?.addListener(async () => {
    console.log('onClicked');

    if (!isConfigured()) {
      chrome.runtime.openOptionsPage();

      return;
    }

    const { hostname, application, username, password } = getCurrentServer()!;

    const tab = await chrome.tabs.create({ url: hostname });

    const client = CLIENTS[application];

    if (client.clientCapabilities && client.clientCapabilities.includes('httpAuth') && username && password) {
      const pendingRequests: string[] = [];

      const onAuthRequiredListener = (details: { requestId: string }) => {
        if (pendingRequests.includes(details.requestId)) {
          return;
        }

        pendingRequests.push(details.requestId);

        return {
          authCredentials: {
            username: username,
            password: password,
          },
        };
      };

      const onAuthCompletedListener = (details: { requestId: string }) => {
        const index = pendingRequests.indexOf(details.requestId);

        if (index > -1) {
          pendingRequests.splice(index, 1);
        }
      };

      chrome.webRequest.onAuthRequired.addListener(
        onAuthRequiredListener,
        {
          urls: [getHostFilter(hostname)],
          tabId: tab.id,
        },
        // ['blocking'],
      );

      chrome.webRequest.onCompleted.addListener(onAuthCompletedListener, {
        urls: [getHostFilter(hostname)],
        tabId: tab.id,
      });

      chrome.webRequest.onErrorOccurred.addListener(onAuthCompletedListener, {
        urls: [getHostFilter(hostname)],
        tabId: tab.id,
      });

      const onTabRemovedListener = (tabId: number) => {
        if (tabId !== tab.id) {
          return;
        }

        chrome.webRequest.onAuthRequired.removeListener(onAuthRequiredListener);
        chrome.webRequest.onCompleted.removeListener(onAuthCompletedListener);
        chrome.webRequest.onErrorOccurred.removeListener(onAuthCompletedListener);

        chrome.tabs.onRemoved.removeListener(onTabRemovedListener);
      };

      chrome.tabs.onRemoved.addListener(onTabRemovedListener);
    }
  });

  chrome.webRequest.onBeforeRequest.addListener(
    details => {
      const parser = document.createElement('a');
      parser.href = details.url;
      const magnetUri = decodeURIComponent(parser.pathname).substr(1);

      if (config.addAdvanced) {
        addAdvancedDialog(magnetUri);
      } else {
        const clientOptions = getCurrentServer()?.clientOptions || {};
        addTorrent(magnetUri, null, {
          paused: config.addPaused,
          ...clientOptions,
        });
      }
      return { cancel: true };
    },
    { urls: ['https://torrent-control.invalid/*'] },
    // ['blocking'],
  );

  chrome.webRequest.onBeforeRequest.addListener(
    details => {
      if (
        config.catchUrls &&
        details.type === 'main_frame' &&
        isTorrentUrl(details.url, regExpCache) &&
        isConfigured()
      ) {
        const tabId = details.tabId;
        if (config.addAdvanced) {
          addAdvancedDialog(details.url, tabId);
        } else {
          const clientOptions = getCurrentServer()?.clientOptions || {};

          addTorrent(details.url, tabId, {
            paused: config.addPaused,
            ...clientOptions,
          });
        }
        return { cancel: true };
      }

      return { cancel: false };
    },
    { urls: ['<all_urls>'] },
    // ['blocking'],
  );

  chrome.runtime.onMessage.addListener(request => {
    if (request.type === 'addTorrent') {
      const clientOptions = getCurrentServer()?.clientOptions || {};

      addTorrent(request.url, request.tabId, {
        ...clientOptions,
        ...request.options,
      });
    }
  });
}

const addAdvancedDialog = (url: string, tabId?: number) => {
  const params = new URLSearchParams();
  params.append('url', url);

  if (tabId) {
    params.append('tabId', `${tabId}`);
  }

  const height = 365;
  const width = 500;
  const top = Math.round(screen.height / 2 - height / 2);
  const left = Math.round(screen.width / 2 - width / 2);

  chrome.windows.create({
    url: 'view/add_torrent.html?' + params.toString(),
    type: 'panel',
    top: top,
    left: left,
    height: height,
    width: width,

    // @crossplatform allowScriptsToClose, titlePreface are Firefox specific
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    allowScriptsToClose: true,
    titlePreface: t('addTorrentAction'),
  });
};

async function tabExists(tabId: number): Promise<boolean> {
  const tab = await chrome.tabs.get(tabId);
  return tab !== undefined;
}

export async function notification(message: string) {
  if (!config.enableNotifications) {
    return;
  }

  const id = await chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icon/default-48.png'),
    title: 'Torrent Control',
    message: message,
  });

  setTimeout(() => chrome.notifications.clear(id), 5000);
}

function toggleURLCatching() {
  config.catchUrls = !config.catchUrls;
  configStore.set(config);
}

function toggleAddPaused() {
  config.addPaused = !config.addPaused;
  configStore.set(config);
}

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
