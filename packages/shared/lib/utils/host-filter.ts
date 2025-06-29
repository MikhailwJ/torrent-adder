export const getHostFilter = (hostname: string) => {
  const url = new URL(hostname);
  return `${url.protocol}//${url.hostname}/*`;
};
