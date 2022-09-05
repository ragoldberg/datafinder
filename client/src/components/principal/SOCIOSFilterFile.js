/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Component,memo, useEffect, useState } from 'react';
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
import states from "../../utils/states.json"
import axios from "axios"
import { Select, Input, ConfigProvider } from "antd"
import ptBR from "antd/lib/locale/pt_BR"

import { tagRender } from "../../utils/tag-render"

const cache = {}

const getResult = async path => {
	try {
		if (cache[path]) return cache[path]

		const { data } = await axios.get(path)

		cache[path] = data

		return data
	} catch (e) {
		console.error(`Loading error path [${path}]`, e)
		return []
	}
}

const SOCIOSFilterFile = ({ formData, setFormData, isMinimum, showMinimum }) => {


	const [porteEmpresas, setPorteEmpresas] = useState([])
	
	const [cidades, setCidades] = useState([])
	const [isLoadingCities, setLoadingCities] = useState(false)


	const [buscar_qualificacao_socio, setbuscar_qualificacao_socio] = useState([])

	useEffect(() => {
		;(async () => {
			const [porEmp, qualisoc] = await Promise.all([ "/porte-empresas","/qualificacao_socio"].map(getResult))


			setPorteEmpresas(porEmp)
			
			setbuscar_qualificacao_socio(qualisoc)
		})()
	}, [])

	const loadCidades = async e => {
		if (e !== "") {
			setFormData({
				...formData,
				"uf": e,
				"municipio": [],
			})
			setLoadingCities(true)
			const result = await getResult(`/cidades-por-estado/${e}`)
			setCidades(result)
			setLoadingCities(false)
		} else {
			setCidades([])
			setFormData({
				...formData,
				"uf": "",
				"municipio": [],
			})
		}
	}

	const { Option } = Select

	
	const fieldFilter = (input, option) =>
		option.children &&
		option.children
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.includes(
				input
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
			)

	const ufFilter = (input, option) =>
		option.children &&
		option.children[0]
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.includes(
				input
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
			)

	return (
		<ConfigProvider locale={ptBR}>
			<div>
				{!isMinimum ? <div style={{ fontSize: 10, color: showMinimum ? "red" : "gray", height: "15px" }}>*Preencha ao menos um campo obrigatório</div> : <div style={{ height: "15px" }}></div>}

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Nome do Sócio${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="nome_socio" value={formData.nome_socio} allowClear onChange={e => setFormData({ ...formData, "nome_socio": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`CPF${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="cpf" default="" value={formData.cpf} allowClear onChange={e => setFormData({ ...formData, "cpf": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Razão Social Empresa${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="razao_social" value={formData.razao_social} allowClear onChange={e => setFormData({ ...formData, "razao_social": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3">Qualificação do Sócio</h3>
					<Select
						mode="multiple"
						showArrow
						allowClear
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="cod_qualificacao_responsavel_socio"
						onChange={e => {
							console.log(e)
							setFormData({
								...formData,
								"cod_qualificacao_responsavel_socio": e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						<option value="" />
						{buscar_qualificacao_socio.map(c => (
							<option key={c.cod_qualificacao_responsavel_socio} value={c.cod_qualificacao_responsavel_socio}>
								{arrumatexto(c.nm_qualificacao_responsavel_socio)}
							</option>
						))}
					</Select>
				</div>

			{/*
				<div className="form-group">
					<h3 className="titulo_h3">Situação Cadastral</h3>
					<Select
						mode="multiple"
						showArrow
						allowClear
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="cod_situacao_cadastral"
						onChange={e => {
							console.log(e)
							setFormData({
								...formData,
								["cod_situacao_cadastral"]: e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						{situacoesCadastrais.map(c => (
							<option key={c.cod_sit_cad} value={c.cod_sit_cad}>
								{arrumatexto(c.nm_sit_cadastral)}
							</option>
						))}
					</Select>
				</div>
*/}

				<div className="form-group">
					<h3 className="titulo_h3">Porte da Empresa</h3>
					<Select
						mode="multiple"
						showArrow
						allowClear
						
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="porte_empresa"
						onChange={e => {
							setFormData({
								...formData,
								"porte_empresa": e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						{porteEmpresas.map(c => (
							<option key={c.id} value={c.id}>
								{arrumatexto(c.nm_porte)}
							</option>
						))}
					</Select>
				</div>

				<div className="form-group">
					<h3 className="titulo_h3">Pesquisa UF</h3>
					<Select
						style={{ width: "100%" }}
						allowClear
						name="uf"
						value={formData.uf}
						onChange={e => {
							e ? loadCidades(e) : setFormData({ ...formData, "uf": "" })
						}}
						showSearch
						optionFilterProp="children"
						filterOption={ufFilter}
					>
						<Option value=""></Option>

						{Object.keys(states).map(acronym => (
							<Option key={acronym} value={acronym}>
								{arrumatexto(states[acronym].name)}
								<span></span>
							</Option>
						))}
					</Select>
				</div>

				<div className="form-group">
					<h3 className="titulo_h3">Município</h3>
					<Select
						mode="multiple"
						allowClear
						showArrow
						
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="municipio"
						onChange={e => {
							setFormData({
								...formData,
								"municipio": e,
							})
						}}
						value={formData.municipio}
						disabled={isLoadingCities}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						{cidades.map(
							(c, index) =>
								c.cod_tom && (
									<Option key={c.cod_tom + index} value={c.cod_tom}>
										{arrumatexto(c.nome)}
									</Option>
								)
						)}
					</Select>
				</div>
			</div>
		</ConfigProvider>
	)
}

export default memo(SOCIOSFilterFile)
