module.exports = function validate (params) {
  var keys = {
    mak: 'circle name',
    act: 'authour',
    nam: 'title',
    gnr: 'genre',
    mch: 'main charactor',
    com: 'comment',
    kyw: 'keyword, tag',
    ser: 'series'
  }

  if (Object.prototype.toString.apply(params) !== '[object Object]') {
    throw new TypeError('params must be "object"')
  }
  if (!('category' in params)) {
    throw new Error('"category" not found in params')
  }
  if (!('value' in params)) {
    throw new Error('"value" not found in params')
  }
  if (typeof params.category !== 'string') {
    throw new TypeError('"params.category" must be "string"')
  }
  if (typeof params.value !== 'string') {
    throw new TypeError('"params.value" must be "string"')
  }
  if (!params.value.trim()) {
    throw new Error('"params.value" is empty')
  }
  if (Object.keys(keys).indexOf(params.category) === -1) {
    throw new Error('"categoory" is wrong "' + params.category + '"')
  }

  return true
}
