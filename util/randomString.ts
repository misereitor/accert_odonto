export function randString(length: number, ...ranges: string[][]) {
  let str = '';
  while (length--) {
    const ind = Math.floor(Math.random() * ranges.length);
    const min = ranges[ind][0].charCodeAt(0),
      max = ranges[ind][1].charCodeAt(0); //
    const c = Math.floor(Math.random() * (max - min + 1)) + min;
    str += String.fromCharCode(c);
  }
  return str;
}
