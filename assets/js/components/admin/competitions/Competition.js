import React, {Component} from 'react';

import { Tabs } from 'antd';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';
import Main from '@app/components/admin/competitions/Main';
import Competitors from '@app/components/admin/competitions/Competitors';
import Stages from '@app/components/admin/competitions/Stages';

class Competition extends Component {
    constructor(props){
        super(props);
        this.state = {
            twoPlayers: [
                'competition.types.mensdouble',
                'competition.types.womensdouble',
                'competition.types.mixt'
            ].includes(this.props.match.params.type)
        }
    }

    render() {
        return (
            <div className="mfw-site-layout">
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={this.props.t('competition.stage.and_results')} key="1">
                        <Stages competition_id={this.props.match.params.id} twoPlayers={this.state != 1}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={this.props.t('competition.competitor.competitors')} key="2">
                        <Competitors competition_id={this.props.match.params.id} twoPlayers={this.state != 1}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={this.props.t('competition.main')} key="3">
                        <Main competition_id={this.props.match.params.id}/>
                    </Tabs.TabPane>
                </Tabs>
           </div>)
    }
}

export default withTranslation()(Competition);