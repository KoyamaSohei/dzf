import { RR } from '@dzfu/core';
import { genZone } from '../src';

describe('generate file', () => {
  it('multipie RRs', () => {
    const rrs: RR[] = [
      {
        class: 0,
        expire: 1209600,
        mbox: 'root.example1.com.',
        minttl: 3600,
        name: 'example1.com.',
        ns: 'ns.example1.com.',
        refresh: 3600,
        retry: 3600,
        rrtype: 5,
        serial: 20190101,
        ttl: 3600
      },
      {
        class: 0,
        name: 'example1.com.',
        ns: 'ns.example1.com.',
        rrtype: 3,
        ttl: 3600
      },
      {
        class: 0,
        name: 'example1.com.',
        ns: 'ns2.example1.com.',
        rrtype: 3,
        ttl: 3600
      },
      {
        a: '127.0.0.1',
        class: 0,
        name: 'localhost.example1.com.',
        rrtype: 7,
        ttl: 3600
      },
      {
        a: '192.1.2.2',
        class: 0,
        name: 'ns.example1.com.',
        rrtype: 7,
        ttl: 3600
      },
      {
        a: '192.1.2.3',
        class: 0,
        name: 'ns2.example1.com.',
        rrtype: 7,
        ttl: 3600
      },
      {
        a: '192.249.249.1',
        class: 0,
        name: 'bug.example1.com.',
        rrtype: 7,
        ttl: 3600
      },
      {
        a: '192.249.249.2',
        class: 0,
        name: 'dog.example1.com.',
        rrtype: 7,
        ttl: 3600
      },
      {
        a: '192.249.249.3',
        class: 0,
        name: 'cat.example1.com.',
        rrtype: 7,
        ttl: 3600
      },
      {
        a: '192.249.249.4',
        class: 0,
        name: 'shark.example1.com.',
        rrtype: 7,
        ttl: 3600
      },
      {
        class: 0,
        name: 'foo.example1.com.',
        rrtype: 0,
        target: 'example2.com.',
        ttl: 3600
      },
      {
        class: 0,
        name: 'bar.example1.com.',
        rrtype: 0,
        target: 'foo.example2.com.',
        ttl: 3600
      }
    ];
    expect(genZone(rrs)).toMatchSnapshot();
  });
});
