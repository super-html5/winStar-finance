$(document).ready(function () {
    $("body").on("click","#notice a",function () {
        $("#notice ul").toggle();
    });


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
    window.getUrlParams=getUrlParams;
});