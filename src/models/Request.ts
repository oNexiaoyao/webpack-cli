/**
 * @author 甘露平
 */
// tslint:disable:no-any
/**
 * axios http请求配置
 */
export interface IRequestConfig {
  // 用于请求的服务器 URL(不是 baseUrl)
  url: string;
  // 创建请求时的方法
  method: 'get' | 'delete' | 'head' | 'post' | 'put' | 'patch';
  // params 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象（plain object）或 URLSearchParams 对象
  params?: any;
  // data 是作为请求主体被发送的数据
  // 只适用于这些请求方法 'PUT','POST','PATCH'
  data?: any;
}
