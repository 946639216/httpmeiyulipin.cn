import {} from 'https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js';
import {} from "./jquery.lazyload.js";
// 登录，退出
const $login = $('#login'); //登录前显示
const $admin = $('#admin'); //登录成功后显示的
const $btn = $('#admin .quit'); //退出
if (localStorage.getItem('loginname')) {
    $admin.show(); //显示登录成功的内容
    $login.hide();
    $('#admin span').html(window.localStorage.getItem('loginname'));
}
//点击退出按钮，让本地存储清空。
$btn.on('click', function() {
    $admin.hide(); //显示退出的内容
    $login.show();
    window.localStorage.removeItem('loginname'); //删除本地存储
})

// 选项卡
// const $tab = $('.tab');
const $taba = $('.tab a');
const $span = $('.tab  span');
const $alldiv = $('.tab .alldiv')
const $item = $('.item');

//2.对应的菜单添加鼠标移入移出的事件。
$taba.hover(function() {
    //当前的li添加样式以及cartlist显示
    $(this).addClass('active').siblings('.tab a').removeClass('active');
    $alldiv.show();
    //内容的切换
    $item.eq($(this).index()).show().siblings('.item').hide();
    $span.eq($(this).index()).show();

}, function() {
    $alldiv.hide();
    $span.eq($(this).index()).hide();
});
$alldiv.hover(function() {
    $alldiv.show();
}, function() {
    $alldiv.hide();
});

// 轮播图
const $banner = $('.lubo');
const $piclist = $('.lubo ul li');
const $btnlist = $('.lubo ol li');
const $leftarrow = $('#leftarrow'); //左右箭头
const $rightarrow = $('#rightarrow');

let $index = 0; //存放索引的变量。
let $timer = null;

//2.鼠标移入小圆圈，进行图片切换 - onmouseover
$btnlist.on('mouseover', function() {
    $index = $(this).index(); //当前的索引
    tabswitch();
});

//3.点击左右箭头
$rightarrow.on('click', function() {
    $index++;
    if ($index > $btnlist.length - 1) {
        $index = 0;
    }
    tabswitch();
});


$leftarrow.on('click', function() {
    $index--;
    if ($index < 0) {
        $index = $btnlist.length - 1;
    }
    tabswitch();
    $('title').html($index);
});

function tabswitch() {
    $btnlist.eq($index).addClass('active').siblings('ol li').removeClass('active'); //当前的按钮添加类，其他的按钮删除类。
    $piclist.eq($index).stop(true).animate({ //当前的图片显示，其他的图片隐藏  eq支持负数，负数从-1开始从后往前数。
        opacity: 1
    }).siblings('ul li').stop(true).animate({
        opacity: 0
    });
}

//4.自动轮播
//约定的时间自动点击右键头事件。
$timer = setInterval(function() {
    $rightarrow.click();
}, 3000);

//5.鼠标移入bannner停止自动轮播，移出开启自动轮播
$banner.hover(function() {
    clearInterval($timer);
}, function() {
    $timer = setInterval(function() {
        $rightarrow.click();
    }, 3000);
});

const $list = $('.zcx');
// console.log($list);
$.ajax({
    url: "http://10.31.165.44/httpmeiyulipin.cn/php/index.php",
    // url: "http://192.168.1.107/httpmeiyulipin.cn/php/list.php",
    dataType: "json",
}).done(function(data) {
    console.log(data);
    // $page = data.pagesize;
    let $strhtml = '';
    $.each(data.pagecontent, function(index, value) {
        $strhtml += `
        <li>
            <i><a href="">加入PPT</a></i>
            <a href="detail.html?sid=${value.sid}">
                <img class='lazy' data-original="${value.picurl}" alt="">
                <em class="price">￥${value.price}</em>
                <strong>${value.title}</strong>
            </a>
        </li>
        `;
    });
    $list.html($strhtml);
    $("img.lazy").lazyload({ effect: "fadeIn" });
});

// 楼梯效果
let $louti = $('.lift-nav'); //整个楼梯
let $louceng = $('.jgti'); //楼层
let $loutinav = $('.lift li'); //楼梯
function scroll() {
    let $top = $(window).scrollTop();
    if ($top >= 3000) {
        $louti.show();
    } else {
        $louti.hide();
    }
    //4.通过滚动条的改变，给对应的楼梯添加激活状态
    //核心：滚动条的top和楼层的top值(如果楼层的top值>滚动条的top值，给楼层对应的楼梯添加一个激活状态)
    //获取楼层的top值。
    $louceng.each(function(index, element) {
        let $loucengtop = $(element).offset().top + 400; //每一个楼层的top值。
        if ($loucengtop >= $top) {
            $loutinav.removeClass('current'); //清除所有的楼梯上面的current。
            $loutinav.eq(index).addClass('current'); //当前对应的楼梯显示
            return false; //保证都是满足条件的第一个添加active.
        }
    });

    // $('title').html($top);
}
scroll();

$(window).on('scroll', function() {
    scroll();
});

//2.点击楼梯切换到对应的楼层(运动)
//任意的获取每一个楼层的top值。
//点击楼梯，将楼梯对应的楼层的top值给滚动条的top值。
$loutinav.on('click', function() {
    $(window).off('scroll'); //取消滚轮事件。
    $(this).addClass('current').siblings('li').removeClass('current');
    let $top = $louceng.eq($(this).index()).offset().top;
    //赋值给滚动条
    $('html').animate({
        scrollTop: $top
    }, function() { //点击运动结束，开启滚轮事件
        $(window).on('scroll', function() {
            scroll();
        });
    });
});

//3.回到顶部
$('.hp').on('click', function() {
    //赋值给滚动条
    $('html').animate({
        scrollTop: 0
    });
});