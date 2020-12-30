import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import { Table, message, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import axios from 'axios';
import { withTranslation } from 'react-i18next';

import MfwForm from '@app/mfw/mfwForm/MfwForm';
import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';
import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class Competitions extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            modal: false
        }
        this.addForm = this.addForm.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.post = this.post.bind(this);
    }

    addForm() {
        axios.get(window.MFW_APP_PROPS.urls.competition.addForm).then(res => {
            if (res.data.success) {
                res.data.form.action = window.MFW_APP_PROPS.urls.competition.post;
                this.props.form.resetFields();
                this.setState({
                    form: res.data.form,
                    modal: true,
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

    closeModal() {
        this.setState({modal: false});
    }

    post() {
        this.props.form
            .validateFields()
            .then(values => {
                axios({
                    method: this.state.form.method,
                    url: window.MFW_APP_PROPS.urls.competition.post,
                    data: values,
                    headers: {'Content-Type': 'application/json'}
                }).then(res => {
                    if (res.data.success) {
                        this.list();
                    } else {
                        message.error(this.props.t(res.data.error));
                    }
                }).catch(error => {
                    message.error(error.toString());
                });
                this.setState({modal: false});
            })
            .catch(info => {
                message.error(this.props.t('common.errors.validate'));
            });
        this.setState({modal: false});
    }

    render() {
        var id = 30;
        return (
            <React.Fragment>
                <div>
                    <Button
                      onClick={this.addForm}
                      type="primary"
                      style={{ marginBottom: 16 }}>
                        <PlusOutlined/>
                    </Button>
                </div>
                {this.state.modal == true ?
                    <Modal
                      title={this.props.t('competition.new') }
                      visible={this.state.modal}
                      onOk={this.post}
                      onCancel={this.closeModal}>
                        <MfwForm
                           formProps={{
                               form: this.props.form,
                               name: this.state.form.from,
                               labelCol: { span: 8 },
                               wrapperCol: { span: 16 }
                           }}
                           mfwForm={this.state.form}
                           success={this.list}>
                            <MfwFormWidget element={this.state.form.elements.type}/>
                            <MfwFormWidget element={this.state.form.elements.court_id}/>
                        </MfwForm>
                    </Modal> : ''
                }
                
            </React.Fragment>
        )
/*        
        return (
            <React.Fragment>
                <div>
                    <Link to='/admin/main'>{this.props.t('common.mainPage')}</Link>
                    <Button
                    
                      type="primary"
                      style={{ marginBottom: 16 }}>
                        <PlusOutlined/>
                    </Button>
                </div>
                <Table
                    columns={this.state.columns}
                    rowKey={record => record.id}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                />
            </React.Fragment>
        )*/
    }
}

export default useWithForm(withTranslation()(Competitions));