/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */import React, { Fragment, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login"
import Registrar from "./components/auth/Registrar"
import Trial from "./components/auth/trial"
import RegistrationForm from "./components/auth/RegistrationForm"
import Principal from "./components/principal/Principal"
import LGPD from "./components/principal/lgpd"
import "./App.css"

// REDUX
import { Provider } from "react-redux"
import store from "./store"

import Alert from "./components/layout/Alert.js"
import { loadUser } from "./actions/auth"
import setAuthToken from "./utils/setAuthToken"
import PrivateRoute from "./components/routing/PrivateRoute"

if (localStorage.token) {
	setAuthToken(localStorage.token)
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser())
	}, [])

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Route exact path="/" component={Login} />
					<Alert />
					<section className="container">
						<Switch>
							<Route exact path="/registrar" component={Registrar} />
							<Route exact path="/trial" component={Trial} />
							<Route exact path="/RegistrationForm" component={RegistrationForm} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/lgpd" component={LGPD} />
							<PrivateRoute exact path="/principal" component={Principal} />
						</Switch>
					</section>
				</Fragment>
			</Router>
		</Provider>
	)
}

export default App
