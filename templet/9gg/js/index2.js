/**
 * Created by m on 2017/9/13.
 */
var lottery = {
    index: -1,    //当前转动到哪个位置，起点位置
    count: 0,     //总共有多少个位置
    timer: 0,     //setTimeout的ID，用clearTimeout清除
    speed: 20,    //初始转动速度
    times: 0,     //转动次数
    cycle: 50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,    //中奖位置
    init: function (id) {
        if ($('#' + id).find('.lottery-unit').length > 0) {
            $lottery = $('#' + id);
            $units = $lottery.find('.lottery-unit');
            this.obj = $lottery;
            this.count = $units.length;
            $lottery.find('.lottery-unit.lottery-unit-' + this.index).addClass('active');
        }
    },
    roll: function () {
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find('.lottery-unit.lottery-unit-' + index).removeClass('active');
        index += 1;
        if (index > count - 1) {
            index = 0;
        }
        $(lottery).find('.lottery-unit.lottery-unit-' + index).addClass('active');
        this.index = index;
        return false;
    },
    stop: function (index) {
        this.prize = index;
        return false;
    }
};

//js获取url参数
function getUrlParams(name, url) {
    if (!url) url = window.location.href;
    var params = {};
    var url = decodeURI(url);
    var idx = url.indexOf("?");
    if (idx > 0) {
        var queryStr = url.substring(idx + 1);
        var args = queryStr.split("&");
        for (var i = 0, a, nv; a = args[i]; i++) {
            nv = args[i] = a.split("=");
            params[nv[0]] = nv.length > 1 ? nv[1] : true;
        }
    }
    return params[name];
}

/** 显示加载流动条HTML5版
 *
 * @param {int} show     为1表示显示 为0表示隐藏
 * @returns {undefined}
 *
 */
function showloaddinghtml5(show, strs) {
    if (show == 0) {
        $("#mess_loaddinghtml5").remove();
    } else {
        if (strs == "" || strs == undefined) strs = "";
        if (!$("#mess_loaddinghtml5").attr("id")) { //不存在创建
            $("body").append('<div id="mess_loaddinghtml5"><div class="loadding"><div class="loaddingtishi">' + strs + '</div><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div></div></div>'); //写入内容
        }
        $("#mess_loaddinghtml5").css("display", '');
    }
}


function getTokenId(tokenId) {
    $('#token_id').val(tokenId);
    localStorage.setItem('_token_id', tokenId);
    _init(tokenId);
}


_getTokenId();
var telPhone = getUrlParams("phoneNumber");

// _init('152185cdd0c847ca81da7a2ceb065710');
// var telPhone = '15319781855';
// localStorage.setItem('_token_id', '152185cdd0c847ca81da7a2ceb065710');


var click = false;
var result = 2;
var imgSrc = '';
var title = '';
var text = '';
var butText = '确定';
var isGo = '';


window.onload = function () {
    lottery.init('lottery');
    $('#draw-btn').click(function () {
        if (click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            return false;
        } else {

            if ($('#ntime').val() <= $('#btime').val()) {
                return
            }

            if ($('#drawNumber').text().trim() == 0) {
                swal({
                    title: '没有抽奖次数啦<br>快去参加活动吧！',
                    text: '',
                    imageUrl: 'img/alert/nocs.png',
                    padding: 0,
                    confirmButtonColor: '#e01524',
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btnLong',
                    imageClass: 'imageLong'
                }).then(function () {

                    }, function () {

                    }
                );
                return;
            }
            cj();
            //jcj();
            click = true; //一次抽奖完成后，设置click为true，可继续抽奖
            return false;
        }
    });
};


