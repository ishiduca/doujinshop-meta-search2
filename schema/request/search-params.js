module.exports = {
  title: 'requst search params',
  type: 'object',
  required: true,
  addtionalProperties: false,
  properties: {
    category: {
      title: 'request search params category',
      type: 'string',
      required: true,
      enum: [
        'mak', 'act', 'nam', 'gnr', 'com', 'mch', 'kyw'
      ]
    },
    value: {
      title: 'request search params value',
      type: 'string',
      required: true,
      minLength: 1
    }
  }
}
