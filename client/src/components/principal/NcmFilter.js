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

const NcmFilter = ({ formData, setFormData, isMinimum, showMinimum }) => {
	const [cnaes, setCnaes] = useState([])
	const [situacoesCadastrais, setSituacoesCadastrais] = useState([])
	const [porteEmpresas, setPorteEmpresas] = useState([])
	const [cidades, setCidades] = useState([])
	const [isLoadingCities, setLoadingCities] = useState(false)
	const [seleciona_ncm, setseleciona_ncm] = useState([])
	const [isLoadingdivisao_cnae, setLoadingdivisao_cnae] = useState(false)
	const [secao_cnae, setsecao_cnae] = useState([])
	const [divisao_cnae, setdivisao_cnae] = useState([])
	const [cnaes_ncm, setcnaes_ncm] = useState([])

	function arrumatexto(string) {
		return string.replace(/\S*/g, function (word) {
			return word.charAt(0) + word.slice(1).toLowerCase()
		})
	}

	useEffect(() => {
		;(async () => {
			const [cnaesRes, sitCad, porEmp, secao_cnae1, selecionancm1, divisao_cnae1, cnaes_ncm1] = await Promise.all(["/cnaes", "/situacoes-cadastrais", "/porte-empresas", "/secao_cnae", "/seleciona_ncm", "/divisao_cnae", "/cnaes_ncm"].map(getResult))

			setCnaes(cnaesRes)
			setSituacoesCadastrais(sitCad)
			setPorteEmpresas(porEmp)
			setsecao_cnae(secao_cnae1)
			setseleciona_ncm(selecionancm1)
			setdivisao_cnae(divisao_cnae1)
			setcnaes_ncm(cnaes_ncm1)
		})()
	}, [])

	const loaddivisao_cnae = useCallback(
		async e => {
			if (e.target.value !== "") {
				setLoadingdivisao_cnae(true)
				const result = await getResult(`/divisao_cnae/${e.target.value}`)
				setsecao_cnae(result)
				setLoadingdivisao_cnae(false)
			} else {
				setsecao_cnae([])
			}
		},
		[setsecao_cnae]
	)

	console.log("-------------form data----------------: ", formData)

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

	return (
		<ConfigProvider locale={ptBR}>
			<div>
				{!isMinimum ? <div style={{ fontSize: 10, color: showMinimum ? "red" : "gray", height: "15px" }}>*Preencha ao menos um campo obrigatório</div> : <div style={{ height: "15px" }}></div>}

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Produto${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="nome_produto" default="" value={formData.nome_produto} allowClear onChange={e => setFormData({ ...formData, "nome_produto": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`NCM${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="ncm" default="" value={formData.ncm} allowClear onChange={e => setFormData({ ...formData, "ncm": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`CNAE${!isMinimum ? "*" : ""}`}</h3>
					<Select
						mode="multiple"
						showArrow
						allowClear
						
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
						{cnaes_ncm.map(c => (
							<Option key={c.cod_cnae} value={c.cod_cnae}>
								{arrumatexto(c.nome)}
							</Option>
						))}
					</Select>
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Código CNAE${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="cod_cnae" default="" value={formData.cod_cnae} allowClear onChange={e => setFormData({ ...formData, "cod_cnae": e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`Descrição CNAE${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="desc_cnae" default="" value={formData.desc_cnae} allowClear onChange={e => setFormData({ ...formData, "desc_cnae": e.target.value })} />
				</div>
			</div>
		</ConfigProvider>
	)
}

export default memo(NcmFilter)
