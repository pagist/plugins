
$(function() {

  var container = $('.container').eq(0)
  if (container.length === 0) return

  if (container.children('hr').length === 0) return

  var _pages = splitPages(container.contents())
  setupPager()
  makePagination(_pages)

  function splitPages(nodes) {
    var result = []
    var current = null
    nodes.each(function() {
      var $this = $(this)
      if ($this.is('h1')) return
      if ($this.is('hr')) {
        if (current != null) {
          current.append($this)
          result.push(current)
          current = null
        }
      } else {
        if (current == null && this.nodeType == 1) {
          current = $('<div class="page"></div>').insertBefore($this)
        }
        if (current != null) {
          current.append($this)
        }
      }
    })
    if (current != null) {
      result.push(current)
      current = null
    }
    return result
  }

  function makePagination(pages) {
    var page
    var all = $(pages).map(function() { return this.toArray() })
    var current = all
    $(window).on('hashchange', function() {
      updatePage()
    })
    updatePage()
    function updatePage() {
      var target = extractPageNumber()
      if (page == target) return
      if (current) current.hide()
      current = pages[target - 1]
      if (current) current.show()
      page = target
      $(document).triggerHandler('pagination', [{ page: page, pages: pages }])
    }
    function extractPageNumber() {
      var match = (location.hash).match(/\d+/)
      return (match && parseInt(match[0], 10)) || 1
    }
  }

  function setupPager() {
    var el = $('<ul class="pager"><li class="prev-li"><a href="javascript://" class="prev-link">Previous</a></li> <li class="next-li"><a href="javascript://" class="next-link">Next &rarr;</a></li></ul>').appendTo('.container')
    var prev = el.find('.prev-link')
    var next = el.find('.next-link')
    $(prev).add(next).on('click', function() {
      window.scrollTo(0, 0)
    })
    $(document).on('pagination', function(event, info) {
      el.find('.prev-li').toggleClass('disabled', !!(info.page == 1))
      el.find('.next-li').toggleClass('disabled', !!(info.page == info.pages.length))
      prev.attr('href', '#' + Math.max(1, info.page - 1))
      next.attr('href', '#' + Math.min(info.pages.length, info.page + 1))
    })
  }

})
