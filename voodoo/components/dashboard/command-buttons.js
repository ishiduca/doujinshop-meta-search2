var yo = require('yo-yo-with-proxy/html')

module.exports = {
  buttons: [
    {
      content: yo`<i class="fa fa-times"></i>`,
      command: 'dom:clearResultMetaSearch'
    },
    {
      content: yo`<i class="fa fa-check"></i>`,
      command: 'storage:getDoneList'
    },
    {
      content: yo`<span><i class="fa fa-star"></i> All</span>`,
      command: 'storage:getFavsList',
      params: {rate: null}
    },
    {
      content: yo`<span><i class="fa fa-star"></i> i</span>`,
      command: 'storage:getFavsList',
      params: {rate: 1}
    },
    {
      content: yo`<span><i class="fa fa-star"></i> ii</span>`,
      command: 'storage:getFavsList',
      params: {rate: 2}
    },
    {
      content: yo`<span><i class="fa fa-star"></i> iii</span>`,
      command: 'storage:getFavsList',
      params: {rate: 3}
    },
    {
      content: yo`<span><i class="fa fa-star"></i> iv</span>`,
      command: 'storage:getFavsList',
      params: {rate: 4}
    },
    {
      content: yo`<span><i class="fa fa-star"></i> v</span>`,
      command: 'storage:getFavsList',
      params: {rate: 5}
    },
    {
      content: yo`<span><i class="fa fa-history"></i></span>`,
      command: 'dom:smoothScroll',
      params: '#result-meta-search-list-section'
    }
  ]
}
