var chai = global.chai = require('chai')
var expect = global.expect = chai.expect
var obj2arg = global.obj2arg = require('../index')

const test1 = {
  string: 'String',
  int: 10,
  float: 3.14,
  date: new Date('2100-01-01'),
  array: [ 1, 2, 3 ],
  remove: undefined,
  nil: null
}
const result1 = '{string:"String",int:10,float:3.14,date:"2100-01-01T00:00:00.000Z",array:[1,2,3]}'

const test2 = {
  arr: [
    {
      k: [1, null],
      l: [null]
    },
    2,
    'three'
  ],
  obj: {
    obj: {},
    obj2: { x: 1 }
  }
}

const result2 = '{arr:[{k:[1],l:[]},2,"three"],obj:{obj:{},obj2:{x:1}}}'

const test3 = {
  enum: 'Enum::ENUMERATION',
  date: 'Date::2100-01-01',
  bool: 'Boolean::false',
  float: 'Float::1.1',
  int: 'Int::100'
}

const result3 = '{enum:ENUMERATION,date:"2100-01-01T00:00:00.000Z",bool:true,float:1.1,int:100}'

const test4 = {
  val: null,
  arr: [ null, 1 ]
}

const result4 = '{val:null,arr:[null,1]}'

const test5 = {
  k: 1,
  l: 'two'
}

const result5 = 'k:1,l:"two"'
const result6 = 'val:null,arr:[null,1]'

const test7 = {
  enum: obj2arg.Enum('ENUMERATION')
}

const result7 = '{enum:ENUMERATION}'

describe('Unit Test', function () {
  it('should convert basic types', function (done) {
    expect(obj2arg(test1)).to.equal(result1)
    done()
  })
  it('should convert complex types', function (done) {
    expect(obj2arg(test2)).to.equal(result2)
    done()
  })
  it('should convert delared types', function (done) {
    expect(obj2arg(test3)).to.equal(result3)
    done()
  })
  it('should retain null values', function (done) {
    expect(obj2arg(test4, { keepNulls: true })).to.equal(result4)
    done()
  })
  it('should remove outer braces', function (done) {
    expect(obj2arg(test5, { noOuterBraces: true })).to.equal(result5)
    done()
  })
  it('should accept Enum object', function (done) {
    expect(obj2arg(test7)).to.equal(result7)
    done()
  })
})