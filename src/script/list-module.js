import {} from "https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js";
import {} from "./jquery.lazyload.js";
import {} from "./index-module.js";
import {} from "./jquery.pagination.js";
const $list = $('.list ul');
let $page = null;
let $array_default = []; //定义一个初始排序数组
let $array = []; //定义排序后的数组
let $prev = 0;
let $next = 0;
$.ajax({
    url: "http://10.31.165.44/httpmeiyulipin.cn/php/list.php",
    // url: "http://192.168.1.107/httpmeiyulipin.cn/php/list.php",
    dataType: "json",
}).done(function(data) {
    $page = data.pagesize;
    let $strhtml = '';
    $.each(data.pagecontent, function(index, value) {
        $strhtml += `
            <li>
                <a href="detail.html?sid=${value.sid}">
                    <img class='lazy' data-original="${value.picurl}" alt="">
                    <p>${value.title}</p>
                </a>
                <span class="price">￥${value.price}</span>
                <a href=""><span class="join">加入购物车</span></a>
                <a href="" class="joinppt">加入PPT</a>
            </li>
        `;
    });
    $list.html($strhtml);
    $array = [];
    $array_default = [];
    $('.list ul li').each(function(index, element) {
        // element == this
        $array[index] = $(this);
        $array_default[index] = $(this);
        // console.log($array);

    });
    $("img.lazy").lazyload({ effect: "fadeIn" });

    $('.page').pagination({
        pageCount: $page,
        jump: true,
        prevContent: '上一页',
        nextContent: '下一页',
        callback: function(api) {
            $.ajax({
                url: "http://10.31.165.44/httpmeiyulipin.cn/php/list.php",
                // url: "http://192.168.1.107/httpmeiyulipin.cn/php/list.php",
                data: {
                    page: api.getCurrent() //将page的值传给后端
                },
                dataType: "json",
            }).done(function(data) {
                $page = data.pagesize;
                let $strhtml = '';
                $.each(data.pagecontent, function(index, value) {
                    // <a href="detail.html?sid=${value.sid}">,跳到商品详情页,将当前传给后端
                    $strhtml += `
                        <li>
                            <a href="detail.html?sid=${value.sid}">
                                <img class='lazy' data-original="${value.picurl}" alt="">
                                <p>${value.title}</p>
                            </a>
                            <span class="price">￥${value.price}</span>
                            <a href=""><span class="join">加入购物车</span></a>
                            <a href="" class="joinppt">加入PPT</a>
                        </li>
                    `;
                });
                $list.html($strhtml); //追加
                //分页也要重排
                $array = []; //排序后的数组
                $array_default = []; //排序前的数组

                $('.list li').each(function(index, element) {
                    $array[index] = $(this);
                    $array_default[index] = $(this); //保留初始状态
                });
                //添加懒加载
                $('img.lazy').lazyload({
                    effect: "fadeIn" //切换形式
                });
            });
        }
    })
});

$('.moren').on('click', function() {
    $('.sort').css("border-top", "10px solid #666");
    $('.moren').css("border-bottom", "10px solid #000");
    $.each($array_default, function(index, value) {
        $list.append(value);
    });
    return;
});
$('.sort').on('click', function() {
    $('.sort').css("border-top", "10px solid #000");
    $('.moren').css("border-bottom", "10px solid #666");
    for (let i = 0; i < $array.length - 1; i++) {
        for (let j = 0; j < $array.length - i - 1; j++) {
            $prev = parseFloat($array[j].find('.price').html().substring(1));
            $next = parseFloat($array[j + 1].find('span.price').html().substring(1));
            // console.log($array.length);
            // console.log($prev, $next);
            if ($prev > $next) {
                let temp = $array[j];
                $array[j] = $array[j + 1];
                $array[j + 1] = temp;
            }
        }
        // console.log($prev, $next);
    }
    $.each($array, function(index, value) {
        $list.append(value);
    });

});