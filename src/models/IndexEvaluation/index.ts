/**
 * 小指标考核
 */

/**
 * 请求班值参数模型
 *
 * @interface IDutyIM
 */
interface IDutyIM {
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
  // 时间类别
  timeType: 'DAY' | 'MONTH';
}

/**
 * 班值模型
 *
 * @interface IDutyOM
 */
interface IDutyOM {
  // ？
  classId: string;
  // 班值id
  dutyId: string;
  // 结束时间
  endTime: string;
  // 开始时间
  startTime: string;
}

/**
 * 请求个人每天得分及排名模型
 *
 * @interface IPersonScoreAndRankIM
 */
interface IPersonScoreAndRankIM {
  // 用户 id
  userId: string[];
  // 班值编码
  dutyCode: string[];
  // 指标分类编码
  paraCategoryCode: string[];
  // 状态？
  paraState: number;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
}

/**
 * 个人每天得分及排名数据返回模型
 *
 * @interface IPersonScoreAndRankOM
 */
interface IPersonScoreAndRankOM {
  // 班值编码
  dutyCode: string;
  // 班值描述
  dutyName: string;
  // 得分
  score: number;
  // 排名
  sort: number;
  // 开始时间
  startTime: string;
  // 结束时间
  endTime?: string;
  // 用户 id
  userId: string;
  // 用户名
  userName: string;
}

/**
 * 请求人员排班表
 *
 * @interface IScheduleIM
 */
interface IScheduleIM {
  // 开始时间
  startTime: string;
  // 结束时间
  endTime: string;
  // 班值编码
  dutyId: string[];
}

/**
 * 人员排班表返回模型
 *
 * @interface IScheduleOM
 */
interface IScheduleOM {
  // 人员 id
  id: string;
  // 真实姓名
  realName: string;
}

export {
  IDutyIM,
  IDutyOM,
  IPersonScoreAndRankIM,
  IPersonScoreAndRankOM,
  IScheduleIM,
  IScheduleOM
};
