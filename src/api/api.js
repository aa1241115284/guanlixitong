import request from './request'
import qs from 'qs'
// export var url = 'http://192.168.1.173:10003' // 张健
// export var url = 'http://192.168.1.194:10003' // 白杨
// export var url = 'http://192.168.1.108:10003/' // 费红云
export var url = 'http://192.168.1.100:32025' // 测试
export function login (parame) {
  return request.post(`${url}/login`, parame)
}
// 退出登录
export function logout (parame) {
  return request.get(`${url}/logout?${qs.stringify(parame)}`)
}
// 获取路由
export function currentMenu (parame) {
  return request.get(`${url}/setting/account/currentMenu?${qs.stringify(parame)}`)
}
// 图片上传
export function ossupload (parame) {
  return request.post(`${url}/oss/uploadBase64`, parame)
}
// 用户管理列表
export function usermanagerlist (parame) {
  return request.post(`${url}/user/manager/list`, parame)
}
// 用户管理新增
export function usermanageradd (parame) {
  return request.post(`${url}/user/manager/add`, parame)
}
// 用户管理详情
export function managerdetails (parame) {
  return request.get(`${url}/user/manager/details?${qs.stringify(parame)}`)
}

// 店铺详情
export function userorderdetails (parame) {
  return request.get(`${url}/user/manager/orderDetails?${qs.stringify(parame)}`)
}

// 支付开通订单列表
export function paymentOrderlist (parame) {
  return request.post(`${url}/payment/paymentOrder/list`, parame)
}
// 支付开通订单详情
export function paymentOrderdetails (parame) {
  return request.post(`${url}/payment/paymentOrder/details`, parame)
}
// 支付订单开通
export function operation (parame) {
  return request.post(`${url}/payment/paymentOrder/operation`, parame)
}
// 三方名称
export function getChannelMap (parame) {
  return request.post(`${url}/payment/config/getChannelMap`, parame)
}

// 建站申请订单列表
export function websitelist (parame) {
  return request.post(`${url}/website/order/list`, parame)
}
//  建站申请订单详情
export function websitedetails (parame) {
  return request.post(`${url}/website/order/details`, parame)
}
//  建站申请支付订单开通
export function websiteoperation (parame) {
  return request.post(`${url}/website/order/operation`, parame)
}
// 会员等级
export function membergetModules (parame) {
  return request.get(`${url}/member/config/getMembers?${qs.stringify(parame)}`)
}

// 公司注册订单列表
export function companyorderlist (parame) {
  return request.post(`${url}/company/order/list`, parame)
}
// 公司注册名称
// export function configgetChannelMap (parame) {
//   return request.post(`${url}/celebrity/config/getChannelMap`, parame)
// }
// 公司注册订单详情
export function companyorderdetails (parame) {
  return request.post(`${url}/company/order/details`, parame)
}
// 公司注册开通
export function companyoperation (parame) {
  return request.post(`${url}/company/order/operation`, parame)
}

// 广告开通订单列表
export function advertisingOrderlist (parame) {
  return request.post(`${url}/advertising/advertisingOrder/list`, parame)
}
// 广告开通订单详情
export function advertisingOrderdetails (parame) {
  return request.post(`${url}/advertising/advertisingOrder/details`, parame)
}
// 广告订单开通
export function advertisingOrderoperation (parame) {
  return request.post(`${url}/advertising/advertisingOrder/operation`, parame)
}
// 广告名称
export function advertisingMap (parame) {
  return request.post(`${url}/advertising/advertisingOrder/advertisingList`, parame)
}

// 网红订单列表
export function celebrityOrderlist (parame) {
  return request.post(`${url}/celebrity/celebrityOrder/list`, parame)
}
// 网红公司名称
export function configgetChannelMap (parame) {
  return request.post(`${url}/celebrity/config/getChannelMap`, parame)
}
// 网红开通订单详情
export function celebrityOrderdetails (parame) {
  return request.post(`${url}/celebrity/celebrityOrder/details`, parame)
}
// 网红开通
export function celeoperation (parame) {
  return request.post(`${url}/celebrity/celebrityOrder/operation`, parame)
}

// 支付参数配置列表
export function configlist (parame) {
  return request.post(`${url}/payment/config/list`, parame)
}
// 修改渠道商状态
export function updateStatus (parame) {
  return request.post(`${url}/payment/config/updateStatus`, parame)
}
// 新增渠道商
export function addPayment (parame) {
  return request.post(`${url}/payment/config/addPayment`, parame)
}
// 编辑渠道商回显
export function configedit (parame) {
  return request.post(`${url}/payment/config/edit`, parame)
}
// 编辑渠道商
export function configupdate (parame) {
  return request.post(`${url}/payment/config/update`, parame)
}

