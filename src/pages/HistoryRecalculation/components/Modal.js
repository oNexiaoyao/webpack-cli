import * as moment from 'moment';
import {
  businessPrefix,
  baseCalcUrl,
  sendRequest
} from '../../../services/base';

export class Modal {
  constructor() {
    // dom 绑定
    this._domBind();
    // 定义存储数据变量
    this._rowsData = [];

    this._initEditModal = this._initEditModal.bind(this);
    this._initDateTime = this._initDateTime.bind(this);
    this._recalculationOperate = this._recalculationOperate.bind(this);
  }

  init() {
    this._initEventBind();
  }

  // dom 绑定
  _domBind() {
    this._table$ = $('#tableShow');
    this._editModal$ = $('#editModal');
    this._editModalRecalculationBtn$ = $('#modalRecalculationBtn');
    this._editModalRecalculationStartTime$ = $('#recalculationStartTime');
    this._editModalRecalculationEndTime$ = $('#recalculationEndTime');
  }

  // 时间插件初始化
  _initDateTime() {
    // 销毁时间插件
    if (this._editModalRecalculationStartTime$.data('DateTimePicker')) {
      this._editModalRecalculationStartTime$.off('dp.change');
      this._editModalRecalculationStartTime$.data('DateTimePicker').clear().destroy();
      this._editModalRecalculationEndTime$.off('dp.change');
      this._editModalRecalculationEndTime$.data('DateTimePicker').clear().destroy();
    }
    const _startDateOptions = {
      locale: moment.locale('zh-cn'),
      format: 'YYYY-MM-DD HH:mm:ss',
      defaultDate: moment().subtract(7, 'days')
    }
    const _endDateOptions = {
      locale: moment.locale('zh-cn'),
      format: 'YYYY-MM-DD HH:mm:ss',
      defaultDate: moment()
    }

    const _self = this;
    this._editModalRecalculationStartTime$.datetimepicker(_startDateOptions).on('dp.change', (ev) => {
      _self._editModalRecalculationEndTime$.data('DateTimePicker').minDate(ev.date);
    });
    this._editModalRecalculationEndTime$.datetimepicker(_endDateOptions).on('dp.change', (ev) => {
      _self._editModalRecalculationStartTime$.data('DateTimePicker').maxDate(ev.date);
    });
  }

  // 初始化编辑模态框
  _initEditModal() {
    this._editModal$.on('show.bs.modal', (e) => {
      // 时间插件初始化
      this._initDateTime();
      // 判断是批量编辑还是单行编辑
      if ($(e.relatedTarget).attr('data-action') === 'row') {
        // 点击行编辑
        this._rowsData = [];
        const _currentRowData = this._table$.DataTable().row($(e.relatedTarget).parent('td').parent('tr')).data();
        this._rowsData.push({
          "orgId": _currentRowData.orgId,
          "code": _currentRowData.code,
          "category": _currentRowData.category,
          "dataType": _currentRowData.dataType,
          "startTime": "",
          "endTime": ""
        });
      }
      if ($(e.relatedTarget).attr('data-action') === 'batch') {
        // 点击批量编辑按钮
        this._rowsData = [];
        const _rowsCheckedData = this._table$.DataTable().rows({ selected: true }).data();
        if (_rowsCheckedData.length) {
          _rowsCheckedData.toArray().forEach((item) => {
            this._rowsData.push({
              "orgId": item.orgId,
              "code": item.code,
              "category": item.category,
              "dataType": item.dataType,
              "startTime": "",
              "endTime": ""
            });
          });
        } else {
          layer.msg('请先勾选需要重算的数据');
        }
      }
    })
  }

