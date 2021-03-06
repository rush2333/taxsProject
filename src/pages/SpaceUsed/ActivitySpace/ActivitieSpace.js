import React, { Component, Fragment } from 'react';
import { Input, Table, Select, Button, DatePicker, Card } from 'antd';
import { observer } from 'mobx-react'
import store from './store';
import request from '../../../helpers/request';
import Add from './modal/add';
import { withRouter } from 'react-router-dom';
import nextStore from './ActProgress/store';

const { RangePicker } = DatePicker;
const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}
@observer
class ActivitySpace extends Component {
  columns = [
    {
      title: '日期',
      dataIndex: 'create_time'
    },
    {
      title: '申请人',
      dataIndex: 'username'
    },
    {
      title: '使用单位',
      dataIndex: 'unit'
    },
    {
      title: '使用时间',
      dataIndex: 'time_begin'
    },
    {
      title: '使用人数',
      dataIndex: 'user_count'
    },
    {
      title: '场地名称',
      dataIndex: 'space'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (<span>{_status[text]}</span>)
    },
    {
      title: '操作',
      render: (text, record, columns) => <a onClick={() => { this.goDetail(record) }}>查看进度</a>
    }
  ]

  render() {
    let { department, dataSource, time_begin, time_end, status, space, addParams } = store;
    return (
      <Fragment>
        <Card>
          <div>
            <span>日期：</span><RangePicker style={{ width: 250, marginRight: 10 }} defaultValue={[time_begin, time_end]} onChange={(d, t) => { store.time_begin = t[0]; store.time_end = t[1]; }} />
            <span>部门：</span>
            <Select defaultValue={department} onChange={(v) => { store.department = v }} style={{ width: 100, marginRight: 10 }}>
              <Option value={'全部'}>全部</Option>
            </Select>
            <span>申请人：</span> <Input style={{ width: 120, marginRight: 10 }} onChange={(e) => { store.username = e.target.value }} placeholder='全部' />
            <Button type='primary' style={{ marginRight: 10 }} onClick={this.fetchList} >查询</Button>
            <Button type='primary' >导出</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <span>状态：</span><Select defaultValue={status} style={{ width: 100, marginRight: 10 }}><Option value={3}>全部</Option></Select>
            <span>场地名称：</span><Select defaultValue={space} style={{ width: 100, marginRight: 10 }}><Option value={'全部'}>全部</Option></Select>
            <Button type='primary' onClick={() => { store.addParams.AddVisible = true }} >新增</Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table columns={this.columns} dataSource={dataSource} rowKey='id' bordered ></Table>
          </div>
        </Card>
        <Add props={addParams} />
      </Fragment>
    )
  }
  fetchList = (e, page = 1, size = 10) => {
    let { department, time_begin, time_end, status, username, space } = store;
    request({
      url: '/api/v1/recreational/list',
      method: 'GET',
      data: {
        department,
        username,
        status,
        space,
        time_begin: time_begin.format('YYYY-MM-DD'),
        time_end: time_end.format('YYYY-MM-DD'),
        page,
        size
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'));
      },
      success: (res) => {
        store.dataSource = res.data;
      }
    })
  }

  goDetail = (record) => {
    nextStore.dataSource.clear();
    nextStore.dataSource.push(record);
    let {history} = this.props;
    let id = record.id;
    history.push(`/space/actProgress/${id}`);
  }
}

export default withRouter(ActivitySpace)