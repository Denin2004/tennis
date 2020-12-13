import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';


class MfwSelect extends Component {
    constructor(props){
        super(props);
        this.state = {
            value: props.element.value
        }
        this.selectChange = this.selectChange.bind(this);
    }    
    
    selectChange(event) {
        this.setState( (state) => {
            state.value = event.target.value;
            return state;
        })
    };
   
    render() {
        return (
            <TextField
              id={this.props.element.id}
              name ={this.props.element.full_name}
              select
              fullWidth
              label={this.props.element.label}
              value={this.state.value}
              onChange={this.selectChange}
              SelectProps={{
                multiple: this.props.element.multiple
              }}>
                {this.props.element.choices.map((choice) => {
                    return(
                  <MenuItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </MenuItem>
                )})}
            </TextField>                
        )
    }
}

export default MfwSelect;