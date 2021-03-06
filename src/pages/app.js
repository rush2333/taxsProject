import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import HeaderInclude from '../components/header';
import SiderMenu from '../components/sider';
import { Route, Switch, Redirect } from 'react-router-dom';

const { Header, Content, Sider, Footer } = Layout;

class App extends Component {
  render() {
    let { globalStore, history } = this.props;
    let { loginSuccess } = globalStore
    let pathName = this.props.history.location.pathname;
    let atLogin = pathName === '/login'
    let unLogin = pathName === '/login' || (pathName !== '/login' && localStorage.getItem('token'));
    return unLogin ? (
      <Layout>
        <Header style={{ background: '#fff' }} className="header">
          <HeaderInclude history={history} />
        </Header>
        <Layout>
          {
            !atLogin ? (<Sider width={200} style={{ background: '#fff' }}>
              <SiderMenu />
            </Sider>) : null
          }
          <Layout style={{ background: '#eee', padding: '0 24px 24px' }}>
            {/* {
              !atLogin ? (<span>
                您现在的位置：
            <Breadcrumb style={{ margin: '16px 0', display: 'inline' }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
              </span>) : null} */}
            <Content style={{ padding: '10px 0', margin: 0, minHeight: 800 }}>
              <div>
                <Switch>
                  <Route path='/meetings/new' render={() => <WrapperComponent Comp={import('./Meetings/meeting')} globalStore={globalStore} name='newMeeting' />} />
                  <Route path='/meetings/checkIn' render={() => <WrapperComponent Comp={import('./Meetings/checkIn')} globalStore={globalStore} name='CheckIn' />} />
                  <Route path='/entrance/authority' render={(history) => <WrapperComponent Comp={import('./Entrance/Entrance')} history={history} globalStore={globalStore} name='Entrance' />} />
                  <Route path='/entrance/progress/:id' render={() => <WrapperComponent Comp={import('./Entrance/Progress/Progress')} globalStore={globalStore} name='EntranceProgress' />} />
                  <Route path='/space/activity' render={() => <WrapperComponent Comp={import('./SpaceUsed/ActivitySpace/ActivitieSpace')} globalStore={globalStore} name='ActicitySpace' />} />
                  <Route path='/space/actProgress/:id' render={() => <WrapperComponent Comp={import('./SpaceUsed/ActivitySpace/ActProgress/Progress')} globalStore={globalStore} name='ActProgress' />} />
                  <Route path='/space/fnRoom' render={() => <WrapperComponent Comp={import('./SpaceUsed/FunctionRoom/FunctionRoom')} globalStore={globalStore} name='FnRoom' />} />
                  <Route path='/space/fnProgress/:id' render={() => <WrapperComponent Comp={import('./SpaceUsed/FunctionRoom/fnRoomPg/Progress')} globalStore={globalStore} name='FnProgress' />} />
                  <Route path='/education/meetingplace' render={() => <WrapperComponent Comp={import('./Education/Meetingplace')} globalStore={globalStore} name='Meetingplace' />} />
                  <Route path='/reception/diningaround' render={() => <WrapperComponent Comp={import('./officialReceptions/Diningaround')}  globalStore={globalStore} name='DiningAround' />} />
                  <Route path='/reception/diningProgress/:id' render={() => <WrapperComponent Comp={import('./officialReceptions/Progress/Progress')} globalStore={globalStore} name='DiningProgress' />} />
                  <Route path='/meetingReception/' render={() => <WrapperComponent Comp={import('./MeetingReceptions/meetingReceptions')} globalStore={globalStore} name='MeetingReception' />} />
                  <Route path='/useCar/' render={() => <WrapperComponent Comp={import('./useCar/useCar')} globalStore={globalStore} name='useCar' />} />
                  <Route path='/login' render={(history) => <WrapperComponent history={history} globalStore={globalStore} Comp={import('./Login/login')} name='login' />} />
                  <Route path='/' render={() => <WrapperComponent Comp={import('./Meetings/meeting')} globalStore={globalStore} />} />
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    ) : (
        <Redirect to='/login' />
      )
  }
}

class WrapperComponent extends React.Component {
  state = {
    Comp: null
  }
  componentDidMount() {
    this.updateComp(this.props);
  }
  render() {
    let Comp = this.state.Comp;
    let { globalStore, match, history } = this.props;
    return Comp ? <Comp match={match} globalStore={globalStore} history={history} /> : Comp;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.Comp !== this.props.Comp) {
      this.updateComp(nextProps);
    }
  }
  updateComp = (props) => {
    props.Comp.then(C => {
      this.setState({
        Comp: C.default
      })
    });
  }
}

export default App