// 建站参数配置列表
export function websiteconfiglist (parame) {
  return request.post(`${url}/website/config/list`, parame)
}
// 建站修改状态
export function websiteStatus (parame) {
  return request.post(`${url}/website/config/updateStatus`, parame)
}
// 新增渠道商
export function websiteaddPayment (parame) {
  return request.post(`${url}/website/config/addWebsite`, parame)
}
//  建站回显
export function websiteconfigedit (parame) {
  return request.post(`${url}/website/config/edit`, parame)
}
//  建站编辑
export function websiteconfigupdate (parame) {
  return request.post(`${url}/website/config/update`, parame)
}

// 网红公司配置列表
export function celebritylist (parame) {
  return request.post(`${url}/celebrity/config/list`, parame)
}
// 修改渠道商状态
export function celebrityStatus (parame) {
  return request.post(`${url}/celebrity/config/updateStatus`, parame)
}
// 网红公司新增渠道商
export function addCelebrity (parame) {
  return request.post(`${url}/celebrity/config/addCelebrity`, parame)
}
// 网红公司编辑渠道商回显
export function celebrityedit (parame) {
  return request.post(`${url}/celebrity/config/edit`, parame)
}
// 网红公司编辑渠道商
export function celebrityupdate (parame) {
  return request.post(`${url}/celebrity/config/update`, parame)
}

// 广告参数列表
export function advertisinglist (parame) {
  return request.post(`${url}/advertising/config/list`, parame)
}
// 修改广告参数状态
export function advertisingStatus (parame) {
  return request.post(`${url}/advertising/config/updateStatus`, parame)
}
// 广告参数新增渠道商
export function addAdvertising (parame) {
  return request.post(`${url}/advertising/config/addAdvertising`, parame)
}
// 广告参数编辑渠道商回显
export function advertisingedit (parame) {
  return request.post(`${url}/advertising/config/edit`, parame)
}
// 广告参数编辑渠道商
export function advertisingupdage (parame) {
  return request.post(`${url}/advertising/config/update`, parame)
}

// 公司参数列表
export function companylist (parame) {
  return request.post(`${url}/company/config/list`, parame)
}
// 修改公司参数状态
export function companyupdateStatus (parame) {
  return request.post(`${url}/company/config/updateStatus`, parame)
}
// 公司参数新增渠道商
export function companyaddCompany (parame) {
  return request.post(`${url}/company/config/addCompany`, parame)
}
// 公司参数编辑渠道商回显
export function companyedit (parame) {
  return request.post(`${url}/company/config/edit`, parame)
}
// 公司参数编辑渠道商
export function companyconfigupdate (parame) {
  return request.post(`${url}/company/config/update`, parame)
}

// 账号费用订单列表
export function accountOrderlist (parame) {
  return request.post(`${url}/order/accountOrder/list`, parame)
}

// 账号开通审核列表
export function accountAuditlist (parame) {
  return request.post(`${url}/finance/accountAudit/list`, parame)
}
// 收款操作
export function financecollection (parame) {
  return request.post(`${url}/finance/accountAudit/collection`, parame)
}
// 详情
export function financedetails (parame) {
  return request.get(`${url}/finance/accountAudit/details?${qs.stringify(parame)}`)
}

// 会员信息配置列表
export function memberlist (parame) {
  return request.post(`${url}/member/config/list`, parame)
}
// 编辑会员配置状态
export function memberupdateStatus (parame) {
  return request.post(`${url}/member/config/updateStatus`, parame)
}
// 新增会员信息配置
export function memberadd (parame) {
  return request.post(`${url}/member/config/add`, parame)
}
// 会员信息配置编辑回显
export function membergetMemberConfig (parame) {
  return request.get(`${url}/member/config/getMemberConfig?${qs.stringify(parame)}`)
}
// 会员权益
export function configmembergetModules (parame) {
  return request.get(`${url}/member/config/getModules?${qs.stringify(parame)}`)
}
// 编辑会员信息配置
export function memberconfigedit (parame) {
  return request.post(`${url}/member/config/edit`, parame)
}
// 客户系统权限配置列表
export function modulelist (parame) {
  return request.get(`${url}/module/permission/list?${qs.stringify(parame)}`)
}
// 客户系统权限修改
export function moduleupdate (parame) {
  return request.post(`${url}/module/permission/update`, parame)
}

// 员工管理
export function settinglist (parame) {
  return request.post(`${url}/setting/account/list`, parame)
}

// 角色列表
export function rolelist (parame) {
  return request.get(`${url}/setting/account/role/list?${qs.stringify(parame)}`)
}
// 员工管理添加
export function accountadd (parame) {
  return request.post(`${url}/setting/account/add`, parame)
}
// 编辑回显
export function accountupdate (parame) {
  return request.get(`${url}/setting/account/update?${qs.stringify(parame)}`)
}
// 编辑提交
export function submupdate (parame) {
  return request.post(`${url}/setting/account/update`, parame)
}
// 冻结
export function settingfreeze (parame) {
  return request.get(`${url}/setting/account/freeze?${qs.stringify(parame)}`)
}
// 删除
export function settingdel (parame) {
  return request.get(`${url}/setting/account/del?${qs.stringify(parame)}`)
}
