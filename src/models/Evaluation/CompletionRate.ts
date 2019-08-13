/**
 * @file 整改完成率
 * @author 管超
 * @created 2018-10-18T01:37:57.396Z
 */

/**
 * 整改完成率
 */
export interface ICompletionRate {
  /**
   * 技术监督检查问题数量
   */
  total: number;

  /**
   * 目前已整改完成数量
   */
  completed: number;

  /**
   * 整改完成率
   */
  rate: string;
}
