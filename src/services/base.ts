/**
 * @file 服务通用方法
 * @author 管超
 * @created 2018-10-11T08:34:17.596Z
 * @updated 2018-10-15T10:42:52.412Z
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { IDictionaryLite } from '../models/DictionaryLite';
import { IOrganization } from '../models/Organization';
import { IDataBag } from '../models/DataBag';
import { IExcelIM, IExcelOM } from '../models/Excel';
import { IRequestConfig } from '../models/Request';
import {
  IDutyIM,
  IDutyOM,
  IPersonScoreAndRankIM,
  IPersonScoreAndRankOM,
  IScheduleIM,
  IScheduleOM
} from '../models/IndexEvaluation/index';

// tslint:disable-next-line
declare const baseConfig: any;
// tslint:disable-next-line
declare const layer: any;

/**
 * 基地址
 */
export let baseUrl: string = baseConfig.baseUrl;

/**
 * 系统部分接口地址前缀
 */
export let systemPrefix: string = baseConfig.systemPrefix;

/**
 * 业务部分接口地址前缀
 */
export let businessPrefix: string = baseConfig.businessPrefix;

/**createFlowNodeForRecord
 * 基地址 首页跳新能源专用
 */
export let xnybaseUrl: string = baseConfig.xnybaseUrl;

/**
 * 系统部分接口地址前缀 首页跳新能源专用
 */
export let xnysystemPrefix: string = baseConfig.xnysystemPrefix;

/**
 * 业务部分接口地址前缀 首页跳新能源专用
 */
export let xnybusinessPrefix: string = baseConfig.xnybusinessPrefix;

/**
 * 业务后台指标计算服务接口
 */
export let baseCalcUrl: string = baseConfig.baseCalcUrl;

/**
 * 令牌 key 值
 */
const tokenKey: string = baseConfig.tokenKey;


/**
 * 存储令牌以供备用
 *
 * @remark
 * 测试期间每天更换一次
 */
// tslint:disable-next-line
export let token: string | undefined = "";

// tslint:disable
// (() => {
//   axios.get('./config.json')
//     .then((response: AxiosResponse<any>) => {
//       const appConfig: any = response.data;
//       baseUrl = appConfig.url.base;
//       systemPrefix = appConfig.url.system;
//       businessPrefix = appConfig.url.business;
//     })
//     .catch((error: AxiosError) => {
//       console.error(error);
//     });
// })();
// tslint:enable

/**
 * 从 cookie 中读取令牌字符串
 */
export function getToken(): string | undefined {
  if (token) {
    return token;
  }

  if (tokenKey === 'accessToken' || tokenKey === 'waterpowerAccessToken') {
    // .Net 平台三合一发布
    const tokenStr: string | null = window.localStorage.getItem(tokenKey);
    if (tokenStr) {
      token = tokenStr;
      return token;
    }
  } else {
    const tokenStr: string | null = window.localStorage.getItem(tokenKey);
    // react 平台单独发布
    if (tokenStr) {
      const tokenObj: any = JSON.parse(tokenStr); // tslint:disable-line
      if (tokenObj.access_token) {
        token = tokenObj.access_token;
        return token;
      }
    }
  }
  return undefined;
}

/**
 * 获取基础请求配置
 */
export function getBaseRequestConfig(): AxiosRequestConfig {
  // 设置基地址
  const config: AxiosRequestConfig = {
    baseURL: baseUrl
  };

  // 参见：https://github.com/axios/axios/issues/679
  // config.withCredentials = true;

  // 设置令牌信息
  const token: string | undefined = getToken(); // tslint:disable-line
  if (token) {
    config.headers = {
      ...config.headers, ...{
        'Authorization': `Bearer ${token}` // tslint:disable-line
      }
    };
  }

  return config;
}

/**
 * 生成查询字符串
 *
 * @param query - 查询条件对象
 */
// tslint:disable-next-line:no-any
export function generateQueryString(query?: { [field: string]: any }): string {
  let queryString: string = '';

  if (query) {
    // tslint:disable
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        queryString += `;${key}=${query[key]}`;
      }
    }
    // tslint:enable
  }

  return queryString;
}

/**
 * 根据类别获取字典列表
 *
 * @param category - 类别
 */
