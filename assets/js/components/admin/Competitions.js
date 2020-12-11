import React, {Component} from 'react';
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';

import i18n from '@app/i18app';
import { withTranslation } from 'react-i18next';

class Competitions extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <React.Fragment>
            Competitions
            </React.Fragment>
        )
    }
}

export default withTranslation()(Competitions);