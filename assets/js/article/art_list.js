$(function () {
  let layer = layui.layer
  let form = layui.form
  var laypage = layui.laypage
  //做一个时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器

  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }
  initTable()

  //定义渲染文章列表的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取数据失败')
        }
        // 调用模板引擎渲染文章分类的选项
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // initTable()
        initCate()
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取列表失败')
        }
        // 调用模板引擎渲染分类的可选项
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  //  实现筛选功能
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  //定义一个渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum, //设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10], //每页展示多少条
      jump: function (obj, first) {
        //可以通过first值来判断是通过哪种方式,触发的jump回调
        //把最新的页码值,赋值到q这个查询参数对象中
        q.pagenum = obj.curr
        //吧最新的条目数,赋值到q这个查询参数对象的pagesize属性中
        q.pagesize = obj.limit
        //根据最新的q获取对应的数据列表,并渲染表格
        //首次不执行
        if (!first) {
          initTable()
        }
      }
    })
  }

  //删除文章的方法
  $('tbody').on('click', '.btn-delete', function () {
     let len = $('.btn-delete').length
    let id = $(this).attr('data-id')
    layer.confirm('确认要删除吗?', { icon: 3, title: '提示' }, function (index) {
      // 问题：删除后，页码值虽然正常，但是当前页码的数据没有渲染出来
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.msg('删除成功')
          // 解决：
          // - 判断删除后，页面上是否还有数据
          // - 判断当前页面的删除按钮的长度是否等于1
          // - 如果等于1，那么我们让当前页码-1即可，如果不等于1，不用处理
          if(len ===1 ){
            q.pagenum = q.pagenum ===1?1:q.pagenum-1
          }
          initTable()
        }
      })
      layer.close(index)
    })
  })
})
