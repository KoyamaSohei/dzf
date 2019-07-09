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
  isByDirective: boolean
}

export interface RrHeader {
  name: string;
  rrtype: Rrtype;
  class: Class;
  ttl: number;
}

export type RR =
  CNAME |
  HINFO |
  MX |
  NS |
  PTR |
  SOA |
  TXT |
  A;

export interface CNAME {
  hdr: RrHeader;
  target: string;
}

export interface HINFO {
  hdr: RrHeader;
  cpu: string;
  os: string;
}

export interface MX {
  hdr: RrHeader;
  preference: number;
  mx: string;
}

export interface NS {
  hdr: RrHeader;
  ns: string;
}

export interface PTR {
  hdr: RrHeader;
  ptr: string;
}


export interface SOA {
  hdr: RrHeader;
  ns: string;
  mbox: string
  serial: number;
  refresh: number;
  retry: number;
  expire: number;
  minttl: number;
}

export interface TXT {
  hdr: RrHeader;
  txt: string;
}

export interface A {
  hdr: RrHeader;
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
  zExpectDirOrigin,
}