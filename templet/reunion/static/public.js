jQuery.support.cors = true;//解决ie9跨域问题
var e = function(){
   if(document.all){
     window.event.returnValue = false;
   }else{
     event.preventDefault();
     event.stopPropagation();
   }
}
//event.preventDefault();
//event.stopPropagation();

/*ajax提交表单，用于form的添加修改 ,成功后执行指定函数
*@prame formid  要提交的表单id
*@prame fun     提交成功后执行的函数 可以是字符串表示函数名 "test"  也可以直接是函数代码 function(){ 代码 }
*/
function ajaxsubmit(formid,fun){

      var obj=$("#"+formid);
      var url=$(obj).attr("action");
      if(!url){
          mess_tusi("找不到提交地址");
          return false;
      }
      $.ajax({
           url:url,
           type: 'POST',
           data:$(obj).serialize(),
           dataType:"json",
           cache:false,
           timeout : 30000, //超时时间设置，单位毫秒
           success: function(data){
                  if(typeof(fun)=="function"){
                     fun(data);
                  }else if(typeof(fun)=="string"){
                     eval(fun+"(data)");
                  }
           },
           complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数

               if(status=='timeout'){//超时,status还有success,error等值的情况
                   alert("请求超时");
                   showloaddinghtml5(0);
               }
           },
           error:function(XMLHttpRequest, textStatus, errorThrown){
               //200-确定。客户端请求已成功
                showloaddinghtml5(0);

               //0 － （未初始化）还没有调用send()方法
               //1 － （载入）已调用send()方法，正在发送请求
               //2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
               //3 － （交互）正在解析响应内容
               //4 － （完成）响应内容解析完成，可以在客户端调用了
               //alert(XMLHttpRequest.readyState);

               // "timeout", "error", "notmodified" 和 "parsererror"。
               //alert(textStatus);
				if(textStatus=='timeout'){//超时
                   alert("请求超时");
               }
           }

     });
     return false;
}
/*ajax  提交到指定url处理数据，成功后执行指定函数
*@prame url  要提交的url
*@prame param  参数可以是对象类型 {"name":"zhi","name":"zhi"} 可以是字符串类型 id=54&tt=6
*@prame fun  提交成功后执行的函数,可以是字符串表示函数名 "test"  也可以直接是函数代码 function(){ 代码 }
*/
function ajaxrun(url,param,fun){

   if(typeof(param)=="string"){ var params=param; }
   if(typeof(param)=="object"){ var params=jQuery.param(param);    }
      $.ajax({
           url:url,
           type:"post",
           data:params,
           dataType:"json",
           cache:false,
           timeout : 10000, //超时时间设置，单位毫秒
           success: function(data){
                 if(typeof(fun)=="function"){
                     fun(data);
                 }else if(typeof(fun)=="string"){
                     eval(fun+"(data)");
                 }
           },
           complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数

               if(status=='timeout'){//超时,status还有success,error等值的情况
                   alert("请求超时");
                   showloaddinghtml5(0);
               }
           },
           error:function(XMLHttpRequest, textStatus, errorThrown){
               //200-确定。客户端请求已成功

               //0 － （未初始化）还没有调用send()方法
               //1 － （载入）已调用send()方法，正在发送请求
               //2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
               //3 － （交互）正在解析响应内容
               //4 － （完成）响应内容解析完成，可以在客户端调用了
               //alert(XMLHttpRequest.readyState);

               // "timeout", "error", "notmodified" 和 "parsererror"。
               //alert(textStatus);
		if(textStatus=='timeout'){//超时
                   alert("请求超时");
                   showloaddinghtml5(0);
               }
           }
     });
     return false;
}


