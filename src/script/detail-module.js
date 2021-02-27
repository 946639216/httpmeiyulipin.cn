import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';
import {} from './index-module.js';
let $sid = location.search.substring(1).split('=')[1];

if (!$sid) {
    $sid = 1;
}

const $spic = $('#spic'); //小图
const $smallpic = $('#spic img'); //小图里面的图片
const $bpic = $('#bpic'); //大图
const $loadtitle = $('.loadtitle'); //标题
const $loadpcp = $('.loadpcp'); //价格
const $list = $('#list ul'); //存放小图
const $sf = $('#sf');
const $bf = $('#bf');
const $cm = $('.cm');
let $liwidth = 0; //li的宽度
let $lilenth = 0; //所有li的个数

$.ajax({
    url: 'http://10.31.165.44/httpmeiyulipin.cn/php/getsid.php',
    // url: 'http://192.168.1.107/httpmeiyulipin.cn/php/getsid.php',
    data: {
        datasid: $sid
    },
    dataType: 'json'
}).done(function(data) {
    // console.log(data);
    $smallpic.attr('src', data.picurl);
    $loadtitle.html(data.title);
    $loadpcp.html(data.price);
    let $picarr = data.piclisturl.split(','); //数组
    let $strHtml = '';
    $.each($picarr, function(index, value) {
        $strHtml += `
            <li>
                <img src="${value}">
            </li>
        `;
        $list.html($strHtml);
    });
    $lilenth = $('#list ul li').length;
    // if($lilenth<6){
    //     $('#right').css('color',)
    // }
    $liwidth = $('#list ul li').eq(0).outerWidth(true);
});
$spic.hover(function() {
    $sf.css('visibility', 'visible');
    $bf.css('visibility', 'visible');
    //3.2.计算小放的尺寸和比例
    $sf.width($spic.outerWidth() * $bf.outerWidth() / $bpic.outerWidth());
    $sf.height($spic.outerHeight() * $bf.outerHeight() / $bpic.outerHeight());
    let $bili = $bpic.outerWidth() / $spic.outerWidth(); //比例
    //3.3.鼠标在小图里面移动，小放跟随鼠标
    $spic.on('mousemove', function(ev) {
        let $leftvalue = ev.pageX - $cm.offset().left - $sf.outerWidth() / 2;
        let $topvalue = ev.pageY - $cm.offset().top - $sf.outerHeight() / 2;
        if ($leftvalue < 0) {
            $leftvalue = 0;
        } else if ($leftvalue >= $spic.outerWidth() - $sf.outerWidth()) {
            $leftvalue = $spic.outerWidth() - $sf.outerWidth();
        }

        if ($topvalue < 0) {
            $topvalue = 0;
        } else if ($topvalue >= $spic.outerHeight() - $sf.outerHeight()) {
            $topvalue = $spic.outerHeight() - $sf.outerHeight();
        }

        $sf.css({
            left: $leftvalue,
            top: $topvalue
        });

        $bpic.css({
            left: -$bili * $leftvalue,
            top: -$bili * $topvalue
        });
    });
}, function() {
    $sf.css('visibility', 'hidden');
    $bf.css('visibility', 'hidden');
});

//3.4.经过小图，切换大图。
//无法获取渲染的元素，渲染的过程是异步的ajax，只能采用事件委托。
const $listul = $('#list ul');
$listul.on('mouseover', 'li', function() { //注意委托的元素就是内部的元素，设置的时候可以忽略
    // console.log($(this)); //委托的元素
    //获取委托元素li里面的img下面的src的路径。
    let $url = $(this).find('img').attr('src');
    // console.log($(this));//$(this)指向li
    $(this).css('border', '2px solid #666')
        //对应的赋值
    $smallpic.attr('src', $url);
    $bpic.attr('src', $url);
});
$listul.on('mouseout', 'li', function() {
    $(this).css('border', '2px solid transparent');
});
//3.5.通过小图两侧的按钮，切换小图。
//每点击一次箭头，图片移动一张。
// let $num = 6; //这里的6是固有的值。表示显示的张数。
// $('#right').on('click', function() {
//     if ($lilenth > $num) {
//         $num++;
//         $('#left').css('color', '#333');
//         if ($num === $lilenth) { //右箭头无法点击
//             $('#right').css('color', '#fff');
//         }
//     }
//     $listul.animate({
//         left: -$liwidth * ($num - 6)
//     });
// });
// $('#left').on('click', function() {
//     if ($num > 6) {
//         $num--;
//         $('#right').css('color', '#333');
//         if ($num === 6) {
//             $('#left').css('color', '#fff');
//         }
//     }
//     $listul.animate({
//         left: -$liwidth * ($num - 6)
//     });
// });

