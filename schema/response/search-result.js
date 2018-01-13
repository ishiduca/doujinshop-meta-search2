module.exports = {
  title: 'response search core',
  type: 'object',
  required: true,
  addtionalProperties: false,
  properties: {
    urlOfTitle: {
      title: 'response search core urlOfTitle',
      type: 'string',
      required: true,
      format: 'uri'
    },
    urlOfCircle: {
      title: 'response search core urlOfCircle',
      type: 'string',
//      required: true,
      format: 'uri'
    },
    srcOfThumbnail: {
      title: 'response search core srcOfThumbnail',
      type: 'string',
      required: true,
      format: 'uri'
    },
    title: {
      title: 'response search core title',
      type: 'string',
      required: true
    },
    circle: {
      title: 'response search core circle',
      type: 'string',
      required: true
    }
  }
}
