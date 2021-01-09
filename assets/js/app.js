import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import {ConfigProvider} from 'antd';

import 'antd/dist/antd.css';

import '@app/../css/app.css';
import Admin from '@app/components/admin/Admin';

import ruRU from 'antd/lib/locale/ru_RU';
import moment from 'moment-timezone';
import 'moment/locale/ru';

moment.locale('ru');
moment.tz.setDefault('Etc/GMT0');

window.MFW_APP_PROPS.formats = {
    date: moment.localeData().longDateFormat('L'),
    time: moment.localeData().longDateFormat('LT'),
    datetime: moment.localeData().longDateFormat('L')+' '+moment.localeData().longDateFormat('LT'),
    datetimeToMoment: function(datetime) {return moment(datetime, window.MFW_APP_PROPS.formats.datetime)},
    dateToMoment: function(datetime) {return moment(datetime, window.MFW_APP_PROPS.formats.date)}
};

ReactDOM.render(
    <div className="App">
        <Router>
            <ConfigProvider locale={ruRU}> 
                <Admin/>
            </ConfigProvider>
        </Router>
    </div>,
    document.getElementById("root")
);
