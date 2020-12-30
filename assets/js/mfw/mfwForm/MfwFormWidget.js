import React, {Component} from 'react';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import { Form, Input, Button, Select, DatePicker } from 'antd';

class MfwFormWidget extends Component {
    constructor(props){
        super(props);
        this.textElement = this.textElement.bind(this);
        this.hiddenElement = this.hiddenElement.bind(this);
        this.buttonElement = this.buttonElement.bind(this);
        this.disabledTime = this.disabledTime.bind(this);
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
        var {rangeProps} = this.state.widgetProps;
        if (rangeProps.showTime) {
            rangeProps.showTime = {
                format: moment.localeData().longDateFormat('LT')
            }
            if (rangeProps.disableTime) {
                rangeProps.disabledTime = this.disabledTime;
                rangeProps.showTime.hideDisabledOptions = true;
            }
            rangeProps.format = moment.localeData().longDateFormat('L')+
                    ' '+moment.localeData().longDateFormat('LT');
        } else {
            rangeProps.format = moment.localeData().longDateFormat('L');
        }
        return (
            <Form.Item {...this.state.widgetProps.itemProps}>
                <DatePicker.RangePicker {...rangeProps} />
            </Form.Item>
        );
    }
    
    disabledTime() {
        return {
            disabledHours: () => this.state.widgetProps.rangeProps.disableTime.disabledHours ? 
               this.state.widgetProps.rangeProps.disableTime.disabledHours : [],
            disabledMinutes: () => this.state.widgetProps.rangeProps.disableTime.disabledMinutes ? 
               this.state.widgetProps.rangeProps.disableTime.disabledMinutes : [],
            disabledSeconds: () => this.state.widgetProps.rangeProps.disableTime.disabledSeconds ? 
               this.state.widgetProps.rangeProps.disableTime.disabledSeconds : []
       };
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

export default withTranslation()(MfwFormWidget);