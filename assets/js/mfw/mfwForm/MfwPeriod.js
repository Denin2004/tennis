import React, {Component} from 'react';

import moment from 'moment-timezone';

import { Form, DatePicker } from 'antd';

class MfwPeriod extends Component {
    constructor(props){
        super(props);
        this.disabledTime = this.disabledTime.bind(this);
        var rangeProps = {
            format: props.element.widgetProps.showTime ? window.MFW_APP_PROPS.formats.datetime : 
                window.MFW_APP_PROPS.formats.date
        },
        widgetProps = this.props.element.widgetProps ? 
            (this.props.widgetProps ? {...this.props.element.widgetProps, ...this.props.widgetProps} : this.props.element.widgetProps) : 
            (this.props.widgetProps ? this.props.widgetProps : {});
        if (widgetProps.showTime) {
            rangeProps.showTime = widgetProps.showTime;
            if (widgetProps.disableTime) {
                rangeProps.disabledTime = this.disabledTime;
                rangeProps.showTime = {hideDisabledOptions: true};
            }
        }
        if (widgetProps.rangeProps &&(widgetProps.rangeProps.defaultValue != undefined)) {
            rangeProps.defaultValue = [];
            widgetProps.rangeProps.defaultValue.map(function(value) {
                rangeProps.defaultValue.push(moment(value, rangeProps.format));
            });
        }
        this.state = {
            widgetProps : widgetProps,
            rangeProps: rangeProps
        }
    }
    
    disabledTime() {
        return {
            disabledHours: () => this.props.element.widgetProps.disableTime.disabledHours ? 
               this.props.element.widgetProps.disableTime.disabledHours : [],
            disabledMinutes: () => this.props.element.widgetProps.disableTime.disabledMinutes ? 
               this.props.element.widgetProps.disableTime.disabledMinutes : [],
            disabledSeconds: () => this.props.element.widgetProps.disableTime.disabledSeconds ? 
               this.props.element.widgetProps.disableTime.disabledSeconds : []
        }
    }

    render() {
        return (
            <Form.Item {...this.props.element.widgetProps.itemProps}>
                <DatePicker.RangePicker {...this.state.rangeProps} />
            </Form.Item>
        )
    }
}

export default MfwPeriod;