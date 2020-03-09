import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import {Button} from 'antd'

import { adminRouter } from "./routes";

class App extends Component {
  render() {
    return (
      <div>
        <div>
          这是公共部分
        </div>
        <Switch>
          {
            adminRouter.map(route => {
              return <Route 
                        key={route.pathname} 
                        path={route.pathname} 
                        exact={route.exact}
                        render={(routerProps) => {
                          return <route.component {...routerProps} />
                        }} 
                      />
          })
          }
          <Redirect to={adminRouter[0].pathname} to="/admin" exact/>
          <Redirect to="/404" />
        </Switch>
      </div>
    );
  }
}

export default App;
