/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { Fragment, useState } from "react"
import { connect } from "react-redux"
import { setAlert } from "../../actions/alert"
import { REGISTER_LGPD } from "../../actions/auth"
import { Redirect } from "react-router-dom"
import Navbar from "../layout/Navbar_std"
import { Input, ConfigProvider } from "antd"
import ptBR from "antd/lib/locale/pt_BR"

import PropTypes from "prop-types"
import { toDate } from "date-fns"

import InputMask from 'react-input-mask';


function PhoneInput(props) {
    return (
      <InputMask 
        mask='(+55 99) 9999-99999' 
        value={props.value} 
        onChange={props.onChange}>
      </InputMask>
    )}
    function CNPJinput(props) {
      return (
        <InputMask 
          mask='99.999.999/9999-99' 
          value={props.value} 
          onChange={props.onChange}>
        </InputMask>
      );
    }


    
export const LGPD = ({ REGISTER_LGPD }) => {


	const [formData, setFormData] = useState({
		nome: "",
		email: "",
	
	

		telefone:"",
		cnpj:"",

		
	})

	
	
	const { nome, email, telefone, cnpj } = formData

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

	const onSubmit = async e => {
		let cnpj = cnpj1.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
		let telefone = phone
		
		e.preventDefault()
		// eslint-disable-next-line no-self-compare
		if (1==1) {
			REGISTER_LGPD({ nome, email,telefone, cnpj  })
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
						<h3 className="trial_title">Formulário de revogação do consentimento, como nos termos do § 5º do art. 8º da LGPD</h3>
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
										<h3 htmlFor="cnpj">CNPJ</h3>
										<CNPJinput  className="input-box"  name="cnpj" value={cnpj1}   onChange={handleInputCNPJ}> </CNPJinput>
									</div>
									
									
									
									<div className="trial_form-field">
										<h3 htmlFor="telefone">Telefone</h3>
     									 <PhoneInput  className="input-box"  name="telefone" value={phone}   onChange={handleInput}> </PhoneInput>
      
  									  </div>

                                        <h6 className="trial_title">
                                        O Datafinder fará a remoção completa dos dados associados ao CNPJ fornecido neste formulário em até 7 dias uteis.
Todas as informações relacionadas serão excluídas das pesquisas internas após análise das informações</h6>
								</div>

								<input type="submit" className="trial_btn" value="REMOVER" />
							</div>
						</form>
					</div>
				</div>
			</div>
		</ConfigProvider>
	)
}

LGPD.propTypes = {
	setAlert: PropTypes.func.isRequired,
	REGISTER_LGPD: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
})

export default connect(mapStateToProps, { setAlert, REGISTER_LGPD })(LGPD)
