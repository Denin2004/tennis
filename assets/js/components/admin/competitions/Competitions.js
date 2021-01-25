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
            modal: false,
            columns: [
                {
                    title: this.props.t('date._date'),
                    dataIndex: 'from',
                    render: (text, row) => {
                        var from = window.MFW_APP_PROPS.formats.datetimeToMoment(row.from),
                            to = window.MFW_APP_PROPS.formats.datetimeToMoment(row.to);
                        return <Link to={'/admin/competition/'+row.id+'/'+row.type}>
                            {to.diff(from, 'days') >= 1 ? row.from+' - '+row.to : text+' - '+to.format(window.MFW_APP_PROPS.formats.time)}</Link>;
                    }
                },
                {
                    title: this.props.t('competition.type'),
                    dataIndex: 'type',
                    render: (text, row) => {
                        return this.props.t(text);
                    }
                },
                {
                    title: this.props.t('court._court'),
                    dataIndex: 'court'
                }
            ]
        }
        this.addForm = this.addForm.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.post = this.post.bind(this);
        this.list = this.list.bind(this);
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
                        if (res.data.id != undefined) {
                            this.props.history.push('/admin/competition/'+res.data.id);
                            return;
                        }
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

    list() {
        axios.get(window.MFW_APP_PROPS.urls.competition.list).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false,
                    data: res.data.data,
                    pagination: {
                        total: res.data.data.length
                    }
                });
            } else {
                message.error(this.props.t(res.data.error));
                this.setState({loading: false})
            }
        }).catch(error => {
            message.error(error.toString());
            this.setState({loading: false});
        });
    }

    componentDidMount() {
        this.list();
    }

    render() {
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
                <Table
                    columns={this.state.columns}
                    rowKey={record => record.id}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                />
                {this.state.modal == true ?
                    <Modal
                      title={this.props.t('competition.new') }
                      visible={this.state.modal}
                      onOk={this.post}
                      onCancel={this.closeModal}>
                        <MfwForm
                           formProps={{
                               form: this.props.form,
                               name: this.state.form.name,
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
    }
}

export default useWithForm(withTranslation()(Competitions));