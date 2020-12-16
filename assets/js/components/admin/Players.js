import React, {Component} from 'react';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import { Table, message, Button, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import MfwForm from '@app/mfw/mfwForm/MfwForm';
import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';
import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class Players extends Component {
    constructor(props){
        super(props);
        this.addPlayerForm = this.addPlayerForm.bind(this);
        this.postPlayer = this.postPlayer.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getPlayers = this.getPlayers.bind(this);
        this.state = {
            loading: true,
            columns: [
                {
                    title: this.props.t('player.fio'),
                    dataIndex: 'name',
                    sorter: true
                },
                {
                    title: this.props.t('player.phone'),
                    dataIndex: 'phone'
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <Space size="middle">
                            <Button type="link" className="mfw-table-button-link">{this.props.t('actions.edit')}</Button>
                            <Button type="link">{this.props.t('actions.delete')}</Button>
                        </Space>
                    )
                  },
            ],
            data: [],
            pagination: {
                current: 1,
                pageSize: 10
            },
            modal: false
        }
    }
    componentDidMount() {
        this.getPlayers();
    }

    getPlayers() {
        axios.get(window.MFW_APP_PROPS.urls.player.list).then(res => {
            if (res.data.success) {
                this.setState( state => {
                    return {
                        loading: false,
                        data: res.data.data,
                        pagination: {
                            total: res.data.data
                        }
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

    addPlayerForm() {
        this.showPlayerForm(-1);
    }

    showPlayerForm(id) {
        axios.get(window.MFW_APP_PROPS.urls.player.form+'/'+id).then(res => {
            if (res.data.success) {
                res.data.form.elements.name.label = this.props.t('player.fio');
                res.data.form.elements.phone.label = this.props.t('player.phone');
                res.data.form.action = window.MFW_APP_PROPS.urls.player.post;
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

    postPlayer() {
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
                        this.getPlayers();
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

    closeModal() {
        this.setState({modal: false});
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <Button
                      onClick={this.addPlayerForm}
                      type="primary"
                      style={{ marginBottom: 16 }}
                      icon={<PlusOutlined/>}></Button>
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
                      title="Basic Modal"
                      visible={this.state.modal}
                      onOk={this.postPlayer}
                      onCancel={this.closeModal}>
                        <MfwForm
                           formProps={{
                               form: this.props.form,
                               name: this.state.form.name,
                               labelCol: { span: 8 },
                               wrapperCol: { span: 16 }
                           }}
                           mfwForm={this.state.form}
                           success={this.getPlayers}>
                            <MfwFormWidget element={this.state.form.elements.name}/>
                            <MfwFormWidget element={this.state.form.elements.phone}/>
                        </MfwForm>
                    </Modal> : ''
                }
            </React.Fragment>
        )
    }
}

export default useWithForm(withTranslation()(Players));