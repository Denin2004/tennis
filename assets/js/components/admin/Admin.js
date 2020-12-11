import React, {Component} from 'react';
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';
import { Layout, Menu } from 'antd';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import Main from '@app/components/admin/Main';
import Players from '@app/components/admin/Players';
import Competitions from '@app/components/admin/Competitions';

const { Header, Footer, Sider, Content } = Layout;

class Admin extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Layout>
                    <Header>
                        <Menu mode="horizontal" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                                <Link to='/admin/main'>{this.props.t('common.mainPage')}</Link></Menu.Item>
                            <Menu.Item key="2">
                                <Link to='/admin/competitions'>{this.props.t('competition.s')}</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to='/admin/players'>{this.props.t('player.s')}</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content>
                        <Switch>
                            <Redirect exact from="/" to="/admin/main" />
                            <Route path="/admin/players" component={Players} />
                            <Route path="/admin/main" component={Main} />
                            <Route path="/admin/competitions" component={Competitions} />
                        </Switch>                    
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>            
            </React.Fragment>
        )
    }
}

export default withTranslation()(Admin);