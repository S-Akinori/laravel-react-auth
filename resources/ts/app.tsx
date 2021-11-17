import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import Top from './views/Top'
import ProvideAuth, { PrivateRoute, PublicRoute } from './AuthContext'
 
const App = () => {
    return (
      <ProvideAuth>
        <BrowserRouter>
          <div>
            <Switch>
                <Route path="/" exact><Top /></Route>
                <PublicRoute path="/register" exact><Register/></PublicRoute>
                <PublicRoute path="/login" exact><Login/></PublicRoute>
                <PrivateRoute path="/home" exact><Home/></PrivateRoute>
            </Switch>
          </div>
        </BrowserRouter>
      </ProvideAuth>
    )
}
 
ReactDOM.render(
    <App />,
    document.getElementById('app')
)