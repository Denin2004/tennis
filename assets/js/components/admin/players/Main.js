import React, {Component} from 'react';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import { Table, message, Button, Tooltip, Typography, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import PlayerModal from '@app/components/admin//players/Modal';

class Players extends Component {
    constructor(props){
        super(props);
        this.addForm = this.addForm.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.list = this.list.bind(this);
        this.showForm = this.showForm.bind(this);
        this.delete = this.delete.bind(this);

        this.state = {
            loading: true,
            columns: [
                {
                    title: this.props.t('player.fio'),
                    dataIndex: 'name',
                    sorter: true,
                    render: (text, row) => {
                        return <React.Fragment>
                            <Button
                              type="link"
                              onClick={() => this.showForm(row.id)}
                              className="mfw-table-button-link">{text}
                            </Button>
                            <Tooltip title={this.props.t('actions.delete')} placement="bottom">
                                <Popconfirm
                                  title={this.props.t('player.delete_confirm')}
                                  onConfirm={() => this.delete(row.id)}
                                  okText={this.props.t('confirm.yes')}
                                  cancelText={this.props.t('confirm.no')}>
                                    <Button type="link"
                                      className="mfw-table-button-link mfw-float-right">
                                        <Typography.Text type="secondary">
                                            <DeleteOutlined className="mfw-test"/>
                                        </Typography.Text>
                                    </Button>
                                </Popconfirm>
                            </Tooltip>
                        </React.Fragment>
                    }
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
        this.list();
    }

    list() {
        axios.get(window.MFW_APP_PROPS.urls.player.list).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false,
                    modal: false,
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

    addForm() {
        this.showForm(-1);
    }

    showForm(id) {
        this.setState({
            modal: true,
            editPlayer: id
        });
    }

    delete(id) {
        axios.get(window.MFW_APP_PROPS.urls.player.delete+'/'+id).then(res => {
            if (res.data.success) {
                this.list();
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch(error => {
            message.error(error.toString());
        });
    }

    closeModal() {
        this.setState({modal: false});
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
                    <PlayerModal
                       id={this.state.editPlayer}
                       close={this.closeModal}
                       postSuccess={this.list}  />  : ''
                }
            </React.Fragment>
        )
    }
}

export default withTranslation()(Players);