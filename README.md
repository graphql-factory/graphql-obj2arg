# graphql-obj2arg
Converts a JavaScript Object to a GraphQL arguments string

---

GraphQL is great, but it can sometimes be a pain to programatically create arguments for a query. This library can help create an argument string from a JavaScript object.

## Example (ES6)

```js
import graphql from 'graphql'
import obj2arg from 'graphql-obj2arg'
import PeopleSchema from './PeopleSchema'

let args = {
  id: 'jd8675309',
  name: 'John',
  age: 20,
  gpa: 3.9,
  role: 'Enum::STUDENT',
  courses: [
    {
      id: 101,
      name: 'CS101'
    },
    {
      id: 203,
      name: 'CS144'
    }
  ]
}

let query = `mutation updateStudentData {
  updateStudent(${obj2arg(args, { noOuterBraces: true })}) {
    id
  }
}`

graphql(PeopleSchema, query).then((result) => {
  ...
})
```

## API

#### `obj2arg` ( `arguments`, [ `options` ] )

Converts an object into a GraphQL arguments string

**Parameters:**

* `arguments` { `Object` } - Object containing arguments to convert
* [ `options` ] { `Object` } - Options hash
  * [ `keepNulls=false` ] { `Boolean` } - Allows nulls to be included in the argument string if `true`
  * [ `noOuterBraces=false` ] { `Boolean` } - Removes the outer `{}` or `[]` from the argument string
  
**Returns:**
`String` - Argument string

#### `obj2arg.Enum` ( `value` )

Creates an `Enum` object. When part of an arguments object the `Enum` will not be enclosed in double quotes

**Parameters:**

* `value` { `String` } - Enum name

**Returns:**
`Enum` - Enum object

## Declaring Types

Types can be declared in the argument object using declaration notation `<Declaration><Value>`. This is useful for data types that either do not exist in JavaScript (i.e. Enum), can be tricky to determine (i.e. Floats), or simply to ensure a type is parsed a certain way.

### Declarations

* Boolean - `Boolean::`
* Date - `Date::`
* Enum - `Enum::`
* Float - `Float::`
* Int - `Int::`

## Example

```js
let args = {
  bool: 'Boolean::true',
  date: 'Date::2100-01-01',
  enum: 'Enum::MYENUM',
  float: 'Float::1.2',
  int: 'Int::100'
}
```