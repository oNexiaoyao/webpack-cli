import { Event } from '../../../common/event';
import {
  getUnitsByCategory,
  getDictionaryLite,
  getOrganizationChildren,
  getOrganizationByCategory
} from '../../../services/base';

export class CommandBar {

  constructor() {
    this._evQuery = new Event('CommandBar-Query');

    // 指标分类下拉选项
    this._indexCategoryOptionsArr = [];
    // 电厂下拉选项
    this._powerStationArr = [];
    // 工期下拉选项
    this._constructionPeriodArr = [];
    // 机组下拉选项
    this._unitOptionsArr = [];

    // dom绑定
    this._domBind();
  }
  // 命令栏组件初始化
  async init() {
    try {
      // 获取电厂下拉
      await this._initPowerStationSelected();
      // 获取工期下拉
      await this._initPeriodSelected();
      // 获取机组下拉
      await this._renderUnitsSelected();
      // 异步执行获取指标分类
      const _resArr = await Promise.all([getDictionaryLite('INDEX-CATEGORY')]);
      // 渲染指标分类下拉框
      this._renderIndexCategorySelected(_resArr[0]);

      // 相关事件绑定
      this._initEvent();
      // 执行默认查询
      this._handleQueryClick();
    } catch (error) {
      //
    }
  }

  // dom绑定
  _domBind() {
    this._indexCategory$ = $('#indexCategorySelect');
    this._powerStation$ = $('#powerStationSelect');
    this._constructionPeriod$ = $('#constructionPeriodSelect');
    this._unit$ = $('#unitSelect');
    this._queryBtn$ = $('#queryBtn');
    this._batchEditBtn$ = $('#batchEditBtn');
  }

  // 初始化电厂下拉选择框
  async _initPowerStationSelected() {
    try {
      let _powerStationOptions = await getOrganizationByCategory('ORG-STATION-SUB');

      this._powerStation$.empty();
      let option = document.createElement('option');
      option.innerText = '全部指标';
      option.value = 'all';
      option.selected = true;

      this._powerStation$.append(option);

      this._powerStationArr.length = 0;

      _powerStationOptions.items.forEach((item) => {
        option = document.createElement('option');
        option.innerText = item.name;
        option.value = item.code;
        this._powerStation$.append(option);
        this._powerStationArr.push(item.code);
      });

      this._powerStation$.selectpicker('refresh');
      this._powerStation$.selectpicker('val', 'all');

    } catch (error) {
      layer.msg('获取电厂失败');
    }
  }

  // 初始化工期下拉选择框
  async _initPeriodSelected() {
    try {
      const _powerStationCode = this._powerStation$.val();
      if (_powerStationCode !== 'all') {
        let _periodOptions = await getOrganizationChildren(_powerStationCode, 1);

        this._constructionPeriod$.empty();
        let option = document.createElement('option');
        option.innerText = '全部指标';
        option.value = 'all';
        option.selected = true;

        this._constructionPeriod$.append(option);

        this._constructionPeriodArr.length = 0;

        _periodOptions.forEach((item) => {
          option = document.createElement('option');
          option.innerText = item.name;
          option.value = item.code;
          this._constructionPeriod$.append(option);
          this._constructionPeriodArr.push(item.code);
        });
      } else {
        let _periodOptions = await getOrganizationByCategory('ORG-PERIOD');

        this._constructionPeriod$.empty();
        let option = document.createElement('option');
        option.innerText = '全部指标';
        option.value = 'all';
        option.selected = true;

        this._constructionPeriod$.append(option);

        this._constructionPeriodArr.length = 0;

        _periodOptions.items.forEach((item) => {
          option = document.createElement('option');
          option.innerText = item.name;
          option.value = item.code;
          this._constructionPeriod$.append(option);
          this._constructionPeriodArr.push(item.code);
        });
      }

      this._constructionPeriod$.selectpicker('refresh');
      this._constructionPeriod$.selectpicker('val', 'all');

    } catch (error) {
      layer.msg('获取工期失败');
    }
  }

