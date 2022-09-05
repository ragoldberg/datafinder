/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useState } from "react"
import states from "../../utils/states.json"
import axios from "axios"
import { Select, Input, ConfigProvider } from "antd"
import ptBR from "antd/lib/locale/pt_BR"
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

import { tagRender } from "../../utils/tag-render"

const cache = {}
//ARRUMA TEXTO


//ARRUMA TEXTO

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

const CnaeFilter = ({ formData, setFormData, isMinimum, showMinimum, isMinimum2, showMinimum2 }) => {
	const [situacoesCadastrais, setSituacoesCadastrais] = useState([])
	const [porteEmpresas, setPorteEmpresas] = useState([])
	const [cnaesporclasse, setcnaesporclasse] = useState([])
	const [opcao_pelo_mei, setopcao_pelo_mei] = useState([])
	const [cidades, setCidades] = useState([])
	const [isLoadingCities, setLoadingCities] = useState(false)

	//-// Estados que controlam os CNAEs

	// Educacional: É feita a requisição à base de dados das Seções de CNAEs
	// A informação é inserida no estado secaoCnae (useEffect...[secaoCnae])
	// que ativa um useEffect que, quando o usuário seleciona uma seção,
	// libera o campo Divisão Cnae, e assim por diante, até chegar nas CNAEs de fato.

	// 1) Seção Cnae
	const [secaoCnae, setSecaoCnae] = useState([])
	const [secaoCnaeLoaded, setSecaoCnaeLoaded] = useState(false)
	const [secaoCnaeIsLoading, setSecaoCnaeLoading] = useState(false)
	// 2) Divisão Cnae
	const [divisaoCnae, setDivisaoCnae] = useState([])
	const [divisaoCnaeLoaded, setDivisaoCnaeLoaded] = useState(false)
	const [divisaoCnaeIsLoading, setDivisaoCnaeLoading] = useState(false)
	// 3) Grupo Cnae
	const [grupoCnae, setGrupoCnae] = useState([])
	const [grupoCnaeLoaded, setGrupoCnaeLoaded] = useState(false)
	const [grupoCnaeIsLoading, setGrupoCnaeLoading] = useState(false)
	// 4) Classe Cnae
	const [classeCnae, setClasseCnae] = useState([])
	const [classeCnaeLoaded, setClasseCnaeLoaded] = useState(false)
	const [classeCnaeIsLoading, setClasseCnaeLoading] = useState(false)
	// 5) Cnae
	const [cnae, setCnae] = useState([])
	const [cnaeLoaded, setCnaeLoaded] = useState(false)
	const [cnaeIsLoading, setCnaeLoading] = useState(false)

	//-//

	const [isLoadingcnaesporclasse, setLoadingcnaesporclasse] = useState(false)

	const [descriptionLoaded, setDescriptionLoaded] = useState(false)
	const [classLoaded, setClassLoaded] = useState(false)
	const [capital_social, setcapital_social] = useState([])
	useEffect(() => {
		setSecaoCnae([])
		setcapital_social([])
		setFormData({})
	}, [])

	useEffect(() => {
		;(async () => {
			// const [secao_cnae, cnaesRes, sitCad, porEmp, opmei] = await Promise.all(["/secao_cnae", "/cnaes", "/situacoes-cadastrais", "/porte-empresas", "/sit-mei"].map(getResult))
			const [secao_cnae, sitCad, porEmp, opmei] = await Promise.all(["/secao_cnae", "/situacoes-cadastrais", "/porte-empresas", "/sit-mei"].map(getResult))

			setSecaoCnae(secao_cnae)
			console.log("secao Cnae: ", secao_cnae)
			// setCnae(cnaesRes)
			// console.log("cnaes Res: ", cnaesRes)

			setSituacoesCadastrais(sitCad)
			setPorteEmpresas(porEmp)
			setopcao_pelo_mei(opmei)
		})()
	}, [])

	useEffect(() => {
		;(async () => {
			if (formData.secao_cnae) {
				console.log("formData.secao_cnae: ", formData.secao_cnae)
				const [secao_cnae, cnae_from_secao] = await Promise.all(["/secao_cnae", `/cnae_from_secao/${formData.secao_cnae}`].map(getResult))
				console.log("secao Cnae: ", secao_cnae)

				setCnae(cnae_from_secao)
				console.log("cnaes por secao: ", cnae_from_secao)
			} else {
				setFormData({ ...formData, "secao_cnae": "" })
			}
		})()
	}, [formData.secao_cnae])






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

	console.log("-------------form data----------------: ", formData)

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
				{!isMinimum ? <div style={{ fontSize: 10, color: showMinimum ? "red" : "gray", height: "15px" }}>*Preencha ao menos um dos campos</div> : <div style={{ height: "15px" }}></div>}
				{!isMinimum2 ? <div style={{ fontSize: 10, color: showMinimum2 ? "red" : "gray", height: "15px" }}>**Campo obrigatório</div> : <div style={{ height: "15px" }}></div>}

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Código CNAE${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="cod_cnae" value={formData.cod_cnae} allowClear onChange={e => setFormData({ ...formData, "cod_cnae": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3">Setor</h3>
					<Select
						style={{ width: "100%" }}
						allowClear
						name="secao_cnae"
						value={formData.secao_cnae}
						onChange={e => {
							setFormData({ ...formData, "secao_cnae": e })
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						{secaoCnae && secaoCnae.length > 0 ? (
							secaoCnae.map(c => (
								<Option key={c.cod_setor} value={c.cod_setor}>
									{arrumatexto(c.nm_setor)}
								</Option>
							))
						) : (
							<Option value="" />
						)}
					</Select>
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Selecione CNAE${!isMinimum ? "*" : ""}`}</h3>
					<Select
						mode="multiple"
						showArrow
						allowClear
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="cnae"
						onChange={e => {
							console.log(e)
							setFormData({
								...formData,
								"cnae": e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						{cnae &&
							cnae.length > 0 &&
							cnae.map(c => (
								<Option key={c.cod_cnae} value={c.cod_cnae}>
									{arrumatexto(c.nome)}
								</Option>
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
					<h3 className="titulo_h3">MEI</h3>
					<Select allowClear style={{ width: "100%" }} name="opcao_pelo_mei" value={formData.opcao_pelo_mei} onChange={e => setFormData({ ...formData, "opcao_pelo_mei": e })} showSearch optionFilterProp="children" filterOption={fieldFilter}>
						<option value=""></option>
						<option value="s">Sim</option>
						<option value="n">Não</option>
					</Select>
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum2 ? { color: "red" } : { color: "black" }}>{`Pesquisa UF${!isMinimum2 ? "**" : ""}`}</h3>
					<Select
						required
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

export default memo(CnaeFilter)
