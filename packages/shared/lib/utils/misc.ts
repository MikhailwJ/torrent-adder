export const saveOptions = (options: Record<string, unknown>) => chrome.storage.local.set(options);

export const isMagnetUrl = (url: string) => !!url.match(/^magnet:/);

export const whitelist = [
  // Generic
  /\.torrent$/,
  /\.torrent\?/,

  // Software specific
  /\/torrents\.php\?action=download&id=\d+/, // Gazelle
  /\/dl\/.+?\/\?jackett_apikey=[a-z0-9]{32}&path=/, // Jackett
  /\/download\.php\?id=[a-z0-9]{40}&f=.+?&key=/, // Xbtit
  /\/torrents\/download\/\d+/, // UNIT3D
];

export const isTorrentUrl = (url: string, whitelist: RegExp[]) => whitelist.some(regExp => !!url.match(regExp));

export const getMagnetUrlName = (url: string) => {
  const match = url.match(/^magnet:(.+)$/);
  const params = new URLSearchParams(match ? match[1] : '');

  return params.has('dn') ? params.get('dn') : false;
};

export const getTorrentName = (data: Blob) => {
  const reader = new FileReader();
  reader.onerror = async () => false;
  reader.onload = () => {
    const result = reader.result?.toString() ?? '';
    const offset = result?.match(/name(\d+):/) || undefined;
    let text = '';

    if (offset?.length && offset.index) {
      const index = offset.index + offset[0].length;
      let bytes = 0;
      text = '';

      while (bytes < Number(offset[1])) {
        const char = result.charAt(index + text.length);

        text += char;
        bytes += encodeURIComponent(char).length;
      }
    }

    return text;
  };
  reader.readAsText(data);
};

export const regExpFromString = (regExpStr: string) => {
  const parts = /\/(.*)\/(.*)/.exec(regExpStr);

  if (parts === null) {
    return new RegExp(regExpStr);
  }

  return new RegExp(parts[1], parts[2]);
};