  // 电厂改变事件绑定
  _bindPowerStationChangeEvent() {
    this._powerStation$.on('changed.bs.select', async (ev) => {
      // 触发工期重新渲染
      await this._initPeriodSelected();
      // 手动触发工期改变事件
      // this._constructionPeriod$.trigger('change');
    })
  }

  // 工期改变事件绑定
  _bindPeriodChangeEvent() {
    this._constructionPeriod$.on('changed.bs.select', async (ev) => {
      // 触发机组重新渲染
      await this._renderUnitsSelected();
    })
  }

  // 渲染机组下拉框
  async _renderUnitsSelected() {
    try {
      const _powerStationCode = this._powerStation$.val();
      const _periodCode = this._constructionPeriod$.val();
      let _unitOptions = [];
      if (_periodCode !== 'all') {
        let _unitOptionData = await getOrganizationChildren(_periodCode, 1);
        _unitOptions = _unitOptionData;
      }
      if (_powerStationCode === 'all' && _periodCode === 'all') {
        let _unitOptionData = await getUnitsByCategory();
        _unitOptions = _unitOptionData.items;
      }
      if (_powerStationCode !== 'all' && _periodCode === 'all') {
        let _periodAndUnitData = await getOrganizationChildren(_powerStationCode, 2);
        _unitOptions = _periodAndUnitData.filter((item) => {
          return item.category === 'FAC-UNIT';
        })
      }

      this._unit$.empty();

      let option = document.createElement('option');
      option.innerText = '所有机组';
      option.value = 'all';
      option.selected = true;

      this._unit$.append(option);

      this._unitOptionsArr.length = 0;

      _unitOptions.forEach(item => {
        option = document.createElement('option');
        option.innerText = item.name;
        option.value = item.code;
        this._unit$.append(option);
        this._unitOptionsArr.push(item.code);
      })

      this._unit$.selectpicker('refresh');
    } catch (error) {
      layer.msg('获取机组失败');
    }
  }

  // 渲染指标分类下拉框
  _renderIndexCategorySelected(param) {
    if (!param) {
      return;
    }
    this._indexCategory$.empty();

    let option = document.createElement('option');
    option.innerText = '所有';
    option.value = 'all';
    option.selected = true;

    this._indexCategory$.append(option);

    this._indexCategoryOptionsArr.length = 0;

    param.forEach(item => {
      option = document.createElement('option');
      option.innerText = item.name;
      option.value = item.code;
      this._indexCategory$.append(option);
      this._indexCategoryOptionsArr.push(item.code);
    })

    this._indexCategory$.selectpicker('refresh');
  }

  // 初始化页面操作事件
  _initEvent() {
    // 绑定查询按钮点击事件
    this._queryBtn$.on('click', (e) => {
      this._handleQueryClick();
    });

    // 绑定电厂改变事件
    this._bindPowerStationChangeEvent();

    // 绑定工期改变事件
    this._bindPeriodChangeEvent();
  }

  _handleQueryClick() {
    // 命令栏进行数据的处理

    const _obj = {
      category: [this._indexCategory$.val()],
      orgId: this._unit$.val(),
      stationId: [this._powerStation$.val()],
      periodId: [this._constructionPeriod$.val()],
      indexType: 'INDEX-VALUE'
    }

    if (this._unit$.val() === 'all') {
      // 选中所有的机组
      _obj.orgId = '';
    }
    if (this._indexCategory$.val() === 'all') {
      // 选中所有的机组
      _obj.category = this._indexCategoryOptionsArr;
    }
    if (this._powerStation$.val() === 'all') {
      _obj.stationId = this._powerStationArr;
    }

    if (this._constructionPeriod$.val() === 'all') {
      _obj.periodId = this._constructionPeriodArr;
    }
    this._evQuery.raise(_obj);
  }

  // 订阅查询事件
  subscribeQueryEvent(handler) {
    this._evQuery.addHandler(handler);
  }



}
