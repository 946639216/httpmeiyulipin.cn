import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';

// 1.用户点击submit按钮直接提交(form+submit+name+action) - 直接完成

// 2.用户名重名检测：如果用户名存在不允许注册。
// 失去焦点事件进行检测
// 检测过程：
// 先通过ajax将用户名传给后端，后端拿到前端的值和数据库里面的值进行匹配，如果数据库里面存在，说明此用户名不能使用。否则可以使用。
// 后端将匹配的结果返回前端，前端提示错误。
// 表单验证
const $username = $('#username');
const $userspan = $('#userspan');
const $form = $('form');
const $password = $('#password');
const $passspan = $('#passspan');
const $xycheckbox = $('#xycheckbox');
let $userflag = true;
let $passflag = true;
let $checkboxflag = true;
// let $passflag = true;
// 失去焦点将前端的用户名传给后端
$username.on('blur', function() {
    $.ajax({
        type: 'post',
        url: 'http://10.31.165.44/httpmeiyulipin.cn/php/reg.php',
        // url: 'http://192.168.1.107/httpmeiyulipin.cn/php/reg.php',
        data: {
            checkname: $username.val()
        }
    }).done(function(data) { //根据后端的返回值确定是否重名
        if ($username.val() === '') {
            $userspan.html('用户名不能为空');
            $userspan.css('color', 'red');
            $userflag = false;
        } else if (data === 'true') {
            $userspan.html('该用户名已存在');
            $userspan.css('color', 'red');
            $userflag = false;
        } else if (data === 'false') {
            $userspan.html('√');
            $userspan.css('color', 'green');
            $userflag = true;
        }
    })
});
$password.on('blur', function() {
    if ($password.val() === '') {
        $passspan.html('密码不能为空');
        $passspan.css('color', 'red');
        $passflag = false;
    } else if ($password.val().length >= 6 && $password.val().length <= 20) {
        $passspan.html('密码输入正确');
        $passspan.css('color', 'green');
        $passflag = true;
    } else {
        $passspan.html('密码输入错误');
        $passspan.css('color', 'red');
        $passflag = false;
    }
});
$xycheckbox.on('click', function() {
    if ($('#xycheckbox').prop('checked')) {
        $checkboxflag = true;
    } else {
        $checkboxflag = false;
    };
});

//阻止浏览器的submit跳转，如果用户名不能通过，不允许提交注册。
$form.on('submit', function() {
    if ((!$userflag) || (!$passflag) || (!$checkboxflag)) {
        return false;
    } else {
        alert('注册成功');
    }
})