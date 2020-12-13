import React, {Component} from 'react';

import { Form } from 'antd';

import axios from 'axios';
import { withTranslation } from 'react-i18next';

import MfwFormWidget from '@app/mfw/MfwFormWidget';
import MfwSnackbar from '@app/mfw/MfwSnackbar';

class MfwForm extends Component {
    constructor(props){
        super(props);
        this.state = { 
            error: ''
        }
        this.closeError = this.closeError.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }    
    
    closeError() {
        this.setState({error: ''});
    }

    handleSubmit(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: this.props.form.action,
            data: new FormData(event.target),
        }).then(res => {
            if (res.data.success) {
                this.props.successSubmit(res.data);
            } else {
                this.setState({error: res.data.error})
            }
        }).catch(error => {
            this.setState({error: error.toString(), loading: false});
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
            <form action={this.props.form.action} method={this.props.form.method} name={this.props.form.name} onSubmit={this.handleSubmit}>
                {this.props.children} 
                {Object.keys(this.props.form.elements).map(key => {
                    if (parsed.indexOf(this.props.form.elements[key].id) === -1) { 
                        return (
                            <MfwFormWidget key={key} element={this.props.form.elements[key]}/>
                        )
                    }
                })}   
            </form>
        )
    }
}

export default withTranslation()(MfwForm);