
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { logout } from "../../actions/auth"

import ReactGA from 'react-ga';
ReactGA.initialize('G-JVCPL13LBW');



const Navbar = props => {
	const {
		auth: { isAuthenticated, loading, user },
		logout,
		activeCategory,
		visibilidadeCampos,
	} = props

	let mostrar = ""

	
	

	

	

	const deslogados = (
		<ul className="navlinks-secondary">
			<li>
				<Link to="/login">Retornar</Link>
			</li>
			<li>
				<Link to="/trial">
				Requisite seu TRIAL!  <i className="fas fa-edit"></i>
				</Link>
			</li>

			<li>
				<Link to="/lgpd">
				Remoção de dados pessoais  <i className="fas fa-edit"></i>
				</Link>
			</li>
			
		</ul>
	)

	


	if (user) {
		if (user[0].email !== undefined && user[0].email !== "") {
			if (user[0].email === "leandro@datafinder.com.br") {
				mostrar = deslogados
			} else if (user[0].email === "leandro@datafinder.com.br") {
				mostrar = deslogados
			} else {
				mostrar = deslogados
			}
		}
	} else {
		mostrar = deslogados
	}

	return (
		<header className="inner header-container">
			<Link to="/">
				<img src="./img/logo.svg" alt="Logo Datafinder" width="180" />
			</Link>
			<nav>{!loading && <Fragment>{isAuthenticated ? mostrar : deslogados} </Fragment>}</nav>
		</header>
	)
}

Navbar.propTypes = {
	logout: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	auth: state.auth,
})

export default connect(mapStateToProps, { logout })(Navbar)
