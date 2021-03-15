import React, {Component} from 'react';

import { Descriptions, message, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import axios from 'axios';
import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import MfwForm from '@app/mfw/mfwForm/MfwForm';
import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';
import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';

class StageGroup extends Component {
    constructor(props){
        super(props);
        this.games = this.games.bind(this);
        this.groups = this.groups.bind(this);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.view+'/'+this.props.id).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false,
                    config: JSON.parse(res.data.view.data),
                    groups: this.groups(res.data.games)
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
        });
    }

    games() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.games+'/'+this.props.group_id).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
        });
    }
    
    competitor(game, competitor) {
        return competitor == 1 ? (this.props.twoPlayers ? (this.player(game.player11)+' / '+this.player(game.player12)) : (this.player(game.player11))) :
            (this.props.twoPlayers ? (this.player(game.player21)+' / '+this.player(game.player22)) : (this.player(game.player21)));
    }
    
    player(player) {
        return player != null ? player : '';
    }
    
    gameScore(competitor_id, game) {
        if ((game.player11_id === null)||(game.player21_id === null)) {
            return '';
        }
        if (game.competitor1_id == competitor_id) {
            return game.score1 + ' : ' + game.score2 + (game.tie1 != 0 || game.tie2 != 0 ?  game.tie1 + ' : ' + game.tie2 : '');
        }
        return game.score2 + ' : ' + game.score1 + (game.tie1 != 0 || game.tie2 != 0 ?  game.tie2 + ' : ' + game.tie1 : '');
    }
    
    groups(games) {
        var res = {};
        const stage = this;
        games.map(function (game){
            if (res[game.group_id] == undefined) {
                res[game.group_id] = {
                    name: '',
                    games: {}
                };
            }
            if (res[game.group_id]['games'][game.competitor1_id] == undefined) {
                res[game.group_id]['games'][game.competitor1_id] = {
                    name: stage.competitor(game, 1),
                    score: game.competitor1_score
                };
                res[game.group_id]['games'][game.competitor1_id][game.competitor2_id] = {...game};

            } else {
                res[game.group_id]['games'][game.competitor1_id][game.competitor2_id] = {...game}
            }
            if (res[game.group_id]['games'][game.competitor2_id] == undefined) {
                res[game.group_id]['games'][game.competitor2_id] = {
                    name: stage.competitor(game, 2),
                    score: game.competitor2_score
                };
                res[game.group_id]['games'][game.competitor2_id][game.competitor1_id] = {...game};
            } else {
                res[game.group_id]['games'][game.competitor2_id][game.competitor1_id] = {...game}
            }           
        });
        Object.keys(res).map(group => {
            res[group].columns = [{
                    title: '',
                    dataIndex: 'name'
            }];
            res[group].data = [];
            var col = 1
            Object.keys(res[group].games).map(competitor1 => {
                res[group].columns.push({
                    title: col,
                    dataIndex: 'competitor_'+competitor1,
                    align: 'center',
                    render: (game, row) => {
                        return row.id == competitor1 ? {props: {style: {background: 'black'}}, children: ''} : stage.gameScore(row.id/1, game);
                    }
                });
                col++;
                var row = {
                    id: competitor1,
                    name: res[group].games[competitor1].name,
                    score: res[group].games[competitor1].score
                };
                row['competitor_'+competitor1] = '';
                Object.keys(res[group].games[competitor1]).map(competitor2 => {
                    if (competitor2 != 'name') {
                        row['competitor_'+competitor2] = {...res[group].games[competitor1][competitor2]};
                    }
                });
                res[group].data.push(row);
            });
            res[group].columns.push({
                title: this.props.t('competition.competitor.score'),
                dataIndex: 'score'
            });            
            delete res[group].games;
        });
        return res;
    }

    render() {
        return (
            this.state.loading ? (
                <React.Fragment></React.Fragment>
            ) : (
                <React.Fragment>
                    <Descriptions>
                        <Descriptions.Item label={this.props.t('competition.stage.group_count')}>{this.state.config.count}</Descriptions.Item>
                        <Descriptions.Item label={this.props.t('competition.stage.group_competitors')}>{this.state.config.players}</Descriptions.Item>
                    </Descriptions>
                    {Object.keys(this.state.groups).map(id => {
                        return (<Table columns={this.state.groups[id].columns} key={id}
                              rowKey={record => record.id}
                              dataSource={this.state.groups[id].data}
                              pagination={false}/>
                        );
                    })}
                </React.Fragment>
            )
        )
    }
}

export default useWithForm(withTranslation()(StageGroup));