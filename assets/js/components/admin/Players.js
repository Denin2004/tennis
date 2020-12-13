import React, {Component} from 'react';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import { Table, message, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import MfwForm from '@app/mfw/mfwForm/MfwForm';
import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';

class Players extends Component {
    constructor(props){
        super(props);
        this.showPlayerForm = this.showPlayerForm.bind(this);
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
                }
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
    
    showPlayerForm(id) {
        axios.get(window.MFW_APP_PROPS.urls.player.form+'/'+id).then(res => {
            if (res.data.success) {
                res.data.form.elements.name = this.props.t('player.name');
                res.data.form.elements.phone = this.props.t('player.phone');
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
    
    render() {
        return (
            <React.Fragment>    
                <div>
                    <Button onClick={() => this.showPlayerForm(-1)} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined/>}></Button>
                </div>
                <Table
                    columns={this.state.columns}
                    rowKey={record => record.id}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                />
                <Modal
                  title="Basic Modal"
                  visible={this.state.modal}
                  onOk={() => this.setState({modal: false})}
                  onCancel={() => this.setState({modal: false})}>
                    <MfwForm form={this.state.form} successSubmit={() => {this.setState({changePsw: false})}}>
                        <MfwFormWidget element={this.state.form.elements.name}/>
                        <MfwFormWidget element={this.state.form.elements.phone}/>
                                  <Button onClick={() => {this.setState({changePsw: false})}} color="primary">{this.props.t('dialog.abort')}</Button>
                                  <Button type="submit" color="primary">{this.props.t('dialog.save')}</Button>
                        </MfwForm>                          
                </Modal>
            </React.Fragment>
        )
    }
}

export default withTranslation()(Players);