import React, {Component} from 'react';

import { Form, Input, Button } from 'antd';

class MfwFormWidget extends Component {
    constructor(props){
        super(props);
        this.textElement = this.textElement.bind(this);
        this.hiddenElement = this.hiddenElement.bind(this);
        this.buttonElement = this.buttonElement.bind(this);
        this.state = {
            widgetProps : this.props.widgetProps ? 
            (this.props.element.widgetProps ? {...this.props.element.widgetProps, ...this.props.widgetProps} : this.props.widgetProps) : 
            (this.props.element.widgetProps ? this.props.element.widgetProps : {})
        }
    }

    textElement() {
        return (
            <Form.Item {...this.state.widgetProps}>
                <Input/>
            </Form.Item>
        );
    };

    hiddenElement() {
        return (
            <Form.Item hidden={true} {...this.state.widgetProps}>
                <input type="hidden"/>
            </Form.Item>
        );
    };

    buttonElement() {
        return (
            <Form.Item>
                <Button htmlType="submit" type={this.props.element.type ? this.props.element.type : 'primary'}>{this.props.element.title}</Button>
            </Form.Item>
        );
    };

    render() {
        return (
            this[this.props.element.type+'Element']()
        )
    }
}

export default MfwFormWidget;