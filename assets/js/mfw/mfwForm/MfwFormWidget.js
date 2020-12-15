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
        var props = this.props.widgetProps ? this.props.widgetProps : {};
        return (
            <Form.Item
                label={element.label}
                name={element.full_name}
                {...props}>                
                <Input/>
            </Form.Item>
        );
    };
    
    hiddenElement(element) {
        return (
            <Form.Item
              name={element.full_name}
              hidden={true} initialValue={element.value}>
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