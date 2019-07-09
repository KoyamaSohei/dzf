import { ZoneParser } from './core';
import { ByteReader } from './lexer';
export { Rrtype, RR, CNAME, HINFO, MX, NS, PTR, SOA, TXT, A, Class, } from './types';

export function parseZone(file: string, origin: string, defaultTtl: number = 3600) {
  if (file === '') return [];
  if (file.length > 0 && file[file.length - 1] !== '\n') {
    file += '\n';
  }
  const br = new ByteReader(file);
  const zp = new ZoneParser(br, origin, file, defaultTtl);
  const rrs = [];
  for (let res = zp.next(); res; res = zp.next()) {
    rrs.push(res);
  }
  return rrs;
}