function jcj() {
    if (result === 4) {
        lottery.prize = 2;
        imgSrc = 'img/alert/4.png';
        title = '没中哦';
        butText = '确定';
        isGo = ''
    } else if (result === 1) {
        lottery.prize = 0;
        imgSrc = 'img/alert/1.png';
        title = '恭喜您抽到<br>30元加油代金券';
        text = '请至我的优惠券中查看奖品';
        butText = '确定';
        isGo = ''
    } else if (result === 2) {
        lottery.prize = 1;
        imgSrc = 'img/alert/2.png';
        title = '恭喜您抽到<br>5元加油代金券';
        text = '请至我的优惠券中查看奖品';
        butText = '确定';
        isGo = ''

    } else if (result === 3) {
        lottery.prize = 7;
        imgSrc = 'img/alert/3.png';
        title = '恭喜您抽到<br>1元加油代金券';
        text = '请至我的优惠券中查看奖品';
        butText = '确定';
        isGo = ''
    }
    lottery.speed = 100;
    roll(); //转圈过程不响应click事件，会将click置为false
}


function _init(token_id) {
    showloaddinghtml5(1);
    $.ajax({
        //提交数据的类型 POST GET
        type: "GET",
        //提交的网址
        url: '/wechat_access/api/v1/nationalActivity/init',
        //url: 'http://192.168.118.28:4000/api/v1/nationalActivity/init',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token_id": $('#token_id').val(),
            "accountId": "134cacde-df3a-4bcc-9a46-bf6eca84a5b6"
        },
        //返回数据的格式
        dataType: "json",
        //成功返回之后调用的函数
        success: function (data) {
            showloaddinghtml5(0);
            console.log(data);

            $('#ntime').val(data.nowTime);
            $('#btime').val(data.beginTime);
            $('#drawNumber').text(data.drawNumber);
            $('#integrals').text(data.integrals);
            $('#seniorityNumber').text(data.seniorityNumber);
            var str = '<img id="bt" class="img-responsive" src="img/btok.png"/>';
            var nostr = '<img class="img-responsive" src="img/btno.png"/>';
            var qdstr = '<img id="_qd" class="img-responsive" src="./img/qd.png"/>';
            var qdystr = '<img class="img-responsive" src="./img/yqd.png"/>';

            if (data.nowTime >= data.beginTime) {
                if (data.isSign == 0) {
                    $('#qd').html(qdstr);
                    $('#_qd').click(function () {
                        qdd();
                    });
                } else {
                    $('#qd').html(qdystr);
                }

                if (data.nowTime >= data.drawTime) {
                    $('#bt_con').html(str);
                    $('#bt').click(function () {
                        f50();
                    });
                } else {
                    $('#bt_con').html(nostr);
                }
            } else {
                swal(
                    '',
                    '活动尚未开始',
                    'info'
                )
            }

            if (data.nowTime >= data.endTime) {
                if (data.nowTime >= data.drawTime) {
                    $('#bt_con').html(str);
                    $('#bt').click(function () {
                        f50();
                    });
                } else {
                    $('#bt_con').html(nostr);
                }
                swal(
                    '',
                    '活动已经结束，赶快平分油吧',
                    'info'
                );
            }
        },
        //调用出错执行的函数
        error: function (data) {
            showloaddinghtml5(0);
            swal(
                '',
                '当前访问人数过多，请稍后再试',
                'error'
            )
        }
    });
}

