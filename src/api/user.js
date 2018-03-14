import http from './index';

// 获取左侧菜单
export function leftmenu() {
  const url = `/boardnew/getlablcount`;
  return http.get(url)
}

// 获取每日拨打情况
export function getContactCount() {
  const url = `/boardnew/getContactCount`;
  return http.get(url)
}

// 获取用户列表
export function getboardnewtable(data) {
  const url = `/boardnew/getboardnewtable`;
  data = data ? data : {
    phone: null,
    label: null,
    day: '7',
    start: 0,
    length: 20,
    sign: 'all'
  }
  return http.get(url, data);
}

// 获取用户信息
export function getClientInfo(phone) {
  const url = `/boardnew/getclientinfo/${phone}`;
  return http.get(url)
}

// 获取聊天消息列表
export function getContact(data) {
  const url = `/boardnew/getcontact`;
  return http.get(url, data);
}

// 添加聊天消息
export function addContact(datas) {
  const {phone, ...data} = datas
  const url = `/boardnew/addcontact/${phone}`;
  return http.get(url, data);
}

// 修改状态 标签
export function modifyClientinfo(data) {
  const url = `/boardnew/modifyclientinfo`;
  return http.post(url, data)
}

// 设置店长
export function setmanager(data) {
  const url = `/boardnew/setmanager`;
  return http.formData(url, data);
}

// 评分等级
export function setScore(data) {
  const url = `/boardnew/setscore`;
  return http.formData(url, data);
}
