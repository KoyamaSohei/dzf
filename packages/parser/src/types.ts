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

export interface TTLState {
  ttl: number;
  isByDirective: boolean;
}

export interface RrHeader<T = Rrtype> {
  name: string;
  rrtype: T;
  class: Class;
  ttl: number;
}

export type RR = CNAME | HINFO | MX | NS | PTR | SOA | TXT | A;

export interface CNAME {
  hdr: RrHeader<Rrtype.CNAME>;
  target: string;
}

export interface HINFO {
  hdr: RrHeader<Rrtype.HINFO>;
  cpu: string;
  os: string;
}

export interface MX {
  hdr: RrHeader<Rrtype.MX>;
  preference: number;
  mx: string;
}

export interface NS {
  hdr: RrHeader<Rrtype.NS>;
  ns: string;
}

export interface PTR {
  hdr: RrHeader<Rrtype.PTR>;
  ptr: string;
}

export interface SOA {
  hdr: RrHeader<Rrtype.SOA>;
  ns: string;
  mbox: string;
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minttl: number;
}

export interface TXT {
  hdr: RrHeader<Rrtype.TXT>;
  txt: string;
}

export interface A {
  hdr: RrHeader<Rrtype.A>;
  a: string;
}

export interface Lex {
  token: string;
  value: Tokenize;
  torc: Rrtype | Class;
  line: number;
  column: number;
}

export enum Tokenize {
  zEOF,
  zString,
  zBlank,
  zQuote,
  zNewline,
  zRrtype,
  zOwner,
  zClass,
  zDirOrigin,
  zDirTTL,

  zValue,
  zKey,

  zExpectOwnerDir,
  zExpectOwnerBl,
  zExpectAny,
  zExpectAnyNoClass,
  zExpectAnyNoClassBl,
  zExpectAnyNoTTL,
  zExpectAnyNoTTLBl,
  zExpectRrtype,
  zExpectRrtypeBl,
  zExpectRdata,
  zExpectDirTTLBl,
  zExpectDirTTL,
  zExpectDirOriginBl,
  zExpectDirOrigin
}
