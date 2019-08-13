// /**
//  * @file 页面表格绘制
//  * @author 甘露平
//  */

// import i18nChinese from '../../../../infrastructure/datatables.net/i18n/Chinese';

// export class DataList {

//   // 初始化
//   init() {
//     // 绑定 dom
//     this.domBind();
//     // 初始化 dataTable
//     this._initDataTable();
//   }

//   // dom 结构绑定
//   domBind() {
//     this._table$ = $('#tableShow');
//   }

//   // 初始化表格
//   _initDataTable() {
//     const _tableOptions = {
//       paging: true,
//       processing: true,
//       lengthChange: true,
//       pageLength: 10,
//       searching: false,
//       info: true,
//       ordering: false,
//       stateSave: true,
//       dom: '<"row"<"col-sm-6"f>>' + '<"row"<"col-sm-12"tr>>' + '<"row"<"col-sm-5"i><"col-sm-7"lp>>',
//       language: i18nChinese,
//       columnDefs: [0, 1, 2, 3, 4, 5].map((item, columnIndex) => {
//         const def = {
//           targets: columnIndex,
//           width: undefined
//         };
//         if (columnIndex === 0) {
//           def.width = '60px';
//         }
//         // if (columnIndex === 4 || columnIndex === 5) {
//         //   def.width = '140px';
//         // }
//         return def;
//       }),
//       columns: [
//         {
//           title: '序号',
//           render: (data, type, row, meta) => {
//             if (typeof meta.row === 'number') {
//               return `${meta.row + 1}`;
//             } else {
//               return `${meta.row[0] + 1}`;
//             }
//           }
//         },
//         {
//           title: '机组',
//           data: 'orgName',
//           createdCell: (td, cellData, rowData, rowIndex, colIndex) => {
//             if (rowIndex === 0) {
//               $(td).attr('rowspan', rowData.sumRowsLen);
//             } else {
//               $(td).remove();
//             }
//           }
//         },
//         {
//           title: '指标分类',
//           data: 'categoryName',
//           createdCell: (td, cellData, rowData, rowIndex, colIndex) => {
//             if (rowIndex === 0) {
//               $(td).attr('rowspan', rowData.sumRowsLen);
//             } else {
//               $(td).remove();
//             }
//           }
//         },
//         {
//           title: '指标名称',
//           data: 'name',
//           createdCell: (td, cellData, rowData, rowIndex, colIndex) => {
//             if (rowIndex === 0) {
//               $(td).attr('rowspan', rowData.sumRowsLen);
//             } else {
//               $(td).remove();
//             }
//           }
//         },
//         {
//           title: '重算开始时间',
//           data: 'startTime'
//         },
//         {
//           title: '重算结束时间',
//           data: 'endTime'
//         }
//       ]
//     };

//     this._table$.DataTable(_tableOptions);
//   }

//   // 获取数据渲染表格
//   setDataSource(data) {
//     const _tableRenderData = data.map((item) => {
//       item.sumRowsLen = data.length;
//       return item;
//     })
//     // 清空当前的表格数据
//     this._table$.DataTable().rows().remove();
//     // 填充新的表格数据
//     this._table$.DataTable().rows.add(_tableRenderData).draw();
//   }
// }
