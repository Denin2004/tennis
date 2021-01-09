import React, {Component} from 'react';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

import { Form, Input, Button, Select} from 'antd';

import MfwPeriod from '@app/mfw/mfwForm/MfwPeriod';

class MfwFormWidget extends Component {
    constructor(props){
        super(props);
        this.textElement = this.textElement.bind(this);
        this.hiddenElement = this.hiddenElement.bind(this);
        this.buttonElement = this.buttonElement.bind(this);
        this.periodElement = this.periodElement.bind(this);

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
    
    periodElement() {
        return (
            <MfwPeriod element={this.props.element}/>
        );
    }

    choiceElement() {
        return (
            <Form.Item {...this.state.widgetProps}>
                <Select>
                    {this.props.element.choices.map((choice) => {
                        return(
                      <Select.Option key={choice.value} value={choice.value}>{this.state.widgetProps.translate == 'true' ? 
                         this.props.t(choice.label) : choice.label}</Select.Option>
                    )})}
                </Select>
            </Form.Item>
        );
    };

    buttonElement() {
        return (
            <Form.Item {...this.state.widgetProps}>
                <Button htmlType="submit" {...this.props.element.buttonProps}>{this.props.element.title}</Button>
            </Form.Item>
        );
    };

    render() {
        return (
            this[this.props.element.type+'Element']()
        )
    }
}

export default withTranslation()(MfwFormWidget);