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
      params: null
    },
    {
      content: yo`<span><i class="fa fa-star"></i> i</span>`,
      command: 'storage:getFavsList',
      params: 1
    },
    {
      content: yo`<span><i class="fa fa-star"></i> ii</span>`,
      command: 'storage:getFavsList',
      params: 2
    },
    {
      content: yo`<span><i class="fa fa-star"></i> iii</span>`,
      command: 'storage:getFavsList',
      params: 3
    },
    {
      content: yo`<span><i class="fa fa-star"></i> iv</span>`,
      command: 'storage:getFavsList',
      params: 4
    },
    {
      content: yo`<span><i class="fa fa-star"></i> v</span>`,
      command: 'storage:getFavsList',
      params: 5
    },
    {
      content: yo`<span><i class="fa fa-history"></i></span>`,
      command: 'dom:smoothScroll',
      params: '#result-meta-search-list-section'
    }
  ]
}
