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

  function getMonthDay(year,month){
      if(month == 1 || month == 3|| month == 5||month == 7||month == 8||month == 10||month == 12){
          return 31
      }
      if(month == 4 || month == 6|| month == 9||month == 11){
          return 30
      }
      if(month == 2){
        var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
        var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
        var cond3 = year % 400 ==0;  //条件3：年份是400的倍数
        //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
        //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
        //所以得出判断闰年的表达式：
        var cond = cond1 && cond2 || cond3;
        if(cond) {
            return 29
        } else {
            return 28
        }
      }
  }