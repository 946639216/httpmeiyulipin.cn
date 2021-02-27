import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';

// 点击登录按钮，将用户名和密码传输给后端
const $btn = $('.btn');
const $username = $('#username');
const $password = $('#password');
$btn.on('click', function() {
    $.ajax({
        type: 'post',
        url: 'http://10.31.165.44/httpmeiyulipin.cn/php/login.php',
        // url: 'http://192.168.1.107/httpmeiyulipin.cn/php/login.php',
        data: {
            username: $username.val(),
            password: $password.val()
        }
    }).done(function(data) { //data:后端返回的值
        if (data === 'true') { //登录成功:跳转首页，同时首页应该出现用户名等信息(本地存储)。
            alert('登录成功');
            window.localStorage.setItem('loginname', $username.val());
            location.href = 'index.html';
        } else { //登录失败
            alert('用户名或者密码错误');
            $password.val(''); //清空密码
        }
    });
});