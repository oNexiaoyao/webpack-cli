/**
 * @file 事件的订阅与发布
 * @author 甘露平
 */

export class Event {

  constructor(eventName) {
    this._name = eventName;
    this._callBacks = [];
  }

  // 增加事件
  addHandler(cb) {
    this._callBacks.push(cb);
  }

  // 移除事件
  removeHandler(cb) {
    this._callBacks.forEach((value, index) => {
      if(value === cb) {
        this._callBacks.splice(index, 1);
      }
    });
  }

  // 针对订阅的事件进行发布
  raise(...param) {
    for (let i = 0, count = this._callBacks.length; i < count; i++) {
      this._callBacks[i](...param);
    }
  }

  // 针对异步事件进行发布并返回值
  async raiseAsync(...param) {
    let res = [];
    let reqArr = this._callBacks.map(
      async callBack => {
        return await callBack(...param);
      }
    );
    for (let i = 0; i < reqArr.length; i++) {
      res[i] = reqArr[i];
    }

    return res;
  }
}
