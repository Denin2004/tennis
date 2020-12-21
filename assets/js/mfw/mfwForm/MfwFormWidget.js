import React, {Component} from 'react';

import { Form, Input, Button } from 'antd';

class MfwFormWidget extends Component {
    constructor(props){
        super(props);
        this.textElement = this.textElement.bind(this);
        this.hiddenElement = this.hiddenElement.bind(this);
        this.buttonElement = this.buttonElement.bind(this);
    }    
    
    textElement(element) {
        var props = element.widgetProps ? element.widgetProps : {};
        return (
            <Form.Item {...props}>                
                <Input/>
            </Form.Item>
        );
    };
    
    hiddenElement(element) {
        var props = element.widgetProps ? element.widgetProps : {};
        return (
            <Form.Item
              hidden={true} 
              {...props}>
                <input type="hidden"/>
            </Form.Item>
        );
    };
    
    buttonElement(element) {
        return (
            <Form.Item>                
                <Button htmlType="submit" type={element.type ? element.type : 'primary'}>{element.title}</Button>
            </Form.Item>
        );
    };
    
    render() {
        return (
            this[this.props.element.type+'Element'](this.props.element)
        )
    }
}

export default MfwFormWidget;