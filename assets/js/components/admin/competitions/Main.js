import React, {Component} from 'react';

import { Tabs, message, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import MfwForm from '@app/mfw/mfwForm/MfwForm';
import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';
import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true
        }    
    }

    componentDidMount() {
        axios.get(window.MFW_APP_PROPS.urls.competition.edit+'/'+this.props.id).then(res => {
            if (res.data.success) {
                res.data.form.action = window.MFW_APP_PROPS.urls.competition.post;
                res.data.form.elements.type.widgetProps.label = this.props.t('competition.type');
                res.data.form.elements.court_id.widgetProps.label = this.props.t('court._court');
                res.data.form.elements.period.widgetProps.itemProps.label = this.props.t('date._date');
                this.props.form.resetFields();
                res.data.form.initialValues = {
                    period: []
                };
                res.data.form.elements.period.widgetProps.rangeProps.defaultValue.map(function(value){
                    res.data.form.initialValues.period.push(window.MFW_APP_PROPS.formats.datetimeToMoment(value));
                });
                delete res.data.form.elements.period.widgetProps.rangeProps.defaultValue;
                this.setState({
                    form: res.data.form,
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
                <Row justify="center">
                    <Col span={6}>
                        <MfwForm
                           formProps={{
                               form: this.props.form,
                               name: this.state.form.name,
                               labelCol: { span: 8 },
                               wrapperCol: { span: 16 },
                               initialValues: this.state.form.initialValues ? this.state.form.initialValues : {}
                           }}
                           mfwForm={this.state.form}>
                            <MfwFormWidget element={this.state.form.elements.type}/>
                            <MfwFormWidget element={this.state.form.elements.court_id}/>
                            <MfwFormWidget element={this.state.form.elements.period}/>
                            <MfwFormWidget element={{
                                type: 'button', 
                                title: this.props.t('actions.post'), 
                                widgetProps: {
                                    label: ' ',
                                    colon: false
                                }, 
                                buttonProps: {
                                    type: 'primary'
                                }
                            }}/>        
                        </MfwForm>
                    </Col>
                </Row>
            )
        )
    }
}

export default useWithForm(withTranslation()(Main));