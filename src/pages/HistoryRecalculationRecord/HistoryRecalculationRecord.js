// /**
//  * @file 指标显示
//  * @author 甘露平
//  */

// import './index.css';

// import { CommandBar } from './components/CommandBar';
// import { DataList } from './components/DataList';

// import {
//   businessPrefix,
//   sendRequest
// } from '../../../services/base';

// import { Loading } from '../../../components/Loading';

// const commandBar = new CommandBar();
// const dataList = new DataList();

// const loading = new Loading();

// $(() => {
//   commandBar.subscribeQueryEvent(commandBarQueryHandler);
//   commandBar.init();

//   dataList.init();
// })


// // 命令栏查询事件
// async function commandBarQueryHandler(param) {
//   // 显示待加载
//   loading.show();
//   // param传递过来的是一个包含 minStartTime、maxStartTime、duties、units及 types 的对象
//   try {
//     const _config = {
//       url: `${businessPrefix}/indexrecalculation/indexrecalculationlist`,
//       method: 'post',
//       data: JSON.parse(JSON.stringify(param))
//     }

//     delete _config.data.indexChecked;

//     const _tableData = await sendRequest(_config);
//     // 这里对数据进行处理

//     // 将处理好的数据进行图表绘制
//     dataList.setDataSource(_tableData.items);

//     // 关闭待加载
//     loading.hide();
//   } catch (error) {
//     // error
//     loading.hide();
//     // 提示信息
//     layer.msg('获取数据报错');
//   }
// }
