import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import {
  Row,
  Col,
  InputNumber,
  Button,
  Radio,
  Checkbox,
  Input,
  Timeline,
  Icon,
  Tooltip,
  Popconfirm,
  Select
} from "antd";

import {
  addContact,
  modifyClientinfo,
  getContactCount,
  setmanager,
  setScore
} from "../../api/user";
import {
  getTable,
  userContactList,
  selectTableList,
  updata,
  showDataList
} from "../../redux/userdata.redux";
import { success, error } from '../message/message'

import Tag from '../tag/tag';
import Table from '../table/table';
import SearchInput from '../search/search';
import Addremark from '../addremark/addremark';

import './home.css';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const Option = Select.Option;

@connect(state => state.userdata, {
  getTable,
  userContactList,
  selectTableList,
  updata,
  showDataList
})
@withRouter
class Home extends React.Component {
  state = {
    current: "mail",
    data: [],
    // 联系时间 day number
    day: 7,
    // 是否联系 0 已联系 1 未联系
    value: 1,
    // 搜索标签 string
    label: null,
    // 搜索评分
    rate: '',
    rateShow: true,
    // start 分页
    start: 0,
    // length 分页长度
    length: 20,
    // 菜单栏
    sign: "all",
    // 点击的显示详细信息的电话
    phone: "",
    // 从业状态
    selectPractice: [],
    //从业状态默认选择
    checkOptionsDefaultValue: [],
    //自定义用户标签
    userTags: [],
    // 姓名备注
    nameRemark: [],
    // 电话备注
    phoneRemark: [],
    // 只看有效
    seeIsValid: true,
    // 有效沟通
    validContact: true,
    // 输入聊天内容
    msg: "",
    // 聊天列表
    contactInfo: [],
    // 筛选条件
    order: "0",
    // 每日拨打详情
    getContactCount: {},
    // 选择评分等级
    score: ""
  };

  componentDidMount() {
    getContactCount().then(res => {
      if (res.data.code === 0) {
        this.setState({
          getContactCount: res.data.data
        });
      }
    });
  }

  // 联系时间事件
  onChange(value) {
    this.setState({
      day: value
    });
  }

  cancel(e) {
    e.target.blur()
    this.setState({ rate: '', Show: false })
    setTimeout(() => {
      this.setState({ rateShow: true })
    }, 0)
  }

  //搜索：选择评分等级
  changeRate(e) {
    this.setState({
      rate: e.target.value
    })
    if (e.target.value == '') {
      this.setState({ rateShow: false })
      setTimeout(() => {
        this.setState({ rateShow: true })
      }, 0)
    }
  }

  // 搜索所有数据
  searchAllData() {
    const label = this.state.label ? this.state.label.join(",") : null;
    const data = {
      label,
      day: this.state.day,
      contact: this.state.value,
      start: this.state.start,
      length: this.state.length,
      sign: this.props.urlPath,
      order: this.state.order
    };
    //搜索条件里是否有客户分级
    this.state.rate
      ? Object.assign(data, {
        rate: this.state.rate
      })
      : false
    //所搜条件是否为全部，是的话参数不传天和已联系未联系
    this.state.value == 'all'
      ? data.day = data.contact = null
      : false


      console.log(data)
    this.props.getTable(data);
  }
  // 搜索电话号码
  searchPhone(data) {
    if (data.length < 8) {
      error("电话搜索必须满足8位以上");
      return;
    }
    const dataList = {
      phone: data,
      sign: null
    };
    this.props.getTable(dataList, true);
  }
  closeSearch() {
    this.props.getTable(null, false, true)
  }
  // 筛选条件
  selectHandleChange(value) {
    this.setState({
      order: value.key
    });
    const label = this.state.label ? this.state.label.join(",") : null;
    const data = {
      label,
      day: this.state.day,
      contact: this.state.value,
      start: this.state.start,
      length: this.state.length,
      sign: this.props.urlPath,
      order: value.key
    };
    this.props.getTable(data);
  }
  // tag组件传递自定义标签
  handleInputConfirm(tags) {
    // tags = tags.join(',')
    this.setState({
      label: tags
    })
  }

