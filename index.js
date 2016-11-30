'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

function Enum(value) {
  if (!(this instanceof Enum)) return new Enum(value);
  this.value = value;
}

function isString(obj) {
  return typeof obj === 'string';
}

function isEnum(obj) {
  return obj instanceof Enum;
}

function isArray(obj) {
  return Array.isArray(obj);
}

function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

function isFunction(obj) {
  return typeof obj === 'function';
}

function escapeString(str) {
  if (!isString(str)) return '';
  return String(str).replace(/\\/gm, '\\\\').replace(/\//gm, '\\/').replace(/\b/gm, '').replace(/\f/gm, '\\f').replace(/\n/gm, '\\n').replace(/\r/gm, '\\r').replace(/\t/gm, '\\t').replace(/"/gm, '\\"');
}

function includes(obj, key) {
  return isArray(obj) && obj.indexOf(key) !== -1;
}

function forEach(obj, fn) {
  try {
    if (isArray(obj)) {
      var idx = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var val = _step.value;

          if (fn(val, idx) === false) break;
          idx++;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      for (var key in obj) {
        if (fn(obj[key], key) === false) break;
      }
    }
  } catch (err) {
    return;
  }
}

function map(obj, fn) {
  var output = [];
  forEach(obj, function (v, k) {
    return output.push(fn(v, k));
  });
  return output;
}

function circular(obj) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '[Circular]';

  var circularEx = function circularEx(_obj) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var seen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    seen.push(_obj);
    if (isObject(_obj)) {
      forEach(_obj, function (o, i) {
        if (includes(seen, o)) _obj[i] = isFunction(value) ? value(_obj, key, seen.slice(0)) : value;else circularEx(o, i, seen.slice(0));
      });
    }
    return _obj;
  };

  if (!obj) throw new Error('circular requires an object to examine');
  return circularEx(obj, value);
}

var utils = {
  Enum: Enum,
  isString: isString,
  isEnum: isEnum,
  isArray: isArray,
  isObject: isObject,
  isFunction: isFunction,
  escapeString: escapeString,
  includes: includes,
  forEach: forEach,
  map: map,
  circular: circular
};

/*
 * @name - graphql-obj2arg
 * @description - Convert JavaScript a object into a GraphQL argument string
 * @author - Branden Horiuchi <bhoriuchi@gmail.com>
 *
 */
var ARRAY = 'array';
var BOOLEAN = 'boolean';
var DATE = 'date';
var ENUM = 'enum';
var FLOAT = 'float';
var INT = 'int';
var NULL = 'null';
var NUMBER = 'number';
var OBJECT = 'object';
var STRING = 'string';
var UNDEFINED = 'undefined';
var RX_BOOLEAN = /^Boolean::/;
var RX_DATE = /^Date::/;
var RX_ENUM = /^Enum::/;
var RX_FLOAT = /^Float::/;
var RX_INT = /^Int::/;
var RX_OUTER_BRACES = /^{|^\[|\]$|}$/g;

function getType(obj) {
  if (obj === null) {
    return { obj: obj, type: NULL };
  } else if (obj === undefined) {
    return { obj: obj, type: UNDEFINED };
  } else if (obj instanceof utils.Enum) {
    return { obj: obj.value, type: ENUM };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === STRING) {
    if (obj.match(RX_BOOLEAN)) return { obj: Boolean(obj.replace(RX_BOOLEAN, '')), type: BOOLEAN };
    if (obj.match(RX_DATE)) return { obj: new Date(obj.replace(RX_DATE, '')), type: DATE };
    if (obj.match(RX_ENUM)) return { obj: obj.replace(RX_ENUM, ''), type: ENUM };
    if (obj.match(RX_FLOAT)) return { obj: obj.replace(RX_FLOAT, ''), type: FLOAT };
    if (obj.match(RX_INT)) return { obj: obj.replace(RX_INT, ''), type: INT };
    return { obj: obj, type: STRING };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === BOOLEAN) {
    return { obj: obj, type: BOOLEAN };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === NUMBER) {
    return obj % 1 === 0 ? { obj: obj, type: INT } : { obj: obj, type: FLOAT };
  } else if (Array.isArray(obj)) {
    return { obj: obj, type: ARRAY };
  } else if (obj instanceof Date) {
    return { obj: obj, type: DATE };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === OBJECT) {
    return { obj: obj, type: OBJECT };
  } else {
    return { obj: obj, type: UNDEFINED };
  }
}

var toArguments = function toArguments(obj) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var keepNulls = options.keepNulls === true ? true : false;
  var noOuterBraces = options.noOuterBraces === true ? true : false;

  var toLiteral = function toLiteral(o) {
    var _getType = getType(o),
        obj = _getType.obj,
        type = _getType.type;

    var _ret = function () {
      switch (type) {
        case ARRAY:
          var arrList = [];
          utils.forEach(obj, function (v) {
            var arrVal = toLiteral(v);
            if (arrVal === NULL && keepNulls || arrVal && arrVal !== NULL) arrList.push(arrVal);
          });
          return {
            v: '[' + arrList.join(',') + ']'
          };
        case OBJECT:
          var objList = [];
          utils.forEach(obj, function (v, k) {
            var objVal = toLiteral(v);
            if (objVal === NULL && keepNulls || objVal && objVal !== NULL) objList.push(k + ':' + objVal);
          });
          return {
            v: '{' + objList.join(',') + '}'
          };
        case DATE:
          return {
            v: '"' + obj.toISOString() + '"'
          };
        case FLOAT:
          var s = String(obj);
          return {
            v: s.indexOf('.') === -1 ? s + '.0' : s
          };
        case NULL:
          return {
            v: NULL
          };
        case STRING:
          return {
            v: '"' + utils.escapeString(obj) + '"'
          };
        case UNDEFINED:
          return {
            v: undefined
          };
        default:
          return {
            v: String(obj)
          };
      }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  };

  var objStr = toLiteral(utils.circular(obj));
  return noOuterBraces ? objStr.replace(RX_OUTER_BRACES, '') : objStr;
};

toArguments.Enum = utils.Enum;
toArguments.escapeString = utils.escapeString;

module.exports = toArguments;
