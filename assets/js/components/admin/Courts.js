import React, {Component} from 'react';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import { Table, message, Button, Form, Input, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';
import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class Courts extends Component {
    constructor(props){
        super(props);
        this.isEditing = this.isEditing.bind(this);

        this.addCourtRow = this.addCourtRow.bind(this);
        this.postCourt = this.postCourt.bind(this);
        this.getCourts = this.getCourts.bind(this);
        this.showCourtRow = this.showCourtRow.bind(this);
        this.deleteCourt = this.deleteCourt.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);

        this.state = {
            loading: true,
            editCourt: 0,
            columns: [
                {
                    title: this.props.t('common.name'),
                    dataIndex: 'name',
                    sortDirections: ['ascend', 'descend'],
                    sorter: (a, b) => a.name.localeCompare(b.name),
                    render: (text, row) => {
                        const editable = this.isEditing(row);
                        return editable ? (
                            <React.Fragment>
                                <MfwFormWidget element={this.state.form.elements.name} widgetProps={{className: 'mfw-margin-0'}}/>
                                <MfwFormWidget element={this.state.form.elements.id}/>
                                <MfwFormWidget element={this.state.form.elements._token}/>
                            </React.Fragment>    
                        ) : (<React.Fragment>{text}</React.Fragment>)
                    }
                },
                {
                    title: this.props.t('common.address'),
                    dataIndex: 'address',
                    sortDirections: ['ascend', 'descend'],
                    sorter: (a, b) => a.name.localeCompare(b.name),
                    render: (text, row) => {
                        const editable = this.isEditing(row);
                        return editable ? (
                            <MfwFormWidget element={this.state.form.elements.address} widgetProps={{className: 'mfw-margin-0'}}/>
                        ) : (<React.Fragment>{text}</React.Fragment>)
                    }
                },
                {
                    title: this.props.t('actions._'),
                    dataIndex: 'actions',
                    render: (text, row) => {
                        const editable = this.isEditing(row);
                        return editable ? 
                            (<Space size="middle">
                                <Button
                                  type="link"
                                  onClick={this.postCourt}
                                  className="mfw-table-button-link">{this.props.t('actions.post')}
                                </Button>
                                <Button
                                  type="link"
                                  onClick={this.cancelEdit}
                                  className="mfw-table-button-link">{this.props.t('actions.cancel')}
                                </Button>
                            </Space>) : 
                            (<Space size="middle">
                                <Button
                                  type="link"
                                  onClick={() => this.showCourtRow(row.id)}
                                  className="mfw-table-button-link">{this.props.t('actions.edit')}
                                </Button>
                                <Popconfirm
                                  title={this.props.t('court.delete_confirm')}
                                  onConfirm={() => this.deleteCourt(row.id)}
                                  okText={this.props.t('confirm.yes')}
                                  cancelText={this.props.t('confirm.no')}>
                                    <Button type="link"
                                      className="mfw-table-button-link">
                                      {this.props.t('actions.delete')}
                                    </Button>
                                </Popconfirm>
                            </Space>
                        );
                    }
                }
            ],
            data: [],
            pagination: {
                current: 1,
                pageSize: 10
            }
        }
    }

    componentDidMount() {
        this.getCourts();
    }

    isEditing(row) {
        return this.state.editCourt === row.id;
    }

    getCourts() {
        axios.get(window.MFW_APP_PROPS.urls.court.list).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false,
                    data: res.data.data,
                    editCourt: 0,
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

    addCourtRow() {
        this.showCourtRow(-1);
    }

    showCourtRow(id) {
        axios.get(window.MFW_APP_PROPS.urls.court.form+'/'+id).then(res => {
            if (res.data.success) {
                this.props.form.resetFields();
                this.setState( state => {
                    var {columns, data} = state;
                    if (id === -1) {
                        columns[0].sortOrder = 'ascend';
                        data = [{
                            id: -1,
                            name: '',
                            address: ''
                        }, ...state.data];
                    }
                    return {
                        form: res.data.form,
                        loading: false,
                        editCourt: id,
                        data: data,
                        columns: [...columns],
                        pagination: {
                            total: data.length
                        }
                    }
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
        });
    }

    postCourt() {
        this.props.form
            .validateFields()
            .then(values => {
                axios({
                    method: this.state.form.method,
                    url: window.MFW_APP_PROPS.urls.court.post,
                    data: values,
                    headers: {'Content-Type': 'application/json'}
                }).then(res => {
                    if (res.data.success) {
                        var {data} = this.state;
                        const postRowIndex = this.state.data.findIndex(function(element){return element.id/1 === values.id/1});
                        if (postRowIndex == -1) {
                            this.getCourts();
                            return;
                        }
                        Object.keys(values).map(key => {
                            if (data[postRowIndex][key] != undefined) {
                                data[postRowIndex][key] = values[key];
                            }
                        })
                        if (values.id/1 == -1) {
                            data[postRowIndex].id = res.data.id/1;
                        }
                        this.setState({
                            data: [...data],
                            editCourt: 0
                        });
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

    deleteCourt(id) {
        axios.get(window.MFW_APP_PROPS.urls.court.delete+'/'+id).then(res => {
            if (res.data.success) {
                var {data} = this.state;
                const deleteRowIndex = this.state.data.findIndex(function(element){return element.id === id});
                if (deleteRowIndex == -1) {
                    this.getCourts();
                    return;
                }
                data.splice(deleteRowIndex, 1);
                this.setState({
                    data: [...data],
                    pagination: {
                        total: data.length
                    }
                });
                return;
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch(error => {
            message.error(error.toString());
        });
    }

    cancelEdit() {
        const addRowIndex = this.state.editCourt == -1 ? this.state.data.findIndex(function(element){return element.id === -1}) : -1;
        const {columns} = this.state;

        if (addRowIndex !== -1) {
            const {data} = this.state;
            data.splice(addRowIndex, 1);
            delete columns[0].sortOrder;
            this.setState({
                editCourt: 0,
                data: [...data],
                columns: [...columns]
            });
            return;
        }
        this.setState({
            editCourt: 0,
            columns: [...columns]
        });
    }
    
    render() {
        return (
            <React.Fragment>
                <div>
                    <Button
                      onClick={this.addCourtRow}
                      type="primary"
                      style={{ marginBottom: 16 }}>
                        <PlusOutlined/>
                    </Button>
                </div>
                <Form component={false} form={this.props.form}>
                    <Table
                        columns={this.state.columns}
                        rowKey={record => record.id}
                        dataSource={this.state.data}
                        pagination={this.state.pagination}
                        loading={this.state.loading}
                    />
                </Form>
            </React.Fragment>
        )
    }
}

export default useWithForm(withTranslation()(Courts));