let $arrsid = []; //存储的商品编号,以及获取本地存储的商品编号
let $arrnum = []; //存储商品的数量,以及获取本地存储的商品数量
// 提前获取本地存储的商品编号和key值
// 封装函数，获取本地存储
function getLocalStorage() {
    // 判断商品是否存储过
    if (localStorage.getItem('localsid') && localStorage.getItem('localnum')) { //商品存储过
        $arrsid = localStorage.getItem('localsid').split(','); //将获取的编号转换成数组，方便后面判断是否存在当前编号。
        $arrnum = localStorage.getItem('localnum').split(',');
    } else { //没存储过的或者被清空了
        $arrsid = [];
        $arrnum = [];
    }
}

// 开始存储商品的编号和数量
const $btn = $('.p-btn .jr'); //存储商品的按钮
const $count = $('.num #count'); //存储商品的数量
const $jian = $('.num #jian'); //减按钮
const $jia = $('.num #jia'); //加按钮
$btn.on('click', function() {
    // 判断是第一次存储，还是多次存储
    getLocalStorage()
    if ($arrsid.includes($sid)) {
        //存在,不是第一次添加，改变数量
        let $index = $arrsid.indexOf($sid);
        //sid在数组中的位置，sid的位置和数量是匹配的
        // console.log($count.val());
        // console.log($num);
        $arrnum[$index] = parseInt($arrnum[$index]) + parseInt($count.val()); //重新赋值
        localStorage.setItem('localnum', $arrnum); //重新添加到本地存储，覆盖前面的值
    } else {
        $arrsid.push($sid); //将sid添加到存储sid数组中
        localStorage.setItem('localsid', $arrsid);
        $arrnum.push($count.val());
        localStorage.setItem('localnum', $arrnum);
    }
});
$count.on('input', function() {
    let $reg = /^\d+$/; //行首行尾匹配一个或者多个数字
    if (!$reg.test($(this).val())) { //如果不满足条件，值为1
        // alert('输入错误');
        $count.val("");
    }
});
$jian.on('click', function() {
    let $num = $count.val();
    $num--;
    if ($num <= 1) {
        $num = 1
    }
    $count.val($num);
    if ($arrsid.includes($sid)) {
        //存在,不是第一次添加，改变数量
        let $index = $arrsid.indexOf($sid);
        //sid在数组中的位置，sid的位置和数量是匹配的
        // console.log($count.val());
        // console.log($num);
        $arrnum[$index] = $num; //重新赋值
        localStorage.setItem('localnum', $arrnum); //重新添加到本地存储，覆盖前面的值
    } else {
        $arrsid.push($sid); //将sid添加到存储sid数组中
        localStorage.setItem('localsid', $arrsid);
        $arrnum.push($count.val());
        localStorage.setItem('localnum', $arrnum);
    }
});
$jia.on('click', function() {
    let $num = $count.val();
    $num++;
    $count.val($num);
    if ($arrsid.includes($sid)) {
        //存在,不是第一次添加，改变数量
        let $index = $arrsid.indexOf($sid);
        //sid在数组中的位置，sid的位置和数量是匹配的
        // console.log($count.val());
        // console.log($num);
        $arrnum[$index] = $num //重新赋值
        localStorage.setItem('localnum', $arrnum); //重新添加到本地存储，覆盖前面的值
    } else {
        $arrsid.push($sid); //将sid添加到存储sid数组中
        localStorage.setItem('localsid', $arrsid);
        $arrnum.push($count.val());
        localStorage.setItem('localnum', $arrnum);
    }
});