  // 从业状态
  selectPractice(v) {
    this.props.updata(v, "checkOptionsDefaultValue");
    const { practiceStatuses } = this.props.clientInfo;
    let data = [];
    for (let i = 0; i < v.length; i++) {
      practiceStatuses.filter(val => val.value === v[i] && data.push(val.id));
    }
    this.props.updata(data, "selectPractice");
    this.setState({
      selectPractice: data,
      checkOptionsDefaultValue: v
    });
  }

  // 右侧自定义标签
  rightHandleInputConfirm(tags) {
    this.props.updata(tags, "labels");
    this.setState({
      userTags: tags
    });
  }
  // 只看有效
  changeSeeIsValid(e) {
    const phone = this.props.selectUserPhone;
    const status = e.target.checked ? 1 : 0;
    this.setState({
      seeIsValid: e.target.checked
    });
    this.props.userContactList(phone, status);
  }
  // 有效沟通
  changeValidContact(e) {
    this.setState({
      validContact: e.target.checked
    });
  }

  // 姓名备注
  nameRemark(val) {
    this.setState({
      nameRemark: val
    });
  }

  // 电话备注
  phoneRemark(val) {
    this.setState({
      phoneRemark: val
    });
  }

  // 聊天备注输入框
  onBlurTextareaVal = e => {
    this.setState({ msg: e.target.value });
  };

  // 确定提升为店长
  onConfirm(e) {
    const phone = this.props.selectUserPhone;
    const openid = this.props.clientInfo.openid;
    setmanager({ phone, openid }).then(res => {
      if (res.data.code === 0) {
        success("成功！");
        setTimeout(() => {
          this.props.showDataList(phone);
        }, 200);
      }
    });
  }

  // 选择评分等级
  checkedScore(e) {
    if (e.target.checked) {
      this.props.updata(e.target.value, "checkedScore");
      this.setState({
        score: e.target.value
      });
    }
  }

  // 提交添加更改信息
  addContact() {
    const phone = this.props.selectUserPhone;
    const score = this.props.clientInfo.checkedScore;
    const userTags = this.props.clientInfo.labels;
    const selectPractice = this.props.clientInfo.selectPractice;
    const status = this.state.validContact ? 1 : 0;

    const {
      msg,
      nameRemark,
      phoneRemark
    } = this.state;
    if (status) {
      if (!msg) {
        error("有效沟通内容不能为空！");
        return;
      }
    }
    if (score) {
      setScore({ phone, score }).then(res => {
        console.log(res);
      });
    }
    const data = {
      status,
      phone,
      msg
    };
    addContact(data).then(res => {
      if (res.data.code === 0) {
        success(res.data.msg);
        this.props.userContactList(phone, status);
        status && this.props.selectTableList(phone, msg);
        this.setState({ msg: "" });
      } else {
        error(res.data.msg);
      }
    });
    const modifyData = {
      phone,
      addPractice: selectPractice,
      addLabel: userTags,
      boardRemark: {
        nameRemark: nameRemark[0] || "",
        phoneRemark: phoneRemark[0] || ""
      }
    };
    modifyClientinfo(modifyData).then(res => {
      if (res.data.code === 0) {
      } else {
        error(res.data.msg);
      }
    })
    this.setState({
      msg: "",
      nameRemark: [],
      phoneRemark: []
    });
  }

