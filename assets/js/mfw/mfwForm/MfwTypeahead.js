import React, {Component} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

class MfwTypeahead extends Component {
    constructor(props){
        super(props);
        this.inputChange = this.inputChange.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            value: this.props.element.value ? this.props.element.value : '',
            label: this.props.element.text ? this.props.element.text : '',
            loading: false,
            open: false,
            options: [],
            multiple: this.props.element.multiple ? this.props.element.multiple : false
        }
    }

    onChange(event, value, reason) {
        if (reason == 'clear') {
            this.setState((state) => (state.value = state.multiple ? [] : ''))
        } else {
            this.setState((state) => {
                if (state.multiple) {
                    state.value = [];
                    value.map(option => state.value.push(option.value));
                } else {
                    state.value = value.value;
                    state.label = value.label; 
                }
                return state;
            });
        }
        if (this.props.element.onChange != undefined) {
            this.props.element.onChange(value);
        }
    }

    inputChange(event, value, reason) {
        switch (reason) {
            case 'input':
                this.setState({loading: true});
                axios.get(this.props.element.src.url+'?query='+value).then(res => {
                    if (res.data.success) {
                        this.setState({
                            loading: false,
                            options: res.data.find,
                            open: true,
                            label: value,
                            error: ''
                        });
                    } else {
                        this.setState({error: res.error})
                    }
                }).catch((error) => {
                    this.setState({error: error.toString(), loading: false});
                });
                break;
            case 'reset':
                this.setState({open: false});
                break;
            case 'clear':
                this.setState({open: false});
                break;
        }
    };

    renderInput(params) {
        return (
            <TextField
                {...params}
                label={this.props.element.label}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                      <React.Fragment>
                          {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                      </React.Fragment>
                  )
                }}
            />
        )
    }

    render() {
        //inputValue={this.state.label}
        var props = this.props.widgetProps ? this.props.widgetProps : {};
        return (
            <React.Fragment>
                <Autocomplete
                  {...props}
                  open={this.state.open}
                  inputValue={this.state.label}
                  multiple={this.state.multiple}
                  getOptionSelected={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label }
                  options={this.state.options}
                  loading={this.state.loading}
                  onInputChange={this.inputChange}
                  onChange={this.props.onChange ? this.props.onChange : this.onChange}
                  onKeyPress={(ev) => {if (ev.key === 'Enter') {ev.preventDefault();}}}
                  renderInput={this.renderInput}/>
                <input type="hidden" id={this.props.element.id} value={this.props.getValue ? this.props.getValue() : this.state.value} name={this.props.element.full_name} />
            </React.Fragment>
        )
    }
}

export default withTranslation()(MfwTypeahead);