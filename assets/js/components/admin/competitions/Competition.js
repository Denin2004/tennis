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
                    <Tabs.TabPane tab="Tab 1" key="1">
                        <Main id={this.props.match.params.id}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Tab 2" key="2">
                        ontent of Tab Pane 2
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Tab 3" key="3">
                      Content of Tab Pane 3
                    </Tabs.TabPane>
                </Tabs>
           </div>)
    }
}

export default withTranslation()(Competition);