/*ajax公共提交处理
*
* var paramsData = {}
* paramsData['url'] = '';
* paramsData['cache'] = '';
* paramsData['debug'] = '';
* paramsData['funSuccess'] = '';
* paramsData['api'] = '';
*
*/
function comajax(data,token_id){

    var url = data.url || "";//请求地址
    var cache = data.cache || false;//false不缓存 true缓存结果
    var type = data.type || "post";//get请求还是post
    var debug = data.debug || false;//是否输出请求数据与返回数据
    var async = data.async || false;//是否同步 true 异步 false 同步, 默认同步
    var funSuccess = data.funSuccess || function(){};//请求成功后的处理函数
    var funError = data.funError || function(){};//请求失败后的处理函数
    var funBefore = data.funBefore || function(){};//请求之前处理函数
    delete data.url;
    delete data.async;
    delete data.cache;
    delete data.type;
    delete data.debug;
    delete data.funBefore;
    delete data.funSuccess;
    delete data.funError;

    //拼装请求数据
    var params = data;
    var paramsStr = JSON.stringify(params);
    console.log(jQuery.param(params));

    if(type=="get"){
        url = url + "?"  + jQuery.param(params);

    }
    //输出请求数据
    if(debug==true){
        console.log("请求地址:"+url);
        console.log("请求数据:"+paramsStr);
    }

   $.ajax({
       "url":url,
       "type":type,
       "data": (type=="get" ? "" : jQuery.param(params) ) ,
       "dataType":"json",
       "cache":cache,
       "async":async,
       "timeout" : 10000, //超时时间设置，单位毫秒

       beforeSend: function (xhr) {
           showloaddinghtml5(1);
         if(null == token_id){
             return;
         }
         xhr.setRequestHeader("token_id",token_id);
          if(typeof(funBefore) == "function"){
              funBefore(xhr);
          }
       },

       success : function(result,textStatus,XMLHttpRequest){
           showloaddinghtml5(0);
        if(debug==true){
            console.log("返回结果:");
            console.log(result);
        }
           //返回处理函数
        if(typeof(funSuccess)=="function"){
                 funSuccess(result,textStatus,XMLHttpRequest);
           }
       },

       complete : function(XMLHttpRequest,textStatus){ //请求完成后最终执行参数
           showloaddinghtml5(0);
           // if(textStatus=='timeout'){//超时,status还有success,error等值的情况
           //     mess_tusi("请求超时");
           // }
       },
       error : function(XMLHttpRequest, textStatus ,errorThrown){
           showloaddinghtml5(0);
           if(debug==true){
               console.log("XMLHttpRequest===>"+XMLHttpRequest.status);
               console.log("textStatus===>"+textStatus);
               console.log("errorThrown===>"+errorThrown);
           }
           //返回处理函数
           if(typeof(funError)=="function"){
               funError(XMLHttpRequest,textStatus,errorThrown);
           }
               //200-确定。客户端请求已成功
               //0 － （未初始化）还没有调用send()方法
               //1 － （载入）已调用send()方法，正在发送请求
               //2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
               //3 － （交互）正在解析响应内容
               //4 － （完成）响应内容解析完成，可以在客户端调用了
               //alert(XMLHttpRequest.readyState);
               // "timeout", "error", "notmodified" 和 "parsererror"。
               //alert(textStatus);
               //console.log("textStatus...."+textStatus);
               //if(textStatus=='timeout'){//超时
               //    mess_tusi("请求超时");
               //}
               //if(textStatus=='error'){//出错
               //    mess_tusi("请求出错");
               //}
           return false;
       }
 });
     return false;
}
/** 显示信息提示框
 * 
 * @param {int} show     为1表示显示 为0表示隐藏
 * @param {str} strs     要显示的文本可以是html代码
 * @param {int} times    为数字表示多少秒后自动关闭，为空表示不自动关闭
 * @param {str} urls     表示关闭后要跳转到的URL
 * @returns {undefined}
 * 
 */
function showmessage(show,strs,times,urls){

    //创建层
    var w = $(window).width();
    var divw = (w*0.6 > 200)? 200 : w*0.6;
	//防止二次调用时生成多个
    if($(".message").html()==undefined){
       $("body").append("<div class='message' style='background:rgba(0,0,0,.1);width:100%;height:100%; position: absolute; z-index: 100; top:0px; bottom: 0px;left:0px;right:0px; display: none;'><div class='con' style='background: #fff; width: "+divw+"px;min-height:20px; border-radius: 4px;font-size:14px;padding:15px;'></div></div> ");
    }
	//设置位置
    $(".message").css({"top":$(window).scrollTop()+"px"});
    $(".message .con").css({"margin-top":($(window).height()-$(".message .con").height())/2+"px","margin-left":(w-divw)/2+"px"});
    $("body").css('overflow-y','hidden');

    if(show){
      $(".message").show();
      $(".message .con").html(strs);
        if(times){
           setTimeout(function (){
              if(urls){ //有url跳转
                window.location.href=urls;
              }else{   //没有直接关闭消息层
                $(".message").remove();
                $(".message .con").html("");
                $("body").css('overflow-y','auto');
              }
           },times);
       }
    }else{
      $(".message").remove();
      $(".message .con").html("");
      $("body").css('overflow-y','auto');
    }
}





var tusitemp="";
/** 显示吐丝消息
 * @param {str} strs    消息内容
 * @returns {undefined}
 */
function mess_tusi(strs){
    //清除事件
    clearTimeout(tusitemp);
    $("#mess_tusi").remove();
    //创建吐丝层并写入内容
    if(!$("#mess_tusi").attr("id")){ //吐丝层不存在创建
       $("body").append("<div id='mess_tusi' style='position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>"+strs+"</span></div>"); //写入内容
    }else{
       $("#mess_tusi").html(strs);  //写入内容
    }

    //定义吐丝层位置
    var left=($(window).width()-$("#mess_tusi").width())/2;//居中
    //var top=($(window).height()-$("#mess_tusi").height())/2;//居中
    var top=$(window).height()*0.8;//偏下
    $("#mess_tusi").css({"left":left+"px","top":top+"px"});
    //显示吐丝层
    $("#mess_tusi").css("display",'');
    //2秒后关闭
    tusitemp =  setTimeout(function (){
           $("#mess_tusi").remove();
           $("#mess_tusi").html("");
    },2000);
    return false;
}




