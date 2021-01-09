import React, {Component} from 'react';

import { Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';
import Main from '@app/components/admin/competitions/Main';

class Competition extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="mfw-site-layout">
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={this.props.t('competition.stages_and_results')} key="1">
                      Content of Tab Pane 3
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={this.props.t('competition.competitiors')} key="2">
                        Competitors
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={this.props.t('competition.main')} key="3">
                        <Main id={this.props.match.params.id}/>
                    </Tabs.TabPane>
                </Tabs>
           </div>)
    }
}

export default withTranslation()(Competition);