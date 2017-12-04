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

var click = false;
var result = 2;
var title = '';
var text = '';
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
_init();
window.onload = function () {
    lottery.init('lottery');
    $('#draw-btn').click(function () {
        if (click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            return false;
        } else {
            _alert();
        }
    });
};


function jcj() {
    _init();
    lottery.speed = 100;
    roll(); //转圈过程不响应click事件，会将click置为false
}

function _alert() {
    if (_errorMsg() === false) {
        return;
    }
    var _i = localStorage.getItem('_i');
    if (_i == null || _i == undefined || _i == "null" || _i == "") {
        swal({
            title: '请输入手机号码开始抽奖',
            input: 'tel',
            inputPlaceholder: '请输入手机号码',
            background: '#002b42',
            confirmButtonText: '开始抽奖',
            showLoaderOnConfirm: true,
            inputAttributes: {'maxlength': '11', 'autofocus': 'autofocus'},
            preConfirm: function (value) {
                return new Promise(function (resolve, reject) {
                    if (value && value.length === 11 && value.substring(0, 1) === "1") {
                        localStorage.setItem('_i', value);
                        checkPhone(value, resolve);
                    } else {
                        reject('请输入正确的手机号码')
                    }
                })
            }
        }).then(function () {
            jcj();
            $('#draw-btn').find('img').attr('src', 'img/9/img5-1.png');
            click = true; //一次抽奖完成后，设置click为true，可继续抽奖
            return false;
        }, function () {

        });
    } else {
        _cj(_i, localStorage.getItem('_accountId'))
    }
}


function _endAlert(num) {
    var _num = 0;
    if (num === 0) {
        _num = 30
    } else if (num === 1) {
        _num = 5
    } else if (num === 5) {
        _num = 3
    } else if (num === 7) {
        _num = 1
    }
    swal({
        title: '恭喜您抽中' + _num + '元加油代金券<br>赶紧下载 优easy 使用吧',
        background: '#002b42',
        confirmButtonColor: 'transparent',
        confirmButtonText: '朕知道了'
    }).then(function () {
        location.href = "index8.html";
    }, function () {

    })
}

function _noStart() {
    swal({
        title: '活动尚未开始',
        background: '#002b42',
        confirmButtonColor: 'transparent'
    })
}

function _endStart() {
    swal({
        title: '活动已经结束',
        background: '#002b42',
        confirmButtonColor: 'transparent'
    })
}

function roll() {
    lottery.times += 1;
    lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化

    if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
        clearTimeout(lottery.timer);
        lottery.prize = -1;
        lottery.times = 0;
        click = false;
        $('#draw-btn').find('img').attr('src', 'img/9/img5.png');
        setTimeout(function () {
            _endAlert(lottery.index);
        }, 500);
    } else {
        if (lottery.times < lottery.cycle) {
            lottery.speed -= 10;
        } else if (lottery.times == lottery.cycle) {
            // var index = Math.random() * (lottery.count) | 0;
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


function _init() {

    $.ajax({
        //提交数据的类型 POST GET
        type: "GET",
        //提交的网址
        url: '/wechat_access/api/v1/nationalActivity/init',
        //url: '/wechatApi-ng4/api/v1/nationalActivity/init',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token_id": localStorage.getItem('token_id')
        },
        //返回数据的格式
        dataType: "json",
        //成功返回之后调用的函数
        success: function (data) {
            $('#beginTime').val(data.beginTime);
            $('#nowTime').val(data.nowTime);
            $('#endTime').val(data.endTime);
            $('#syNum').text(data.number);
            if (data.nowTime < data.beginTime) {
                _noStart();
                return false;
            } else if (data.nowTime >= data.beginTime && data.nowTime <= data.endTime) {

            } else if (data.nowTime > data.endTime) {
                _endStart();
                return false;
            }
        },
        //调用出错执行的函数
        error: function (data) {
            errorMsg();
        }
    });
}

//根据手机号获取用户基本信息
function checkPhone(telPhone, resolve) {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        headers: {'Content-Type': 'application/json'},
        //提交的网址
        url: '/wechat_access/api/user/account/loginH5?mobile=' + telPhone + '&verify=24b6e946d4594661a58bd235fe639544',
        //url: '/wechatApi-ng4/api/user/account/loginH5?mobile=' + telPhone + '&verify=24b6e946d4594661a58bd235fe639544',
        //返回数据的格式
        dataType: "json",
        //成功返回之后调用的函数
        success: function (data) {
            localStorage.setItem('_accountId', data.id);
            cj(telPhone, data.id, resolve);
        },
        //调用出错执行的函数
        error: function (data) {
            console.log(data);
            errorMsg();
        }
    });
}