/** 显示弹窗提示，并有确定和取消操作
 * 如果只传入字符串,字符串将作为显示的内容使用，其它参数将会启用默认值 
 * @param {obj} params {"content":"","width":"400px","isQueding":"1","isQuxiao":"1"}  提示内容，是否显示确定按钮，是否显示关闭按钮
 * @param {fun} funok      确定后执行的js内容 function(){代码}
 * @param {array} funno    取消后执行的js内容 function(){代码}
 * @returns {undefined}
 */
function mess_tanchuang(data,funok,funno){
      var  params={}
      params.content = (data.content == undefined ) ? data : data.content ;
      params.width = (data.width == undefined ) ? "200px" : data.width ;
      params.isQueding =(data.isQueding == undefined ) ? "1" :data.isQueding ;
      params.isQuxiao = (data.isQuxiao == undefined ) ? "0" :data.isQuxiao ;

	if( params.isQueding == 1 && params.isQuxiao ==1){
		var tempW = "width:49.5%;";
	}else{
		var tempW = "width:100%;";
	}

    var anniustyle="color: #888787;font-size: 16px;text-align: center;float: left;display:block;"+tempW+"line-height: 40px;";
    var strs="<div style='position:fixed;top:0px;left:0px;right:0px;bottom:0px;background:rgba(0,0,0,0.2);z-index:99999'>\n\
                <div id='mess_tanchuang' style='width: "+params.width+" ; position: fixed; font-size:16px; border-radius: 4px; left: 50%; top: 50%;background: rgb(255, 255, 255);box-shadow: 0px 0px 15px rgba(0,0,0,.5),-0px -0px 15px rgba(0,0,0,.5);'>\n\
                <div style='padding:30px 15px;border-bottom: solid #ccc 1px;text-align:center;'>"+params.content+"</div>";
            strs=strs+"<center style='display:flex'>";
            if( params.isQueding != 0 ) strs=strs+"<a href='javascript:void(0);' class='queding' style='"+anniustyle+"'>确定</a>";
            if( params.isQuxiao != 0 ) strs=strs+"<a href='javascript:void(0);' class='quxiao' style='"+anniustyle+";border-left: solid 1px #ECEAEA;'>取消</a>";
            strs=strs+"</center>\n\
                </div>\n\
                </div>";
       $("body").append(strs); //写入内容
       $("#mess_tanchuang .quxiao").click(function(event){ //取消直接删除层
           event.preventDefault();
           event.stopPropagation();
            if(typeof(funno)=="function"){
                  funno();
            }else if(typeof(funno)=="string"){
                  eval(funno);
            }
           $("#mess_tanchuang").parent().remove();

       });
       $("#mess_tanchuang .queding").click(function(event){//确定时，执行代码删除层
              event.preventDefault();
              event.stopPropagation();
              if(typeof(funok)=="function"){
                  funok();
               }else if(typeof(funok)=="string"){
                  eval(funok);
               }
               $("#mess_tanchuang").parent().remove();
       });

        //位置
        var mleft=$("#mess_tanchuang").width()/2;//居中
        var mtop=$("#mess_tanchuang").height()/2;//居中
        $("#mess_tanchuang").css({"margin-left":"-"+mleft+"px","margin-top":"-"+mtop+"px"});
        return false;
}

/** 显示加载流动条HTML5版
 * 
 * @param {int} show     为1表示显示 为0表示隐藏
 * @returns {undefined}
 * 
 */
function showloaddinghtml5(show,strs){
     if(show==0){
         $("#mess_loaddinghtml5").remove();
     }else{
        if(strs=="" || strs==undefined)  strs = "正在加载中...";
        if(!$("#mess_loaddinghtml5").attr("id")){ //不存在创建
          $("body").append('<div id="mess_loaddinghtml5"><div class="loadding"><div class="loaddingtishi">'+strs+'</div><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div></div></div>'); //写入内容
         }
         $("#mess_loaddinghtml5").css("display",'');
    }
}




/* 在移动端，click 改为touchstart       手机端页面滑动时，不触发事件
*/
(function(){
        var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click', _on = $.fn.on;
            $.fn.on = function(){
                arguments[0] = (arguments[0] === 'click') ? isTouch: arguments[0];
                return _on.apply(this, arguments);
            };
})();

