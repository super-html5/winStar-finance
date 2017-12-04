/**
 * Created by Administrator on 2017/9/27.
 */
//适配
window.use_screen_base = '750';
(function (a, b) {
    if (typeof(use_screen_base) != "undefined") {
        var c = "orientationchange" in b ? "orientationchange" : "resize",
            d = use_screen_base.indexOf("_mate"),
            e = parseInt(use_screen_base),
            f = a.documentElement,
            g = function () {
                var a = f.clientWidth,
                    c = b.innerWidth;
                f.style.fontSize = 100 * (c / e) + "px"
            };
        if (/iPad.*OS|iPhone.*OS/.test(navigator.userAgent) && d > 0) {
            var h = a.querySelectorAll("meta[name=viewport]");
            h[0] && h[0].setAttribute("content", "width=device-width, user-scalable=no, initial-scale=" + 1 / b.devicePixelRatio)
        }
        g(), b.addEventListener(c, g, !1), delete use_screen_base
    }
})(document, window);