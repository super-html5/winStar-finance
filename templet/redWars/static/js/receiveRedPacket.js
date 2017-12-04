$(document).ready(function () {

    var accountId = getUrlParams("accountId");
    var orderId = getUrlParams("orderId");
    var recordId = getUrlParams("recordId");

    //请求接口加载页面图片
    $.ajax({
        type: "GET",
        url: "https://mobile.sxwinstar.net/wechat_access/api/v1/items/secKill/noauth/checkReceiveIsValid",
        data: {
            accountId: accountId,
            orderId: orderId
        },
        dataType: "JSON",
        success: function (res) {
            console.log(res);
            drawHtml();
            if(!res.received){
                $("#phoneNumber #receive").attr({"disabled":"disabled"}).css({"background":"#EBEBE4","color":"#757575"});
                $("#phoneNumber #phone").attr({"disabled":"disabled"});
            }
            judgeMoney(res.panAmt);
            $("#hidden").val(res.received);

        },
        error: function (res) {
            console.log("当前服务器繁忙，请稍后再试！");
        }
    });

    //画HTML的页面
    function drawHtml() {
        $("body").html("<div id='imgBox'>" +
            "    <!--<img src='img/5000.gif' alt=''>-->" +
            "</div>" +
            "<div id='phoneNumber'>" +
            "    <input hidden id='hidden' type='text'>" +
            "    <input type='text' id='phone' class='ac' value='' placeholder='输入手机号接受邀请'/>" +
            "    <button id='receive' class='bg-blue white ac receive'>立即领取</button>" +
            "    <div id='notice' class='ac'>" +
            "        <a href='javascript:;' id='noticeA'>领取须知</a>" +
            "        <ul>" +
            "            <li>1、输入手机号，立即领取好友赠送的油券；</li>\n" +
            "            <li>2、下载优驾行easy APP，使用手机号注册登陆（需与领券的手机号一致）—进入个人中心—点击我的加油券—点立即使用开始使用油券；</li>" +
            "            <li>3、领取的油券会拆分成等值面额数张，每张仅限一次性使用，不兑现，不与其他优惠同时享用；</li>" +
            "            <li>4、如在使用中遇到任何问题，可致电400-801-2122，优驾行保留本次活动的最终解释权。</li>" +
            "        </ul>" +
            "    </div>" +
            "</div>");
    }

    //判断价格显示图片
    function judgeMoney(panAmt) {
        if (panAmt == 0) {
            $("#imgBox").html("<img src='img/success.gif' alt=''/>");
        } else {
            for (var i = 100; i <= 5000; i += 100) {
                if (i == panAmt) {
                    $("#imgBox").html("<img src='img/" + i + ".gif' alt=''/>");
                    return;
                }
            }
        }

    }


    //点击立即领取按钮
    $("body").on("click", "#receive", function () {


        var phone = $("#phoneNumber #phone").val();
        if (phone.length == 0) {
            alert("请输入手机号码！");
            return false;
        } else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone))) {
            alert("请输入正确的手机号码！");
            return false;
        } else {
            var received = $("#phoneNumber #hidden").val();
            console.log(received == "true");
            received == "true" ? canReceive(phone) : alert("该红包已被领取！");
        }

    });


    //可以领取红包
    function canReceive(phone) {
        //请求接口跳转领取成功页面
        $.ajax({
            type: "post",
            headers: {'Content-Type': 'application/json'},
            url: "https://mobile.sxwinstar.net/wechat_access/api/v1/items/secKill/noauth/receive",
            data: JSON.stringify({
                accountId: accountId,
                orderId: orderId,
                phone: phone,
                recordId: recordId
            }),
            beforeSend:function () {
                $("#phoneNumber #receive").attr({"disabled":"disabled"}).css({"background":"#EBEBE4","color":"#757575"});
            },
            success: function (res) {
                location.href = "success.html";
            },
            error: function (res) {
                alert("当前服务器繁忙，请稍后再试！");
            },
            complete:function () {
                $("#phoneNumber #receive").removeAttr("disabled").css({"background":"#3ca8d9","color":"#fff"});
            }
        });

    }

});