  render() {
    if (!this.props.clientInfo && !this.props.clientInfo.phone) {
      return null;
    }
    const clientInfo = this.props.clientInfo;
    const contactInfo = this.props.contactList;
    return (
      <div className="home-page">
        <Row className="home-page-top">
          {this.state.getContactCount.dataTime != null ? (
            <Row style={{ borderBottom: '1px dashed #ccc' }}>
              <Col span={1} />
              <Col span={243}>
                {this.state.getContactCount.dataTime} 更新：昨日已联系<span
                  style={{ color: "red" }}
                >
                  {this.state.getContactCount.yesterday}
                </span>人，今日已联系<span style={{ color: "red" }}>
                  {this.state.getContactCount.today}
                </span>人； &nbsp;&nbsp;系统推荐您<span
                  style={{ color: "red" }}
                >
                  {this.state.getContactCount.commend}
                </span>人,还有<span style={{ color: "red" }}>
                  {this.state.getContactCount.contcat}
                </span>人未回访
              </Col>
            </Row>
          ) : (
              <Row>
                <Col span={1} />
                <Col span={23}>正在获取...</Col>
              </Row>
            )}

          <Col span={24} style={{ padding: "5px 0" }}>
            <Row>
              <Col span={2} className="font-color">
                标签：
              </Col>
              <Col span={21}>
                <Tag handleInputConfirm={this.handleInputConfirm.bind(this)} />
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ paddingTop: 10, paddingBottom: 10, width: 350, position: 'absolute', top: -39, left: 580 }}>
                  <Col span={6} className="font-color">
                    客户分级：
                  </Col>
                  {
                    this.state.rateShow ?
                      <RadioGroup value={this.state.rate} onChange={(e) => this.changeRate(e)}>
                        <RadioButton value="A">A</RadioButton>
                        <RadioButton value="B">B</RadioButton>
                        <RadioButton value="C">C</RadioButton>
                        <RadioButton value="D">D</RadioButton>
                        <Button icon='close' style={{ marginLeft: 10 }} onClick={(e) => this.cancel(e)}></Button>
                      </RadioGroup>
                      : null
                  }
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={2} className="font-color">
                联系时间：
              </Col>
              <Col span={21}>
                {
                  this.state.value == 'all'
                    ?
                    <Col span={2}>
                      全部
              </Col>
                    : <div>
                      <Col span={1}>最近</Col>
                      <Col span={2}>
                        <InputNumber
                          style={{ width: "70px" }}
                          min={0}
                          max={30}
                          size={5}
                          value={this.state.day}
                          onChange={val => this.onChange(val)}
                        />{" "}
                      </Col>
                      <Col span={1}> 天</Col>
                    </div>
                }
                <Col span={7}>
                  <RadioGroup
                    onChange={e =>
                      this.setState({
                        value: e.target.value
                      })
                    }
                    value={this.state.value}
                  >
                    <Radio value={1}>未联系</Radio>
                    <Radio value={0}>已联系</Radio>
                    <Radio value={'all'}>全部</Radio>
                  </RadioGroup>
                </Col>
                <Col span={2} style={{ position: 'absolute', top: -13, left: 400 }}>
                  <Button onClick={() => this.searchAllData()}>搜索</Button>
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <div className="home-page-top">
              <Row style={{ paddingTop: 5, paddingBottom: 5 }}>
                <Col span={4} className="font-color">
                  联系手机:
                </Col>
                <Col span={12}>
                  <SearchInput
                    closeSearch={this.closeSearch.bind(this)}
                    searchPhone={this.searchPhone.bind(this)}
                  />
                </Col>
                <Col span={1} className="font-color" />
                <Col span={5} className="font-color">
                  <Select
                    labelInValue
                    defaultValue={{ key: "0" }}
                    style={{ width: 110 }}
                    onChange={value => this.selectHandleChange(value)}
                  >
                    <Option value="0">活跃度</Option>
                    <Option value="1">
                      联系时间 <Icon type="arrow-up" />
                    </Option>
                    <Option value="2">
                      联系时间 <Icon type="arrow-down" />
                    </Option>
                  </Select>
                </Col>
              </Row>
              <Table order={this.state.order} />
            </div>
            <div className="xianxia">
              <p>线下资料</p>
              <div>
                <div>
                  <p className="font-color">姓名</p>{" "}
                  <span> {clientInfo.offlineName}</span>
                </div>
                <div>
                  <p className="font-color">工龄</p>{" "}
                  <span> {clientInfo.workYears}</span>
                </div>
                <div>
                  <p className="font-color">公司</p>{" "}
                  <span> {clientInfo.com}</span>
                </div>
                <div>
                  <p className="font-color">门店</p>{" "}
                  <span> {clientInfo.storeName}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col span={14}>
            <div className="home-page-right">
              <Row className="item-height">
                <Col span={8}>
                  <span className="font-color">注册时间：</span>
                  <span className="font-size">{clientInfo.enrolTime}</span>
                </Col>
                <Col span={8}>
                  <span className="font-color">业务管家：</span>
                  <span className="font-size">{clientInfo.managername}</span>
                </Col>
                <Col span={8}>
                  <span className="font-color">取关时间：</span>
                  <span className="font-size">
                    {clientInfo.unsubscribeTime}
                  </span>
                </Col>
              </Row>
              <Row className="item-height">
                <Col span={8}>
                  <span className="font-color">最后登录：</span>
                  <span className="font-size">{clientInfo.loginTime}</span>
                </Col>
                <Col span={8}>
                  <span className="font-color">最后报备：</span>
                  <span className="font-size">{clientInfo.reportTime}</span>
                </Col>
                <Col span={8}>
                  <span className="font-color">最后带看：</span>
                  <span className="font-size">{clientInfo.lookTime}</span>
                </Col>
              </Row>
              <div
                style={{
                  borderTop: "1px dashed #cdcfce",
                  margin: "5px 0 5px -8px"
                }}
              />
              <Row className="item-height">
                <Col span={3} className="font-color">
                  业务概览:{" "}
                </Col>
                <Col span={21} className="font-size">
                  {clientInfo.business}
                </Col>
              </Row>
              <Row className="item-height">
                <Col span={3} className="font-color">
                  最多浏览:{" "}
                </Col>
                <Col span={21} className="font-size">
                  {clientInfo.projectCount
                    ? clientInfo.projectCount.map(
                      v =>
                        v !== null && (
                          <span key={v} style={{ marginRight: 10 }}>
                            {v}
                          </span>
                        )
                    )
                    : null}
                </Col>
              </Row>
              <Row className="item-height">
                <Col span={3} className="font-color">
                  最近浏览:{" "}
                </Col>
                <Col span={21} className="font-size">
                  {clientInfo.recentProject
                    ? clientInfo.recentProject.map(
                      v =>
                        v !== null && (
                          <span key={v} style={{ marginRight: 10 }}>
                            {v}
                          </span>
                        )
                    )
                    : null}
                </Col>
              </Row>
              <Row className="item-height">
                <Col span={3} className="font-color">
                  筛选区域:{" "}
                </Col>
                <Col span={21} className="font-size">
                  {clientInfo.area
                    ? clientInfo.area.split(",").map(v => {
                      return (
                        <span key={v} style={{ marginRight: 10 }}>
                          {v}
                        </span>
                      );
                    })
                    : null}
                </Col>
              </Row>
            </div>
            <Col
              style={{
                marginLeft: 5,
                background: "#fff",
                padding: "10px 0 10px 10px"
              }}
            >
              <Row>
                <Col span={3} className="font-color">
                  从业状态：
                </Col>
                <Col span={21}>
                  {clientInfo.practiceStatuses &&
                    clientInfo.practiceStatuses.length > 0 ? (
                      <CheckboxGroup
                        options={clientInfo.practiceStatuses}
                        value={clientInfo.checkOptionsDefaultValue}
                        onChange={this.selectPractice.bind(this)}
                      />
                    ) : null}
                </Col>
              </Row>
              <Row>
                <Col span={3} className="font-color">
                  自定标签：
                </Col>
                <Col span={21}>
                  <Tag
                    labels={clientInfo.labels || []}
                    rightHandleInputConfirm={this.rightHandleInputConfirm.bind(
                      this
                    )}
                  />
                </Col>
              </Row>
              {/* <Row style={{ marginLeft: -10, padding: "3px 0 3px 10px", background: "#f9f9f9" }}>
                <Col span={19}>新增回访</Col>
                <Col span={5}>
                  <Checkbox disabled={!clientInfo.phone} checked={this.state.seeIsValid} onChange={this.changeSeeIsValid.bind(this)}>
                    只看有效
                  </Checkbox>
                </Col>
              </Row> */}
              <div
                style={{
                  borderTop: "1px dashed #cdcfce",
                  margin: "5px 0 5px -8px"
                }}
              />
              <Row>
                <Col span={11}>
                  <Col span={15}>
                    <p>
                      <span className="font-color">姓名</span>：{
                        clientInfo.username
                      }
                    </p>
                  </Col>
                  <Col span={9}>
                    <Addremark
                      data={{ name: "姓名", label: this.state.nameRemark }}
                      remark={this.state.nameRemark}
                      remarkFunc={this.nameRemark.bind(this)}
                    />
                  </Col>
                </Col>
                <Col span={13}>
                  <Col span={15}>
                    <span className="font-color">手机</span>：{clientInfo.phone}
                  </Col>
                  <Col span={9}>
                    <Addremark
                      data={{ name: "手机", label: this.state.phoneRemark }}
                      remark={this.state.phoneRemark}
                      remarkFunc={this.phoneRemark.bind(this)}
                    />
                  </Col>
                </Col>
              </Row>
              <Row style={{ paddingTop: 10 }}>
                <Col span={15} style={{ marginRight: "10px" }}>
                  <TextArea
                    rows={6}
                    value={this.state.msg}
                    onChange={this.onBlurTextareaVal.bind(this)}
                    placeholder="限500个字符内"
                  />
                </Col>
                <Col span={8}>
                  <Row style={{ paddingTop: 10 }}>
                    <Col span={24}>
                      <span className="font-color">身份: </span>
                      <span className="font-size">{clientInfo.store}</span>
                      <span style={{ paddingLeft: "5px" }} />
                      {clientInfo.store === "店长" ? (
                        <span className="font-size" style={{ color: "#ccc" }}>
                          ({clientInfo.managerTime})
                        </span>
                      ) : (
                          ""
                        )}
                      {clientInfo.store === "店员" ? (
                        <Popconfirm
                          onConfirm={e => this.onConfirm(e)}
                          title="确认升为店长? "
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button size="small">提升</Button>
                        </Popconfirm>
                      ) : (
                          ""
                        )}
                    </Col>
                  </Row>
                  <div style={{ paddingTop: 10 }}>
                    <span className="font-color">评分: </span>
                    <RadioGroup
                      className="radio-style"
                      value={clientInfo.checkedScore}
                      onChange={e => this.checkedScore(e)}
                      size="default"
                    >
                      {clientInfo.score
                        ? clientInfo.score.map(v => {
                          return (
                            <Tooltip
                              key={v.key}
                              placement="topLeft"
                              title={v.msg}
                            >
                              <RadioButton
                                className="radio-style-lable"
                                value={v.key}
                              >
                                {v.key}
                              </RadioButton>
                            </Tooltip>
                          );
                        })
                        : ""}
                    </RadioGroup>
                  </div>
                  <div style={{ paddingTop: 10 }}>
                    <Button
                      type="primary"
                      disabled={!clientInfo.phone}
                      size="large"
                      onClick={() => this.addContact()}
                    >
                      提交
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row style={{ paddingTop: 30 }}>
                {contactInfo.length > 0 ? (
                  <Timeline>
                    {contactInfo.map((v, i) => (
                      <Timeline.Item
                        key={i}
                        color={v.status === 1 ? "#449bf6" : "#fe0101"}
                      >
                        <Row>
                          <Col span={12} className="font-color">
                            {v.create_time}
                          </Col>
                          <Col span={12}>
                            <span className="font-color">回访人：</span>
                            {v.username}
                          </Col>
                        </Row>
                        <Row>
                          <Col className="user-info-msg" span={18}>
                            <p>{v.msg}</p>
                          </Col>
                          <Col span={6} />
                        </Row>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                ) : null}
              </Row>
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
