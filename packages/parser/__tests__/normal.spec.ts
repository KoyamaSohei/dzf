import { parseZone } from '../src';

describe('normal scenario', () => {

  describe('SOA record', () => {
    it('with class', () => {
      const p = parseZone('example1.com.\tIN\tSOA\tns1.example1.com.\troot.example1.com.\t( 10000 10000 10000 10000 10000 )\n'
        , 'example1.com.');
      expect(p).toMatchSnapshot();
    })
    it('with TTL', () => {
      const p = parseZone('example1.com.\t3600\tIN\tSOA\tns1.example1.com.\troot.example1.com.\t( 10000 10000 10000 10000 10000 )\n'
        , 'example1.com.');
      expect(p).toMatchSnapshot();
    })
    it('with TTL 2', () => {
      const p = parseZone('example1.com.\tIN\t3600\tSOA\tns1.example1.com.\troot.example1.com.\t( 10000 10000 10000 10000 10000 )\n'
        , 'example1.com.');
      expect(p).toMatchSnapshot();
    })
    it('without class', () => {
      const p = parseZone('example1.com.\tSOA\tns1.example1.com.\troot.example1.com.\t( 10000 10000 10000 10000 10000 )\n'
        , 'example1.com.');
      expect(p).toMatchSnapshot();
    })
    it('without class,with TTL', () => {
      const p = parseZone('example1.com.\t3600\tSOA\tns1.example1.com.\troot.example1.com.\t( 10000 10000 10000 10000 10000 )\n'
        , 'example1.com.');
      expect(p).toMatchSnapshot();
    })
  })

  describe('other rrtypes records', () => {
    it('CNAME with class', () => {
      const p = parseZone('foo.example1.com.\tCS\tCNAME example2.com.', 'example1.com.');
      expect(p).toMatchSnapshot();
    })

    it('CNAME with TTL', () => {
      const p = parseZone('foo.example1.com.\t3600\tCH\tCNAME example2.com.', 'example1.com.');
      expect(p).toMatchSnapshot();
    })

    it('HINFO', () => {
      const p = parseZone('example1.com.\tIN\tHINFO\tfoopc\tUNIX', 'example1.com.');
      expect(p).toMatchSnapshot();
    })

    it('MX', () => {
      const p = parseZone('example1.com.\t1800\tMX\t10\tmail1.example.com.', 'example1.com.');
      expect(p).toMatchSnapshot();
    })

    it('NS', () => {
      const p = parseZone('example1.com.\tHS\tNS\tns1.example1.com.', 'example1.com.');
      expect(p).toMatchSnapshot();
    })

    it('TXT', () => {
      const p = parseZone('example1.com.\tCS\tTXT\t"foo! foo! foo!"', 'example1.com.');
      expect(p).toMatchSnapshot();
    })

    it('A', () => {
      const p = parseZone('example1.com.\tANY\tA\t123.45.67.89', 'example1.com.');
      expect(p).toMatchSnapshot();
    })
  })

  describe('$ORIGIN', () => {
    it('basic', () => {
      const p = parseZone('$ORIGIN\texample1.com.\nexample1.com.\tANY\tA\t123.45.67.89', '');
      expect(p).toMatchSnapshot();
    })

    it('not override', () => {
      const p = parseZone('$ORIGIN\texample1.com.\nexample1.com.\tANY\tA\t123.45.67.89', 'foo.com.');
      expect(p).toMatchSnapshot();
    });

    it('@', () => {
      const p = parseZone('$ORIGIN\texample1.com.\n@\tANY\tA\t123.45.67.89', '');
      expect(p).toMatchSnapshot();
    })
  })

  describe('$TTL', () => {
    it('basic', () => {
      const p = parseZone('$TTL\t99999\nexample1.com.\tANY\tA\t123.45.67.89', 'example1.com.');
      expect(p).toMatchSnapshot();
    })

    it('not override', () => {
      const p = parseZone('$ORIGIN\texample1.com.\nexample1.com.\t3600\tANY\tA\t123.45.67.89', 'foo.com.');
      expect(p).toMatchSnapshot();
    });

  })

  describe('absolute domain', () => {
    it('name + origin', () => {
      const p = parseZone('dog \t3600\tANY\tA\t123.45.67.89', 'example1.com.');
      expect(p).toMatchSnapshot();
    })
  })

  describe('misc', () => {
    it('ignore comments', () => {
      const p = parseZone('dog \t3600\tANY\tA\t123.45.67.89; foo! foo!', 'example1.com.');
      expect(p).toMatchSnapshot();
    })
  })


})
