import { getHostFilter } from '../utils/index.js';
import type { ServerSettings, SelectedOptions } from '@extension/storage';

interface Listeners {
  onHeadersReceived: Parameters<typeof chrome.webRequest.onHeadersReceived.addListener>[0];
  onBeforeSendHeaders: Parameters<typeof chrome.webRequest.onBeforeSendHeaders.addListener>[0];
  onAuthRequired: Parameters<typeof chrome.webRequest.onAuthRequired.addListener>[0];
}

interface AuthCompletListerners {
  onAuthCompleted: Parameters<typeof chrome.webRequest.onCompleted.addListener>[0];
  onErrorOccurred: Parameters<typeof chrome.webRequest.onErrorOccurred.addListener>[0];
}

export abstract class BaseClient {
  private pendingRequests: string[] = [];
  private listeners: Partial<Listeners> & AuthCompletListerners = {
    onAuthCompleted: (details: chrome.webRequest.OnCompletedDetails) => {
      const index = this.pendingRequests.indexOf(details.requestId);
      if (index > -1) this.pendingRequests.splice(index, 1);
    },
    onErrorOccurred: (details: chrome.webRequest.OnErrorOccurredDetails) => {
      const index = this.pendingRequests.indexOf(details.requestId);
      if (index > -1) this.pendingRequests.splice(index, 1);
    },
  };

  constructor(protected settings: ServerSettings) {}

  abstract logIn(): Promise<void>;

  abstract logOut(): Promise<void>;

  abstract addTorrent(_torrent: Blob, _options: SelectedOptions): Promise<void>;

  abstract addTorrentUrl(url: string): Promise<void>;

  addHeadersReceivedEventListener(listener: Listeners['onHeadersReceived']) {
    const { hostname } = this.settings;

    this.listeners.onHeadersReceived = listener;

    chrome.webRequest.onHeadersReceived.addListener(
      this.listeners.onHeadersReceived,
      { urls: [getHostFilter(hostname)] },
      ['blocking', 'responseHeaders'],
    );
  }

  addBeforeSendHeadersEventListener(listener: Listeners['onBeforeSendHeaders']) {
    const { hostname } = this.settings;

    this.listeners.onBeforeSendHeaders = listener;

    chrome.webRequest.onBeforeSendHeaders.addListener(
      this.listeners.onBeforeSendHeaders,
      { urls: [getHostFilter(hostname)] },
      ['blocking', 'requestHeaders'],
    );
  }

  addAuthRequiredListener(username: string, password: string) {
    const { hostname } = this.settings;

    this.listeners.onAuthRequired = details => {
      if (this.pendingRequests.indexOf(details.requestId) !== -1) return;

      this.pendingRequests.push(details.requestId);

      return {
        authCredentials: {
          username: username,
          password: password,
        },
      };
    };

    chrome.webRequest.onAuthRequired.addListener(this.listeners.onAuthRequired, { urls: [getHostFilter(hostname)] }, [
      'blocking',
    ]);

    chrome.webRequest.onCompleted.addListener(this.listeners.onAuthCompleted, { urls: [getHostFilter(hostname)] });

    chrome.webRequest.onErrorOccurred.addListener(this.listeners.onErrorOccurred, { urls: [getHostFilter(hostname)] });
  }

  removeEventListeners() {
    if (this.listeners.onHeadersReceived)
      chrome.webRequest.onHeadersReceived.removeListener(this.listeners.onHeadersReceived);

    if (this.listeners.onBeforeSendHeaders)
      chrome.webRequest.onBeforeSendHeaders.removeListener(this.listeners.onBeforeSendHeaders);

    if (this.listeners.onAuthRequired) {
      chrome.webRequest.onAuthRequired.removeListener(this.listeners.onAuthRequired);
      chrome.webRequest.onCompleted.removeListener(this.listeners.onAuthCompleted);
      chrome.webRequest.onErrorOccurred.removeListener(this.listeners.onErrorOccurred);
    }
  }

  async parseJsonResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    const isJson = !!contentType?.match(/application\/json/);

    if (response.ok && isJson) return response.json();
    else if (response.ok && !isJson)
      return response.text().then(text => {
        throw new Error(chrome.i18n.getMessage('apiError', text.trim().slice(0, 256)));
      });
    else if (response.status === 400) throw new Error(chrome.i18n.getMessage('torrentAddError'));
    else if (response.status === 401) throw new Error(chrome.i18n.getMessage('loginError'));
    else throw new Error(chrome.i18n.getMessage('apiError', response.status.toString() + ': ' + response.statusText));
  }

  filterHeaders(headers: chrome.webRequest.HttpHeader[], filters: string[]) {
    return headers.filter(header => !filters.includes(header.name.toLowerCase()));
  }

  getCookie(headers: chrome.webRequest.HttpHeader[], key: string) {
    const cookie = headers.find(header => header.name.toLowerCase() === 'set-cookie');
    const regex = new RegExp(key + '=(.+?);');

    if (cookie) return cookie.value?.match(regex)?.[0] || null;

    return null;
  }
}
