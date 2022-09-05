/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useState } from "react"
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

const HoldingsFilterFile = ({ formData, setFormData, isMinimum, showMinimum }) => {
	const [cnaes, setCnaes] = useState([])
	const [situacoesCadastrais, setSituacoesCadastrais] = useState([])
	const [porteEmpresas, setPorteEmpresas] = useState([])
	const [cidades, setCidades] = useState([])
	const [isLoadingCities, setLoadingCities] = useState(false)
	const [classecnae, setclassecnae] = useState([])
	const [cnaesporclasse, setcnaesporclasse] = useState([])
	const [isLoadingcnaesporclasse, setLoadingcnaesporclasse] = useState(false)
	const [qualificacao_socia, setqualificacao_socia] = useState([])
	const [opcao_pelo_mei, setopcao_pelo_mei] = useState([])
	const [natureza_juridica, setNatureza_jur] = useState([])

	function arrumatexto(string) {
		return string.replace(/\S*/g, function (word) {
			return word.charAt(0) + word.slice(1).toLowerCase()
		})
	}

	console.log("===========form data=============: ", formData)

	useEffect(() => {
		;(async () => {
			const [cnaesRes, sitCad, porEmp, classeCnae, qual_socia, opmei, natjur] = await Promise.all(["/cnaes", "/situacoes-cadastrais", "/porte-empresas", "/classecnae", "/qualificacao_socia", "/sit-mei", "/natureza_juridica"].map(getResult))

			setCnaes(cnaesRes)
			setSituacoesCadastrais(sitCad)
			setPorteEmpresas(porEmp)
			setclassecnae(classeCnae)
			setqualificacao_socia(qual_socia)
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
			<div>
				{!isMinimum ? <div style={{ fontSize: 10, color: showMinimum ? "red" : "gray", height: "15px" }}>*Preencha ao menos um campo obrigatório</div> : <div style={{ height: "15px" }}></div>}

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`CNPJ${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="cnpj_socia" value={formData.cnpj_socia} allowClear onChange={e => setFormData({ ...formData, "cnpj_socia": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Razão Social${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="razao_social" value={formData.razao_social} allowClear onChange={e => setFormData({ ...formData, "razao_social": e.target.value })} />
				</div>

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
							setFormData({
								...formData,
								"cod_situacao_cadastral": e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						<option value="" />

						{situacoesCadastrais.map(c => (
							<option key={c.cod_sit_cad} value={c.cod_sit_cad}>
								{arrumatexto(c.nm_sit_cadastral)}
							</option>
						))}
					</Select>
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Qualificação da Holding${!isMinimum ? "*" : ""}`}</h3>

					<Select
						mode="multiple"
						showArrow
						allowClear
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="qualificacao_socia"
						value={formData.qualificacao_socia}
						onChange={e => {
							setFormData({
								...formData,
								"qualificacao_socia": e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						<option value="" />
						{qualificacao_socia.map(c => (
							<option key={c.nm_quali_socia} value={c.nm_quali_socia}>
								{arrumatexto(c.nm_quali_socia)}
							</option>
						))}
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
					<h3 className="titulo_h3">Selecione CNAE</h3>

					<Select
						allowClear
						maxTagTextLength={22}
						mode="multiple"
						showArrow
						showSearch
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="cnae"
						onChange={e => {
							setFormData({
								...formData,
								"cnae": e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						<option value="" />
						{cnaes.map(c => (
							<option key={c.cod_cnae} value={c.cod_cnae}>
								{arrumatexto(c.nome)}
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

export default memo(HoldingsFilterFile)
