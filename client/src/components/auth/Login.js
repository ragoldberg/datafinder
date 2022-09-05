/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from "react"
import { connect } from "react-redux"
import { login } from "../../actions/auth"
import PropTypes from "prop-types"
import { Redirect } from "react-router-dom"
import Navbar from "../layout/Navbar"

import { Input, ConfigProvider } from "antd"
import ptBR from "antd/lib/locale/pt_BR"
import ReactGA from 'react-ga';
ReactGA.initialize('G-JVCPL13LBW');

export const Login = ({ login, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: "",
		senha: "",
	})

	const { email, senha } = formData

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

	const onSubmit = async e => {
		e.preventDefault()

		login(email, senha)
	}

	if (isAuthenticated) {
		return <Redirect to="/principal" />
	}

	return (
		<ConfigProvider locale={ptBR}>
			<div className="auth_container">
				<Navbar />
				<div className="auth_inner-container">
					<div className="auth_input-box">
						<h3 className="auth_title">Entrar</h3>
						<form onSubmit={e => onSubmit(e)}>
							<div>
								<div className="form-group">
									<div className="auth_form-field">
										<h3 htmlFor="email">Email</h3>
										<Input type="email" className="input-box" name="email" id="email" value={email} allowClear onChange={e => onChange(e)} placeholder="Digite seu email" required style={{ color: "black" }} />
									</div>
									<div>
										<h3 htmlFor="senha">Senha</h3>
										<Input type="password" className="input-box" name="senha" id="senha" value={senha} allowClear onChange={e => onChange(e)} placeholder="Digite sua senha" required style={{ color: "black" }} />
									</div>
								</div>

								<input type="submit" className="auth_btn" value="ENTRAR" />
							</div>
						</form>
					</div>
				</div>
			</div>
		</ConfigProvider>
	)
}

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { login })(Login)