function f50() {
    if ($('#integrals').text().trim() >= 150) {

        $.ajax({
            //提交数据的类型 POST GET
            type: "POST",
            //提交的网址
            url: '/wechat_access/api/v1/nationalActivity/coupon/deuce',
            //url: 'http://192.168.118.28:4000/api/v1/nationalActivity/coupon/deuce',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "token_id": $('#token_id').val(),
                "accountId": "134cacde-df3a-4bcc-9a46-bf6eca84a5b6"
            },
            data: JSON.stringify({'telPhone': telPhone}),
            //返回数据的格式
            dataType: "json",
            //成功返回之后调用的函数
            success: function (data) {
                console.log(data);
                swal({
                    title: '您与' + $('#seniorityNumber').text().trim() + '位车主<br>平分了10吨油',
                    text: '升级到最新版本才能看到哦',
                    imageUrl: 'img/alert/pfy.png',
                    padding: 0,
                    confirmButtonColor: '#e01524',
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btnLong',
                    imageClass: 'imageLong'
                }).then(function () {

                    }, function () {

                    }
                );
            },
            //调用出错执行的函数
            error: function (data) {
                if ('deuce.used.NotRule' === data.responseJSON.code) {
                    swal({
                        title: '您已平分过油了',
                        text: '',
                        imageUrl: 'img/alert/pfy.png',
                        padding: 0,
                        confirmButtonColor: '#e01524',
                        confirmButtonText: '确定',
                        confirmButtonClass: 'btnLong',
                        imageClass: 'imageLong'
                    }).then(function () {

                        }, function () {

                        }
                    );
                    return;
                }
                swal(
                    '',
                    '当前访问人数过多，请稍后再试',
                    'error'
                )
            }
        });


    } else {
        swal({
            title: '您的积分不够哦',
            text: '',
            imageUrl: 'img/alert/fbg.png',
            padding: 0,
            confirmButtonColor: '#e01524',
            confirmButtonText: '确定',
            confirmButtonClass: 'btnLong',
            imageClass: 'imageLong'
        }).then(function () {

            }, function () {

            }
        );
    }
}

function qdd() {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: '/wechat_access/api/v1/nationalActivity/win/integral',
        //url: 'http://192.168.118.28:4000/api/v1/nationalActivity/win/integral',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token_id": $('#token_id').val(),
            "accountId": "134cacde-df3a-4bcc-9a46-bf6eca84a5b6"
        },
        data: JSON.stringify({'type': '1'}),
        //返回数据的格式
        dataType: "json",
        //成功返回之后调用的函数
        success: function (data) {
            if (data.result == "FAIL") {

            } else {
                swal({
                    title: '',
                    text: '',
                    imageUrl: 'img/alert/qdcg.png',
                    padding: 0,
                    confirmButtonColor: '#e01524',
                    confirmButtonText: '确定',
                    confirmButtonClass: 'btnLong',
                    imageClass: 'imageLong'
                }).then(function () {
                        _init();
                    }, function () {
                        _init();
                    }
                );
            }
        },
        //调用出错执行的函数
        error: function (data) {
            console.log(data);
            swal(
                '',
                '当前访问人数过多，请稍后再试',
                'error'
            )
        }
    });
}


function cj() {
    if ($('#ntime').val() <= $('#btime').val()) {
        return
    }
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: '/wechat_access/api/v1/nationalActivity/draw',
        //url: 'http://192.168.118.28:4000/api/v1/nationalActivity/draw',
        data: JSON.stringify({'telPhone': telPhone}),
        //返回数据的格式
        dataType: "json",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token_id": $('#token_id').val()
        },

        beforeSend: function () {
            showloaddinghtml5(1);
        },
        //成功返回之后调用的函数
        success: function (data) {
            showloaddinghtml5(0);
            console.log(data);
            if (data.result === 1) {
                lottery.prize = 0;
                imgSrc = 'img/alert/1.png';
                title = '恭喜您抽到<br>30元加油代金券';
                text = '请至我的优惠券中查看奖品<br>升级到最新版本才能看到哦';
                butText = '确定';
                isGo = ''
            } else if (data.result === 2) {
                lottery.prize = 1;
                imgSrc = 'img/alert/2.png';
                title = '恭喜您抽到<br>5元加油代金券';
                text = '请至我的优惠券中查看奖品<br>升级到最新版本才能看到哦';
                butText = '确定';
                isGo = ''
            } else if (data.result === 3) {
                lottery.prize = 7;
                imgSrc = 'img/alert/3.png';
                title = '恭喜您抽到<br>1元加油代金券';
                text = '请至我的优惠券中查看奖品<br>升级到最新版本才能看到哦';
                butText = '确定';
                isGo = ''
            } else if (data.result === 4) {
                lottery.prize = 2;
                imgSrc = 'img/alert/4.png';
                title = '没中哦';
                butText = '确定';
                isGo = ''
            }
            lottery.speed = 100;
            roll(); //转圈过程不响应click事件，会将click置为false
        },
        //调用出错执行的函数
        error: function (data) {
            showloaddinghtml5(0);
            swal(
                '',
                '当前访问人数过多，请稍后再试',
                'error'
            );
            click = false; //一次抽奖完成后，设置click为true，可继续抽奖
        }
    });
}

