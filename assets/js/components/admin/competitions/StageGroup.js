import React, {Component} from 'react';

import { Descriptions, message, Table, Button, Form, Row, Col } from 'antd';
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
//        this.games = this.games.bind(this);
        this.groups = this.groups.bind(this);
        this.groupCompetitor = this.groupCompetitor.bind(this);
        this.editCompetitor = this.editCompetitor.bind(this);
        this.cancelEditCompetitor = this.cancelEditCompetitor.bind(this);
        this.postCompetitor = this.postCompetitor.bind(this);
        this.state = {
            loading: true,
            editCompetitor: -1
        }
    }

    componentDidMount() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.view+'/'+this.props.id).then(res => {
            if (res.data.success) {
                var config = JSON.parse(res.data.view.data);
                this.setState({
                    loading: false,
                    config: config,
                    groups: this.groups({ games: res.data.games, players: config.players})
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
        });
    }

  /*  games() {
          axios.get(window.MFW_APP_PROPS.urls.competition.stage.games+'/'+this.props.group_id).then(res => {
            if (res.data.success) {
                console.log(res.data);
                this.setState({
                    loading: false
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
        });
    }*/
    
    gameCompetitor(game, competitor) {
        return competitor == 1 ? this.groupCompetitor({
            player1: game.player11,
            player2: game.player12
        }) : this.groupCompetitor({
            player1: game.player21,
            player2: game.player22
        });
    }
    
    groupCompetitor(competitor) {
        return this.props.twoPlayers ? competitor.player1+'/'+competitor.player2 : competitor.player1;
    }
    
    editCompetitor(stageID, groupCompetitorID) {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.editCompetitor+'/'+stageID+'/'+groupCompetitorID).then(res => {
            if (res.data.success) {
                this.setState({
                    loading: false,
                    editCompetitor: groupCompetitorID,
                    form: res.data.form
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
        });
    }
    
    postCompetitor() {
        this.props.form
            .validateFields()
            .then(values => {
                axios({
                    method: this.state.form.method,
                    url: window.MFW_APP_PROPS.urls.competition.stage.postCompetitor,
                    data: values,
                    headers: {'Content-Type': 'application/json'}
                }).then(res => {
                    if (res.data.success) {
                        this.setState({editCompetitor: -1});
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
    
        cancelEditCompetitor() {
        this.setState({editCompetitor: -1});
    }

    
    gameScore(group_competitor_id, game) {
        if ((game.player11 === null)||(game.player21 === null)) {
            return '';
        }
        if (game.group_competitor1_id == group_competitor_id) {
            return game.score1 + ' : ' + game.score2 + (game.tie1 != 0 || game.tie2 != 0 ?  game.tie1 + ' : ' + game.tie2 : '');
        }
        return game.score2 + ' : ' + game.score1 + (game.tie1 != 0 || game.tie2 != 0 ?  game.tie2 + ' : ' + game.tie1 : '');
    }
    
    groups(data) {
        var res = {},
            width = 70/(data.players*1+1)+'%';
        const stage = this;
        data.games.map(function (game){
            if (res[game.group_id] == undefined) {
                res[game.group_id] = {
                    name: '',
                    games: {}
                };
            }
            if (res[game.group_id]['games'][game.group_competitor1_id] == undefined) {
                res[game.group_id]['games'][game.group_competitor1_id] = {
                    name: stage.gameCompetitor(game, 1),
                    score: game.competitor1_score,
                    gamesPlayed: game.competitor1_games_played,
                    stageID: game.stage_id,
                    competitorID: game.competitor1_id
                };
                res[game.group_id]['games'][game.group_competitor1_id][game.group_competitor2_id] = {...game};

            } else {
                res[game.group_id]['games'][game.group_competitor1_id][game.group_competitor2_id] = {...game}
            }
            if (res[game.group_id]['games'][game.group_competitor2_id] == undefined) {
                res[game.group_id]['games'][game.group_competitor2_id] = {
                    name: stage.gameCompetitor(game, 2),
                    score: game.competitor2_score,
                    gamesPlayed: game.competitor2_games_played,
                    stageID: game.stage_id,
                    competitorID: game.competitor2_id
                };
                res[game.group_id]['games'][game.group_competitor2_id][game.group_competitor1_id] = {...game};
            } else {
                res[game.group_id]['games'][game.group_competitor2_id][game.group_competitor1_id] = {...game}
            }           
        });
        Object.keys(res).map(group => {
            res[group].columns = [{
                title: '',
                dataIndex: 'name',
                render: (competitor, row) => {
                    if (row.id == this.state.editCompetitor) {
                        return <React.Fragment>
                            <Form component={false} form={this.props.form}>
                                <Row wrap={false}>
                                    <Col flex="auto">
                                        <MfwFormWidget element={this.state.form.elements.free_competitors}/>
                                    </Col>
                                    <Col flex="none">
                                        <Button  type="link" onClick={this.postCompetitor}>{this.props.t('actions.post')}</Button>
                                        <Button  type="link" onClick={this.cancelEditCompetitor}>{this.props.t('actions.cancel')}</Button>
                                    </Col>
                                </Row>
                                <MfwFormWidget element={this.state.form.elements.stage_id}/>
                                <MfwFormWidget element={this.state.form.elements.competitor_id}/>
                                <MfwFormWidget element={this.state.form.elements._token}/>
                            </Form>
                        </React.Fragment>;
                    }
                    if (this.state.editCompetitor != -1) {
                        return row.competitorID === null ? this.props.t('competition.competitor.vacancy') : 
                           (competitor);
                    }
                    if (row.gamesPlayed == 0) {
                        return <Button  type="link" onClick={() => {this.editCompetitor(row.stageID, row.id)}}>{row.competitorID === null ? this.props.t('competition.competitor.vacancy') : 
                           (competitor)}</Button>
                    }
                    return competitor; 
                }
            }];
            res[group].data = [];
            var col = 1
            Object.keys(res[group].games).map(competitor1 => {
                res[group].columns.push({
                    title: col,
                    dataIndex: 'competitor_'+competitor1,
                    align: 'center',
                    width: width,
                    render: (game, row) => {
                        return row.id == competitor1 ? {props: {style: {background: 'black'}}, children: ''} : stage.gameScore(row.id/1, game);
                    }
                });
                col++;
                var row = {
                    id: competitor1,
                    name: res[group].games[competitor1].name,
                    score: res[group].games[competitor1].score,
                    gamesPlayed: res[group].games[competitor1].gamesPlayed,
                    stageID: res[group].games[competitor1].stageID,
                    competitorID: res[group].games[competitor1].competitorID                    
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
                dataIndex: 'score',
                width: width,
                align: 'center'
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