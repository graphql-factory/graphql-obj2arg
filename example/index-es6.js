import obj2arg from '../src/index'

let o1 = {
  str: 'String',
  int: 10,
  flt: 3.14,
  flt0: 'Float::1.0',
  bool: true,
  enum: 'Enum::HI',
  date: new Date(),
  arr: [ 1, 2, { k1: 'a', e: 'Enum::OK' } ],
  code: 'console.log("test1")\nconsole.log("test2")'
}

console.log(obj2arg.utils)

console.log(obj2arg(o1))