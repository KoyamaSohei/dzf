import { Lex, Tokenize, Rrtype, Class } from './types';

function isRrtype(t: string) {
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

function isClass(c: string) {
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

export class ByteReader {
  private file: string;
  private idx: number;
  private len: number;
  public constructor(file: string) {
    this.idx = 0;
    this.file = file;
    this.len = file.length;
  }
  public readByte(): string | null {
    if (this.idx >= this.len) {
      return null;
    }
    return this.file[this.idx++];
  }
}

export class ZoneLexer {
  private bl: ByteReader;
  private line: number;
  private column: number;
  private comBuf: string;
  private comment: string;
  private l: Lex;
  private cachedl: Lex | null;
  private brace: number;
  private quote: boolean;
  private space: boolean;
  private commt: boolean;
  private rrtype: boolean;
  private owner: boolean;
  private nextl: boolean;
  private eol: boolean;
  public constructor(r: ByteReader) {
    this.comBuf = '';
    this.comment = '';
    this.l = {
      token: '',
      value: Tokenize.zEOF,
      torc: -1,
      line: -1,
      column: -1
    };
    this.line = 1;
    this.column = 0;
    this.owner = true;
    this.rrtype = false;
    this.bl = r;
    this.brace = 0;
    this.quote = false;
    this.space = false;
    this.commt = false;
    this.nextl = false;
    this.eol = false;
    this.cachedl = null;
  }

  public readByte(): string | null {
    const x = this.bl.readByte();
    if (x === null) {
      return null;
    }

    if (this.eol) {
      this.line++;
      this.column = 0;
      this.eol = false;
    }
    if (x === '\n') {
      this.eol = true;
    } else {
      this.column++;
    }
    return x;
  }

  public next(): Lex {
    const zl: ZoneLexer = this;

    if (zl.cachedl !== null) {
      zl.l = zl.cachedl;
      zl.cachedl = null;
      return zl.l;
    } else if (zl.nextl) {
      zl.nextl = false;
      return zl.l;
    }
    let str = '';
    let com = '';
    let stri = 0;
    let comi = 0;
    let escape = false;
    if (zl.comBuf !== '') {
      comi = Math.min(com.length, zl.comBuf.length);
      com = zl.comBuf;
    }
    zl.comment = '';
    for (let x = zl.readByte(); x !== null; x = zl.readByte()) {
      zl.l.line = zl.line;
      zl.l.column = zl.column;
      switch (x) {
        case ' ':
        case '\t': {
          if (escape || zl.quote) {
            str += x;
            stri++;
            break;
          }
          if (zl.commt) {
            com += x;
            comi++;
            break;
          }
          let retl: Lex | null = null;
          if (stri === 0) {
          } else if (zl.owner) {
            zl.l.value = Tokenize.zOwner;
            zl.l.token = str;
            switch (zl.l.token.toUpperCase()) {
              case '$TTL':
                zl.l.value = Tokenize.zDirTTL;
                break;
              case '$ORIGIN':
                zl.l.value = Tokenize.zDirOrigin;
                break;
            }
            retl = { ...zl.l };
          } else {
            zl.l.value = Tokenize.zString;
            zl.l.token = str;
            if (!zl.rrtype) {
              const rres = isRrtype(zl.l.token.toUpperCase());
              if (rres !== null) {
                zl.l.value = Tokenize.zRrtype;
                zl.l.torc = rres;
                zl.rrtype = true;
              }
              const cres = isClass(zl.l.token.toUpperCase());
              if (cres !== null) {
                zl.l.value = Tokenize.zClass;
                zl.l.torc = cres;
              }
            }
            retl = { ...zl.l };
          }
          zl.owner = false;
          if (!zl.space) {
            zl.space = true;
            zl.l.value = Tokenize.zBlank;
            zl.l.token = '';
            if (retl === null) {
              return zl.l;
            }
            zl.nextl = true;
          }
          if (retl !== null) {
            return retl;
          }
          break;
        }
        case ';': {
          if (escape || zl.quote) {
            str += x;
            stri++;
            escape = false;
            break;
          }
          zl.commt = true;
          zl.comBuf = '';
          if (comi > 1) {
            com += ' ';
            comi++;
          }
          if (stri > 0) {
            zl.comBuf = com;
            zl.l.value = Tokenize.zString;
            zl.l.token = str;
            return zl.l;
          }
          break;
        }
        case '\r': {
          escape = true;
          if (zl.quote) {
            str += x;
            stri++;
          }
          break;
        }
        case '\n': {
          escape = false;
          if (zl.quote) {
            str += x;
            stri++;
            break;
          }
          if (zl.commt) {
            zl.commt = false;
            zl.rrtype = false;
            if (zl.brace == 0) {
              zl.owner = true;
              zl.l.value = Tokenize.zNewline;
              zl.l.token = '\n';
              zl.comment = com;
              return zl.l;
            }
            zl.comBuf = com;
            break;
          }
          if (zl.brace == 0) {
            let retl: Lex | null = null;
            if (stri !== 0) {
              zl.l.value = Tokenize.zString;
              zl.l.token = str;
              if (!zl.rrtype) {
                const res = isRrtype(zl.l.token.toUpperCase());
                if (res !== null) {
                  zl.rrtype = true;
                  zl.l.value = Tokenize.zRrtype;
                  zl.l.torc = res;
                }
              }
              retl = { ...zl.l };
            }
            zl.l.value = Tokenize.zNewline;
            zl.l.token = '\n';

            zl.comment = zl.comBuf;
            zl.comBuf = '';
            zl.rrtype = false;
            zl.owner = true;
            if (retl !== null) {
              zl.nextl = true;
              return retl;
            }
            return zl.l;
          }
          break;
        }
        case '\\': {
          if (zl.commt) {
            com += x;
            comi++;
            break;
          }
          if (escape) {
            str += x;
            stri++;
            escape = false;
            break;
          }
          str += x;
          stri++;
          escape = true;
          break;
        }
        case '"': {
          if (zl.commt) {
            com += x;
            comi++;
            break;
          }
          if (escape) {
            str += x;
            stri++;
            escape = false;
            break;
          }
          zl.space = false;
          let retl: Lex | null = null;
          if (stri !== 0) {
            zl.l.value = Tokenize.zString;
            zl.l.token = str;
            retl = { ...zl.l };
          }
          zl.l.value = Tokenize.zQuote;
          zl.l.token = '"';
          zl.quote = !zl.quote;
          if (retl !== null) {
            zl.nextl = true;
            return retl;
          }
          return zl.l;
        }
        case '(':
        case ')': {
          if (zl.commt) {
            com += x;
            comi++;
            break;
          }
          if (escape || zl.quote) {
            str += x;
            stri++;
            escape = false;
            break;
          }
          switch (x) {
            case ')': {
              zl.brace--;
              if (zl.brace < 0) {
                throw new SyntaxError(
                  `extra closing brace at ${zl.line}:${zl.column}`
                );
              }
              break;
            }
            case '(': {
              zl.brace++;
              break;
            }
          }
          break;
        }
        default:
          escape = false;
          if (zl.commt) {
            com += x;
            comi++;
            break;
          }
          str += x;
          stri++;

          zl.space = false;
      }
    }
    let retl: Lex | null = null;
    if (stri > 0) {
      zl.l.value = Tokenize.zString;
      zl.l.token = str;
      retl = zl.l;
      if (comi <= 0) {
        return retl;
      }
    }
    if (comi > 0) {
      zl.l.value = Tokenize.zNewline;
      zl.l.token = '\n';

      zl.comment = com;
      if (retl !== null) {
        zl.nextl = true;
        return retl;
      }
      return zl.l;
    }
    if (zl.brace !== 0) {
      throw new SyntaxError(`unbalanced brace at ${zl.line}:${zl.column}`);
    }
    return {
      token: '',
      value: Tokenize.zEOF,
      torc: -1,
      line: zl.line,
      column: zl.column
    };
  }

  public Comment(): string {
    return this.comment;
  }
}
