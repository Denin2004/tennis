import React, {Component} from 'react';

class MfwFormWidget extends Component {
    constructor(props){
        super(props);
        this.textElement = this.textElement.bind(this);
        this.choiceElement = this.choiceElement.bind(this);
        this.hiddenElement = this.hiddenElement.bind(this);
        this.fileElement = this.fileElement.bind(this);
        this.checkboxElement = this.checkboxElement.bind(this);
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
            <TextField
               {...props}
               label={element.label}
               id={element.id} 
               defaultValue={element.value} 
               onKeyPress={(ev) => {if (ev.key === 'Enter') {ev.preventDefault();}}}/>
        );
    };
    
    passwordElement(element) {
        var props = this.props.widgetProps ? this.props.widgetProps : {};
        if (props.InputProps == undefined) {
            props.InputProps = {name: element.full_name};
        } else {
            props.InputProps.name = element.full_name;
        }
        props.fullWidth = props.fullWidth != undefined ? props.fullWidth : true;
        return (
            <TextField
               {...props}
               label={element.label}
               type="password"
               id={element.id} 
               defaultValue={element.value} 
               onKeyPress={(ev) => {if (ev.key === 'Enter') {ev.preventDefault();}}}/>
        );
    };    
    
    hiddenElement(element) {
        return (
            <input type="hidden" id={element.id} value={element.value} name={element.full_name} />
        );
    };
    
    render() {
        return (
            this[this.props.element.type+'Element'](this.props.element)
        )
    }
}

export default MfwFormWidget;