module.exports = {
  title: 'favs',
  type: 'object',
  required: true,
  additionalProperties: false,
  properties: {
    rate: {
      type: ['integer', 'null'],
      required: true,
      maximum: 5,
      minimum: 1,
      exclusiveMaximum: false,
      exclusiveMinimum: false
    }
  }
}