  // 重算操作
  async _recalculationOperate() {
    // 处理数据
    const _paramFill = {
      startTime: moment(this._editModalRecalculationStartTime$.data('DateTimePicker').date()).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(this._editModalRecalculationEndTime$.data('DateTimePicker').date()).format('YYYY-MM-DD HH:mm:ss'),
      orgIDs: [],
      paraIDs: []
    }

    const _paramRealTime = {
      startTime: moment(this._editModalRecalculationStartTime$.data('DateTimePicker').date()).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(this._editModalRecalculationEndTime$.data('DateTimePicker').date()).format('YYYY-MM-DD HH:mm:ss'),
      paraIDs: []
    }

    this._rowsData.forEach((item) => {
      item.startTime = moment(this._editModalRecalculationStartTime$.data('DateTimePicker').date()).format('YYYY-MM-DD HH:mm:ss');
      item.endTime = moment(this._editModalRecalculationEndTime$.data('DateTimePicker').date()).format('YYYY-MM-DD HH:mm:ss');

      if (item.dataType) {
        if (item.dataType.toUpperCase() === 'RL') {
          _paramFill.orgIDs.push(item.orgId);
          _paramFill.paraIDs.push(item.code);
        }
        if (item.dataType.toUpperCase() === 'RT') {
          _paramRealTime.paraIDs.push(item.code);
        }
      }
    })

    const _paramSave = this._rowsData.map((item) => {
      var _obj = {
        "orgId": item.orgId,
        "code": item.code,
        "category": item.category,
        "startTime": item.startTime,
        "endTime": item.endTime
      };
      return _obj;
    })

    try {
      // 异步并发执行
      if (_paramFill.orgIDs.length && _paramRealTime.paraIDs.length) {
        const _resArr = await Promise.all([this._saveRecalculation(_paramSave), this._triggerFillRecalculation(_paramFill), this._triggerRealTimeRecalculation(_paramRealTime)]);
        if (_resArr[0].items.length && _resArr[1].state === 0 && _resArr[2].state === 0) {
          layer.msg('重算成功');
          this._editModal$.modal('hide');
        } else {
          layer.msg('重算失败')
        }
      }
      if (_paramFill.orgIDs.length > 0 && _paramRealTime.paraIDs.length === 0) {
        const _resArr = await Promise.all([this._saveRecalculation(_paramSave), this._triggerFillRecalculation(_paramFill)]);
        if (_resArr[0].items.length && _resArr[1].state === 0) {
          layer.msg('重算成功');
          this._editModal$.modal('hide');
        } else {
          layer.msg('重算失败')
        }
      }

      if (_paramFill.orgIDs.length === 0 && _paramRealTime.paraIDs.length > 0) {
        const _resArr = await Promise.all([this._saveRecalculation(_paramSave), this._triggerRealTimeRecalculation(_paramRealTime)]);
        if (_resArr[0].items.length && _resArr[1].state === 0) {
          layer.msg('重算成功');
          this._editModal$.modal('hide');
        } else {
          layer.msg('重算失败')
        }
      }

    } catch (error) {
      layer.msg('重算失败');
    }
  }

  // 存储重算数据
  async _saveRecalculation(data) {
    const _config = {
      url: `${businessPrefix}/indexrecalculation`,
      method: 'post',
      data: data
    }
    return await sendRequest(_config);
  }

  // 触发填报计算重算
  async _triggerFillRecalculation(data) {
    const _config = {
      url: `${baseCalcUrl}/calculation-indicator/nonrealtimerecalc`,
      method: 'post',
      data: data
    }
    return await sendRequest(_config);
  }

  // 触发实时计算重算
  async _triggerRealTimeRecalculation(data) {
    const _config = {
      url: `${baseCalcUrl}/calculation-indicator/realtimerecalc`,
      method: 'post',
      data: data
    }
    return await sendRequest(_config);
  }

  // 事件绑定
  _initEventBind() {
    // 编辑模态框初始化
    this._initEditModal();
    // 编辑模态框重算按钮点击
    this._editModalRecalculationBtn$.on('click', this._recalculationOperate);
  }
}
