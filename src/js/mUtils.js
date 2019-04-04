import $ from 'jquery'

export const parseURL = (url) => {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

/**
 * 设置uuid
 */
export const setUUid = (len, radix) => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++)
            uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

/***
 * 格式化手机号 187****5194
 * @param phone
 */
export const formatPhone = (phone) => {
    var myPhone = phone.substr(3, 4);
    var formatPhone = phone.replace(myPhone, "****");
    return formatPhone;
}

/***
 * 格式化图文详情img的样式
 * @param htmlString
 */
export const formatImgStyle = (htmlString) => {
    //定义容器，方便获取修改后的html字符串
    //直接用jQuery包装"<div></div>"，此时在内存中就有了一个div元素
    var $container = $("<div></div>");
    var html = htmlString
        .replace(htmlString ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "\'")
        .replace(/&amp;/g, '')
        .replace(/&ldquo;/g, '\"')
        .replace(/&rdquo;/g, '\"')
        .replace(/nbsp;/ig, ' ');
    //console.log($container.html());
    //直接将要修改的html字符串插入到容器中
    $container.append(html);
    //在容器中搜索所有的img标签，并遍历
    $container.find("p").each(function (i, n) {
        //对于每一个p元素，直接修改其style属性中的width属性
        //如果style属性没有，自动添加；如果已经有width属性，直接修改
        $(n).css(
            "font-size", "0.6rem"
        );
    });

    $container.find("img").each(function (i, n) {
        //对于每一个img元素，直接修改其style属性中的width属性
        //如果style属性没有，自动添加；如果已经有width属性，直接修改
        $(n).css({
            width: "100%"
        });
    });
    //获取修改后的html字符串，即容器的html内容
    //return $container.html();
    var formatedHtml = $container.html();
    //设置成width会导致图片拉升失真,使用max-width
    //直接设置max-width会build失败,故先设置width再替换成max-width
    formatedHtml = formatedHtml.replace('width: 100%;', 'max-width: 100%;');
    return formatedHtml;
}

/***
 * 过滤特殊字符
 */
export const filterString = (value) => {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
    var specialStr = "";
    if (!value) return '';
    for (var i = 0; i < value.length; i++) {
        specialStr += value.substr(i, 1).replace(pattern, '');
    }
    return specialStr;
}

/***
 * 过滤 &字符
 */

export const filterAnd = (value) => {
    var pattern = new RegExp("&");
    var specialStr = "";
    if (!value) return '';
    for (var i = 0; i < value.length; i++) {
        specialStr += value.substr(i, 1).replace(pattern, '');
    }
    return specialStr;
}

/**
 * trim输入的前后空格
 * @param value
 * @returns {string}
 */
export const trimVal = (value) => {
    return value.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 *  判断是否是服务类商品
 */
export const isServerProduct = (product) => {
    if (product.isRequireShip == 0 && product.price == 0) {
        return true;
    }
    return false;

}

/**
 * html 转码
 * @param text
 * @returns {string}
 */
export const htmlDecode = (text) => {
    //1.首先动态创建一个容器标签元素，如DIV
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
}


/***
 * 删除本地缓存的当前商品信息和购物车结算信息
 */
export const delLocStorge = () => {
    removeStore('chooseCartItemList');
    removeStore('chooseProductInfo');
    removeStore('chooseProNum');
    removeStore('chooseProSpec');
    removeStore('chooseProOrgInfo');
}


/**
 * 存储sessionStorage
 */

export const setSessionStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getSessionStore = name => {
    if (!name) return;
    return window.sessionStorage.getItem(name);
}


/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return;
    window.sessionStorage.removeItem(name);
    window.localStorage.removeItem(name);
}

/**
 * 获取cookie
 */
export const getCookieByName = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') {
        target = element.scrollTop;
    } else if (element.currentStyle) {
        target = element.currentStyle[attr];
    } else {
        target = document.defaultView.getComputedStyle(element, null)[attr];
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return NumberMode == 'float' ? parseFloat(target) : parseInt(target);
}

/**
 * 页面到达底部，加载更多
 */
