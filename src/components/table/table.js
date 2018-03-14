import React from 'react';
import { connect } from 'react-redux';
import { Table, Tooltip } from "antd";

import { getTable, showDataList, userContactList, selectTableList } from '../../redux/userdata.redux';
import './table.css';

@connect(
  state => state,
  { getTable, showDataList, userContactList, selectTableList}
)
export default class Tables extends React.Component{
  state = {
    columns: [{
      title: '注册名',
      dataIndex: 'username',
      width: 80,
      render: (text, record, index) => {
        return <a className="columns-row" onClick={() => this.clickUserName(record)}>{text}</a>
      },
    }, {
      title: '电话',
      dataIndex: 'phone',
      width: 90,
      key: 'phone',
      render: (text, record, index) => {
        return <a className="columns-row" onClick={() => this.clickUserName(record)}>{text}</a>
      },
    }, {
      title: '联系时间',
      dataIndex: 'createtime',
      key: 'createtime',
      width: 95,
      render: (text, record, index) => {
        return <span className="columns-row" onClick={() => this.clickUserName(record)}>{text}</span>
      },
    }, {
      title: '联系详情',
      dataIndex: 'msg',
      key: 'msg',
      render: (text, record, index) => {
        return <Tooltip placement="topLeft" title={record.actionMsg}>
            <span className="columns-row" onClick={() => this.clickUserName(record)}>
              {text}
            </span>
          </Tooltip>;
      },
    }]
  }
  timer = null
  componentWillUnmount() {
    this.timer = null
  }

  // 点击传递电话
  clickUserName(record) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.props.selectTableList(record.phone)
      this.props.showDataList(record.phone)
      this.props.userContactList(record.phone)
    }, 300)
  }
  // 选择分页获取表格数据
  changePageGetData(page, pageSize){
    const data = {
      start: page - 1,
      length: pageSize,
      sign: this.props.userdata.urlPath,
      order: this.props.order
    }
    this.props.getTable(data)
  }
  render() {
    const { data, recordsTotal, page } = this.props.userdata
    const paginationConfig = {
      pageSize: 20,
      total: recordsTotal,
      showTotal: (total) => `共${total}位`,
      defaultCurrent: 1,
      current: page,
      onChange: (page, pageSize) => this.changePageGetData(page, pageSize),
      size: 'small'
    }
    return(
      <div>
        <Table
            rowClassName={(record) => {
              return record.rowClassName
            }}
            dataSource={data}
            indentSize={10}
            pagination={paginationConfig}
            scroll={{ x: 435, y: 600 }}
            columns={this.state.columns}
            size='small'
          />
    </div>
    )
  }
}
