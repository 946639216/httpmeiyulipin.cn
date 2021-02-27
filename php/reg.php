<?php
include "conn.php";
if(isset($_POST['checkname'])){
    // 数据传输
    $checkname = $_POST['checkname'];
    $result=$conn->query("SELECT * FROM reg WHERE username = '$checkname'");//where后面跟的是数据库查询的条件。
        //查询所有的信息来自于register表，但是条件是用户名和传入的用户信息相等。
    
        //$result->fetch_assoc():逐条获取$result里面每一条记录,返回值是一个数组。
        if($result->fetch_assoc()){//满足条件，存在值，说明此用户名不能被注册。
        echo 'true';
    }else{
        echo 'false';
    }
}
if(isset($_POST['submit'])){
    $username=$_POST['username'];
    $password=sha1($_POST['password']);
    $repass=sha1($_POST['repass']);

    if($repass===$password){
        $conn->query("insert reg values(null,'$username','$password','$repass')");
    }else{
        echo '两次密码不同,请重新输入';
    }

    header('location:http://10.31.165.44/httpmeiyulipin.cn/src/login.html');
    // header('location:http://192.168.1.107/httpmeiyulipin.cn/src/login.html');
    //后端跳转前端，前端跳转后端都需要采用绝对路径，但是如果是前端跳转前端，后端跳转后端可以使用相对路径。
}