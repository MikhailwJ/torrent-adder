export const convertToBlob = function (data: string[], myType = 'text/plain') {
  const ords = data.map(x => x.charCodeAt(0) & 0xff);
  const ui8a = new Uint8Array(ords);
  const dataBlob = new Blob([ui8a.buffer], { type: myType });

  return dataBlob;
};
