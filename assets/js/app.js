import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import 'antd/dist/antd.css';

import '@app/../css/app.css';
import Admin from '@app/components/admin/Admin';

ReactDOM.render(
    <div className="App">
        <Router>
            <Admin/>
        </Router>
    </div>,
    document.getElementById("root")
);
