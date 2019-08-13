/*
	作者：zhouan
	时间：2018-10-21
	描述：
 * */
//ajax添加；令牌
//给所有ajax加上header
import { getToken } from '../services/base'
$(function(){
    getAutorozation();
});
async function getAutorozation(){
    var token = await getToken();
    if(token != null){
        $.ajaxSetup({
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
    }
}
//业务接口发布地址
export var baseUrl = 'http://10.76.251.32:9050';
//ajax:Post
export function callAjaxWithPost(url, params, callback, error) {
    $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: url,
        data: JSON.stringify(params),
        dataType: "json",
        cache: false,
        success: function (result, testStatus) {
            if (result) {
                callback(result);
            }
        },
        complete: function (xhr, xs) {
            xhr = null;
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            // var data = -1;
            // callback(data);
            // showWarning(error);
        }
    });
}
//ajax:Get
export function callAjaxWithGet(url, callback, error) {
    $.ajax({
        type: "GET",
        url: url,
        cache: false,
        success: function (result, testStatus) {
            if (result) {
                callback(result);
            }
        },
        complete: function (xhr, xs) {
            xhr = null;
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            // showWarning(error);
        }
    });
}
//ajax:Put
export function callAjaxWithPut(url, params, callback, error) {
    $.ajax({
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        url: url,
        data: JSON.stringify(params),
        dataType: "json",
        cache: false,
        success: function (result, testStatus) {
            if (result) {
                callback(result);
            }
        },
        complete: function (xhr, xs) {
            xhr = null;
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            // var data = -1;
            // callback(data);
            // showWarning(error);
        }
    });
}

//ajax:Put
export function callAjaxWithDelete(url, params, callback, error) {
    $.ajax({
        type: "DELETE",
        contentType: "application/json;charset=utf-8",
        url: url,
        data: JSON.stringify(params),
        dataType: "json",
        cache: false,
        success: function (result, testStatus) {
            if (result) {
                callback(result);
            }
        },
        complete: function (xhr, xs) {
            xhr = null;
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            // var data = -1;
            // callback(data);
            // showWarning(error);
        }
    });
}

//告警窗口
export function showWarning(msg) {
    layer.alert(msg, {
        title: [
            '警告',
            'background-color:#337ab7; color:#fff;font-size:16px;'
        ], icon: 0
    });
}
//提示窗口
export function showTips(msg, obj) {
    layer.tips(msg, obj);
}
//确认窗口
export function showConfirm(msg) {
    layer.alert(msg);
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
/**
 *
 * @param {} date
 * @returns {}
 */
Date.prototype.format = function (date) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(date))
        date = date.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            if (new RegExp("(" + k + ")").test(date)) {
                date = date.replace(RegExp.$1,
                (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }

    return date;
}
//自定义字典
export function Dictionary() {
    var items = {};

    this.has = function (key) {
        return key in items;
    };

    this.set = function (key, value) {
        items[key] = value;
    };

    this.remove = function (key) {
        if (this.has(key)) {
            delete items[key];
            return true;
        }
        return false;
    };

    this.get = function (key) {
        return this.has(key) ? items[key] : undefined;
    };

    this.values = function () {
        var values = [];
        for (var k in items) {
            if (this.has(k)) {
                values.push(items[k]);
            }
        }
        return values;
    };

    this.clear = function () {
        items = {};
    };

    this.size = function () {
        var count = 0;
        for (var prop in items) {
            if (items.hasOwnProperty(prop)) {
                ++count;
            }
        }
        return count;
    };

    this.getItems = function () {
        return items;
    };
}
//正则表达式获取
export function getUrlPara(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]); return null;
}
export function showLoading() {
    // return layer.msg('数据加载中...', { icon: 16, shade: [0.5, '#f5f5f5'], scrollbar: false, offset: '45%', time: 10000000, area: ['20px', '70px'], });
    return layer.load( 2, { shade: [0.5, '#f5f5f5'] });
}

export function closeLoading(index) {
    layer.close(index);
}
