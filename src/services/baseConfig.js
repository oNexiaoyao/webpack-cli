/**
 * @file 业务地址配置文件
 * @author 甘露平
 */

/**
 * 基地址
 */
var baseConfig = {
  // 公司地址
  // baseUrl: 'http://10.137.225.133:7080',
  // 公司公网映射地址
  // baseUrl: 'http://10.137.186.202:8091',
  // 集团地址
  // baseUrl: 'http://10.76.251.32:9050',
  // 小指标考核
  baseUrl: 'http://10.137.225.133:7088',

  //指标计算服务地址（实时库）
  baseCalcUrl: 'http://10.137.225.144:8080',


  // 系统部分接口地址前缀
  systemPrefix: '/indexevaluationhttp/api/v1',

  // 业务部分接口地址前缀
  // businessPrefix: '/waterpower/api',
  businessPrefix: '/indexevaluation/api',

  // createFlowNodeForRecord
  // 基地址 首页跳新能源专用
  xnybaseUrl: 'http://10.137.186.202:8091',

  // 系统部分接口地址前缀 首页跳新能源专用
  xnysystemPrefix: '/newenergyhttp/api/v1',

  // 业务部分接口地址前缀 首页跳新能源专用
  xnybusinessPrefix: '/newenergy/api',

  // 令牌 key 值
  tokenKey: '@sac/account-manager.token:waterpower.station'
}
