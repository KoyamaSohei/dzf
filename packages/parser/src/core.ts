import { ZoneLexer, ByteReader } from './lexer';
import { RrHeader, TTLState, Class, Rrtype, CNAME, HINFO, MX, NS, PTR, SOA, TXT, A, Tokenize, Lex, RR } from './types';

export class ZoneParser {
  private c: ZoneLexer;
  private origin: string;
  public file: string;
  private h: RrHeader | null;
  private defttl: TTLState | null;
  public constructor(r: ByteReader, origin: string, file: string, defaultTtl: number) {
    this.c = new ZoneLexer(r);
    this.origin = origin;
    this.file = file;
    this.h = null;
    this.defttl = {
      ttl: defaultTtl,
      isByDirective: true,
    }
  }

  public toAbsoluteName(name: string, origin: string) {
    if (origin == '') {
      if (name == '' || name == '@') {
        throw new SyntaxError(`invalid domain, name:${name} ,origin:${origin}`);
      }
      return name;
    }
    if (name == '@') {
      return origin
    }
    if (origin == '.') {
      return name + origin;
    }
    if (name.length > 0 && name[name.length - 1] == '.') {
      return name;
    }
    return name + '.' + origin;
  }

  public next(): RR | null {
    const zp = this;
    let state = Tokenize.zExpectOwnerDir;
    let h = (zp.h || {}) as RrHeader;
    for (let l = zp.c.next(); l.value !== Tokenize.zEOF; l = zp.c.next()) {
      switch (state) {
        case Tokenize.zExpectOwnerDir:
          {
            if (zp.defttl !== null) {
              h.ttl = zp.defttl.ttl;
            }
            h.class = Class.IN;
            switch (l.value) {
              case Tokenize.zNewline:
                {
                  state = Tokenize.zExpectOwnerDir;
                  break;
                }
              case Tokenize.zOwner:
                {
                  const n = this.toAbsoluteName(l.token, zp.origin);
                  h.name = n;
                  state = Tokenize.zExpectOwnerBl;
                  break;
                }
              case Tokenize.zDirTTL:
                {
                  state = Tokenize.zExpectDirTTLBl;
                  break;
                }
              case Tokenize.zDirOrigin:
                {
                  state = Tokenize.zExpectDirOriginBl;
                  break;
                }
              case Tokenize.zRrtype:
                {
                  h.rrtype = l.torc as Rrtype;
                  state = Tokenize.zExpectRdata;
                  break;
                }
              case Tokenize.zClass:
                {
                  h.class = l.torc as Class;
                  state = Tokenize.zExpectAnyNoClassBl;
                  break;
                }
              case Tokenize.zBlank:
                break;
              case Tokenize.zString:
                {
                  const t = parseInt(l.token);
                  if (isNaN(t)) {
                    throw new TypeError(`${l.token} is not number at ${l.line}: ${l.column}`);
                  }
                  h.ttl = t;
                  if (zp.defttl == null || !zp.defttl.isByDirective) {
                    zp.defttl = {
                      ttl: t,
                      isByDirective: false,
                    }
                  }
                  state = Tokenize.zExpectAnyNoTTLBl;
                  break;
                }
              default:
                {
                  throw new SyntaxError(`error at ${l.line}: ${l.column}`);
                }
            }
            break;
          }
        case Tokenize.zExpectDirTTLBl:
          {
            if (l.value !== Tokenize.zBlank) {
              throw new SyntaxError(`no blank after $TTL-directive at ${l.line}:${l.column}`);
            }
            state = Tokenize.zExpectDirTTL;
            break;
          }
        case Tokenize.zExpectDirTTL:
          {
            if (l.value !== Tokenize.zString) {
              throw new SyntaxError(`expecting $TTL value at ${l.line}:${l.column}`);
            }
            const t = parseInt(l.token);
            if (isNaN(t)) {
              throw new SyntaxError(`${l.token} is not number at ${l.line}:${l.column}`);
            }
            zp.defttl = {
              ttl: t,
              isByDirective: true,
            }

            state = Tokenize.zExpectOwnerDir;
            break;
          }
        case Tokenize.zExpectDirOriginBl:
          {
            if (l.value !== Tokenize.zBlank) {
              throw new SyntaxError(`no blank after $ORIGIN at ${l.line}:${l.column}`);
            }
            state = Tokenize.zExpectDirOrigin;
            break;
          }
        case Tokenize.zExpectDirOrigin:
          {
            if (l.value !== Tokenize.zString) {
              throw new SyntaxError(`expecting $ORIGIN at ${l.line}:${l.column}`);
            }
            zp.origin = l.token;
            state = Tokenize.zExpectOwnerDir;
            break;

          }
        case Tokenize.zExpectOwnerBl:
          {
            if (l.value !== Tokenize.zBlank) {
              throw new SyntaxError(`no blank after owner at ${l.line}:${l.column}`);
            }
            state = Tokenize.zExpectAny;
            break;
          }
        case Tokenize.zExpectAny:
          {
            switch (l.value) {
              case Tokenize.zRrtype:
                {
                  if (zp.defttl == null) {
                    throw new SyntaxError(`missing TTL with no previous value at ${l.line}:${l.column}`);
                  }
                  h.rrtype = l.torc as Rrtype;
                  state = Tokenize.zExpectRdata;
                  break;
                }
              case Tokenize.zClass:
                {
                  h.class = l.torc as Class;
                  state = Tokenize.zExpectAnyNoClassBl;
                  break;
                }
              case Tokenize.zString:
                {
                  const t = parseInt(l.token);
                  if (isNaN(t)) {
                    throw new SyntaxError(`${l.token} is not number at ${l.line}:${l.column}`);
                  }
                  h.ttl = t;
                  if (zp.defttl === null || !zp.defttl.isByDirective) {
                    zp.defttl = {
                      ttl: t,
                      isByDirective: false,
                    }
                  }
                  state = Tokenize.zExpectAnyNoTTLBl;
                  break;
                }
              default:
                throw new SyntaxError(`expecting RR type,TTL ot Class at ${l.line}:${l.column}`);
            }
            break;
          }
        case Tokenize.zExpectAnyNoClassBl:
          {
            if (l.value !== Tokenize.zBlank) {
              throw new SyntaxError(`no blank before class at ${l.line}:${l.column}`);
            }
            state = Tokenize.zExpectAnyNoClass;
            break;
          }
        case Tokenize.zExpectAnyNoTTLBl:
          {
            if (l.value !== Tokenize.zBlank) {
              throw new SyntaxError(`no blank before ttl at ${l.line}:${l.column}`);
            }
            state = Tokenize.zExpectAnyNoTTL;
            break;
          }
        case Tokenize.zExpectAnyNoClass:
          {
            switch (l.value) {
              case Tokenize.zString:
                {
                  const t = parseInt(l.token);
                  if (isNaN(t)) {
                    throw new SyntaxError(`${l.token} is not number at ${l.line}:${l.column}`);
                  }
                  h.ttl = t;
                  if (zp.defttl === null || !zp.defttl.isByDirective) {
                    zp.defttl = {
                      ttl: t,
                      isByDirective: false
                    }
                  }
                  state = Tokenize.zExpectRrtypeBl;
                  break;
                }
              case Tokenize.zRrtype:
                {
                  h.rrtype = l.torc as Rrtype;
                  state = Tokenize.zExpectRdata;
                  break;
                }
              default:
                throw new SyntaxError(`expecting Rr type or ttl at ${l.line}:${l.column}`);
            }
            break;
          }
        case Tokenize.zExpectAnyNoTTL:
          {
            switch (l.value) {
              case Tokenize.zClass:
                {
                  h.class = l.torc as Class;
                  state = Tokenize.zExpectRrtypeBl;
                  break;

                }

              case Tokenize.zRrtype:
                {
                  h.rrtype = l.torc as Rrtype;
                  state = Tokenize.zExpectRdata;
                  break;
                }
              default:
                throw new SyntaxError(`expecting RR type or class at ${l.line}:${l.column}`);
            }
            break;
          }
        case Tokenize.zExpectRrtypeBl:
          {
            if (l.value !== Tokenize.zBlank) {
              throw new SyntaxError(`expecting RR type or TTL at ${l.line}:${l.column}`);
            }
            state = Tokenize.zExpectRrtype;
            break;
          }
        case Tokenize.zExpectRrtype:
          {
            if (l.value !== Tokenize.zRrtype) {
              throw new SyntaxError(`unknown RR type at ${l.line}:${l.column}`);
            }
            h.rrtype = l.torc as Rrtype;
            state = Tokenize.zExpectRdata;
            break;
          }
        case Tokenize.zExpectRdata:
          {
            if (l.value !== Tokenize.zBlank) {
              throw new SyntaxError(`expecting blank at ${l.line}:${l.column}`);
            }
            return zp.parseRdata(h);
          }
      }
    }

    return null;
  }
  private parseRdata(hdr: RrHeader): RR | null {
    const zp = this;
    switch (hdr.rrtype) {
      case Rrtype.CNAME:
        {
          const l = zp.c.next();
          if (l.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting string but got ${l.token} at ${l.line}:${l.column}`);
          }
          const target = zp.toAbsoluteName(l.token, zp.origin);
          if (target === null) {
            throw new SyntaxError(`${l.token} is not domain at ${l.line}:${l.column}`);
          }
          const rr: CNAME = {
            hdr: hdr as RrHeader<Rrtype.CNAME>,
            target
          }
          return rr;
        }
      case Rrtype.HINFO:
        {
          const l = zp.c.next();
          if (l.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting string but got ${l.token} at ${l.line}:${l.column}`);
          }
          const cpu = l.token;
          const b = zp.c.next();
          if (b.value !== Tokenize.zBlank) {
            throw new SyntaxError(`expecting blank at ${b.line}:${b.column}`);
          }
          const lx = zp.c.next();
          if (lx.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting os string but got ${lx.token} at ${lx.line}: ${lx.column}`);
          }
          const os = lx.token;
          const rr: HINFO = {
            hdr: hdr as RrHeader<Rrtype.HINFO>,
            cpu,
            os
          }
          return rr;
        }
      case Rrtype.MX:
        {
          const l = zp.c.next();
          if (l.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting string but got ${l.token} at ${l.line}:${l.column}`);
          }
          const preference = parseInt(l.token);
          if (isNaN(preference)) {
            throw new SyntaxError(`expecting mx preference,but ${l.token} is not number at ${l.line}:${l.column}`);
          }
          const b = zp.c.next();
          if (b.value !== Tokenize.zBlank) {
            throw new SyntaxError(`expecting blank at ${b.line}:${b.column}`);
          }
          const m = zp.c.next();
          if (m.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting string but got ${m.token} at ${m.line}:${m.column}`);
          }
          const mx = zp.toAbsoluteName(m.token, zp.origin);
          if (mx === null) {
            throw new SyntaxError(`${m.token} is not domain at ${m.line}:${m.column}`);
          }
          const rr: MX = {
            hdr: hdr as RrHeader<Rrtype.MX>,
            preference,
            mx,
          }
          return rr;
        }
      case Rrtype.NS:
        {
          const l = zp.c.next();
          if (l.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting string but got ${l.token} at ${l.line}:${l.column}`);
          }
          const ns = zp.toAbsoluteName(l.token, zp.origin);
          if (ns === null) {
            throw new SyntaxError(`${l.token} is not domain at ${l.line}:${l.column}`);
          }
          const rr: NS = {
            hdr: hdr as RrHeader<Rrtype.NS>,
            ns
          }
          return rr;
        }
      case Rrtype.PTR:
        {
          const l = zp.c.next();
          if (l.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting string but got ${l.token} at ${l.line}:${l.column}`);
          }
          const ptr = zp.toAbsoluteName(l.token, this.origin);
          if (ptr === null) {
            throw new SyntaxError(`${l.token} is not domain at ${l.line}:${l.column}`);
          }
          const rr: PTR = {
            hdr: hdr as RrHeader<Rrtype.PTR>,
            ptr
          }
          return rr;
        }
      case Rrtype.SOA:
        {
          const l = zp.c.next();
          if (l.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting string but got ${l.token} at ${l.line}:${l.column}`);
          }
          const ns = zp.toAbsoluteName(l.token, zp.origin);
          if (ns === null) {
            throw new SyntaxError(`${l.token} is not domain at ${l.line}:${l.column}`);
          }
          const b = zp.c.next();
          if (b.value !== Tokenize.zBlank) {
            throw new SyntaxError(`expecting blank at ${b.line}:${b.column}`);
          }
          const lx = zp.c.next();
          const mbox = zp.toAbsoluteName(lx.token, zp.origin);
          if (mbox === null) {
            throw new SyntaxError(`${l.token} is not domain at ${l.line}:${l.column}`);
          }


          const rr: SOA = {
            hdr: hdr as RrHeader<Rrtype.SOA>,
            ns,
            mbox,
            serial: 0,
            refresh: 0,
            retry: 0,
            expire: 0,
            minttl: 0
          }
          const b2 = zp.c.next();
          if (b2.value !== Tokenize.zBlank) {
            throw new SyntaxError(`expecting blank at ${b2.line}:${b2.column}`);
          }
          for (let i = 0; i < 5; i++) {
            const lx = zp.c.next();
            const n = parseInt(lx.token);
            if (isNaN(n)) {
              throw new SyntaxError(`${lx.token} is not number at ${lx.line}:${lx.column}`);
            }
            switch (i) {
              case 0:
                {
                  rr.serial = n;
                  const lx = zp.c.next();
                  if (lx.value !== Tokenize.zBlank) {
                    throw new SyntaxError(`${lx.token} is not blank at ${lx.line}:${lx.column}`);
                  }
                  break;
                }
              case 1:
                {
                  rr.refresh = n;
                  const lx = zp.c.next();
                  if (lx.value !== Tokenize.zBlank) {
                    throw new SyntaxError(`${lx.token} is not blank at ${lx.line}:${lx.column}`);
                  }
                  break;
                }
              case 2:
                {
                  rr.retry = n;
                  const lx = zp.c.next();
                  if (lx.value !== Tokenize.zBlank) {
                    throw new SyntaxError(`${lx.token} is not blank at ${lx.line}:${lx.column}`);
                  }
                  break;
                }
              case 3:
                {
                  rr.expire = n;
                  const lx = zp.c.next();
                  if (lx.value !== Tokenize.zBlank) {
                    throw new SyntaxError(`${lx.token} is not blank at ${lx.line}:${lx.column}`);
                  }
                  break;
                }
              case 4:
                {
                  rr.minttl = n;

                  break;
                }
            }
          }
          return rr;
        }
      case Rrtype.TXT:
        {
          const zp = this;
          const txt = zp.sliceRdata(zp.c);
          if (txt.length > 1) {
            throw new SyntaxError('arguments is too many');
          }
          const rr: TXT = {
            hdr: hdr as RrHeader<Rrtype.TXT>,
            txt: txt[0],
          }
          return rr;

        }
      case Rrtype.A:
        {
          const l = zp.c.next();
          if (l.value !== Tokenize.zString) {
            throw new SyntaxError(`expecting string but got ${l.token} at ${l.line}:${l.column}`);
          }
          const a = l.token;
          const rr: A = {
            hdr: hdr as RrHeader<Rrtype.A>,
            a,
          }
          return rr;
        }
    }
  }

  private sliceRdata(c: ZoneLexer): string[] {
    const s: string[] = [];
    let quote = false;
    let empty = false;
    let l: Lex;
    for (l = c.next(); l.value !== Tokenize.zNewline && l.value !== Tokenize.zEOF; l = c.next()) {
      switch (l.value) {
        case Tokenize.zString:
          {
            empty = false;
            s.push(l.token);
            break;
          }
        case Tokenize.zBlank:
          {
            if (quote) {
              throw new SyntaxError(`not expected blank at ${l.line}:${l.column}`);
            }
            break;
          }
        case Tokenize.zQuote:
          {
            if (empty && quote) {
              s.push('');
            }
            quote = !quote;
            empty = true;
            break;
          }
        default:
          {
            throw new SyntaxError(`expecting string but got ${l.token} at ${l.line}:${l.column}`);
          }
      }

    }
    if (quote) {
      throw new SyntaxError(`missing \'"\' at ${l.line}:${l.column}`);
    }
    return s;
  }
}
