import { popupDurationStore, showPopupsStore } from '@extension/storage';
import { audioNotification } from './notification.js';

export async function displayResponse(title: string, message: string, error = false) {
  if (await showPopupsStore.get()) {
    const opts: chrome.notifications.NotificationOptions<true> = {
      type: 'basic',
      iconUrl: error === true ? 'icons/BitTorrent128-red.png' : 'icons/BitTorrent128.png',
      title: title,
      priority: 0,
      message: message,
    };
    const id = Math.floor(Math.random() * 99999) + '';

    const duration = await popupDurationStore.get();
    chrome.notifications.create(id, opts, function (myId) {
      setTimeout(function () {
        chrome.notifications.clear(myId, function () {});
      }, duration);
    });

    if (localStorage.getItem('hearpopups') == 'true') {
      audioNotification(error);
    }
  }
}
