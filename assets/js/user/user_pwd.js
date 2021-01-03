$(function () {
  let form = layui.form
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6~12位，且不能出现空格'],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同'
      }
    },
    rePwd: function (value) {
      if (value !== $('[name = newPwd]').val()) {
        return '两次密码不一致'
      }
    }
  })
  //获取表单数据,提交给服务器
  $('.layui-form').on('submit', function (e) {
    //阻止表单默认提交
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      // 收集数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('提交信息失败')
        }
        layui.layer.msg('提交信息成功')
        //重置表单
        $('.layui-form')[0].reset()
      }
    })
  })
})
