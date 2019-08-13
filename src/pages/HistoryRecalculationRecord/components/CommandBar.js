// import * as moment from 'moment';
// import * as queryString from 'query-string';

// import { Event } from '../../../../common/event';
// import {
//   businessPrefix,
//   sendRequest,
//   getUnitsByCategory,
//   getDictionaryLite,
//   getOrganizationChildren,
//   getOrganizationByCategory
// } from '../../../../services/base';

// export class CommandBar {

//   constructor() {
//     this._evQuery = new Event('CommandBar-Query');

//     // 电厂下拉选项
//     this._powerStationArr = [];
//     // 工期下拉选项
//     this._constructionPeriodArr = [];
//     // 机组下拉选项
//     this._unitOptionsArr = [];
//     // 指标分类下拉选项
//     this._indexCategoryOptionsArr = [];
//     // 指标名称下拉选项
//     this._indexNameOptionsArr = [];

//     // dom绑定
//     this._domBind();
//     // 时间插件初始化
//     this._initDateTime();
//   }
//   // 命令栏组件初始化
//   async init() {
//     try {
//       // 获取电厂下拉
//       await this._initPowerStationSelected();
//       // 设置默认值
//       this._powerStation$.selectpicker('val', queryString.parse(location.search).stationCode);
//       this._powerStation$.selectpicker('refresh');
//       // 获取工期下拉
//       await this._initPeriodSelected();
//       // 设置默认值
//       this._constructionPeriod$.selectpicker('val', queryString.parse(location.search).periodCode);
//       this._constructionPeriod$.selectpicker('refresh');
//       // 获取机组下拉
//       await this._renderUnitsSelected();
//       // 设置默认值
//       this._unit$.selectpicker('val', queryString.parse(location.search).unitCode);
//       this._unit$.selectpicker('refresh');
//       // 异步获取指标分类
//       const _resArr = await Promise.all([getDictionaryLite('INDEX-CATEGORY')]);
//       // 渲染指标分类下拉框
//       this._renderIndexCategorySelected(_resArr[0]);
//       // 设置默认值
//       this._indexCategory$.selectpicker('val', queryString.parse(location.search).indexCategoryCode);
//       this._indexCategory$.selectpicker('refresh');
//       // 获取并渲染指标名称下拉框
//       await this._renderIndexNameSelected();
//       // 设置默认值
//       this._indexName$.selectpicker('val', queryString.parse(location.search).indexNameCode);
//       this._indexName$.selectpicker('refresh');
//       // 相关事件绑定
//       this._initEvent();
//       // 执行默认查询
//       this._handleQueryClick();
//     } catch (error) {
//       //
//     }
//   }

//   // dom绑定
//   _domBind() {
//     this._startTime$ = $('#startTime');
//     this._endTime$ = $('#endTime');
//     this._powerStation$ = $('#powerStationSelect');
//     this._constructionPeriod$ = $('#constructionPeriodSelect');
//     this._unit$ = $('#unitSelect');
//     this._indexCategory$ = $('#indexCategorySelect');
//     this._indexName$ = $('#indexNameSelect');
//     this._queryBtn$ = $('#queryBtn');
//     this._indexCheck$ = $('input[name="indexRadio"]:checked');
//   }

//   // 时间插件初始化
//   _initDateTime() {
//     const _startDateOptions = {
//       locale: moment.locale('zh-cn'),
//       format: 'YYYY-MM-DD',
//       defaultDate: moment().subtract(7, 'days')
//     }
//     const _endDateOptions = {
//       locale: moment.locale('zh-cn'),
//       format: 'YYYY-MM-DD',
//       defaultDate: moment()
//     }

//     this._startTime$.datetimepicker(_startDateOptions).on('dp.change', (ev) => {
//       this._endTime$.data('DateTimePicker').minDate(ev.date);
//       // 重新渲染班值下拉
//       this._initDutySelected();
//     });
//     this._endTime$.datetimepicker(_endDateOptions).on('dp.change', (ev) => {
//       this._startTime$.data('DateTimePicker').maxDate(ev.date);
//       // 重新渲染班值下拉
//       this._initDutySelected();
//     });
//   }

//   // 初始化电厂下拉选择框
//   async _initPowerStationSelected() {
//     try {
//       let _powerStationOptions = await getOrganizationByCategory('ORG-STATION-SUB');

//       this._powerStation$.empty();
//       let option = document.createElement('option');
//       option.innerText = '全部指标';
//       option.value = 'all';
//       option.selected = true;

