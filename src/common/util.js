//ajax post请求
export function callAjaxWithPost(url, params, callback){
  $.ajax({
    type:'POST',
    url:url,
    data:JSON.stringify(params),
    contentType:'application/json',
    dataType:'json',
    success:function(obj) {
      callback(obj);
    }
  })
}
//promise封装ajax post请求
export function jqPostAjaxPromise(url,params) {
     return new Promise(function(resolve, reject){
       $.ajax({
          url: url,
          type: 'POST',
          data: params,
          data:JSON.stringify(params),
          contentType:'application/json',
          dataType:'json',
       success: function(data){
          resolve(data);
         },
       error: function(error){
            reject(error)
        }
      });
    });
  }
//ajax get请求
export function callAjaxWithGet(url,callback) {
  $.ajax({
    url:url,
    type:'GET',
    dataType:'json',
    contentType: "application/json;charset=utf-8",
    success:function(datas) {
      callback(datas);
    }
  })
}
//定义一个公共字典类,并使得中文与字符串进行转义
export function exchange(param){
  var directory=new Dictionary();
  directory.add('OVERDURE','已逾期');
  directory.add('THE_OVERDURE','即将逾期');
  return directory.find(param);
}
//字典类
function Dictionary() {
  this.dataStore=[];
  this.add=function(key,value) {
   this.dataStore[key] = value;
  }
  this.find=function(key) {
    return this.dataStore[key];
  }
}
// 把后台返回回来的字符串类型的百分比组成的数组，转化为number类型的小数
export function dataHandler(array) {
  // console.log(array);
  // let arrayAfter=[];
  //  for(var i in array){
  //    arrayAfter.push(Number(array[i].replace("%",""))/100);
  //  }
  //  return arrayAfter;
  return array;
}
// 监督工作统计中，动态显示echarts的数据
export function generating_chart(myChart,grayBar,baifenbi) {
 return myChart.setOption({
    grid:{
      left:'25%',
      top:0
    },
    color: ['#61A8FF'], //进度条颜色
    xAxis:{
      type:'value',
      show:false,
    },
    yAxis:{
      type:'category',
      data:['满足率','及时率','完成率'],
      axisTick : {show: false},
      axisLine: {show:false},
      show:true
    },
    series:[
      // 背景色
      {
        show: true,
        type: 'bar',
        barGap: '-100%',//两柱状图重合
        barWidth: '35%', //统计条宽度
        itemStyle: {
            normal: {
                barBorderRadius: 20,
                color: '#eee'
            },
        },
        z: 1,
        data: grayBar,
      },
      //蓝条
      {
        show:true,
        type:'bar',
        barGap: '-100%',//不同系列的柱间距离，为百分比。如果想要两个系列的柱子重叠，可以设置 barGap 为 '-100%'。这在用柱子做背景的时候有用。
        barWidth: '35%', //统计条宽度
        itemStyle:{
          normal:{
            barBorderRadius:20,
            colorStops: [{
              offset: 0,
              color: '#3dc0e9' // 0% 处的颜色
              }, {
                  offset: 1,
                  color: '#45e3cf' // 100% 处的颜色
              }],
              globalCoord: false, // 缺省为 false
            }
         },
         max:1,//总长度为1
         label:{
           normal:{
             show:true,
             textStyle:{
               color:"#000",
             },
             position:'top',
             //百分比格式
             formatter: function(data) {
              //  console.log(data);
              return (baifenbi[data.dataIndex] * 100).toFixed(2) + '%';
             },
           }
         },
         labelLine:{//标签的视觉引导线
           show:false
         },
         z:2,
         data:baifenbi
      }
    ]
  });
}
// 整改完成率中，动态显示echarts的数据
export function bar_echart(myChart,title,completed,nocompleted) {
  return myChart.setOption({
    title:{
      text:title,
      left:'center'
    },
    tooltip : {
      trigger:'item',
      formatter:"{a} <br/>{b} : {c} ({d}%)"
    },
    legend:{
      bottom:10,
      left:'center',
      data:['完成','未完成']
    },
    series:[{
      type:'pie',
      radius:'65%',
      center:['50%','50%'],
      selectedMode: 'single',
      data:[
        {
          value:completed,
          name:'完成',
          itemStyle: {color: 'rgb(46,199,201)'}
        },
        {
          value:nocompleted,
          name:'未完成',
          itemStyle: {color: 'rgb(255,185,128)'}
        }
      ],
      itemStyle: {
          emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          label:{
            show: true,
            formatter: '{b} : {c} ({d}%)'
          },
          labelLine :{show:true}
        }
      }
    }]
  });
}
// 解析 URL 并获取传递的参数
export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
