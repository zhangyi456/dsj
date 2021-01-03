$(function () {
  let layer = layui.layer
  let form = layui.form
  let indexAdd = null
  initArtCastList()
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('添加文章失败')
        }
        layer.msg('添加成功')
        layer.close(indexAdd)
        initArtCastList()
      }
    })
  })

  //修改文章分类
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    let id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })
  //修改文章分类数据
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改文章失败')
        }
        layer.msg('修改文章成功')
        layer.close(indexEdit)
        initArtCastList()
      }
    })
  })
  //删除文章分类
  $('tbody').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return  layer.msg('删除文章失败')
          }
          layer.msg('删除文章成功')
          layer.close(index)
          initArtCastList()
        }
      })
    })
  })
})

function initArtCastList() {
  $.ajax({
    method: 'GET',
    url: '/my/article/cates',
    success: function (res) {
      var htmlStr = template('tpl-table', res)
      $('tbody').html(htmlStr)
    }
  })
}
