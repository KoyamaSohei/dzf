import { Rrtype, Class } from './types';
export { Rrtype, Class };

export function isRrtype(t: string) {
  switch (t) {
    case 'CNAME':
      return Rrtype.CNAME;
    case 'HINFO':
      return Rrtype.HINFO;
    case 'MX':
      return Rrtype.MX;
    case 'NS':
      return Rrtype.NS;
    case 'PTR':
      return Rrtype.PTR;
    case 'SOA':
      return Rrtype.SOA;
    case 'TXT':
      return Rrtype.TXT;
    case 'A':
      return Rrtype.A;
    default:
      return null;
  }
}

export function toRrtype(t: Rrtype): string {
  switch (t) {
    case Rrtype.CNAME:
      return 'CNAME';
    case Rrtype.HINFO:
      return 'HINFO';
    case Rrtype.MX:
      return 'MX';
    case Rrtype.NS:
      return 'NS';
    case Rrtype.PTR:
      return 'PTR';
    case Rrtype.SOA:
      return 'SOA';
    case Rrtype.TXT:
      return 'TXT';
    case Rrtype.A:
      return 'A';
  }
}

export function isClass(c: string) {
  switch (c) {
    case 'IN':
      return Class.IN;
    case 'CS':
      return Class.CS;
    case 'CH':
      return Class.CH;
    case 'HS':
      return Class.HS;
    case 'NONE':
      return Class.NONE;
    case 'ANY':
      return Class.ANY;
    default:
      return null;
  }
}

export function toClass(c: Class) {
  switch (c) {
    case Class.IN:
      return 'IN';
    case Class.CS:
      return 'CS';
    case Class.CH:
      return 'CH';
    case Class.HS:
      return 'HS';
    case Class.NONE:
      return 'NONE';
    case Class.ANY:
      return 'ANY';
  }
}
