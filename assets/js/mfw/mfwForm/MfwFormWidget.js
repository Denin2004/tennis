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
        if (props.InputProps == undefined) {
            props.InputProps = {name: element.full_name};
        } else {
            props.InputProps.name = element.full_name;
        }
        props.fullWidth = props.fullWidth != undefined ? props.fullWidth : true;
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
            <Input type="hidden" id={element.id} value={element.value} name={element.full_name} />
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