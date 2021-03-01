import React, {Component} from 'react';

import axios from 'axios';

import { Form, AutoComplete, message, Input } from 'antd';

class MfwAutocomplete extends Component {
    constructor(props) {
        super(props);
        const widgetProps = this.props.element.widgetProps ? 
                (this.props.widgetProps ? {...this.props.element.widgetProps, ...this.props.widgetProps} : this.props.element.widgetProps) : 
                (this.props.widgetProps ? this.props.widgetProps : {});
        this.onSearch = this.onSearch.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.state = {
            widgetProps : widgetProps,
            autocompleteProps : this.props.element.autocompleteProps ? 
                (this.props.autocompleteProps ? {...this.props.element.autocompleteProps, ...this.props.autocompleteProps} : this.props.element.autocompleteProps) : 
                (this.props.autocompleteProps ? this.props.autocompleteProps : 
                    (widgetProps.search ? {
                        onSearch: this.onSearch, 
                        onSelect: this.onSelect,
                        options: [], 
                        value: this.props.element.search.widgetProps.initialValue} : 
                        {
                            value: this.props.element.search.widgetProps.initialValue
                        }
                    )),
            autocompleteItemProps : this.props.element.autocompleteItemProps ? 
                (this.props.autocompleteItemProps ? {...this.props.element.autocompleteItemProps, ...this.props.autocompleteItemProps} : this.props.element.autocompleteItemProps) : 
                (this.props.autocompleteItemProps ? this.props.autocompleteItemProps : {})
        }
    }
    
    onSearch(value) {
        axios.get(this.props.widgetProps.search.url+'/'+encodeURI(value)).then(res => {
            if (res.data.success) {
                this.setState((state) => {
                    state.autocompleteProps.options = res.data.data;
                    return state; 
                });
            } else {
                message.error(this.props.t(res.data.error));
            }
        }).catch((error) => {
            message.error(error.toString());
            this.setState({modal: false});
        });
    }
    
    onSelect(value, option) {
        const values = {};
        values[this.props.element.widgetProps.name] = {};
        values[this.props.element.widgetProps.name][this.props.element.value.widgetProps.name] = option.id;
        values[this.props.element.widgetProps.name][this.props.element.search.widgetProps.name] = value;
        this.props.widgetProps.search.form.setFieldsValue(values);
    }
    
    componentWillReceiveProps(nextProps) {
        const widgetProps = nextProps.element.widgetProps ? 
                (nextProps.widgetProps ? {...nextProps.element.widgetProps, ...nextProps.widgetProps} : netxProps.element.widgetProps) : 
                (nextProps.widgetProps ? nextProps.widgetProps : {});
        
        this.setState(state => {
            state.widgetProps = widgetProps;
            state.autocompleteProps = nextProps.element.autocompleteProps ? 
                (nextProps.autocompleteProps ? {...nextProps.element.autocompleteProps, ...nextProps.autocompleteProps} : nextProps.element.autocompleteProps) : 
                (nextProps.autocompleteProps ? nextProps.autocompleteProps : 
                    (widgetProps.search ? {
                        onSearch: this.onSearch, 
                        onSelect: this.onSelect,
                        options: [],                         
                        value: nextProps.element.search.widgetProps.initialValue} : 
                        {
                            value: nextProps.element.search.widgetProps.initialValue
                        }
                    ));
            state.autocompleteItemProps = nextProps.element.autocompleteItemProps ? 
                (nextProps.autocompleteItemProps ? {...nextProps.element.autocompleteItemProps, ...nextProps.autocompleteItemProps} : nextProps.element.autocompleteItemProps) : 
                (nextProps.autocompleteItemProps ? nextProps.autocompleteItemProps : {});
            return state;
        });
    } 
    
    render() {
        return (
            <React.Fragment>    
                <Form.Item {...this.state.autocompleteItemProps}>
                    <AutoComplete {...this.state.autocompleteProps}>
                    { this.state.widgetProps.customInput ? this.state.widgetProps.customInput() : null} 
                    </AutoComplete>
                </Form.Item>
                <Form.Item hidden={true} {...this.props.element.widgetProps.itemProps}>
                    <Input type="hidden"/>
                </Form.Item>
            </React.Fragment>    
        )
    }
}

export default MfwAutocomplete;