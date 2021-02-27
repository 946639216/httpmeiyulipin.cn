<?php
include "./conn.php";
//后端获取用户名和密码去和数据库里面的数据进行匹配
if(isset($_POST['username'])&&isset($_POST['password'])){//接收用户名和密码存在
    $username=$_POST['username'];//获取的用户名
    $password=sha1($_POST['password']);//获取的密码,加密和加密后数据进行匹配
    $result=$conn->query("SELECT * FROM reg WHERE username='$username' and password='$password'");
    //如果$result存在，说明数据库存在这条注册的信息。用户输入的用户名和密码是正确的。
    if($result->fetch_assoc()){
        echo "true";
    }else{
        echo "false";
    }

}