//_alert();
function _alert(title, text, imgSrc, butText, isGo) {
    swal({
        title: title,
        html: text,
        imageUrl: imgSrc,
        padding: 0,
        confirmButtonColor: '#e01524',
        confirmButtonText: butText,
        confirmButtonClass: 'btnLong',
        imageClass: 'imageLong'
    }).then(function () {
            _init($('#token_id').val());
        }, function () {
            _init($('#token_id').val());
        }
    );
}

function roll() {
    lottery.times += 1;
    lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化

    if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
        clearTimeout(lottery.timer);
        lottery.prize = -1;
        lottery.times = 0;
        click = false;
        setTimeout(function () {
            _alert(title, text, imgSrc, butText, isGo);
        }, 500);
    } else {
        if (lottery.times < lottery.cycle) {
            lottery.speed -= 10;
        } else if (lottery.times == lottery.cycle) {
            // var index = Math.random() * (lottery.count) | 0; //静态演示，随机产生一个奖品序号，实际需请求接口产生
            // lottery.prize = index;
        } else {
            if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                lottery.speed += 110;
            } else {
                lottery.speed += 20;
            }
        }
        if (lottery.speed < 40) {
            lottery.speed = 40;
        }
        lottery.timer = setTimeout(roll, lottery.speed); //循环调用
    }
    return false;
}


/**
 * 和APP端交互获取token_id
 * @returns {[*,*]} tempFlag == 0 为IOS设备 tempFlag == 1 为android设备
 * @private
 */
function _getTokenId() {
    var tokenIdTemp = null;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        window.webkit.messageHandlers.getMobleTokinIdFunc.postMessage("getTokenId");
    } else if (isAndroid) {
        tokenIdTemp = androidBaseInterface.getToken();
        $('#token_id').val(tokenIdTemp);
        localStorage.setItem('_token_id', tokenIdTemp);
        _init(tokenIdTemp);
    }
}


$('#fx').click(function () {
    if ($('#ntime').val() <= $('#btime').val()) {
        return
    }
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        var xo = {
            'title': '上“优驾行easy ”APP，平分10吨油！',
            'dsc': '补贴你的十一出行计划！',
            'url': 'https://mobile.sxwinstar.net/appShare/share10yhd'
        };
        window.webkit.messageHandlers.iOSShare.postMessage(JSON.stringify(xo));
    } else if (isAndroid) {
        androidBaseInterface.doShare(
            '上“优驾行easy ”APP，平分10吨油！',
            '补贴你的十一出行计划！',
            'https://mobile.sxwinstar.net/appShare/share10yhd')
    }
});

function toShareBack() {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: '/wechat_access/api/v1/nationalActivity/win/integral',
        //url: 'http://192.168.118.28:4000/api/v1/nationalActivity/win/integral',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token_id": $('#token_id').val(),
            "accountId": "134cacde-df3a-4bcc-9a46-bf6eca84a5b6"
        },
        data: JSON.stringify({'type': '4'}),
        //返回数据的格式
        dataType: "json",
        //成功返回之后调用的函数
        success: function (data) {
            _init();
        },
        //调用出错执行的函数
        error: function (data) {
            _init();
        }
    });
}