$(function () {
  let layer = layui.layer
  let form = layui.form
  let r = window.location.search.substring(1).split(/=|&/)
  let obj = {}

  for (var i = 0; i < r.length; i += 2) {
    obj[r[i]] = r[i + 1]
  }

  function getAbsoluteUrl() {
    $.ajax({
      method: 'GET',
      url: `/my/article/${obj.Id}`,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取数据失败')
        }
        console.log(res)
        initCate(res.data)
      }
    })
  }
  getAbsoluteUrl()
  //加载文章分类
  //   initCate()
  //调用富文本的方法
  initEditor()
  //定义一个方法获取文章列表
  function initCate(data) {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败')
        }
        //模板引擎渲染结构
        let htmlStr = template('tpl-cate', res)
        $('[name = cate_id]').html(htmlStr)
        // form.render()
        // 要等到分类也加载并渲染完毕了再填充
        form.val('artEdit', data)
        // 富文本编辑器里面并没有默认的内容，只有新版本才支持，这里使用手动填充
        document.querySelector('#content_ifr').contentDocument.querySelector('#tinymce').innerHTML = data.content

        // // 渲染当前用户的头像
        $image.prop('src', 'http://ajax.frontend.itheima.net' + data.cover_img)
        // 等图片 src 正确了之后，再进行初始化
        $image.cropper(options)
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  // 3. 初始化裁剪区域
  //   $image.cropper(options)

  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  //监听一个coverFile的change事件
  $('#coverFile').on('change', function (e) {
    var files = e.target.files
    if (files.length === 0) {
      return
    }

    //根据选的文件,创建一个URL地址
    var newImgURL = URL.createObjectURL(files[0])
    //销毁之前的裁剪区域,在根据选的文件,创建一个新的裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  //定义一个文章的状态
  let art_state = '发布成功'
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    //基于表单 创建一个formData对象
    var fd = new FormData($(this)[0])
    //将文章的发布状态添加到FD 中
    fd.append('state', art_state)

    // 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        fd.append('Id', obj.Id)
        // 发起 ajax 数据请求
        publishArticle(fd)
      })
  })

  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
})