export function getDictionaryLite(category: string): Promise<IDictionaryLite[]> {
  if (!category) {
    return Promise.resolve([]);
  }

  const requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  requestConfig.url = `${systemPrefix}/dictionaries?category=${category}`;
  requestConfig.method = 'get';

  return axios.request<IDataBag<IDictionaryLite>>(requestConfig)
    .then(
      (response: AxiosResponse<IDataBag<IDictionaryLite>>) => {
        return Promise.resolve(response.data.items);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
}

/**
 * 获取当前用户场站编码
 */
export function getCurrentUserStationCode(): Promise<string | null> {
  const requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  requestConfig.url = `${systemPrefix}/organizations/staff`;
  requestConfig.method = 'get';

  return axios.request<{ category: string; code: string }[]>(requestConfig)
    .then(
      (response: AxiosResponse<{ category: string; code: string }[]>) => {
        if (response.data && response.data.length > 0) {
          const station: {
            category: string;
            code: string;
          } | undefined = response.data.find((item: { category: string; code: string }): boolean => {
            return item.category === 'ORG-STATION';
          });

          if (station) {
            return Promise.resolve(station.code);
          }
        }
        return Promise.resolve(null);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
}

/**
 * 上传文件
 *
 * @param files - 文件表单数据
 * @param moduleName - 模块名称
 */
export function uploadFiles(files: FormData, moduleName: string): Promise<string[]> {
  const requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  requestConfig.url = `${businessPrefix}/file/${moduleName}`;
  requestConfig.method = 'post';
  requestConfig.data = files;
  requestConfig.headers = {
    ...requestConfig.headers, ...{
      'content-type': 'multipart/form-data'
    }
  };

  return axios.request<string[]>(requestConfig)
    .then(
      (response: AxiosResponse<string[]>) => {
        return Promise.resolve(response.data);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
}


/**
 * 获取组织机构
 */
export function getOrganizationChildren(code: string, level: number): Promise<IOrganization[]> {
  const _requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  if (!code) {
    return Promise.resolve([]);
  }

  return axios.get<IDataBag<IOrganization>>(`${systemPrefix}/organizations/${code}/children/${level}`, _requestConfig)
    .then(
      (response: AxiosResponse<IDataBag<IOrganization>>) => {
        return Promise.resolve(response.data.items);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

}

/**
 * 获取区域
 */
export function getOrganizationArea(): Promise<IOrganization[]> {
  const _requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  return axios.get<IDataBag<IOrganization>>(`${systemPrefix}/organizations/category/ORG-CAT-QY`, _requestConfig)
    .then(
      (response: AxiosResponse<IDataBag<IOrganization>>) => {
        return Promise.resolve(response.data.items);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

}

/**
 * 根据当前用户令牌获取区域
 */
export function getOrganizationAreByCurrentUser(): Promise<IOrganization[]> {
  const _requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  return axios.get<IDataBag<IOrganization>>(`${systemPrefix}/organizations/employee`, _requestConfig)
    .then(
      (response: AxiosResponse<IDataBag<IOrganization>>) => {
        if (response.data && response.data.length > 0) {
          const areas: IOrganization[] = response.data.filter((item: IOrganization): boolean => {
            return item.category === 'ORG-CAT-QY';
          });
          return Promise.resolve(areas);
        } else {
          return Promise.resolve([]);
        }
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
}

/**
 * 获取对象类别
 * @param powerStationCode 电厂编码
 */
export function getObjectCategory(powerStationCode: string): Promise<IDictionaryLite[]> {
  const _requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  return axios.get<IDataBag<IDictionaryLite>>(`${systemPrefix}/dictionaries/${powerStationCode}`, _requestConfig)
    .then(
      (response: AxiosResponse<IDataBag<IDictionaryLite>>) => {
        if (response.data && response.data.items.length > 0) {
          return Promise.resolve(response.data.items);
        } else {
          return Promise.resolve([]);
        }
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
}

/**
 * 根据对象类别获取对象
 * @param powerStationCode 电厂编码
 */
export function getObjectByObjectCategory(powerStationCode: string, categoryCode: string): Promise<IOrganization[]> {
  const _requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  return axios.get<IDataBag<IOrganization>>(`${systemPrefix}/organizations/${powerStationCode}/children/1/${categoryCode}`, _requestConfig)
    .then(
      (response: AxiosResponse<IDataBag<IOrganization>>) => {
        if (response.data && response.data.items.length > 0) {
          return Promise.resolve(response.data.items);
        } else {
          return Promise.resolve([]);
        }
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
}

/**
 * 获取操作权限码
 */
export function getPermissionCode(param: { permissionCodes: string[] }): Promise<{ [props: string]: boolean }> {
  const _requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  return axios.post<{ [props: string]: boolean }>('/waterpowerauth/resourceAuth', param, _requestConfig)
    .then(
      (response: AxiosResponse<{ [props: string]: boolean }>) => {
        return Promise.resolve(response.data);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
}

/**
 * 创建 excel 表格
 */
export function createExcel(param: IExcelIM): Promise<IExcelOM> {
  const _requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  return axios.post<IExcelOM>(`${businessPrefix}/file/createExcel`, param, _requestConfig)
    .then(
      (response: AxiosResponse<IExcelOM>) => {
        return Promise.resolve(response.data);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
}
/**
 * http请求
 * @param config request通用配置参数
 */
// tslint:disable-next-line
export async function sendRequest(config: IRequestConfig): Promise<any> {
  const _requestConfig: AxiosRequestConfig = getBaseRequestConfig();
  for (const key of Object.keys(config)) {
    _requestConfig[key] = config[key];
  }
  // tslint:disable-next-line
  return axios.request(_requestConfig)
    .then((response: AxiosResponse) => {
      return Promise.resolve(response.data);
    })
    .catch((error: AxiosError) => {
      return Promise.reject(error);
    });
}

// 根据类别获取机组
// tslint:disable-next-line
export async function getUnitsByCategory(): Promise<any> {
  try {
    const _config: IRequestConfig = {
      url: `${systemPrefix}/organizations/category/FAC-UNIT`,
      method: 'get'
    };
    return await sendRequest(_config);
  } catch (error) {
    layer.msg('获取机组失败');
  }
}

// 根据类别获取机组
// tslint:disable-next-line
export async function getOrganizationByCategory(category: string): Promise<any> {
  try {
    const _config: IRequestConfig = {
      url: `${systemPrefix}/organizations/category/${category}`,
      method: 'get'
    };
    return await sendRequest(_config);
  } catch (error) {
    layer.msg('组织机构失败');
  }
}

// 根据日期类别和时间查询班值
export async function getDutiesByCategoryAndTime(param: IDutyIM): Promise<IDutyOM[] | undefined> {
  try {
    const _config: IRequestConfig = {
      url: `${businessPrefix}/duties`,
      method: 'post',
      data: param
    };
    const _duties: IDataBag<IDutyOM> = await sendRequest(_config);
    if (param.timeType !== 'DAY') {
      // tslint:disable-next-line
      const _obj: any = {};
      return _duties.items.reduce(
        (pre: IDutyOM[], cur: IDutyOM) => {
          // tslint:disable-next-line
          _obj[cur.dutyId] ? '' : _obj[cur.dutyId] = true && pre.push(cur);
          return pre;
        },
        []);
      // return _dutyArr;
    } else {
      return _duties.items;
    }
  } catch (error) {
    layer.msg('获取班值失败');
  }
}

// 查询人员个人日总得分及排名
export async function getPersonDayTotalScoreAndRank(param: IPersonScoreAndRankIM): Promise<IPersonScoreAndRankOM[] | undefined> {
  try {
    const _config: IRequestConfig = {
      url: `${businessPrefix}/scorerankdetail/daytotalscorelist`,
      method: 'post',
      data: param
    };
    const _personDayTotalScoreAndRank: IDataBag<IPersonScoreAndRankOM> = await sendRequest(_config);
    return _personDayTotalScoreAndRank.items;
  } catch (error) {
    layer.msg('获取得分失败');
  }
}

// 查询人员个人月总得分及排名
export async function getPersonMonthTotalScoreAndRank(param: IPersonScoreAndRankIM): Promise<IPersonScoreAndRankOM[] | undefined> {
  try {
    const _config: IRequestConfig = {
      url: `${businessPrefix}/scorerankdetail/monthtotalscorelist`,
      method: 'post',
      data: param
    };
    const _personDayTotalScoreAndRank: IDataBag<IPersonScoreAndRankOM> = await sendRequest(_config);
    return _personDayTotalScoreAndRank.items;
  } catch (error) {
    layer.msg('获取得分失败');
  }
}

// 获取排班表配置
export async function getStaffSchedule(param: IScheduleIM): Promise<IScheduleOM[] | undefined> {
  try {
    const _config: IRequestConfig = {
      url: `${businessPrefix}/scheduling/user`,
      method: 'post',
      data: param
    };
    const _staffSchedule: IDataBag<IScheduleOM> = await sendRequest(_config);
    return _staffSchedule.items;
  } catch (error) {
    layer.msg('获取人员失败');
  }
}
