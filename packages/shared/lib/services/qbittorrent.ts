import { BaseClient } from './base-client.js';
import type { ServerSettings, SelectedOptions } from '@extension/storage';

export const VERSION_4_0_4 = 1; // v3.2.0 - v4.0.4
export const VERSION_4_6_7 = 2; // v4.1.0 - v4.6.7
export const VERSION_CURRENT = 3; // v5.0.0

export class qBittorrentApi extends BaseClient {
  static VERSION_4_0_4 = 1; // v3.2.0 - v4.0.4
  static VERSION_4_6_7 = 2; // v4.1.0 - v4.6.7
  static VERSION_CURRENT = 3; // v5.0.0

  cookie?: string | null;

  constructor(protected settings: ServerSettings) {
    settings.apiVersion ??= qBittorrentApi.VERSION_CURRENT;
    super(settings);
  }

  async logIn() {
    const { hostname, username, password, apiVersion } = this.settings;
    const loginPath = apiVersion === VERSION_4_0_4 ? 'login' : 'api/v2/auth/login';

    this._attachListeners();

    const form = new URLSearchParams();
    form.set('username', username);
    form.set('password', password);

    return fetch(hostname + loginPath, {
      method: 'POST',
      body: form,
    })
      .then(response => {
        if (response.ok) return response.text();
        else
          throw new Error(chrome.i18n.getMessage('apiError', response.status.toString() + ': ' + response.statusText));
      })
      .then(text => {
        if (text === 'Ok.') return;
        else if (text === 'Fails.') throw new Error(chrome.i18n.getMessage('loginError'));
        else throw new Error(chrome.i18n.getMessage('apiError', text));
      });
  }

  async logOut() {
    const { hostname, apiVersion } = this.settings;
    const logoutPath = apiVersion === VERSION_4_0_4 ? 'logout' : 'api/v2/auth/logout';

    await fetch(hostname + logoutPath, {
      method: apiVersion === VERSION_4_0_4 ? 'GET' : 'POST',
    });

    this.removeEventListeners();
    this.cookie = null;
  }

  async addTorrent(torrent: Blob, options: SelectedOptions = {}) {
    const { hostname, apiVersion } = this.settings;
    const addTorrentPath = apiVersion === VERSION_4_0_4 ? 'command/upload' : 'api/v2/torrents/add';

    const form = new FormData();

    if (apiVersion === VERSION_4_0_4) {
      form.append('torrents', torrent, 'temp.torrent');
    } else {
      form.append('fileselect', torrent, 'temp.torrent');

      if (options.paused) {
        if (apiVersion === VERSION_4_6_7) {
          form.append('paused', options.paused.toString());
        } else {
          form.append('stopped', options.paused.toString());
        }
      }

      if (options.path) form.append('savepath', options.path);

      if (options.label) form.append('category', options.label);

      if (options.sequentialDownload) form.append('sequentialDownload', 'true');

      if (options.firstLastPiecePrio) form.append('firstLastPiecePrio', 'true');

      if (options.skip_checking) form.append('skip_checking', 'true');

      if (options.contentLayout) form.append('contentLayout', options.contentLayout);
    }

    return fetch(hostname + addTorrentPath, {
      method: 'POST',
      body: form,
    }).then(response => {
      if (response.ok) return;
      else throw new Error(chrome.i18n.getMessage('torrentAddError'));
    });
  }

  async addTorrentUrl(url: string, options: SelectedOptions = {}) {
    const { hostname, apiVersion } = this.settings;
    const addTorrentUrlPath = apiVersion === VERSION_4_0_4 ? 'command/download' : 'api/v2/torrents/add';

    const form = new FormData();
    form.append('urls', url);

    if (apiVersion !== VERSION_4_0_4) {
      if (options.paused) {
        if (apiVersion === VERSION_4_6_7) {
          form.append('paused', options.paused.toString());
        } else {
          form.append('stopped', options.paused.toString());
        }
      }

      if (options.path) form.append('savepath', options.path);

      if (options.label) form.append('category', options.label);

      if (options.sequentialDownload) form.append('sequentialDownload', 'true');

      if (options.firstLastPiecePrio) form.append('firstLastPiecePrio', 'true');

      if (options.skip_checking) form.append('skip_checking', 'true');

      if (options.contentLayout) form.append('contentLayout', options.contentLayout);
    }

    return fetch(hostname + addTorrentUrlPath, {
      method: 'POST',
      body: form,
    }).then(response => {
      if (response.ok) return;
      else throw new Error(chrome.i18n.getMessage('torrentAddError'));
    });
  }

  async addRssFeed(url: string) {
    const { hostname } = this.settings;

    const form = new FormData();
    form.append('url', url);
    form.append('path', '');

    return fetch(hostname + 'api/v2/rss/addFeed', {
      method: 'POST',
      body: form,
    }).then(response => {
      if (response.ok) return;
      else throw new Error(chrome.i18n.getMessage('rssFeedAddError'));
    });
  }

  _attachListeners() {
    const { hostname, httpAuth } = this.settings;
    let sessionCookie = this.cookie;

    if (httpAuth) {
      this.addAuthRequiredListener(httpAuth.username, httpAuth.password);
    }

    this.addHeadersReceivedEventListener(details => {
      if (!details.responseHeaders) return;
      const cookie = this.getCookie(details.responseHeaders, 'SID');

      if (cookie) sessionCookie = cookie;

      return {
        responseHeaders: this.filterHeaders(details.responseHeaders, ['set-cookie']),
      };
    });

    this.addBeforeSendHeadersEventListener(details => {
      if (!details.requestHeaders) return;
      const requestHeaders = this.filterHeaders(details.requestHeaders, ['cookie', 'origin', 'referer']);

      requestHeaders.push({
        name: 'Referer',
        value: hostname,
      });

      requestHeaders.push({
        name: 'Origin',
        value: hostname,
      });

      if (sessionCookie) {
        requestHeaders.push({
          name: 'Cookie',
          value: sessionCookie,
        });
      }

      return {
        requestHeaders: requestHeaders,
      };
    });
  }
}
