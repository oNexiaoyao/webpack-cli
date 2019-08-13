/**
 * @file 创建 Excel 表格
 * @author 甘露平
 */
/**
 * Excel 后台请求参数模型
 */
export interface IExcelIM {
  /**
   * 文件名
   */
  fileName: string;
  /**
   * 查询时间
   */
  time: string;
  /**
   * 总行数
   */
  maxRowCount: number;
  /**
   * 单元格数据
   */
  data: ICellIM[];
}

export interface IExcelOM {
  /**
   * 模块名
   */
  // tslint:disable-next-line
  module: string;
  /**
   * 文件名
   */
  fileName: string;
  /**
   * 下载文件名
   */
  downLoadFileName: string;
  /**
   * 文件名后缀
   */
  suffix: string;
}

/**
 * 单元格模型
 */
export interface ICellIM {
  /**
   * 行索引
   */
  rowIndex: number;
  /**
   * 列索引
   */
  cellIndex: number;
  /**
   * 内容
   */
  content: string | null;
  /**
   * 合并单元格行数
   */
  rowCount: number;
  /**
   * 合并单元格列数
   */
  colCount: number;
}
