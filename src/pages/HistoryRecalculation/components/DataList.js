/**
 * @file 页面表格绘制
 * @author 甘露平
 */

import i18nChinese from '../../../infrastructure/datatables.net/i18n/Chinese';

export class DataList {
  constructor() {
    this._initEvent = this._initEvent.bind(this);
    this._selectAllRows = this._selectAllRows.bind(this);
  }

  // 初始化
  init() {
    // 绑定 dom
    this.domBind();
    // 初始化 dataTable
    this._initDataTable();
    // 初始化相关事件
    this._initEvent();
  }

  // dom 结构绑定
  domBind() {
    this._table$ = $('#tableShow');
    this._batchEditBtn$ = $('#batchEditBtn');
  }

  // 初始化表格
  _initDataTable() {
    const _tableOptions = {
      paging: true,
      processing: true,
      lengthChange: true,
      pageLength: 10,
      searching: false,
      info: true,
      ordering: false,
      stateSave: true,
      dom: '<"row"<"col-sm-6"f>>' + '<"row"<"col-sm-12"tr>>' + '<"row"<"col-sm-5"i><"col-sm-7"lp>>',
      language: {
        ...i18nChinese,
        select: {
          rows: {
            '_': '选中 %d 行'
          }
        }
      },
      columnDefs: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((item, columnIndex) => {
        const def = {
          targets: columnIndex,
          width: undefined
        };
        if (columnIndex === 0) {
          def.width = '30px';
        }
        if (columnIndex === 1) {
          def.width = '60px';
        }
        if (columnIndex === 7) {
          def.width = '100px';
        }
        if (columnIndex === 8) {
          def.width = '100px';
        }
        return def;
      }),
      columns: [
        {
          title: '',
          className: 'select-checkbox',
          render: (data, type, row, meta) => {
            return '';
          }
        },
        {
          title: '序号',
          render: (data, type, row, meta) => {
            if (typeof meta.row === 'number') {
              return `${meta.row + 1}`;
            } else {
              return `${meta.row[0] + 1}`;
            }
          }
        },
        {
          title: '机组',
          data: 'orgName'
        },
        {
          title: '指标分类',
          data: 'categoryName'
        },
        {
          title: '指标名称',
          data: 'name'
        },
        {
          title: '重算开始时间',
          data: 'id',
          render: (data) => {
            return '';
          }
        },
        {
          title: '重算结束时间',
          data: 'id',
          render: (data) => {
            return '';
          }
        },
        {
          title: '操作',
          data: 'id',
          render: (data, type, row, meta) => {
            return `<a class="detail" href="javascript:void(0);" data-toggle="modal" data-target="#editModal" data-action="row" >编辑</a>`;
          }
        },
        {
          title: '重算记录',
          data: 'id',
          render: (data, type, row, meta) => {
            return `<a class="detail" href="./historyRecalculationRecord.html?stationCode=${row.stationId}&periodCode=${row.periodId}&unitCode=${row.orgId}&indexCategoryCode=${row.category}&indexNameCode=${row.code}">查看</a>`;
          }
        }
      ],
      select: {
        style: 'multi',
        selector: 'td:first-child'
      },
      drawCallback: (setting) => {
        this._table$.DataTable().column(5).visible(false);
        this._table$.DataTable().column(6).visible(false);
      }
    };

    this._table$.DataTable(_tableOptions);
  }

  // 获取数据渲染表格
  setDataSource(data) {
    // 清空当前的表格数据
    this._table$.DataTable().rows().remove();
    // 填充新的表格数据
    this._table$.DataTable().rows.add(data).draw();
  }

  // 相关事件绑定
  _initEvent() {
    // 绑定勾选所有的复选框事件
    this._table$.on('click', 'th[class~="select-checkbox"]', this._selectAllRows);
    // 监听复选框勾选
    this._table$.DataTable().on('select', (e, dt, type, index) => {
      this._batchEditBtn$.removeAttr('disabled');
    });
    this._table$.DataTable().on('deselect', (e, dt, type, index) => {
      if (this._table$.DataTable().rows({ selected: true }).count() === 0) {
        this._batchEditBtn$.attr('disabled', 'disabled');
      }
    });
  }

  // 勾选所有复选框
  _selectAllRows() {
    if (this._table$.DataTable().rows({ selected: true }).count()) {
      $('th[class~="select-checkbox"]').parent('tr').removeClass('selected');
      this._table$.DataTable().rows().deselect();
    } else {
      $('th[class~="select-checkbox"]').parent('tr').addClass('selected');
      this._table$.DataTable().rows().select();
    }
  }
}
