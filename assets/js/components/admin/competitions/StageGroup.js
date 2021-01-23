import React, {Component} from 'react';

import { Descriptions, message } from 'antd';
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
        const twoPlayers = [
            'competition.types.mensdouble',
            'competition.types.womensdouble',
            'competition.types.mixt'].includes(game.type);
        return competitor == 1 ? (twoPlayers != -1 ? (game.player11+' / '+game.player12) : (game.player11)) :
            (twoPlayers != -1 ? (game.player21+' / '+game.player22) : (game.player21));
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
                    name: stage.competitor(game, 1)
                };
                res[game.group_id]['games'][game.competitor1_id][game.competitor2_id] = {...game};

            } else {
                res[game.group_id]['games'][game.competitor1_id][game.competitor2_id] = {...game}
            }
            if (res[game.group_id]['games'][game.competitor2_id] == undefined) {
                res[game.group_id]['games'][game.competitor2_id] = {
                    name: stage.competitor(game, 2)
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
                    dataIndex: 'competitor_'+competitor1
                });
                col++;
                var row = {
                    name: res[group].games[competitor1].name
                };
                row['competitor_'+competitor1] = '';
                Object.keys(res[group].games[competitor1]).map(competitor2 => {
                    if (competitor2 != 'name') {
                        row['competitor_'+competitor2] = '0:0';
                    }
                });
                res[group].data.push(row);
            });
            delete res[group].games;
        });
        return res;
    }

    render() {
        console.log(this.state);
        return (
            this.state.loading ? (
                <React.Fragment></React.Fragment>
            ) : (
                <Descriptions>
                    <Descriptions.Item label={this.props.t('competition.stage.group_count')}>{this.state.config.count}</Descriptions.Item>
                    <Descriptions.Item label={this.props.t('competition.stage.group_competitors')}>{this.state.config.players}</Descriptions.Item>
                </Descriptions>
            )
        )
    }
}

export default useWithForm(withTranslation()(StageGroup));