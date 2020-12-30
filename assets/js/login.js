$(function () {
  //给登录和注册按钮做点击事件,来回切换登录和注册界面
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })
  //自定义校验规则
  const form = layui.form
  const layer = layui.layer
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      //通过形参拿到密码输入框中的内容
      //通过拿到的内容和再次输入的内容做比较如果值不一样输出"两次密码不一致"
      let pwd = $('.reg-box [name = password]').val()
      if (pwd !== value) {
        return '两次密码输入不一致'
      }
    }
  })
  //监听表单提交事件
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data: {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功')
        $('#link_login').click()
      }
    })
  })
  //监听登录表单的提交事件
  $('#form_login').on('submit', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登陆失败')
        }
        layer.msg('登陆成功')
        //本地存储中记录token令牌
        localStorage.setItem('token', res.token)
        // 登录信息输入正确以后点击登录,可以登录主页
        window.location.href = '/index.html'
      }
    })
  })
})
