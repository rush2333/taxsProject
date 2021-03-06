import React, { Component, Fragment } from 'react';
import { Button, Table, Card, Steps } from 'antd';
import { observer } from 'mobx-react';
import Approval from './ApprovalModal/Modal';
import request from '../../../helpers/request';
import moment from 'moment';
import { withRouter } from "react-router-dom";
import store from './store';


const _status = {
  '-1': '不通过',
  '0': '保存中',
  '1': '流程中',
  '2': '通过'
}

@observer
class EntranceProgress extends Component {
  basicMsg = [
    {
      title: '日期',
      dataIndex: 'create_time'
    },
    {
      title: '申请人',
      dataIndex: 'username'
    },
    {
      title: '部门',
      dataIndex: 'department'
    },
    {
      title: '职务',
      dataIndex: 'role_name'
    },
    {
      title: '人员类型',
      dataIndex: 'user_type'
    },
    {
      title: '开通功能',
      dataIndex: 'access'
    },
    {
      title: '工作截止时间（外来人员）',
      dataIndex: 'deadline'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (<span>{_status[text]}</span>)
    },
  ]

  proColumns = [
    {
      title: '序号',
      dataIndex: 'id'
    },
    {
      title: '处理人',
      dataIndex: 'user'
    },
    {
      title: '处理步骤',
      dataIndex: 'step',
    },
    {
      title: '送达时间',
      dataIndex: 'dateline',
      render: (text) => (<span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>)
    },
    {
      title: '处理时间',
      dataIndex: 'handleTime',
    },
    {
      title: '耗时',
      dataIndex: 'waste'
    },
    {
      title: '处理意见',
      dataIndex: 'content'
    }
  ]

  componentDidMount() {
    this.fetchList();
  }
  render() {
    let { params, data, dataSource, info } = store;
    let { id } = this.props.match.params;
    let { proDataSource } = info;
    let disabled = data.check === 1;
    let { history } = this.props;
    return (
      <Fragment>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <Button style={{ marginRight: 15 }} onClick={() => { history.goBack() }}>返回</Button>
            <Button type='primary' onClick={() => store.params.visible = true} disabled={!disabled}>审批</Button>
          </div>
          <div style={{ marginBottom: 60 }}>
            <Table title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>基本信息</div>} rowKey='id' columns={this.basicMsg} dataSource={dataSource} bordered ></Table>
          </div>
          <div>
            <Table title={() => <div style={{ textAlign: 'center', fontSize: 20 }}>申请进度</div>} rowKey='id' columns={this.proColumns} dataSource={proDataSource} bordered ></Table>
          </div>
        </Card>
        <Approval params={params} props={data} wf_fid={id} />
      </Fragment>
    )
  }
  fetchList = () => {
    let { id } = this.props.match.params;
    let { data, info } = store;
    var pro = [];
    request({
      url: '/api/v1/flow/info',
      method: 'GET',
      data: {
        wf_type: 'access_control_t',
        wf_fid: id
      },
      beforeSend: (xml) => {
        xml.setRequestHeader('token', localStorage.getItem('token'))
      },
      success: (res) => {
        console.log(res.info.log);
        store.data = res;
        store.info.log = res.info.log;
        store.info.preprocess = res.info.preprocess;
        store.info.proDataSource.clear();
        let step = Object.values(store.info.preprocess);
        store.info.log.forEach((e, index) => {
          pro.push(Object.assign({}, e, { 'step': step[index] }))
        });
        pro.shift();
        store.info.proDataSource = pro;
      },
    })
  }
}

export default withRouter(EntranceProgress)