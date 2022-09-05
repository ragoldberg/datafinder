/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from "react"
import { connect } from "react-redux"
import { setAlert } from "../../actions/alert"
import { register } from "../../actions/auth"
import { Redirect } from "react-router-dom"
import Navbar from "../layout/Navbar"

import { Input, ConfigProvider } from "antd"
import ptBR from "antd/lib/locale/pt_BR"

import PropTypes from "prop-types"

export const Registrar = ({ setAlert, register, isAuthenticated, user }) => {
	const [formData, setFormData] = useState({
		nome: "",
		email: "",
		senha: "",
		confirmar_senha: "",
	})

	const { nome, email, senha, confirmar_senha } = formData

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

	const onSubmit = async e => {
		e.preventDefault()
		if (senha !== confirmar_senha) {
			setAlert("As senhas não coincidem!", "danger")
		} else {
			register({ nome, email, senha })
		}
	}

	// if ( ! (isAuthenticated && user[0].email === 'teste@teste.com'))
	// {
	//     return ( <Redirect  to="/principal" />)
	// }

	return (
		<ConfigProvider locale={ptBR}>
			<div className="auth_container">
				<Navbar />
				<div className="auth_inner-container">
					<div className="auth_input-box">
						<h3 className="auth_title">Cadastrar Usuário</h3>
						<form onSubmit={e => onSubmit(e)}>
							<div>
								<div className="form-group">
									<div className="auth_form-field">
										<h3 htmlFor="nome">Nome</h3>
										<Input type="text" className="input-box" name="nome" id="nome" value={nome} allowClear onChange={e => onChange(e)} placeholder="Digite seu nome" required style={{ color: "black" }} />
									</div>

									<div className="auth_form-field">
										<h3 htmlFor="email">Email</h3>
										<Input type="email" className="input-box" name="email" id="email" value={email} allowClear onChange={e => onChange(e)} placeholder="Digite seu email" required style={{ color: "black" }} />
									</div>
									<div className="auth_form-field">
										<h3 htmlFor="senha">Senha</h3>
										<Input type="password" className="input-box" name="senha" id="senha" value={senha} allowClear onChange={e => onChange(e)} placeholder="Digite sua senha" required style={{ color: "black" }} />
									</div>
									<div>
										<h3 htmlFor="confirmar_senha">Confirmar senha</h3>
										<Input type="password" className="input-box" name="confirmar_senha" id="confirmar_senha" value={confirmar_senha} allowClear onChange={e => onChange(e)} placeholder="Confirme sua senha" required style={{ color: "black" }} />
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

Registrar.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
})

export default connect(mapStateToProps, { setAlert, register })(Registrar)
