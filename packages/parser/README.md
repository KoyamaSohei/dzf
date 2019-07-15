@dzf/parser
--------
dns zonefile parser

## Install

```bash
yarn add @dzf/parser
```

## Usage

```ts
import { parseZone, RR } from '@dzf/parser';

const text = `
$TTL  3600
@ IN  SOA ns.example1.com. root.example1.com. (
  20190101  ; serial
  3600 ; refresh
  3600 ; retry
  1209600 ; expire
  3600 ; negative cache ttl
)

; NS records

@  IN  NS  ns.example1.com.
@  IN  NS  ns2.example1.com. 

; A records

localhost.example1.com. IN  A 127.0.0.1
ns.example1.com.  IN  A 192.1.2.2
ns2.example1.com. IN  A 192.1.2.3
bug.example1.com. IN  A 192.249.249.1
dog IN  A 192.249.249.2
cat IN  A 192.249.249.3
shark IN  A 192.249.249.4

; CNAME records

foo.example1.com.  IN  CNAME example2.com.
bar.example1.com.  IN  CNAME foo.example2.com.
`;

const rrs: RR[] = parseZone(text,'example1.com.');
console.log(rrs);
/**
Array [
  Object {
    "expire": 1209600,
    "hdr": Object {
      "class": 0,
      "name": "example1.com.",
      "rrtype": 5,
      "ttl": 3600,
    },
    "mbox": "root.example1.com.",
    "minttl": 3600,
    "ns": "ns.example1.com.",
    "refresh": 3600,
    "retry": 3600,
    "serial": 20190101,
  },
  Object {
    "hdr": Object {
      "class": 0,
      "name": "example1.com.",
      "rrtype": 3,
      "ttl": 3600,
    },
    "ns": "ns.example1.com.",
  },

  ...,

  Object {
    "hdr": Object {
      "class": 0,
      "name": "bar.example1.com.",
      "rrtype": 0,
      "ttl": 3600,
    },
    "target": "foo.example2.com.",
  },
]
*/

```