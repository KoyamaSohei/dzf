import { RR, Rrtype, toClass, toRrtype } from '@dzfu/core';

export function genZone(rrs: RR[]): string {
  return rrs.reduce((acc, rr) => {
    let str;
    switch (rr.rrtype) {
      case Rrtype.CNAME:
        str = `${rr.name}\t${rr.ttl}\t${toClass(rr.class)}\t${toRrtype(
          rr.rrtype
        )}\t${rr.target}\n`;
        break;
      case Rrtype.HINFO:
        str = `${rr.name}\t${rr.ttl}\t${toClass(rr.class)}\t${toRrtype(
          rr.rrtype
        )}\t${rr.cpu}\t${rr.os}\n`;
        break;
      case Rrtype.MX:
        str = `${rr.name}\t${rr.ttl}\t${toClass(rr.class)}\t${toRrtype(
          rr.rrtype
        )}\t${rr.preference}\t${rr.mx}\n`;
        break;
      case Rrtype.NS:
        str = `${rr.name}\t${rr.ttl}\t${toClass(rr.class)}\t${toRrtype(
          rr.rrtype
        )}\t${rr.ns}\n`;
        break;
      case Rrtype.PTR:
        str = `${rr.name}\t${rr.ttl}\t${toClass(rr.class)}\t${toRrtype(
          rr.rrtype
        )}\t${rr.ptr}\n`;
        break;
      case Rrtype.SOA:
        str = `${rr.name}\t${rr.ttl}\t${toClass(rr.class)}\t${toRrtype(
          rr.rrtype
        )}\t${rr.ns}\t${rr.mbox}\t(\n\t${rr.serial}\n\t${rr.refresh}\n\t${
          rr.retry
        }\n\t${rr.expire}\n\t${rr.minttl}\n)\n`;
        break;
      case Rrtype.TXT:
        str = `${rr.name}\t${rr.ttl}\t${toClass(rr.class)}\t${toRrtype(
          rr.rrtype
        )}\t${rr.txt}\n`;
        break;
      case Rrtype.A:
        str = `${rr.name}\t${rr.ttl}\t${toClass(rr.class)}\t${toRrtype(
          rr.rrtype
        )}\t${rr.a}\n`;
        break;
    }
    return acc + str;
  }, '');
}
