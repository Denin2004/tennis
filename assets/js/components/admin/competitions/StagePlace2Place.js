import React, {Component} from 'react';

import { Descriptions, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import MfwForm from '@app/mfw/mfwForm/MfwForm';
import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';
import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class StageGroup extends Component {
    constructor(props){
        super(props);
        this.games = this.games.bind(this);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.view+'/'+this.props.id).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false,
                    config: JSON.parse(res.data.view.data)
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
        });
    }

    games() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.games+'/'+this.props.group_id).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
        });
    }

    render() {
        return (
            this.state.loading ? (
                <React.Fragment></React.Fragment>
            ) : (
                <Descriptions>
                    <Descriptions.Item label={this.props.t('competition.stage.place_count')}>{this.state.config.count}</Descriptions.Item>
                </Descriptions>
            )
        )
    }
}

export default useWithForm(withTranslation()(StageGroup));