import { isRrtype, toRrtype, isClass, toClass, Rrtype, Class } from '../src';

describe('normal scenario', () => {
  it('isRrtype', () => {
    expect(isRrtype('CNAME')).toEqual(Rrtype.CNAME);
    expect(isRrtype('HINFO')).toEqual(Rrtype.HINFO);
    expect(isRrtype('MX')).toEqual(Rrtype.MX);
    expect(isRrtype('NS')).toEqual(Rrtype.NS);
    expect(isRrtype('PTR')).toEqual(Rrtype.PTR);
    expect(isRrtype('SOA')).toEqual(Rrtype.SOA);
    expect(isRrtype('TXT')).toEqual(Rrtype.TXT);
    expect(isRrtype('A')).toEqual(Rrtype.A);
  });
  it('toRrtype', () => {
    expect(toRrtype(Rrtype.CNAME)).toEqual('CNAME');
    expect(toRrtype(Rrtype.HINFO)).toEqual('HINFO');
    expect(toRrtype(Rrtype.MX)).toEqual('MX');
    expect(toRrtype(Rrtype.NS)).toEqual('NS');
    expect(toRrtype(Rrtype.PTR)).toEqual('PTR');
    expect(toRrtype(Rrtype.SOA)).toEqual('SOA');
    expect(toRrtype(Rrtype.TXT)).toEqual('TXT');
    expect(toRrtype(Rrtype.A)).toEqual('A');
  });
  it('isClass', () => {
    expect(isClass('IN')).toEqual(Class.IN);
    expect(isClass('CS')).toEqual(Class.CS);
    expect(isClass('CH')).toEqual(Class.CH);
    expect(isClass('HS')).toEqual(Class.HS);
    expect(isClass('NONE')).toEqual(Class.NONE);
    expect(isClass('ANY')).toEqual(Class.ANY);
  });
  it('toClass', () => {
    expect(toClass(Class.IN)).toEqual('IN');
    expect(toClass(Class.CS)).toEqual('CS');
    expect(toClass(Class.CH)).toEqual('CH');
    expect(toClass(Class.HS)).toEqual('HS');
    expect(toClass(Class.NONE)).toEqual('NONE');
    expect(toClass(Class.ANY)).toEqual('ANY');
  });
});
