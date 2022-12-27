export function chunkArray(unchunked, chunkSize = 100) {
  const unchunkedLength = unchunked.length;
  const chunked = [];

  for (let i = 0; i < unchunkedLength; i += chunkSize) {
    chunked.push(unchunked.slice(i, i + chunkSize));
  }

  return chunked;
}
