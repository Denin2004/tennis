import React, {Component} from 'react';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import { message, Modal } from 'antd';

import MfwForm from '@app/mfw/mfwForm/MfwForm';
import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';
import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class PlayerModal extends Component {
    constructor(props){
        super(props);
        this.post = this.post.bind(this);
        this.state = {
            loading: true
        }
    }
    
    componentDidMount() {
        axios.get(window.MFW_APP_PROPS.urls.player.form+'/'+this.props.id).then(res => {
            if (res.data.success) {
                res.data.form.elements.name.widgetProps.label = this.props.t('player.fio');
                res.data.form.elements.phone.widgetProps.label = this.props.t('player.phone');
                res.data.form.action = window.MFW_APP_PROPS.urls.player.post;
                this.props.form.resetFields();
                this.setState({
                    form: res.data.form,
                    loading: false
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

    post() {
        this.props.form
            .validateFields()
            .then(values => {
                axios({
                    method: this.state.form.method,
                    url: window.MFW_APP_PROPS.urls.player.post,
                    data: values,
                    headers: {'Content-Type': 'application/json'}
                }).then(res => {
                    if (res.data.success) {
                        this.props.postSuccess(res.data);
                    } else {
                        message.error(this.props.t(res.data.error));
                    }
                }).catch(error => {
                    message.error(error.toString());
                });
            })
            .catch(info => {
                message.error(this.props.t('common.errors.validate'));
            });
    }

    render() {
        return (
            this.state.loading == true ?
                <React.Fragment></React.Fragment>  : 
                <Modal
                  title={this.props.t(this.props.id == -1 ? 'player.new' : 'player.edit') }
                  visible={true}
                  onOk={this.post}
                  onCancel={this.props.close}>
                    <MfwForm
                       formProps={{
                           form: this.props.form,
                           name: this.state.form.name,
                           labelCol: { span: 8 },
                           wrapperCol: { span: 16 }
                       }}
                       mfwForm={this.state.form}>
                        <MfwFormWidget element={this.state.form.elements.name}/>
                        <MfwFormWidget element={this.state.form.elements.phone}/>
                    </MfwForm>
                </Modal>
        )
    }
}

export default useWithForm(withTranslation()(PlayerModal));