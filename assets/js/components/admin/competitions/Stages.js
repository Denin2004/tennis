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
        this.addForm = this.addForm.bind(this);
        this.post = this.post.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.state = {
            stages: [],
            modal: false,
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
    
    addForm() {
        axios.get(window.MFW_APP_PROPS.urls.competition.stage.addForm+'/'+this.props.competition_id).then(res => {
            if (res.data.success) {
                res.data.form.action = window.MFW_APP_PROPS.urls.competition.stage.create;
                this.props.form.resetFields();
                console.log(res.data.form);
                this.setState({
                    form: res.data.form,
                    modal: true,
                    editStage: -1
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
        this.setState({modal: false});
    }

    render() {
        return (
            <React.Fragment>
                <Tabs tabBarExtraContent={{left: <Button className="mfw-margin-right-2" onClick={this.addForm}>{this.props.t('competition.stage.create')}</Button>}}>
                    {
                      this.state.stages.map(stage => {
                            return <Tabs.TabPane tab={stage.name} key={stage.id}>
                                 Content of Tab Pane 1
                            </Tabs.TabPane>;
                      })
                    }
                </Tabs>
                {this.state.modal == true ?
                    <Modal
                      title={this.props.t(this.state.editStage == -1 ? 'player.new' : 'player.edit') }
                      visible={this.state.modal}
                      onOk={this.post}
                      onCancel={this.closeModal}>
                        <MfwForm
                           formProps={{
                               form: this.props.form,
                               name: this.state.form.name,
                               labelCol: { span: 8 },
                               wrapperCol: { span: 16 }
                           }}
                           mfwForm={this.state.form}
                           success={this.list}>
                            <MfwFormWidget element={this.state.form.elements.name}/>
                            <MfwFormWidget element={this.state.form.elements.type}/>
                            <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.type !== curValues.type}>
                            {(form) => { 
                                console.log(form.getFieldValue('type'));
                                return(
                                        <div></div>
                                )}}
                            </Form.Item>
                        </MfwForm>
                    </Modal> : ''
                }
            </React.Fragment>        
        )
    }
}

export default useWithForm(withTranslation()(Stages));