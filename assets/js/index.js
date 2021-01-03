$(function () {
  // 获取用户的基本信息
  getUserInfo()
  let layer = layui.layer
  $('#btnLogout').on('click', function () {
    layer.confirm('确定退出登录吗?', { icon: 3, title: '提示' }, function (index) {
      //清空本地的token
      localStorage.removeItem('token')
      //跳转登录页
      location.href = '/login.html'
      // 3. 关闭确认框
      layer.close(index)
    })
  })
})

function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // 请求头这里要存储token令牌
    headers: {
      Authorization: localStorage.getItem('token') || ''
    },
    success: function (res) {
      console.log(res)
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      randerAvatar(res.data)
    }
  })
}

function randerAvatar(user) {
  var name = user.nickname || user.username
  //设置欢迎文本
  $('#welcome').html('欢迎&nbsp' + name)
  //按需求获取用户头像
  if (user.user_pic !== null) {
    // 如果有图片头像先显示图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 没有图片头像就显示文字头像
    $('.layui-nav-img').hide()
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
