import React, {Component} from 'react';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import { Table, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
            }
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
                this.setState({error: res.data.error, loading: false})
            }
        }).catch(error => {
            this.setState({error: error.toString(), loading: false});
        });
    }    
    
    showPlayerForm(id) {
        console.log(this, id);
    }

    render() {
        if (this.state.error) {
            message.error('This is an error message');
        }
        return (
            <div>
                <Button onClick={() => this.showPlayerForm(-1)} type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined/>}></Button>
                <Table
                    columns={this.state.columns}
                    rowKey={record => record.id}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                />
            </div>
        )
    }
}

export default withTranslation()(Players);