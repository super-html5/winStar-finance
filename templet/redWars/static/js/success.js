$(document).ready(function () {

    //点击跳转下载app
    $("body").on("click","#download",function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        // 是安卓浏览器
        if (isAndroid) {
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.wsd.yjx'; // 跳安卓端下载地址
        }
        // 是iOS浏览器
        if (isIOS) {
            window.location.href = 'https://itunes.apple.com/cn/app/uez/id1124821366?mt=8'; // 跳AppStore下载地址
        }
    })
});