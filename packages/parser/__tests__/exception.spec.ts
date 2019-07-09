import { parseZone } from '../src';

describe('exception scenario', () => {
  it('missing )', () => {
    expect(() => {
      parseZone('example1.com.\tIN\tSOA\tns1.example1.com.\troot.example1.com.\t( 10000 10000 10000 10000 10000 \n', 'example1.com');
    }).toThrowError();
  })

  it('missing (', () => {
    expect(() => {
      parseZone('example1.com.\tIN\tSOA\tns1.example1.com.\troot.example1.com.\t 10000 10000 10000 10000 10000 )\n', 'example1.com');
    }).toThrowError();
  })

  it('origin is "" but use @', () => {
    expect(() => {
      parseZone('@\tANY\tA\t123.45.67.89', '');
    }).toThrowError();
  })
})