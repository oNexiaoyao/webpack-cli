/**
 * @author 管超
 */

/**
 * 服务数据包
 *
 * @public
 */
// istanbul ignore next
export interface IDataBag<T> {
  /**
   * 元素数组
   */
  items: T[];

  /**
   * 其余未知属性
   */
  [property: string]: any; // tslint:disable-line:no-any
}