export const loadMore = (element, callback) => {
    let windowHeight = window.screen.height;
    let height;
    let setTop;
    let paddingBottom;
    let marginBottom;
    let requestFram;
    let oldScrollTop;

    document.body.addEventListener('scroll', () => {
        loadMore();
    }, false)
    //运动开始时获取元素 高度 和 offseTop, pading, margin
    element.addEventListener('touchstart', () => {
        height = element.offsetHeight;
        setTop = element.offsetTop;
        paddingBottom = getStyle(element, 'paddingBottom');
        marginBottom = getStyle(element, 'marginBottom');
    }, {passive: true})

    //运动过程中保持监听 scrollTop 的值判断是否到达底部
    element.addEventListener('touchmove', () => {
        loadMore();
    }, {passive: true})

    //运动结束时判断是否有惯性运动，惯性运动结束判断是非到达底部
    element.addEventListener('touchend', () => {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
    }, {passive: true})

    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                loadMore();
                moveEnd();
            } else {
                cancelAnimationFrame(requestFram);
                //为了防止鼠标抬起时已经渲染好数据从而导致重获取数据，应该重新获取dom高度
                height = element.offsetHeight;
                loadMore();
            }
        })
    }

    const loadMore = () => {
        if (document.body.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom) {
            callback();
        }
    }
}

/**
 * 显示返回顶部按钮，开始、结束、运动 三个过程中调用函数判断是否达到目标点
 */
export const showBack = callback => {
    let requestFram;
    let oldScrollTop;

    document.addEventListener('scroll', () => {
        showBackFun();
    }, false)
    document.addEventListener('touchstart', () => {
        showBackFun();
    }, {passive: true})

    document.addEventListener('touchmove', () => {
        showBackFun();
    }, {passive: true})

    document.addEventListener('touchend', () => {
        oldScrollTop = document.body.scrollTop;
        moveEnd();
    }, {passive: true})

    const moveEnd = () => {
        requestFram = requestAnimationFrame(() => {
            if (document.body.scrollTop != oldScrollTop) {
                oldScrollTop = document.body.scrollTop;
                moveEnd();
            } else {
                cancelAnimationFrame(requestFram);
            }
            showBackFun();
        })
    }

    //判断是否达到目标点
    const showBackFun = () => {
        if (document.body.scrollTop > 300) {
            callback(true);
        } else {
            callback(false);
        }
    }
}


/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (element, target, duration = 400, mode = 'ease-out', callback) => {
    clearInterval(element.timer);

    //判断不同参数的情况
    if (duration instanceof Function) {
        callback = duration;
        duration = 400;
    } else if (duration instanceof String) {
        mode = duration;
        duration = 400;
    }

    //判断不同参数的情况
    if (mode instanceof Function) {
        callback = mode;
        mode = 'ease-out';
    }

    //获取dom样式
    const attrStyle = attr => {
        if (attr === "opacity") {
            return Math.round(getStyle(element, attr, 'float') * 100);
        } else {
            return getStyle(element, attr);
        }
    }
    //根字体大小，需要从此将 rem 改成 px 进行运算
    const rootSize = parseFloat(document.documentElement.style.fontSize);

    const unit = {};
    const initState = {};

    //获取目标属性单位和初始样式值
    Object.keys(target).forEach(attr => {
        if (/[^\d^\.]+/gi.test(target[attr])) {
            unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
        } else {
            unit[attr] = 'px';
        }
        initState[attr] = attrStyle(attr);
    });

    //去掉传入的后缀单位
    Object.keys(target).forEach(attr => {
        if (unit[attr] == 'rem') {
            target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
        } else {
            target[attr] = parseInt(target[attr]);
        }
    });


    let flag = true; //假设所有运动到达终点
    const remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
    element.timer = setInterval(() => {
        Object.keys(target).forEach(attr => {
            let iSpeed = 0;  //步长
            let status = false; //是否仍需运动
            let iCurrent = attrStyle(attr) || 0; //当前元素属性址
            let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
            let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
            switch (mode) {
                case 'ease-out':
                    speedBase = iCurrent;
                    intervalTime = duration * 5 / 400;
                    break;
                case 'linear':
                    speedBase = initState[attr];
                    intervalTime = duration * 20 / 400;
                    break;
                case 'ease-in':
                    let oldspeed = remberSpeed[attr] || 0;
                    iSpeed = oldspeed + (target[attr] - initState[attr]) / duration;
                    remberSpeed[attr] = iSpeed
                    break;
                default:
                    speedBase = iCurrent;
                    intervalTime = duration * 5 / 400;
            }
            if (mode !== 'ease-in') {
                iSpeed = (target[attr] - speedBase) / intervalTime;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            }
            //判断是否达步长之内的误差距离，如果到达说明到达目标点
            switch (mode) {
                case 'ease-out':
                    status = iCurrent != target[attr];
                    break;
                case 'linear':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                case 'ease-in':
                    status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
                    break;
                default:
                    status = iCurrent != target[attr];
            }

            if (status) {
                flag = false;
                //opacity 和 scrollTop 需要特殊处理
                if (attr === "opacity") {
                    element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
                    element.style.opacity = (iCurrent + iSpeed) / 100;
                } else if (attr === 'scrollTop') {
                    element.scrollTop = iCurrent + iSpeed;
                } else {
                    element.style[attr] = iCurrent + iSpeed + 'px';
                }
            } else {
                flag = true;
            }

            if (flag) {
                clearInterval(element.timer);
                if (callback) {
                    callback();
                }
            }
        })
    }, 20);
}

