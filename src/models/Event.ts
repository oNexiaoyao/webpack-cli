/**
 * @author 管超
 */

export class Event {

  /**
   * The collection of callbacks witch subscribed to this event
   */
  // tslint:disable-next-line:no-any
  private _callbacks: ((...args: any[]) => void)[];

  /**
   * Event name
   */
  // tslint:disable-next-line:member-ordering
  protected _name: string;

  /**
   * Create an {@link Event} type
   *
   * @param name - Event name
   */
  public constructor(name: string) {
    this._name = name;
    this._callbacks = [];
  }

  /**
   * Add an event handler
   *
   * @param cb - The event handler
   */
  // tslint:disable-next-line:no-any
  public addHandler(cb: (...params: any[]) => void): void {
    this._callbacks.push(cb);
  }

  /**
   * Remove an event handler
   *
   * @param cb - The event handler to be removed
   */
  // tslint:disable-next-line:no-any
  public removeHandler(cb: (...params: any[]) => void): void {
    // tslint:disable-next-line:typedef
    const idx: number = this._callbacks.findIndex((item => item === cb));
    if (idx >= 0) {
      this._callbacks.splice(idx, 1);
    }
  }

  /**
   * Raise the event
   *
   * @param params - The list of parameters
   */
  // tslint:disable-next-line:no-any
  public raise(...params: any[]): void  {
    // tslint:disable-next-line:prefer-for-of no-increment-decrement
    for (let i: number = 0; i < this._callbacks.length; i++) {
      this._callbacks[i](...params);
    }
  }
}