//       this._powerStation$.append(option);

//       this._powerStationArr.length = 0;

//       _powerStationOptions.items.forEach((item) => {
//         option = document.createElement('option');
//         option.innerText = item.name;
//         option.value = item.code;
//         this._powerStation$.append(option);
//         this._powerStationArr.push(item.code);
//       });

//       this._powerStation$.selectpicker('refresh');
//       this._powerStation$.selectpicker('val', 'all');

//     } catch (error) {
//       layer.msg('获取电厂失败');
//     }
//   }

//   // 初始化工期下拉选择框
//   async _initPeriodSelected() {
//     try {
//       const _powerStationCode = this._powerStation$.val();
//       if (_powerStationCode !== 'all') {
//         let _periodOptions = await getOrganizationChildren(_powerStationCode, 1);

//         this._constructionPeriod$.empty();
//         let option = document.createElement('option');
//         option.innerText = '全部指标';
//         option.value = 'all';
//         option.selected = true;

//         this._constructionPeriod$.append(option);

//         this._constructionPeriodArr.length = 0;

//         _periodOptions.forEach((item) => {
//           option = document.createElement('option');
//           option.innerText = item.name;
//           option.value = item.code;
//           this._constructionPeriod$.append(option);
//           this._constructionPeriodArr.push(item.code);
//         });
//       } else {
//         let _periodOptions = await getOrganizationByCategory('ORG-PERIOD');

//         this._constructionPeriod$.empty();
//         let option = document.createElement('option');
//         option.innerText = '全部指标';
//         option.value = 'all';
//         option.selected = true;

//         this._constructionPeriod$.append(option);

//         this._constructionPeriodArr.length = 0;

//         _periodOptions.items.forEach((item) => {
//           option = document.createElement('option');
//           option.innerText = item.name;
//           option.value = item.code;
//           this._constructionPeriod$.append(option);
//           this._constructionPeriodArr.push(item.code);
//         });
//       }

//       this._constructionPeriod$.selectpicker('refresh');
//       this._constructionPeriod$.selectpicker('val', 'all');

//     } catch (error) {
//       layer.msg('获取工期失败');
//     }
//   }

//   // 电厂改变事件绑定
//   _bindPowerStationChangeEvent() {
//     this._powerStation$.on('changed.bs.select', async (ev) => {
//       // 触发工期重新渲染
//       await this._initPeriodSelected();
//       // 手动触发工期改变事件
//       // this._constructionPeriod$.trigger('change');
//     })
//   }

//   // 工期改变事件绑定
//   _bindPeriodChangeEvent() {
//     this._constructionPeriod$.on('changed.bs.select', async (ev) => {
//       // 触发机组重新渲染
//       await this._renderUnitsSelected();
//     })
//   }

//   // 渲染机组下拉框
//   async _renderUnitsSelected() {
//     try {
//       const _powerStationCode = this._powerStation$.val();
//       const _periodCode = this._constructionPeriod$.val();
//       let _unitOptions = [];
//       if (_periodCode !== 'all') {
//         let _unitOptionData = await getOrganizationChildren(_periodCode, 1);
//         _unitOptions = _unitOptionData;
//       }
//       if (_powerStationCode === 'all' && _periodCode === 'all') {
//         let _unitOptionData = await getUnitsByCategory();
//         _unitOptions = _unitOptionData.items;
//       }
//       if (_powerStationCode !== 'all' && _periodCode === 'all') {
//         let _periodAndUnitData = await getOrganizationChildren(_powerStationCode, 2);
//         _unitOptions = _periodAndUnitData.filter((item) => {
//           return item.category === 'FAC-UNIT';
//         })
//       }

//       this._unit$.empty();

//       let option = document.createElement('option');
//       option.innerText = '所有机组';
//       option.value = 'all';
//       option.selected = true;

//       this._unit$.append(option);

//       this._unitOptionsArr.length = 0;

//       _unitOptions.forEach(item => {
//         option = document.createElement('option');
//         option.innerText = item.name;
//         option.value = item.code;
//         this._unit$.append(option);
//         this._unitOptionsArr.push(item.code);
//       })

//       this._unit$.selectpicker('refresh');
//       this._unit$.selectpicker('val', 'all');
//     } catch (error) {
//       layer.msg('获取机组失败');
//     }
//   }

//   // 渲染指标分类下拉框
//   _renderIndexCategorySelected(param) {
//     if (!param) {
//       return;
//     }
//     this._indexCategory$.empty();

