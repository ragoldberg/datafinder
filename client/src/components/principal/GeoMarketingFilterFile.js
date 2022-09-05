/* eslint-disable eqeqeq */

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

const GeoMFilter = ({ formData, setFormData, isMinimum, showMinimum }) => {
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

	const [cnaes, setCnaes] = useState([])

	const [situacoesCadastrais, setSituacoesCadastrais] = useState([])
	const [porteEmpresas, setPorteEmpresas] = useState([])
	const [cnaesporclasse, setcnaesporclasse] = useState([])
	const [opcao_pelo_mei, setopcao_pelo_mei] = useState([])
	const [natureza_juridica, setNatureza_jur] = useState([])
	const [cidades, setCidades] = useState([])
	const [isLoadingCities, setLoadingCities] = useState(false)

	const [isLoadingcnaesporclasse, setLoadingcnaesporclasse] = useState(false)
	const [classecnae, setclassecnae] = useState([])

	console.log("-------------form data----------------: ", formData)

	useEffect(() => {
		;(async () => {
			const [cnaesRes, sitCad, porEmp, classeCnae, opmei, natjur, secao_cnae] = await Promise.all(["/cnaes", "/situacoes-cadastrais", "/porte-empresas", "/classecnae", "/sit-mei", "/natureza_juridica", "/secao_cnae"].map(getResult))

			setCnaes(cnaesRes)
			setSecaoCnae(secao_cnae)

			setSituacoesCadastrais(sitCad)
			setPorteEmpresas(porEmp)
			setclassecnae(classeCnae)
			setopcao_pelo_mei(opmei)
			setNatureza_jur(natjur)
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

	const formattedState = uf => {
		if (!states[uf] || uf == "DF" || uf == "SP") return "Rio Grande do Sul"
		const selectedStateName = states[uf].name
		return arrumatexto(selectedStateName)
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
	}

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
					<h3 className="titulo_h3" style={showMinimum ? { color: "red" } : { color: "black" }}>{`CEP${!isMinimum ? "*" : ""}`}</h3>
					<Input className="largura_select" name="CEP" value={formData.CEP} allowClear onChange={e => setFormData({ ...formData, "CEP": e.target.value })} />
				</div>




			</div>
		</ConfigProvider>
	)
}

export default memo(GeoMFilter)
