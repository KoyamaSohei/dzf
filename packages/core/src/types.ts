export enum Rrtype {
  CNAME,
  HINFO,
  MX,
  NS,
  PTR,
  SOA,
  TXT,
  A
}

export enum Class {
  IN,
  CS,
  CH,
  HS,
  NONE,
  ANY
}

export interface RrHeader<T extends Rrtype = Rrtype> {
  name: string;
  rrtype: T;
  class: Class;
  ttl: number;
}

export type RR = CNAME | HINFO | MX | NS | PTR | SOA | TXT | A;

export type CNAME = RrHeader<Rrtype.CNAME> & {
  target: string;
};

export type HINFO = RrHeader<Rrtype.HINFO> & {
  cpu: string;
  os: string;
};

export type MX = RrHeader<Rrtype.MX> & {
  preference: number;
  mx: string;
};

export type NS = RrHeader<Rrtype.NS> & {
  ns: string;
};

export type PTR = RrHeader<Rrtype.PTR> & {
  ptr: string;
};

export type SOA = RrHeader<Rrtype.SOA> & {
  ns: string;
  mbox: string;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minttl: number;
};

export type TXT = RrHeader<Rrtype.TXT> & {
  txt: string;
};

export type A = RrHeader<Rrtype.A> & {
  a: string;
};
