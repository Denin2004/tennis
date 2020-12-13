import React, {Component} from 'react';

import { Form } from 'antd';

import axios from 'axios';
import { withTranslation } from 'react-i18next';

import MfwFormWidget from '@app/mfw/mfwForm/MfwFormWidget';

class MfwForm extends Component {
    constructor(props){
        super(props);
        this.state = { 
            layout: props.layout ? props.layout : {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 }
            }
        }
        this.closeError = this.closeError.bind(this);
        this.finish = this.finish.bind(this);
    }    
    
    closeError() {
        this.setState({error: ''});
    }

    finish(values) {
        axios({
            method: this.props.method,
            url: this.props.form.action,
            data: values,
        }).then(res => {
            if (res.data.success) {
                this.props.success(res.data);
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch(error => {
            message.error(error.toString());
        });
    }    
    
    findWidget(child, parsed) {
        const children = React.Children.toArray(child.props ? (child.props.children ? child.props.children : []) : []);
        if ((child.props)&&(child.props.element)&&(child.props.element.id)) {
            parsed.push(child.props.element.id);
        }
        children.map(ch => {
            this.findWidget(ch, parsed);
        });
    }
    
    render() {
        var parsed = [];
        React.Children.toArray(this.props.children).map((child) => {
            this.findWidget(child, parsed);
        });
        return (
            <Form {...this.state.layout} name={this.props.form.name} onFinish={this.finish}>
                {this.props.children} 
                {Object.keys(this.props.form.elements).map(key => {
                    if (parsed.indexOf(this.props.form.elements[key].id) === -1) { 
                        return (
                            <MfwFormWidget key={key} element={this.props.form.elements[key]}/>
                        )
                    }
                })}   
            </Form>
        )
    }
}

export default withTranslation()(MfwForm);