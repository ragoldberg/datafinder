/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from "react"
import {
  cnpjMask,
  Info_adicional,
  sit_cad,
  mat_fil,
  ranking,
  date,
  e_mei,
  tem_div,
  numberFormat,
  arrumatexto,
  arrumatexto_1,
  CNPJinput,
  PhoneInput,
  mat_fil_extenso,
  sit_cad_extenso,
} from "../functions/formatos";
import { connect } from "react-redux"
import { setAlert } from "../../actions/alert"
import { REGISTER_TRIAL } from "../../actions/auth"
import Navbar from "../layout/Navbar_std"
import { Input, ConfigProvider } from "antd"
import ptBR from "antd/lib/locale/pt_BR"
import PropTypes from "prop-types"
import ReactGA from 'react-ga';
ReactGA.initialize('G-JVCPL13LBW');





export const Trial = ({ setAlert, REGISTER_TRIAL, isAuthenticated, user }) => {

	var hoje=new Date();
	var trial_date_expires=new Date(hoje);
	trial_date_expires.setDate(trial_date_expires.getDate()+ 7);
	
	
	const [formData, setFormData] = useState({
		nome: "",
		email: "",
		senha: "",
		status: 3,
		empresa:"",
		telefone:"",
		cnpj:"",
		expirydate: trial_date_expires,
		confirmar_senha: "",
		
	})

	
	
	const { nome, email, senha, status, expirydate, empresa,telefone, cnpj, confirmar_senha } = formData

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

	const onSubmit = async e => {
		let cnpj = cnpj1.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
		let telefone = phone
		
		e.preventDefault()
		if (senha !== confirmar_senha) {
			setAlert("As senhas não coincidem!", "danger")
		} else {
			REGISTER_TRIAL({ nome, email, senha, status, empresa, telefone, cnpj, expirydate })
		}
	}

	
	const [phone, setPhone] = useState('');

	const handleInput = ({ target: { value } }) => setPhone(value);
	const [cnpj1, setCnpj] = useState('');

	const handleInputCNPJ = ({ target: { value } }) => setCnpj(value);

	
	return (
		<ConfigProvider locale={ptBR}>
			<div className="trial_container">
				<Navbar />
				<div className="trial_inner-container">
					<div className="trial_input-box">
						<h3 className="trial_title">Cadastre-se para acessar grátis durante 7 dias!</h3>
						<form onSubmit={e => onSubmit(e)}>
							<div>
								<div className="form-group">
									<div className="trial_form-field">
										<h3 htmlFor="nome">Nome</h3>
										<Input type="text" className="input-box" name="nome" id="nome" value={nome} allowClear onChange={e => onChange(e)} placeholder="Digite seu nome completo" required style={{ color: "black" }} />
									</div>

									<div className="trial_form-field">
										<h3 htmlFor="email">Email</h3>
										<Input type="email" className="input-box" name="email" id="email" value={email} allowClear onChange={e => onChange(e)} placeholder="Digite seu e-mail" required style={{ color: "black" }} />
									</div>
									<div className="trial_form-field">
										<h3 htmlFor="senha">Senha</h3>
										<Input type="password" className="input-box" name="senha" id="senha" value={senha} allowClear onChange={e => onChange(e)} placeholder="Digite sua senha" required style={{ color: "black" }} />
									</div>
									
									<div className="trial_form-field">
										<h3 htmlFor="confirmar_senha">Confirmar senha</h3>
										<Input type="password" className="input-box" name="confirmar_senha" id="confirmar_senha" value={confirmar_senha} allowClear onChange={e => onChange(e)} placeholder="Confirme sua senha" required style={{ color: "black" }} />
									</div>
									<div className="trial_form-field">
										<h3 htmlFor="empresa">Empresa</h3>
										<Input type="empresa" className="input-box" name="empresa" id="empresa" value={empresa} allowClear onChange={e => onChange(e)} placeholder="Digite o nome de sua Empresa" required style={{ color: "black" }} />
									</div>

									<div className="trial_form-field">
										<h3 htmlFor="cnpj">CNPJ</h3>
										<CNPJinput  className="input-box"  name="cnpj" value={cnpj1}   onChange={handleInputCNPJ}> </CNPJinput>
									</div>
									
									
									
									<div className="trial_form-field">
										<h3 htmlFor="telefone">Telefone</h3>
     									 <PhoneInput  className="input-box"  name="telefone" value={phone}   onChange={handleInput}> </PhoneInput>
      
  									  </div>

									
								</div>

								<input type="submit" className="trial_btn" value="REGISTRAR" />
							</div>
						</form>
					</div>
				</div>
			</div>
		</ConfigProvider>
	)
}

Trial.propTypes = {
	setAlert: PropTypes.func.isRequired,
	REGISTER_TRIAL: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
})

export default connect(mapStateToProps, { setAlert, REGISTER_TRIAL })(Trial)