export const formatDateAsMinute = (dateStr) => {
    return new Date(Date.parse(new Date(dateStr))).format("yyyy-MM-dd hh:mm");
}

export const getOrgId = () => {
    let orgId = window.localStorage.getItem('orgId');
    console.log('orgId1='+orgId)
    if (orgId && orgId != 'undefined') {
        console.log('orgId2='+orgId)
        return orgId;
    } else {
        console.log('orgId3='+orgId)
        var url = '/web/user/User/getUserType';
        $.ajax({
            type : 'get',
            url : url,
            async : false,
            success : function(data,textStatus, jqXHR){
                var orgId = jqXHR.getResponseHeader("orgid");
                window.localStorage.setItem('orgId', orgId);
            },
            error:function(jqXHR, textStatus, errorThrown){
              globalAjaxError(jqXHR, textStatus, errorThrown);
            }
        });
        return window.localStorage.getItem('orgId');
    }
}

export const getRandomCode = (len = 4) => {
    var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var code = "";
    for (var i = 0; i < len; i++) {
        code += str.charAt(Math.floor(Math.random() * str.length));
    }
    return code;
}

export const globalAjaxError = (jqXHR, textStatus, errorThrown) => {
    var data = jqXHR.responseJSON;
    console.log('data=' + data);
    if (data && data.message) {
        if (data.code == 401) {
            window.sessionStorage.removeItem("___loginState");
            if(window.location.hash) {
              setSessionStore("___loginState", window.location.hash);
            }
            window.location = data.message;
        } else {
            alert("未知错误");
        }
    } else {
        alert("网络错误，请稍后重试");
    }
}

export function getBase(){
    var location = window.location.href;
    return location.substring(0, location.indexOf('/', 10));
}

export function formatDate (date, fmt) {
     if (/(y+)/.test(fmt)) {
         fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
       }
     let o = {
         'M+': date.getMonth() + 1,
         'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
         's+': date.getSeconds()
     }
    for (let k in o) {
         if (new RegExp(`(${k})`).test(fmt)) {
             let str = o[k] + ''
             fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
           }
       }
     return fmt
   }

 function padLeftZero (str) {
     return ('00' + str).substr(str.length)
   }


export function initWxUploadImage(){
  var url = "/weixin/jsapi?url=" + encodeURIComponent(location.href.split('#')[0]);
  $.get(url, function (wxConfignew) {
    if (wxConfignew) {
      wx.config({
        debug: false,
        appId: wxConfignew.appid, // 必填，公众号的唯一标识
        timestamp: wxConfignew.timestamp, // 必填，生成签名的时间戳
        nonceStr: wxConfignew.nonceStr, // 必填，生成签名的随机串
        signature: wxConfignew.signature,// 必填，签名，见附录1
        jsApiList: ["chooseImage", "uploadImage", "getLocalImgData"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }
  })
}
