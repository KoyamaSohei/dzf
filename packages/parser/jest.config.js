module.exports = {
  'roots': [
    'src'
  ],
  'transform': {
    '^.+\\.ts$': 'ts-jest'
  },
  'globals': {
    'ts-jest': {
      'tsConfig': 'src/__tests__/tsconfig.json'
    }
  },
  'preset': 'ts-jest',
  'testRegex': '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  'moduleFileExtensions': [
    'ts',
    'js',
    'json',
    'node'
  ],
}