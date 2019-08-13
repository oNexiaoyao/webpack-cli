/**
 * @file 测评模型
 * @author 管超
 * @created 2018-10-17T11:52:58.912Z
 */

/**
 * 测评
 */
export interface IEvaluation {
  /**
   * 唯一性标识符
   */
  id: string;

  /**
   * 专业编码
   */
  specialityCode: string;

  /**
   * 专业名称
   */
  specialityName: string;

  /**
   * 场站编码
   */
  stationCode: string;

  /**
   * 场站名称
   */
  stationName: string;

  /**
   * 整改完成情况
   */
  completeStatus: string;

  /**
   * 完成时间
   */
  completeTime: string;

  /**
   * 发现时间
   */
  discoveryTime: string;

  /**
   * 发现问题
   */
  problem: string;

  /**
   * 问题发现者
   */
  problemReporter: string;

  /**
   * 问题发现提交时间
   */
  problemTime: string;

  /**
   * 整改备注
   */
  note: string;

  /**
   * 整改建议
   */
  suggestion: string;

  /**
   * 整改建议人
   */
  suggestionReporter: string;

  /**
   * 整改建议提交时间
   */
  suggestionTime: string;

  /**
   * 文件
   */
  files: string;

  /**
   * 区域名称
   */
  areaName: string;

  categoryCode: string;
}
