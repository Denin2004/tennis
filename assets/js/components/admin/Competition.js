import React, {Component} from 'react';
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

class Competition extends Component {
    constructor(props){
        super(props);
        console.log(props.match.params.id);
    }

    render() {
        return (
            <React.Fragment>Competition</React.Fragment>
        )
    }
}

export default withTranslation()(Competition);