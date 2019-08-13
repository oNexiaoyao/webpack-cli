/**
 * @file 数据加载提示组件
 * @author 管超
 * @created 2018-10-15T05:34:59.077Z
 */

declare const layer: any; // tslint:disable-line:no-any

export class Loading {
  private _count: number = 0;
  private _index: number;

  /**
   * 显示
   */
  public show(): void {
    if (this._count === 0) {
      this._index = layer.load(2);
    }

    this._count += 1;
  }

  /**
   * 隐藏
   */
  public hide(): void {
    if (this._count > 0) {
      this._count -= 1;
    }

    if (this._count === 0) {
      layer.close(this._index);
    }
  }
}
