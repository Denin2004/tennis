import React, {Component} from 'react';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import { Table, message, Button, Form, Input, Space, Popconfirm, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';
import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class Competitors extends Component {
    constructor(props){
        super(props);
        this.isEditing = this.isEditing.bind(this);

        this.newRow = this.newRow.bind(this);
        this.post = this.post.bind(this);
        this.list = this.list.bind(this);
        this.editRow = this.editRow.bind(this);
        this.delete = this.delete.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.playerInput = this.playerInput.bind(this);
        this.createPlayer = this.createPlayer.bind(this);
        this.state = {
            loading: true,
            editCompetitor: 0,
            columns: [
                {
                    title: this.props.t('competition.competitor._'),
                    dataIndex: 'name',
                    render: (text, row) => {
                        const editable = this.isEditing(row);
                        return editable ? (
                            <React.Fragment>
                                {this.props.twoPlayers == true ? 
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <MfwFormWidget
                                           element={this.state.form.elements.player1}
                                           autocompleteItemProps={{
                                                className: 'mfw-margin-0 mfw-autocomplete-with=button'
                                            }}
                                           widgetProps={{
                                               search: {
                                                   url: window.MFW_APP_PROPS.urls.player.search,
                                                   form: this.props.form
                                                },
                                               customInput: this.playerInput
                                           }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <MfwFormWidget
                                           element={this.state.form.elements.player2}
                                           autocompleteItemProps={{
                                                className: 'mfw-margin-0'
                                            }}
                                           widgetProps={{
                                               search: {
                                                   url: window.MFW_APP_PROPS.urls.player.search,
                                                   form: this.props.form
                                               }
                                           }}
                                        />
                                    </Col>
                                </Row>
                                : 
                                <React.Fragment>
                                    <MfwFormWidget
                                       element={this.state.form.elements.player1}
                                        autocompleteItemProps={{
                                             className: 'mfw-margin-0'
                                         }}
                                       widgetProps={{
                                           search: {
                                               url: window.MFW_APP_PROPS.urls.player.search,
                                               form: this.props.form
                                           }
                                       }}
                                    />
                                    <MfwFormWidget
                                       element={this.state.form.elements.player2}
                                        autocompleteItemProps={{
                                             hidden: true
                                        }}
                                       widgetProps={{
                                           hidden: true,
                                           search: {
                                               url: window.MFW_APP_PROPS.urls.player.search,
                                               method: 'get',
                                               form: this.props.form
                                           }
                                       }}
                                    />
                                </React.Fragment>
                                }
                                <MfwFormWidget element={this.state.form.elements.competition_id}/>
                                <MfwFormWidget element={this.state.form.elements.id}/>
                                <MfwFormWidget element={this.state.form.elements._token}/>
                            </React.Fragment>
                        ) : (<React.Fragment>{this.props.twoPlayers == true ? <Space size="middle"><span>{row.player1}</span><span>{row.player2}</span></Space>: row.player1}</React.Fragment>)
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
                                  onClick={this.post}
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
                                  onClick={() => this.editRow(row.id)}
                                  className="mfw-table-button-link">{this.props.t('actions.edit')}
                                </Button>
                                <Popconfirm
                                  title={this.props.t('competition.competitor.delete_confirm')}
                                  onConfirm={() => this.delete(row.id)}
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
        this.list();
    }

    isEditing(row) {
        return this.state.editCompetitor === row.id;
    }

    list() {
        axios.get(window.MFW_APP_PROPS.urls.competition.competitor.list+'/'+this.props.competition_id).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false,
                    data: res.data.data,
                    editCompetitor: 0,
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

    newRow() {
        if (this.state.editCompetitor != -1) {
            this.editRow(-1);
        }
    }

    editRow(id) {
        axios.get(window.MFW_APP_PROPS.urls.competition.competitor.form+'/'+this.props.competition_id+'/'+id).then(res => {
            if (res.data.success) {
                this.props.form.resetFields();
                this.setState( state => {
                    var {columns, data} = state;
                    if (id === -1) {
                        columns[0].sortOrder = 'ascend';
                        data = [{
                            id: -1,
                            type: res.data.form.elements.competition_type.widgetProps.initialValue
                        }, ...state.data];
                    }
                    return {
                        form: res.data.form,
                        loading: false,
                        editCompetitor: id,
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

    post() {
        this.props.form
            .validateFields()
            .then(values => {
                axios({
                    method: this.state.form.method,
                    url: window.MFW_APP_PROPS.urls.competition.competitor.post,
                    data: values,
                    headers: {'Content-Type': 'application/json'}
                }).then(res => {
                    if (res.data.success) {
                        var {data} = this.state;
                        const postRowIndex = this.state.data.findIndex(function(element){return element.id/1 === values.id/1});
                        if (postRowIndex == -1) {
                            this.list();
                            return;
                        }
                        if (values.player1) {
                            data[postRowIndex].player1 = values.player1.value != '' ? values.player1.search : '';
                            data[postRowIndex].player1_id = values.player1.value != '' ? values.player1.value : '';
                        } else {
                            data[postRowIndex].player1 = '';
                            data[postRowIndex].player1_id = '';
                        }
                        if (values.player2) {
                            data[postRowIndex].player2 = values.player2.value != '' ? values.player2.search : '';
                            data[postRowIndex].player2_id = values.player2.value != '' ? values.player2.value : '';
                        } else {
                            data[postRowIndex].player2 = '';
                            data[postRowIndex].player2_id = '';
                        }
                        if (values.id/1 == -1) {
                            data[postRowIndex].id = res.data.id/1;
                        }
                        this.setState({
                            data: [...data],
                            editCompetitor: 0
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

    delete(id) {
        axios.get(window.MFW_APP_PROPS.urls.competition.competitor.delete+'/'+id).then(res => {
            if (res.data.success) {
                var {data} = this.state;
                const deleteRowIndex = this.state.data.findIndex(function(element){return element.id === id});
                if (deleteRowIndex == -1) {
                    this.list();
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
        const addRowIndex = this.state.editCompetitor == -1 ? this.state.data.findIndex(function(element){return element.id === -1}) : -1;
        const {columns} = this.state;

        if (addRowIndex !== -1) {
            const {data} = this.state;
            data.splice(addRowIndex, 1);
            delete columns[0].sortOrder;
            this.setState({
                editCompetitor: 0,
                data: [...data],
                columns: [...columns]
            });
            return;
        }
        this.setState({
            editCompetitor: 0,
            columns: [...columns]
        });
    }
    
    playerInput() {
        return <Input addonAfter={this.createPlayer()}/>
    }
    
    createPlayer() {
        return <Button className="sssss">Add Player</Button>
    }
    
    render() {
        return (
            <React.Fragment>
                <div>
                    <Button
                      onClick={this.newRow}
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

export default useWithForm(withTranslation()(Competitors));