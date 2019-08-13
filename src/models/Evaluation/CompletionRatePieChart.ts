/**
 * @file 完成率饼图模型
 * @author 管超
 * @created 2018-10-21T07:01:05.267Z
 */

export interface ICompletionRatePieChartItem {
  /**
   * 专业名称
   */
  name: string;

  /**
   * 未完成比率
   */
  unfinishedRate: number;

  /**
   * 已完成比率
   */
  rate: number;
}
