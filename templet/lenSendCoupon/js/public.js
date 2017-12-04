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
