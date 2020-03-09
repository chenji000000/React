import React from 'react';
import {render} from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from './App';
import './index.less'

import { mainRouter } from "./routes";

render(
    <Router>
        <Switch>
            <Route path="/admin" render={(routerProps) => {
                return <App {...routerProps} />
            }}/>
            {
                mainRouter.map(route => {
                    return <Route key={route.pathname} path={route.pathname} component={route.component} />
                })
            }
        </Switch>
    </Router>,
    document.querySelector("#root")
)