//     // let option = document.createElement('option');
//     // option.innerText = '所有';
//     // option.value = 'all';
//     // option.selected = true;

//     let option = '';

//     this._indexCategory$.append(option);

//     this._indexCategoryOptionsArr.length = 0;

//     param.forEach(item => {
//       option = document.createElement('option');
//       option.innerText = item.name;
//       option.value = item.code;
//       this._indexCategory$.append(option);
//       this._indexCategoryOptionsArr.push(item.code);
//     })

//     this._indexCategory$.selectpicker('refresh');
//   }

//   // 渲染指标名称下拉框
//   async _renderIndexNameSelected() {
//     const _param = {
//       orgId: this._unit$.val(),
//       category: [this._indexCategory$.val()],
//       indexType: 'INDEX-VALUE'
//     }

//     if (this._indexCategory$.val() === 'all') {
//       // 选中所有的指标
//       _param.category = this._indexCategoryOptionsArr;
//     }

//     if (this._unit$.val() === 'all') {
//       // 选中所有的机组
//       _param.orgId = '';
//     }

//     const _config = {
//       url: `${businessPrefix}/indexbaseinfo/indexlist`,
//       method: 'post',
//       data: _param
//     }
//     let _IndexNameList = await sendRequest(_config);
//     // 过滤删除重复项
//     let _obj = {};
//     _IndexNameList.items = _IndexNameList.items.reduce((cur, next) => {
//       _obj[next.name] ? "" : _obj[next.name] = true && cur.push(next);
//       return cur;
//     }, []);

//     this._indexName$.empty();

//     // let option = document.createElement('option');
//     // option.innerText = '所有';
//     // option.value = 'all';
//     // option.selected = true;

//     let option = '';

//     this._indexName$.append(option);

//     this._indexNameOptionsArr.length = 0;

//     _IndexNameList.items.forEach(item => {
//       option = document.createElement('option');
//       option.innerText = item.name;
//       option.value = item.code;
//       this._indexName$.append(option);
//       this._indexNameOptionsArr.push(item.code);
//     })

//     this._indexName$.selectpicker('refresh');
//   }

//   // 初始化页面操作事件
//   _initEvent() {
//     // 绑定查询按钮点击事件
//     this._queryBtn$.on('click', (e) => {
//       this._handleQueryClick();
//     });

//     // 绑定电厂改变事件
//     this._bindPowerStationChangeEvent();
//     // 绑定工期改变事件
//     this._bindPeriodChangeEvent();
//     // 绑定机组下拉改变事件
//     this._bindUnitChangeEvent();
//     // 绑定指标分类下拉改变事件
//     this._bindIndexCategoryChangeEvent();
//   }

//   // 机组下拉改变事件
//   _bindUnitChangeEvent() {
//     this._unit$.on('changed.bs.select', async (e) => {
//       // 触发指标名称下拉重新渲染
//       await this._renderIndexNameSelected();
//     })
//   }

//   // 指标分类下拉改变事件
//   _bindIndexCategoryChangeEvent() {
//     this._indexCategory$.on('changed.bs.select', async (e) => {
//       // 触发指标名称下拉重新渲染
//       await this._renderIndexNameSelected();
//     })
//   }

//   _handleQueryClick() {
//     // 命令栏进行数据的处理

//     const _obj = {
//       stationIds: [this._powerStation$.val()],
//       projectIds: [this._constructionPeriod$.val()],
//       orgId: this._unit$.val(),
//       category: this._indexCategory$.val(),
//       code: this._indexName$.val(),
//       startTime: moment(this._startTime$.data('DateTimePicker').date()).format('YYYY-MM-DD HH:mm:ss'),
//       endTime: moment(this._endTime$.data('DateTimePicker').date()).format('YYYY-MM-DD HH:mm:ss'),
//       indexChecked: this._indexCheck$.val()
//     }

//     if (this._powerStation$.val() === 'all') {
//       _obj.stationIds = this._powerStationArr;
//     }

//     if (this._constructionPeriod$.val() === 'all') {
//       _obj.projectIds = this._constructionPeriodArr;
//     }

//     if (this._unit$.val() === 'all') {
//       _obj.orgId = '';
//     }

//     if (this._indexCategory$.val() === 'all') {
//       _obj.category = '';
//     }

//     if (this._indexName$.val() === 'all') {
//       _obj.code = '';
//     }


//     this._evQuery.raise(_obj);
//   }

//   // 订阅查询事件
//   subscribeQueryEvent(handler) {
//     this._evQuery.addHandler(handler);
//   }



// }