function cj(telPhone, accountId, resolve) {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: '/wechat_access/api/v1/nationalActivity/draw',
        //url: '/wechatApi-ng4/api/v1/nationalActivity/draw',
        data: JSON.stringify({'telPhone': telPhone}),
        //返回数据的格式
        dataType: "json",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token_id": localStorage.getItem('token_id'),
            "_accountId": accountId
        },
        //成功返回之后调用的函数
        success: function (data) {
            if (data.result === 1) {
                lottery.prize = 1;
            } else if (data.result === 2) {
                lottery.prize = 5;
            } else if (data.result === 3) {
                lottery.prize = 7;
            } else if (data.result === 4) {
                lottery.prize = 0;
            }
            resolve();
        },
        //调用出错执行的函数
        error: function (data) {
            console.log(data);
            if (data.responseJSON.code === 'number.none.NotRule') {
                swal({
                    title: '没有抽奖次数啦，首次分享可多得一次抽奖！',
                    background: '#002b42',
                    showCancelButton: true,
                    confirmButtonColor: 'transparent',
                    cancelButtonColor: 'transparent',
                    cancelButtonText: '立即使用',
                    confirmButtonText: '朕知道了',
                    allowOutsideClick: false
                }).then(function () {

                }, function () {
                    if (isiOS) {
                        window.location.href = 'https://itunes.apple.com/cn/app/uez/id1124821366';
                    } else if (isAndroid) {
                        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wsd.yjx';
                    }
                });
                click = false;
                return;
            }
            errorMsg();
            click = false; //一次抽奖完成后，设置click为true，可继续抽奖
        }
    });
}

function _cj(telPhone, accountId) {
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: '/wechat_access/api/v1/nationalActivity/draw',
        //url: '/wechatApi-ng4/api/v1/nationalActivity/draw',
        data: JSON.stringify({'telPhone': telPhone}),
        //返回数据的格式
        dataType: "json",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "token_id": localStorage.getItem('token_id'),
            "_accountId": accountId
        },
        //成功返回之后调用的函数
        success: function (data) {
            if (data.result === 1) {
                lottery.prize = 1;
            } else if (data.result === 2) {
                lottery.prize = 5;
            } else if (data.result === 3) {
                lottery.prize = 7;
            } else if (data.result === 4) {
                lottery.prize = 0;
            }
            jcj();
            $('#draw-btn').find('img').attr('src', 'img/9/img5-1.png');
            click = true; //一次抽奖完成后，设置click为true，可继续抽奖
            return false;
        },
        //调用出错执行的函数
        error: function (data) {
            console.log(data);
            if (data.responseJSON.code === 'number.none.NotRule') {
                swal({
                    title: '没有抽奖次数啦，首次分享可多得一次抽奖！',
                    background: '#002b42',
                    showCancelButton: true,
                    confirmButtonColor: 'transparent',
                    cancelButtonColor: 'transparent',
                    cancelButtonText: '立即使用',
                    confirmButtonText: '朕知道了',
                    allowOutsideClick: false
                }).then(function () {

                }, function () {
                    if (isiOS) {
                        window.location.href = 'https://itunes.apple.com/cn/app/uez/id1124821366';
                    } else if (isAndroid) {
                        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wsd.yjx';
                    }
                });
                click = false;
                return;
            }
            errorMsg();
            click = false; //一次抽奖完成后，设置click为true，可继续抽奖
        }
    });
}


function errorMsg() {
    swal({
        title: '当前访问人数过多请稍后再试',
        background: '#002b42',
        confirmButtonColor: 'transparent'
    });
}

function _errorMsg() {
    if ($('#beginTime').val() > $('#nowTime').val()) {
        _noStart();
        return false;
    } else if ($('#endTime').val() < $('#nowTime').val()) {
        _endStart();
        return false;
    }
    return true;
}

$('#cdt').click(function () {
    location.href = 'index1.html';
});


$('#fx').click(function () {
    $('.box').show();
});

$('.box').click(function () {
    $(this).hide();
});
