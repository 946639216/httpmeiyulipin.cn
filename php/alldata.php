<?php
include "./conn.php";
$result=$conn->query("select * from shoplist");
//获取所有数据
$num=$result->num_rows;
$arr=array();
for($i=0;$i<$num;$i++){
    $arr[$i]=$result->fetch_assoc();
}

echo json_encode($arr);