//只能这样使用 $("").click(function(){     });
$.fn.click = function(fun){
    var flag = false;
    $(this).on("touchstart touchmove touchend",function(){

        //取出当前点击的对象
        var me = event.currentTarget;
        //把点击事件加到当前对象上
        me.click =fun;

        switch(event.type) {
            case 'touchstart':
                falg = false;
                break;
            case 'touchmove':
                falg = true;
                break;
            case 'touchend':
                if( !falg ) {
                    //执行点击事件
                    me.click();
                } else {

                }
                break;
        }
    });
};


/* 自动适配rem的比值。
//use_screen_base为320时 表示以iphone4的宽320px为标准设计网页,在iphone4下默认的font-size为100px,网页中1rem表示10px.
//use_screen_base为375时 表示以iphone6的宽375px为标准设计网页,在iphone6下默认的font-size为100px,网页中1rem表示10px.

第一步：引入 此js
第一步：在head中引入代码段	window.use_screen_base = '375';		
第三步：把所有px为单位的值都可以换成以rem为单位
*/ 
(function(a, b) {
    if(typeof(use_screen_base) !="undefined"){
	var c = "orientationchange" in b ? "orientationchange" : "resize",
		d = use_screen_base.indexOf("_mate"),
		e = parseInt(use_screen_base),
		f = a.documentElement,
		g = function() {
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



 
 /**
 * 本地图片预览，支持微信 手机端
 * @param  {string} img对象的id
 * @return 
 */
 function showPreview(imgid) {
        showid = imgid;
       //创建file
        if($("#file").length==0){        
            $("<input>",{
                     id : "file",
                     name : "file",
                     type : "file",
                     accept : "image/png,image/jpeg,image/jpeg,DCIM/*;capture=camera",
                     style : "visibility: hidden;"
            }).appendTo("body")
            .blur()   //这里为了让手机也能弹出文件选择的框
            .focus()  //这里为了让手机也能弹出文件选择的框
            .change(function(){
                     var file = this.files[0];            
                    //只能是图片
                    if(!/image\/\w+/.test(file.type)){
                            alert("请确保文件为图像类型");
                            return false;
                    }
                    //不能大于500KB
                    if(file.size > 1024*1024*2 ){
                            alert("文件大小不能超过2MB");
                            return false;
                    }                    
                    if(window.FileReader) {
                            var fr = new FileReader();
                            fr.readAsDataURL(file);             
                            fr.onloadend = function(e) {                                
                                   $("#"+showid).attr("src",e.target.result);
                                   $("#file").remove();
                            };
                    }            
               }); 
        }        
        $("#file").click()                
}

$.extend({
  //console.log() 代替js的 console.log
  log: function(message) {
      var now = new Date(),
      y = now.getFullYear(),
      m = now.getMonth() + 1, //！JavaScript中月分是从0开始的
      d = now.getDate(),
      h = now.getHours(),
      min = now.getMinutes(),
      s = now.getSeconds(),
      time = y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
      console.log(time);
      console.log(message);
  }
})



//js获取url参数
function getUrlParams(name,url){
    if(!url) url = window.location.href;
    var params = {};
    var url = decodeURI(url);
    var idx = url.indexOf("?");
    if(idx > 0)
    {
        var queryStr = url.substring(idx + 1);
        var args = queryStr.split("&");
        for(var i = 0, a, nv; a = args[i]; i++)
        {
            nv = args[i] = a.split("=");
            params[nv[0]] = nv.length > 1 ? nv[1] : true;
        }
    }
    return params[name];
}



//包含required属性的dom是否全部有值
function checkInput(){
    var isEmpty=true;
    $("*[required]").each(function(){
        switch($(this).attr("type"))
        {
        case "text":
            if($.trim($(this).val())=="") isEmpty=false;
            break;
        case "number":
            if($.trim($(this).val())=="") isEmpty=false;
            break;
        case "tel":
            if($.trim($(this).val())=="") isEmpty=false;
            break;
        case "checkbox":
             if(!$(this).prop("checked")) isEmpty=false ;
             break;
        case "undefined":
             if($.trim($(this).text())=="") isEmpty=false;
        }
        console.log($(this).attr("type") +"......"+ $.trim($(this).text()) +"......"+ isEmpty);
    });

    //isEmpty为true表示所有input都有输入的内容
    if(isEmpty){
         $("button.jt-btn").removeClass("jt-btn-disabled").addClass("jt-btn-primary").removeAttr("disabled");//全部都有内容时，删除灰色的样式
    }else{
         $("button.jt-btn").addClass("jt-btn-disabled").removeClass("jt-btn-primary").attr("disabled",true);//只要有一个input没有内容，即为灰色
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 * 判断是否为空
 * @param value
 * @returns {boolean}
 */
function isEmpty(value) {
    if(value == null || value == '' || value == undefined){
        return true;
    }
    return false;
}