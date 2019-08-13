/**
 * @file 指标显示
 * @author 甘露平
 */

require('./HistoryRecalculation.css');

import { CommandBar } from './components/CommandBar';
import { DataList } from './components/DataList';
import { Modal } from './components/Modal';

import {
  businessPrefix,
  sendRequest
} from '../../services/base';

import { Loading } from '../../components/Loading';

const commandBar = new CommandBar();
const dataList = new DataList();
const modal = new Modal();

const loading = new Loading();

$(() => {
  commandBar.subscribeQueryEvent(commandBarQueryHandler);
  commandBar.init();

  dataList.init();
  modal.init();
})


// 命令栏查询事件
async function commandBarQueryHandler(param) {
  // 显示待加载
  loading.show();
  try {
    const _config = {
      url: `${businessPrefix}/indexbaseinfo/indexlist`,
      method: 'post',
      data: param
    }
    const _tableData = await sendRequest(_config);
    // 这里对数据进行处理

    // 将处理好的数据进行图表绘制
    dataList.setDataSource(_tableData.items);

    // 关闭待加载
    loading.hide();
  } catch (error) {
    // error
    loading.hide();
    // 提示信息
    layer.msg('获取数据报错');
  }
}
