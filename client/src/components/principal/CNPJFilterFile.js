/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useState } from "react"
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

const CNPJFilterFile = ({ formData, setFormData, isMinimum, showMinimum }) => {
	const [cnaes, setCnaes] = useState([])

	const [situacoesCadastrais, setSituacoesCadastrais] = useState([])
	const [porteEmpresas, setPorteEmpresas] = useState([])
	const [cnaesporclasse, setcnaesporclasse] = useState([])
	const [opcao_pelo_mei, setopcao_pelo_mei] = useState([])
	const [natureza_juridica, setNatureza_jur] = useState([])
	const [cidades, setCidades] = useState([])
	const [isLoadingCities, setLoadingCities] = useState(false)
	const [iscapital_social, setcapital_social] = useState([])
	const [isLoadingcnaesporclasse, setLoadingcnaesporclasse] = useState(false)
	const [classecnae, setclassecnae] = useState([])

	console.log("-------------form data----------------: ", formData)
	let selectedOptionId = 'Nenhuma'
	useEffect(() => {
		;(async () => {
			const [cnaesRes, sitCad, porEmp, classeCnae, opmei, natjur] = await Promise.all(["/cnaes", "/situacoes-cadastrais", "/porte-empresas", "/classecnae", "/sit-mei", "/natureza_juridica"].map(getResult))

			setCnaes(cnaesRes)

			setSituacoesCadastrais(sitCad)
			setPorteEmpresas(porEmp)
			setclassecnae(classeCnae)
			setopcao_pelo_mei(opmei)
			setNatureza_jur(natjur)
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
			<div >
				{!isMinimum ? <div style={{ fontSize: 10, color: showMinimum ? "red" : "gray", height: "15px" }}>*Preencha ao menos um campo obrigatório</div> : <div style={{ height: "15px" }}></div>}

				

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Razão Social${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="razao_social" value={formData.razao_social} allowClear onChange={e => setFormData({ ...formData, "razao_social": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Nome Fantasia${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="nome_fantasia" value={formData.nome_fantasia} allowClear onChange={e => setFormData({ ...formData, "nome_fantasia": e.target.value })} />
				</div>
				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`CNPJ${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="cnpj" default="" value={formData.cnpj} allowClear onChange={e => setFormData({ ...formData, "cnpj": e.target.value })} />
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
					<h3 className="titulo_h3">Natureza Juridica</h3>
					<Select
						allowClear
						maxTagTextLength={22}
						mode="multiple"
						showArrow
						
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="natureza_juridica"
						onChange={e => {
							setFormData({
								...formData,
								"natureza_juridica": e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						{natureza_juridica.map(c => (
							<option key={c.cod_subclass_natureza_juridica} value={c.cod_subclass_natureza_juridica}>
								{arrumatexto(c.nm_subclass_natureza_juridica)}
							</option>
						))}
					</Select>
				</div>

				<div className="form-group">
					<h3 className="titulo_h3">Idade Empresa maior que:</h3>
					<Select allowClear style={{ width: "100%" }} name="idade_empresa_maior" value={formData.idade_empresa_maior} onChange={e => setFormData({ ...formData, "idade_empresa_maior": e })} showSearch optionFilterProp="children" filterOption={fieldFilter}>
						<option value=""></option>
						<option value="10">10 anos</option>
						<option value="20">20 anos</option>
						<option value="30">30 anos</option>
						<option value="40">40 anos</option>
						<option value="50">50 anos</option>
						<option value="60">60 anos</option>
						<option value="70">70 anos</option>
						<option value="80">80 anos</option>
						<option value="90">90 anos</option>
						<option value="100">100 anos</option>
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

				
				<div className="form-group">
					<h3 className="titulo_h3">Capital Social Declarado</h3>
					<Select style={{width: '100%'}} name="capital_social" value={formData.capital_social} multi={false} 
					
					onChange={e => {e ? setcapital_social(e) : setFormData({ ...formData, "capital_social": "" })}}
						
						defaultInputValue= '1'
						options={[
						{ value: '1', label: 'Todas' },
						{ value: '2', label: 'Sim' },
						{ value: '3', label: 'Nao' },

						]}
						autosize={true}
					/>
				</div>

				<div className="form-group">
					<h3 className="titulo_h3">Ordenação</h3>
					<Select style={{width: '100%'}} name="ordenacao" value={formData.ordenacao} multi={false} 	onChange={e => {e ? setFormData(e) : setFormData({ ...formData, "ordenacao": "" })}}
						allowClear
						defaultInputValue= '1'
						options={[
						{ value: '1', label: 'Nenhuma' },
						{ value: '2', label: 'Capital Social' },
						{ value: '3', label: 'Faturamento' },

						]}
						autosize={true}
					/>
				</div>
			
			
			</div>
		
		</ConfigProvider>
	)
}

export default memo(CNPJFilterFile)
