import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import {ConfigProvider} from 'antd';

import 'antd/dist/antd.css';

import '@app/../css/app.css';
import Admin from '@app/components/admin/Admin';

import ruRU from 'antd/lib/locale/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

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
