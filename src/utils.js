export function Enum (value) {
  if (!(this instanceof Enum)) return new Enum(value)
  this.value = value
}

export function isString (obj) {
  return typeof obj === 'string'
}

export function isEnum (obj) {
  return obj instanceof Enum
}

export function isArray (obj) {
  return Array.isArray(obj)
}

export function isObject (obj) {
  return typeof obj === 'object' && obj !== null
}

export function isFunction (obj) {
  return typeof obj === 'function'
}

export function escapeString (str) {
  if (!isString(str)) return ''
  return String(str)
    .replace(/\\/gm, '\\\\')
    .replace(/\//gm, '\\/')
    .replace(/\b/gm, '')
    .replace(/\f/gm, '\\f')
    .replace(/\n/gm, '\\n')
    .replace(/\r/gm, '\\r')
    .replace(/\t/gm, '\\t')
    .replace(/"/gm, '\\"')
}

export function includes (obj, key) {
  return isArray(obj) && obj.indexOf(key) !== -1
}

export function forEach (obj, fn) {
  try {
    if (isArray(obj)) {
      let idx = 0
      for (let val of obj) {
        if (fn(val, idx) === false) break
        idx++
      }
    } else {
      for (const key in obj) {
        if (fn(obj[key], key) === false) break
      }
    }
  } catch (err) {
    return
  }
}

export function map (obj, fn) {
  let output = []
  forEach(obj, (v, k) => output.push(fn(v, k)))
  return output
}

export function circular (obj, value = '[Circular]') {
  let circularEx = (_obj, key = null, seen = []) => {
    seen.push(_obj)
    if (isObject(_obj)) {
      forEach(_obj, (o, i) => {
        if (includes(seen, o)) _obj[i] = isFunction(value) ? value(_obj, key, seen.slice(0)) : value
        else circularEx(o, i, seen.slice(0))
      })
    }
    return _obj
  }

  if (!obj) throw new Error('circular requires an object to examine')
  return circularEx(obj, value)
}

export default {
  Enum,
  isString,
  isEnum,
  isArray,
  isObject,
  isFunction,
  escapeString,
  includes,
  forEach,
  map,
  circular
}