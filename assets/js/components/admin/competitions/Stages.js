import React, {Component} from 'react';

import { Tabs, Form, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';
import axios from 'axios';

import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class Stages extends Component {
    constructor(props){
        super(props);
        this.stages = this.stages.bind(this);
        this.addForm = this.addForm.bind(this);
        this.state = {
            stages: [],
            modal: false
        }
    }

    componentDidMount() {
        this.stages();
    }
    
    stages() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.list+'/'+this.props.competition_id).then(res => {
            if (res.data.success) {
                this.setState({
                    stages: res.data.stages,
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch(error => {
            message.error(error.toString());
        });
    }
    
    addForm() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.addForm+'/'+this.props.competition_id).then(res => {
            if (res.data.success) {
                res.data.form.action = window.MFW_APP_PROPS.urls.competition.stage.create;
                this.props.form.resetFields();
                this.setState({
                    form: res.data.form,
                    modal: true
                });
            } else {
                message.error(this.props.t(res.data.error));
                this.setState({modal: false})
            }
        }).catch((error) => {
            message.error(error.toString());
            this.setState({modal: false});
        });
    }

    render() {
        return (
            <Tabs tabBarExtraContent={{left: <Button onClick={this.addForm} type="primary"><PlusOutlined/></Button>}}>
                <Tabs.TabPane tab="tab 1" key="1">
                  Content of Tab Pane 1
                </Tabs.TabPane>
                <Tabs.TabPane tab="tab 1" key="2">
                  Content of Tab Pane 2
                </Tabs.TabPane>
                <Tabs.TabPane tab="tab 1" key="3">
                  Content of Tab Pane 3
                </Tabs.TabPane>
            </Tabs>
        )
    }
}

export default useWithForm(withTranslation()(Stages));