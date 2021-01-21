import React, {Component} from 'react';

import { Tabs, Form, Button, message, Modal } from 'antd';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';
import axios from 'axios';

import useWithForm from '@app/mfw/mfwForm/MfwFormHOC';
import MfwForm from '@app/mfw/mfwForm/MfwForm';
import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';

class Stages extends Component {
    constructor(props){
        super(props);
        this.stages = this.stages.bind(this);
        this.createForm = this.createForm.bind(this);
        this.post = this.post.bind(this);
        this.create = this.create.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.labels = {
            name: 'common.name',
            type: 'competition.stage.type',
            group_players: 'competition.competitor.count',
            group_count: 'competition.stage.group_count',
            place2place_places: 'competition.stage.place_count'
        }
        this.state = {
            stages: [],
            createModal: false,
            editStage: 0
        }
    }

    componentDidMount() {
        this.stages();
    }
    
    stages() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.list+'/'+this.props.competition_id).then(res => {
            if (res.data.success) {
                this.setState({
                    stages: res.data.stages,
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch(error => {
            message.error(error.toString());
        });
    }
    
    createForm() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.createForm+'/'+this.props.competition_id).then(res => {
            if (res.data.success) {
                res.data.form.action = window.MFW_APP_PROPS.urls.competition.stage.create;
                //this.props.form.resetFields();
                const parsed = [];
                Object.keys(res.data.form.elements).map(key => {
                    res.data.form.elements[key].widgetProps.label = this.props.t(this.labels[key]);
                    if ((res.data.form.elements[key].attr)&&(res.data.form.elements[key].attr.class)) {
                        parsed.push(res.data.form.elements[key].id);
                    }
                });
                this.setState({
                    form: res.data.form,
                    createModal: true,
                    editStage: -1,
                    parsed: parsed
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
    
    create() {
        this.props.form
            .validateFields()
            .then(values => {
                axios({
                    method: this.state.form.method,
                    url: window.MFW_APP_PROPS.urls.competition.stage.create,
                    data: values,
                    headers: {'Content-Type': 'application/json'}
                }).then(res => {
                    if (res.data.success) {
                        this.setState({
                            stages: res.data.stages,
                        });                        
                    } else {
                        message.error(this.props.t(res.data.error));
                    }
                }).catch(error => {
                    message.error(error.toString());
                });
                this.setState({createModal: false});
            })
            .catch(info => {
                message.error(this.props.t('common.errors.validate'));
            });
        this.setState({createModal: false});
    }    

    post() {
        this.props.form
            .validateFields()
            .then(values => {
                console.log(values);
/*                axios({
                    method: this.state.form.method,
                    url: window.MFW_APP_PROPS.urls.player.post,
                    data: values,
                    headers: {'Content-Type': 'application/json'}
                }).then(res => {
                    if (res.data.success) {
                        this.list();
                    } else {
                        message.error(this.props.t(res.data.error));
                    }
                }).catch(error => {
                    message.error(error.toString());
                });*/
                this.setState({modal: false});
            })
            .catch(info => {
                message.error(this.props.t('common.errors.validate'));
            });
        this.setState({modal: false});
    }

    closeModal() {
        this.setState({createModal: false});
    }

    render() {
        return (
            <React.Fragment>
                <Tabs tabBarExtraContent={{left: <Button className="mfw-margin-right-2" onClick={this.createForm}>{this.props.t('competition.stage.create')}</Button>}}>
                    {
                      this.state.stages.map(stage => {
                            return <Tabs.TabPane tab={stage.name} key={stage.id}>
                                 Content of Tab Pane 1
                            </Tabs.TabPane>;
                      })
                    }
                </Tabs>
                {this.state.createModal == true ?
                    <Modal
                      title={this.props.t('competition.stage.create') }
                      visible={this.state.createModal}
                      onOk={this.create}
                      onCancel={this.closeModal}>
                        <MfwForm
                           formProps={{
                               form: this.props.form,
                               name: this.state.form.name,
                               labelCol: { span: 8 },
                               wrapperCol: { span: 16 }
                           }}
                           parsed={[...this.state.parsed]}
                           mfwForm={this.state.form}
                           success={this.list}>
                            <MfwFormWidget element={this.state.form.elements.name}/>
                            <MfwFormWidget element={this.state.form.elements.type}/>
                            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.type !== curValues.type}>
                            {(form) => {
                                const showType = form.getFieldValue('type');
                                return <React.Fragment>
                                    {Object.keys(this.state.form.elements).map(key => {
                                        if (this.state.parsed.indexOf(this.state.form.elements[key].id) != -1) {
                                            return <MfwFormWidget key={key} element={this.state.form.elements[key]} widgetProps={{hidden: this.state.form.elements[key].attr.class != showType}}/>
                                        }
                                    })}
                                </React.Fragment>
                            }}
                            </Form.Item>
                        </MfwForm>
                    </Modal> : ''
                }
            </React.Fragment>        
        )
    }
}

export default useWithForm(withTranslation()(Stages));