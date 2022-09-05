
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

	const navLinks = [
		{
			title: "todas empresas",
			tipo: "CNPJ",
		},
		{
			title: "holdings",
			tipo: "HOLDINGS",
		},
		{
			title: "cnae fiscal",
			tipo: "cnae",
		},
		{
			title: "sócios",
			tipo: "SOCIOS",
		},
		{
			title: "dívidas ativas",
			tipo: "Dividas",
		},
		{
			title: "inteligência fiscal",
			tipo: "NCM",
		},
		{
			title: "GEO Marketing",
			tipo: "GEOM",
		},
	/*	{
			title: "DASHBOARDS",
			tipo: "DASH",
		},*/
	
	
	

	]

	const logados = (
		<div className="navbar">
		
			<ul className="navlinks-primary__container">
				{navLinks.map(navLink => {
					return (
						<li className="navlinks-primary__item" key={navLink.tipo} onClick={() => visibilidadeCampos(navLink.tipo)}>
							{navLink.title.toUpperCase()}


							
						</li>
					)
				})}
			</ul>

			<ul className="navlinks-secondary__container">
				<li>BEM-VINDO, {user && user[0].nome.toUpperCase()}</li>
				<li>
				<Link to="/lgpd">
				LGPD  <i className="fas fa-edit"></i>
				</Link>
			</li>
				<li>

					<button onClick={logout} className="navlinks-secondary__button">
						SAIR
					</button>
				</li>
			</ul>
		</div>
	)

	const deslogados = (
		<ul className="navlinks-secondary">
			<li>
				<Link to="/login">Login</Link>
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

	const admin = (
		<ul className="navlinks-secondary">
			<li>Bem-Vindo, {user && user[0].nome}</li>
			<li>
				<Link to="/registrar">
					Cadastrar <i className="fas fa-edit"></i>
				</Link>
			</li>
			<li>
				<Link to="/trial">
					Requisite seu TRIAL! <i className="fas fa-edit"></i>
				</Link>
			</li>

			<li>
				<a onClick={logout} href="#!">
					Sair <i className="fas fa-sign-out-alt"></i>
				</a>
			</li>
		</ul>
	)

	if (user) {
		if (user[0].email !== undefined && user[0].email !== "") {
			if (user[0].email === "leandro@datafinder.com.br") {
				mostrar = admin
			} else if (user[0].email === "leandro@datafinder.com.br") {
				mostrar = admin
			} else {
				mostrar = logados
			}
		}
	} else {
		mostrar = logados
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
