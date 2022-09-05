/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { getDetalhe } from "../../actions/detalhes"
import { buscarDados, ressetarDados } from "../../actions/cnpj"

import Navbar from "../layout/Navbar"

import Spinner from "../layout/Spinner"
import Pagination from "./Pagination"

import states from "../../utils/states.json"
import searchIcon from "../../img/icons/search.svg"
import _ from "lodash"
import { fetchGoogleInfo, eraseGoogleInfo } from "../../actions/fetch_google_info"
import { fetchGEOInfo, eraseGEOInfo } from "../../actions/fetch_geo_info"
import ResultsInitial from "./ResultsInitial"

import NoResultsFound from "./NoResultsFound"

import CNPJFilterFile from "./CNPJFilterFile"
import CNPJResultFile from "./CNPJResultFile"
import CNPJDetailsFile from "./CNPJDetailsFile"
import { buscarDetalhesCNPJ } from "../../actions/dados_cnpj"
import { buscarLeads } from "../../actions/dados_leads"

import MEIFilterFile from "./MEIFilterFile"
import MEIResultFile from "./MEIResultFile"
import MEIDetailsFile from "./MEIDetailsFile"
import { buscarDetalhesMEI } from "../../actions/dados_mei"

import SOCIOSFilterFile from "./SOCIOSFilterFile"
import SOCIOSResultFile from "./SOCIOSResultFile"
import SOCIOSDetailsFile from "./SOCIOSDetailsFile"
import { buscarDetalhesSocios } from "../../actions/dados_socios"

import HoldingsResultFile from "./HoldingsResultFile"
import HoldingsFilterFile from "./HoldingsFilterFile"
import HoldingsDetailsFile from "./HoldingsDetailsFile"
import { buscarDetalhesHoldings } from "../../actions/dados_holdings"

import CnaeResult from "./CnaeResult"
import CnaeFilter from "./CnaeFilter"
import CnaeDetailsFile from "./CnaeDetailsFile"
import { buscarDetalhesCnae } from "../../actions/dados_cnae"

import DividasFilter1 from "./DividasFilter1"
import DividasResult1 from "./DividasResult1"
import DividasDetailsFile from "./DividasDetailsFile"
import { buscarDetalhesDividas } from "../../actions/dados_dividas"

import NcmFilter1 from "./NcmFilter1"
import NcmResult1 from "./NcmResult1"
import NcmDetailsFile from "./NcmDetailsFile"
import { buscarDetalhesNCM } from "../../actions/detalhes_NCM"

import GeoMarketingFilter from "./GeoMarketingFilterFile"
import GeoMarketingResult from "./GeoMarketingResultFile"
import GeoMarketingDetailsFile from "./GeoMarketingDetailsFile"
import { buscarDetalhesGEOM } from "../../actions/dados_GEOM"

import DASHFilterFile from "./DASHFilterFile"
import DASHResultFile from "./DASHResultFile"
import DASHDetails from "./DASHDetailsFile"
import { buscarDetalhesDASH } from "../../actions/detalhes_DASH"

import ECAFilterFile from "./ECAFilter"
import ECAResultFile from "./ECAResult"
import ECADetailsFile from "./ECADetailsFile"
import { buscarDetalhesECA } from "../../actions/dados_eca"

import axios from "axios"

import { formatDocument } from "../../utils/string-utils"
import { cnpjMask,Info_adicional, sit_cad, mat_fil, ranking, date, e_mei, tem_div,numberFormat,arrumatexto,arrumatexto_1  } from "../functions/formatos"

// MaterialUI
import { makeStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import SidenavTitle from "./SidenavTitle"


const consultarCNPJ = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-CNPJ?${p.toString()}`, { timeout: 1000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error CNPJ search`, e)
		return []
	}
}
const consultarDASH = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-DASH?${p.toString()}`, { timeout: 1000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error /buscar-por-DASH search`, e)
		return []
	}
}

const consultarMEI = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-MEI?${p.toString()}`, { timeout: 1000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error MEI search`, e)
		return []
	}
}

const consultar_SOCIOS_NEW = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-socios?${p.toString()}`, { timeout: 10000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error SOCIOS search`, e)
		return []
	}
}

const consultarHOLDING = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-holdings?${p.toString()}`, { timeout: 1000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error HOLDING search`, e)
		return []
	}
}

// consultarECA está retornando data.count (contagem) maior do que o correto.
// Ex.: RS - Porto Alegre: data.count: 140, data.result.length: 39
const consultarECA = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-eca?${p.toString()}`, { timeout: 1000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error eca search`, e)
		return []
	}
}

// consultarCnae está retornando erro quando não encontra resultado válido
// Não está retornando data.count (contagem)
// retorna sempre apenas 50 resultados, tanto para cidade pequena quanto para grande
const consultarCnae = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-cnae?${p.toString()}`, { timeout: 1000 * 60 * 5 })
		return data
	} catch (e) {
		console.error(`Loading error cnae search`, e)
		return []
	}
}

// consultarDividas está retornando erro quando não encontra resultado válido
// Não está retornando data.count (contagem)
// retorna sempre apenas 50 resultados, tanto para cidade pequena quanto para grande
const consultarDividas = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-dividas?${p.toString()}`, { timeout: 1000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error Dividas search`, e)
		return []
	}
}

// consultarNCM está retornando erro quando não encontra resultado válido
// Não está retornando data.count (contagem)
// retorna sempre apenas 50 resultados, tanto para cidade pequena quanto para grande
const consultarNCM = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-ncm?${p.toString()}`, { timeout: 1000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error NCM search`, e)
		return []
	}
}
const consultarGEOM = async params => {
	try {
		const p = new URLSearchParams()
		Object.keys(params).forEach(k => p.set(k, params[k]))

		const { data } = await axios.get(`/buscar-por-GEOM?${p.toString()}`, { timeout: 1000 * 60 * 5 })

		return data
	} catch (e) {
		console.error(`Loading error GEOM search`, e)
		return []
	}
}



const Principal = props => {
	const {
		getDetalhe,
		buscarDados,
		ressetarDados,
		fetchGoogleInfo,
		eraseGoogleInfo,
		fetchGEOInfo,
		eraseGEOInfo,
		buscarDetalhesSocios,
		buscarDetalhesCNPJ,
		buscarDetalhesGEOM,
		buscarDetalhesECA,
		buscarDetalhesCnae,
		buscarDetalhesDividas,
		buscarDetalhesMEI,
		buscarDetalhesHoldings,
		buscarLeads,
		detalhes,
		datacnpj: { resultados = [], contagem, carregando },
	} = props

	const {
		result_socios: { resultados_socios, detalhes_SOCIOS },
		result_mei: { resultados_mei },
		result_eca: { resultados_eca },
		result_cnae: { resultados_cnae, socios_cnae },
		result_dividas: { resultados_dividas, detalhes_dividas },
		result_cnpj: { resultados_cnpj, socios_cnpj },
		result_detalhes_GEOM: { detalhes_GEOM, socios_cnpj_GEOM },
		result_holdings: { resultados_holdings, subsidiarias_holdings, results_holdings },
		google_info,
		geo_info,
		result_leads: { resultados_leads },
	} = props

	// Estado inicial de visibilidade dos campos dos forms - onde inicia

	const [isCNPJ, setCNPJ] = useState(true)
	const [CNPJResult, setCNPJResult] = useState([])
	const [CNPJCount, setCNPJCount] = useState(null)
	const [isLoadingCNPJ, setLoadingCNPJ] = useState(false)
	const [isPopupOpenCNPJ, setIsPopupOpenCNPJ] = useState(false)

	const [isSOCIOS, setSOCIOS] = useState(false)
	const [SOCIOSResult, setSOCIOSResult] = useState([])
	const [SOCIOSCount, setSOCIOSCount] = useState(null)
	const [isLoadingSOCIOS, setLoading_SOCIOS] = useState(false)
	const [isPopupOpenSOCIOS, setIsPopupOpenSOCIOS] = useState(false)

	const [isCnae, setCnae] = useState(false)
	const [cnaeResult, setCnaeResult] = useState([])
	const [cnaeCount, setCnaeCount] = useState(null)
	const [isLoadingCnae, setLoadingCnae] = useState(false)
	const [isPopupOpenCnae, setIsPopupOpenCnae] = useState(false)

	const [isDividas, setDividas] = useState(false)
	const [DividasResult, setDividasResult] = useState([])
	const [DividasCount, setDividasCount] = useState(null)
	const [isLoadingDividas, setLoadingDividas] = useState(false)
	const [isPopupOpenDividas, setIsPopupOpenDividas] = useState(false)

	const [isNCM, setNCM] = useState(false)
	const [NcmResult, setNcmResult] = useState([])
	const [NcmCount, setNcmCount] = useState(null)
	const [isLoadingNcm, setLoadingNcm] = useState(false)
	const [isPopupOpenNCM, setIsPopupOpenNCM] = useState(false)

	//DASH

	const [isDASH, setDASH] = useState(false)
	const [DASHResult, setDASHResult] = useState([])
	const [DASHResult2, setDASHResult2] = useState([])

	const [DASHResult_empresas_total, setDASHResult_empresas_total] = useState([])

	const [DASHResult_ativa, setDASHResult_ativa] = useState([])
	const [DASHResult_n_ativa, setDASHResult_n_ativa] = useState([])
	const [DASHResult_bandeira, setDASHResult_bandeira] = useState([])
	const [DASHResult_bairro, setDASHResult_bairro] = useState([])
	const [DASHResult_matriz, setDASHResult_matriz] = useState([])
	const [DASHResult_filial, setDASHResult_filial] = useState([])
	const [DASHResult_mei, setDASHResult_mei] = useState([])
	const [DASHResult_mei_ativo, setDASHResult_mei_ativo] = useState([])
	const [DASHResult_simples, setDASHResult_simples] = useState([])
	const [DASHResult_simples_ativo, setDASHResult_simples_ativo] = useState([])
	const [DASHResult_DASH_Grafico, setDASHResult_DASH_Grafico] = useState([])
	const [DASHResult_estado, setDASHResult_estado] = useState([])
	const [DASHResult_cidade, setDASHResult_cidade] = useState([])

	const [DASHResult_atv_bairro, setDASHResult_atv_bairro] = useState([])
	const [DASHResult_total_empresas_bairro, setDASHResult_total_empresas_bairro] = useState([])
	const [DASHResult_n_atv_bairro, setDASHResult_n_atv_bairro] = useState([])
	const [DASHResult_matriz_bairro, setDASHResult_matriz_bairro] = useState([])
	const [DASHResult_n_matriz_bairro, setDASHResult_n_matriz_bairro] = useState([])

	const [DASHResult_atv_bairro_perc, setDASHResult_atv_bairro_perc] = useState([])
	const [DASHResult_total_empresas_bairro_perc, setDASHResult_total_empresas_bairro_perc] = useState([])
	const [DASHResult_n_atv_bairro_perc, setDASHResult_n_atv_bairro_perc] = useState([])
	const [DASHResult_matriz_bairro_perc, setDASHResult_matriz_bairro_perc] = useState([])
	const [DASHResult_n_matriz_bairro_perc, setDASHResult_n_matriz_bairro_perc] = useState([])
		
	const [DASHResult_dividas, setDASHResult_dividas] = useState([])
	const [DASHResult_vlr_dividas, setDASHResult_vlr_dividas] = useState([])
	const [DASHResult_qtd_dividas_prev, setDASHResult_qtd_dividas_prev] = useState([])
	const [DASHResult_vlr_dividas_prev, setDASHResult_vlr_dividas_prev] = useState([])
	const [DASHResult_qtd_dividas_nprev, setDASHResult_qtd_dividas_nprev] = useState([])
	const [DASHResult_vlr_dividas_nprev, setDASHResult_vlr_dividas_nprev] = useState([])
	const [DASHResult_qtd_dividas_fgts, setDASHResult_qtd_dividas_fgts] = useState([])
	const [DASHResult_vlr_dividas_fgts, setDASHResult_vlr_dividas_fgts] = useState([])
	const [DASHResult_tipo_pessoa_pf, setDASHResult_tipo_pessoa_pf] = useState([])
	const [DASHResult_tipo_pessoa_pj, setDASHResult_tipo_pessoa_pj] = useState([])
	const [DASHResult_tipo_situacao_inscricao_bf, setDASHResult_tipo_situacao_inscricao_bf] = useState([])
	const [DASHResult_tipo_situacao_inscricao_cb, setDASHResult_tipo_situacao_inscricao_cb] = useState([])
	const [DASHResult_tipo_situacao_inscricao_emgarantia, setDASHResult_tipo_situacao_inscricao_emgarantia] = useState([])
	const [DASHResult_tipo_situacao_inscricao_judicial, setDASHResult_tipo_situacao_inscricao_judicial] = useState([])
	const [DASHResult_indicador_ajuizado_sim, setDASHResult_indicador_ajuizado_sim] = useState([])
	const [DASHResult_indicador_ajuizado_nao, setDASHResult_indicador_ajuizado_nao] = useState([])
	const [DASHResult_valor_prev, setDASHResult_valor_prev] = useState([])
	const [DASHResult_valor_nprev, setDASHResult_valor_nprev] = useState([])
	const [DASHResult_valor_fgts, setDASHResult_valor_fgts] = useState([])
	const [DASHResult_valor_prev_regular, setDASHResult_valor_prev_regular] = useState([])
	const [DASHResult_valor_prev_irregular, setDASHResult_valor_prev_irregular] = useState([])
	const [DASHResult_valor_nprev_regular, setDASHResult_valor_nprev_regular] = useState([])
	const [DASHResult_valor_nprev_irregular, setDASHResult_valor_nprev_irregular] = useState([])
	const [DASHResult_valor_fgts_regular, setDASHResult_valor_fgts_regular] = useState([])
	const [DASHResult_valor_fgts_irregular, setDASHResult_valor_fgts_irregular] = useState([])
	const [DASHResult_situacao_regular, setDASHResult_situacao_regular] = useState([])
	const [DASHResult_situacao_irregular, setDASHResult_situacao_irregular] = useState([])

	const [DASHResult_dividas_total, setDASHResult_dividas_total] = useState([])
	const [DASHResult_vlr_dividas_total, setDASHResult_vlr_dividas_total] = useState([])
	const [DASHResult_qtd_dividas_prev_total, setDASHResult_qtd_dividas_prev_total] = useState([])
	const [DASHResult_vlr_dividas_prev_total, setDASHResult_vlr_dividas_prev_total] = useState([])
	const [DASHResult_qtd_dividas_nprev_total, setDASHResult_qtd_dividas_nprev_total] = useState([])
	const [DASHResult_vlr_dividas_nprev_total, setDASHResult_vlr_dividas_nprev_total] = useState([])
	const [DASHResult_qtd_dividas_fgts_total, setDASHResult_qtd_dividas_fgts_total] = useState([])
	const [DASHResult_vlr_dividas_fgts_total, setDASHResult_vlr_dividas_fgts_total] = useState([])
	const [DASHResult_tipo_pessoa_pf_total, setDASHResult_tipo_pessoa_pf_total] = useState([])
	const [DASHResult_tipo_pessoa_pj_total, setDASHResult_tipo_pessoa_pj_total] = useState([])
	const [DASHResult_tipo_situacao_inscricao_bf_total, setDASHResult_tipo_situacao_inscricao_bf_total] = useState([])
	const [DASHResult_tipo_situacao_inscricao_cb_total, setDASHResult_tipo_situacao_inscricao_cb_total] = useState([])
	const [DASHResult_tipo_situacao_inscricao_emgarantia_total, setDASHResult_tipo_situacao_inscricao_emgarantia_total] = useState([])
	const [DASHResult_tipo_situacao_inscricao_judicial_total, setDASHResult_tipo_situacao_inscricao_judicial_total] = useState([])
	const [DASHResult_indicador_ajuizado_sim_total, setDASHResult_indicador_ajuizado_sim_total] = useState([])
	const [DASHResult_indicador_ajuizado_nao_total, setDASHResult_indicador_ajuizado_nao_total] = useState([])
	const [DASHResult_valor_prev_total, setDASHResult_valor_prev_total] = useState([])
	const [DASHResult_valor_nprev_total, setDASHResult_valor_nprev_total] = useState([])
	const [DASHResult_valor_fgts_total, setDASHResult_valor_fgts_total] = useState([])
	const [DASHResult_valor_prev_regular_total, setDASHResult_valor_prev_regular_total] = useState([])
	const [DASHResult_valor_prev_irregular_total, setDASHResult_valor_prev_irregular_total] = useState([])
	const [DASHResult_valor_nprev_regular_total, setDASHResult_valor_nprev_regular_total] = useState([])
	const [DASHResult_valor_nprev_irregular_total, setDASHResult_valor_nprev_irregular_total] = useState([])
	const [DASHResult_valor_fgts_regular_total, setDASHResult_valor_fgts_regular_total] = useState([])
	const [DASHResult_valor_fgts_irregular_total, setDASHResult_valor_fgts_irregular_total] = useState([])
	const [DASHResult_situacao_regular_total, setDASHResult_situacao_regular_total] = useState([])
	const [DASHResult_situacao_irregular_total, setDASHResult_situacao_irregular_total] = useState([])
	

	

	const [DASHCount, setDASHCount] = useState(null)
	const [isLoadingDASH, setLoadingDASH] = useState(false)
	const [isPopupOpenDASH, setIsPopupOpenDASH] = useState(false)

	//GEOM
	const [isGEOM, setGEOM] = useState(false)
	
	const [GEOMResult, setGEOMResult] = useState([])
	const [GEOMCount, setGEOMCount] = useState(null)
	const [isLoadingGEOM, setLoadingGEOM] = useState(false)
	const [isPopupOpenGEOM, setIsPopupOpenGEOM] = useState(false)


	const [GEOMResult2, setGEOMResult2] = useState([])

	const [GEOMResult_empresas_total, setGEOMResult_empresas_total] = useState([])

	const [GEOMResult_ativa, setGEOMResult_ativa] = useState([])
	const [GEOMResult_n_ativa, setGEOMResult_n_ativa] = useState([])
	const [GEOMResult_bairro, setGEOMResult_bairro] = useState([])
	const [GEOMResult_matriz, setGEOMResult_matriz] = useState([])
	const [GEOMResult_filial, setGEOMResult_filial] = useState([])
	const [GEOMResult_mei, setGEOMResult_mei] = useState([])
	const [GEOMResult_mei_ativo, setGEOMResult_mei_ativo] = useState([])
	const [GEOMResult_simples, setGEOMResult_simples] = useState([])
	const [GEOMResult_simples_ativo, setGEOMResult_simples_ativo] = useState([])
	const [GEOMResult_GEOM_Grafico, setGEOMResult_GEOM_Grafico] = useState([])
	const [GEOMResult_estado, setGEOMResult_estado] = useState([])
	const [GEOMResult_cidade, setGEOMResult_cidade] = useState([])

	const [GEOMResult_atv_bairro, setGEOMResult_atv_bairro] = useState([])
	const [GEOMResult_total_empresas_bairro, setGEOMResult_total_empresas_bairro] = useState([])
	const [GEOMResult_n_atv_bairro, setGEOMResult_n_atv_bairro] = useState([])
	const [GEOMResult_matriz_bairro, setGEOMResult_matriz_bairro] = useState([])
	const [GEOMResult_n_matriz_bairro, setGEOMResult_n_matriz_bairro] = useState([])

	const [GEOMResult_atv_bairro_perc, setGEOMResult_atv_bairro_perc] = useState([])
	const [GEOMResult_total_empresas_bairro_perc, setGEOMResult_total_empresas_bairro_perc] = useState([])
	const [GEOMResult_n_atv_bairro_perc, setGEOMResult_n_atv_bairro_perc] = useState([])
	const [GEOMResult_matriz_bairro_perc, setGEOMResult_matriz_bairro_perc] = useState([])
	const [GEOMResult_n_matriz_bairro_perc, setGEOMResult_n_matriz_bairro_perc] = useState([])

	const [GEOMResult_total_cidade, setGEOMResult_total_cidade] = useState([])
	const [GEOMResult_ativos_cidade, setGEOMResult_ativos_cidade] = useState([])
	const [GEOMResult_n_ativos_cidade, setGEOMResult_n_ativos_cidade] = useState([])


//FIM GEOM
	const [isHOLDINGS, setHOLDINGS] = useState(false)
	const [HoldingsResult, setHoldingResult] = useState([])
	const [HoldingsCount, setHoldingCount] = useState(null)
	const [isLoadingHolding, setLoadingHolding] = useState(false)
	const [isPopupOpenHolding, setIsPopupOpenHolding] = useState(false)

	const [isECA, setECA] = useState(false)
	const [ECAResult, setECAResult] = useState([])
	const [ECACount, setECACount] = useState(null)
	const [isLoadingECA, setLoadingECA] = useState(false)
	const [isPopupOpenECA, setIsPopupOpenECA] = useState(false)

	const [isMEI, setMEI] = useState(false)
	const [MEIResult, setMEIResult] = useState([])
	const [MEICount, setMEICount] = useState(null)
	const [isLoadingMEI, setLoadingMEI] = useState(false)
	const [isPopupOpenMEI, setIsPopupOpenMEI] = useState(false)

	// Estado que controla se qualquer filtro está carregando
	const [isLoading, setIsLoading] = useState(false)

	// Estado que controla se as informações Mínimas para efetuar a busca foram preenchidas
	const [isMinimum, setIsMinimum] = useState(false)
	// Estado que controla se as informações Mínimas para efetuar a busca foram preenchidas (UF do CNAE)
	const [isMinimum2, setIsMinimum2] = useState(false)
	// Estado que controla se as informações Mínimas precisam ser destacadas para reforçar ao usuário
	const [showMinimum, setShowMinimum] = useState(false)
	// Estado que controla se as informações Mínimas precisam ser destacadas para reforçar ao usuário (UF do CNAE)
	const [showMinimum2, setShowMinimum2] = useState(false)

	// Estados que controlam o status do Popup de detalhes
	const [isPopupOpen, setIsPopupOpen] = useState(false)
	const [isPopupLoading, setIsPopupLoading] = useState(false)

	const [leads, setLeads] = useState([])

	const [formData, setFormData] = useState({
		tipo: "CNPJ",

		razao_social: "",
		nome_fantasia: "",
		cnae: "",
		desc_cnae: "",
		Dividas: "",
		cnpj_socia: "",
		cod_situacao_cadastral: "",
		natureza_juridica: "",
		opcao_pelo_simples: "",
		opcao_pelo_mei: "",
		socio: "",
		identificador_socio: "",
		cod_qualificacao_socio: "",
		municipio: [],
		cod_tom: "",

		uf: "",
		email: "",

		pagina: "1",
		cnpj: "",
		cod_cnae: "",
		porte_empresa: "",
	})

	console.log("isCNPJ", isCNPJ)

	useEffect(() => {
		if (isLoadingCNPJ || isLoadingSOCIOS || isLoadingCnae || isLoadingDividas || isLoadingNcm || isLoadingGEOM || isLoadingHolding || isLoadingECA || isLoadingMEI || isLoadingDASH) {
			setIsLoading(true)
		} else {
			setIsLoading(false)
		}
	}, [isLoadingCNPJ, isLoadingSOCIOS, isLoadingCnae, isLoadingDividas, isLoadingNcm, isLoadingGEOM, isLoadingHolding, isLoadingECA, isLoadingMEI, isLoadingDASH])

	// Educacional: useEffect(a, b)
	// Essa funcao é um "hook" que existe apenas no React
	// Ela recebe dois argumentos "a" e "b"
	// Ela executa uma função "a", quando "b" for alterado
	// "b" é opcional, se não for passado um valor para "b", a função "a" será executada o tempo todo que esse componente estiver renderizado
	// "b" normalmente é uma array com diversas variáveis, como no caso acima
	// quando qualquer uma das variáveis isLoadingCNPJ, isLoadingSOCIOS, etc, forem alteradas, ele vai executar a função

	// Função que libera o botão de Busca
	// É executada toda vez que o estado formData é modificado
	useEffect(() => {
		if (isCNPJ) {
			console.log("It's CNPJ")
			console.log("isMinimum: ", isMinimum)
			// Educacional: aqui estou desestruturando o objecto formData, ou seja,
			// extraindo as 3 variaveis que tenho interesse em manipular
			// Se trata apenas de uma forma mais bonita de escrever o codigo, mais facil de ler
			const { cnpj, nome_fantasia, razao_social } = formData
			// Educacional:
			// se cnpj OU nome_fantsia OU razao_social tiverem algum valor que seja diferente de nulo/vazio/""
			// seta o estado isMinimum para true (verdadeiro)
			// o Estado isMinimum habilita o botão BUSCAR
			if (cnpj || nome_fantasia || razao_social) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}

		if (isMEI) {
			console.log("It's MEI")
			console.log("isMinimum: ", isMinimum)

			const { cnpj, cpf, razao_social, nome_fantasia } = formData

			if (cnpj || cpf || razao_social || nome_fantasia) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}

		if (isSOCIOS) {
			console.log("It's SOCIOS")
			console.log("isMinimum: ", isMinimum)

			const { cnpj, cpf, razao_social, nome_socio } = formData

			if (cnpj || cpf || razao_social || nome_socio) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}

		if (isHOLDINGS) {
			console.log("It's HOLDINGS")
			console.log("isMinimum: ", isMinimum)

			const { cnpj_socia, razao_social, qualificacao_socia } = formData

			if (cnpj_socia || razao_social || qualificacao_socia) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}

		if (isECA) {
			console.log("It's ECA")
			console.log("isMinimum: ", isMinimum)

			const { cnpj, razao_social, valor_patrimônio_acima, valor_patrimônio_abaixo, data_inscricao_inicio, data_inscricao_fim } = formData

			if (cnpj || razao_social || valor_patrimônio_acima || valor_patrimônio_abaixo || (data_inscricao_inicio && data_inscricao_fim)) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}

		if (isCnae) {
			console.log("It's Cnae")
			console.log("isMinimum: ", isMinimum)

			const { cod_cnae, classe_cnae, cnae, desc_cnae, uf } = formData

			if (cod_cnae || classe_cnae || cnae || desc_cnae) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}

			if (uf) {
				setIsMinimum2(true)
			} else {
				setIsMinimum2(false)
			}
		}

		if (isDividas) {
			console.log("It's Dividas")
			console.log("isMinimum: ", isMinimum)

			const { cnpj, nome_fantasia, razao_social, nome_socio, valor_divida_acima, valor_divida_abaixo } = formData

			if (cnpj || nome_fantasia || razao_social || nome_socio || valor_divida_acima || valor_divida_abaixo) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}

		if (isGEOM) {
			console.log("It's GEOM")
			console.log("isMinimum: ", isMinimum)

			const { CEP } = formData

			if (CEP) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}

		if (isDASH) {
			console.log("It's DASH")
			console.log("isMinimum: ", isMinimum)

			const { uf } = formData

			if (uf) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}

		if (isNCM) {
			console.log("It's NCM")
			console.log("isMinimum: ", isMinimum)

			const { nome_produto, ncm, cnae, cod_cnae, desc_cnae } = formData

			if (nome_produto || ncm || cnae || cod_cnae || desc_cnae) {
				setIsMinimum(true)
			} else {
				setIsMinimum(false)
			}
		}
	}, [formData])

	useEffect(() => {
		if (isPopupOpen) return
		eraseGoogleInfo()
		eraseGEOInfo()
	}, [isPopupOpen])

	useEffect(() => {
		if (!resultados_cnpj) return
		const { cnpj, nome_fantasia, municipio, uf, razao_social } = resultados_cnpj[0]
		fetchGoogleInfo(cnpj, nome_fantasia, municipio, uf, razao_social, resultados_cnpj)
	}, [resultados_cnpj])

	useEffect(() => {
		const getLeads = async () => {
			console.log('{API LEADS} - resultados_cnae', resultados_cnae)
			console.log('{API LEADS} - resultados_dividas', resultados_dividas)
			console.log('{API LEADS} - resultados_eca', resultados_eca)
			console.log('{API LEADS} - resultados_holdings', resultados_holdings)
			console.log('{API LEADS} - resultados_mei', resultados_mei)
			console.log('{API LEADS} - resultados_socios', resultados_socios)
			console.log('{API LEADS} - resultados_socios', resultados_cnpj)

			let domain = '';
			if (resultados_cnpj) {
				domain = _.get(resultados_cnpj, '[0].domain', '')
			} else if (resultados_cnae) {
				domain = _.get(resultados_cnae, '[0].domain', '')
			} else if (resultados_dividas) {
				domain = _.get(resultados_dividas, '[0].domain', '')
			} else if (resultados_eca) {
				domain = _.get(resultados_eca, '[0].domain', '')
			} else if (resultados_holdings) {
				domain = _.get(resultados_holdings, 'domain', '')
			} else if (resultados_mei) {
				domain = _.get(resultados_mei, '[0].domain', '')
			} else if (resultados_socios) {
				domain = _.get(resultados_socios, '[0].domain', '')
			}

			console.log('domain', domain)
			if (leads !== undefined && leads !== null && leads.length === 0) {
				await buscarLeads(domain);
				console.log('{API LEADS} - buscarLeads', resultados_leads)
				setLeads(resultados_leads)
			}
			else if (resultados_leads !== '{API LEADS} - error_leads') {
				setLeads([])
				
			}
		}
		getLeads();
	}, [resultados_cnpj, resultados_cnae, resultados_dividas, resultados_eca, resultados_holdings, resultados_mei, resultados_socios, buscarLeads, resultados_leads])

	const visibilidadeCampos = tipo => {
		// let tipo = e.target.value

		ressetarDados()
		setLeads([])

		// mudarMostrarCnpj(tipo === "cnpj")
		// mudarMostrarDadosPessoais(tipo === "dados_socios")
		setCnae(tipo === "cnae")
		setDividas(tipo === "Dividas")
		setNCM(tipo === "NCM")
		setGEOM(tipo === "GEOM")
		setDASH(tipo === "DASH")
		setHOLDINGS(tipo === "HOLDINGS")
		setCNPJ(tipo === "CNPJ")
		setSOCIOS(tipo === "SOCIOS")
		setECA(tipo === "ECA")
		setMEI(tipo === "MEI")

		setCnaeCount(null)
		setCnaeResult([])

		setDividasCount(null)
		setDividasResult([])

		setNcmCount(null)
		setNcmResult([])

		setGEOMCount(null)
		setGEOMResult([])

		setDASHCount(null)
		setDASHResult([])

		setHoldingCount(null)
		setHoldingResult([])

		setCNPJCount(null)
		setCNPJResult([])

		setSOCIOSCount(null)
		setSOCIOSResult([])

		setECACount(null)
		setECAResult([])

		setMEICount(null)
		setMEIResult([])

		setFormData({
			...formData,
			cnpj: "",
			razao_social: "",
			nome_fantasia: "",
			cnae: "",
			desc_cnae: "",
			cod_cnae: "",
			cod_situacao_cadastral: "",
			natureza_juridica: "",
			opcao_pelo_simples: "",
			opcao_pelo_mei: "",
			socio: "",
			nome_socio:"",
			identificador_socio: "",
			cod_qualificacao_socio: "",
			municipio: [],
			cod_tom: "",
			uf: "",
			email: "",
			porte_empresa: "",
			pagina: "1",
			tipo,
		})
	}

	const limpar = () => {
		setFormData({
			...formData,

			pagina: "1",
		})
	}

	const { tipo, razao_social, nome_fantasia, cnae, desc_cnae, cod_situacao_cadastral, natureza_juridica, opcao_pelo_simples, opcao_pelo_mei, nome_socio, socio, identificador_socio, cod_qualificacao_socio, municipio, cod_tom, uf, porte_empresa, pagina } = formData

	const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

	const onSubmit = e => {
		ressetarDados()
		setLeads([])
		setIsLoading(true)
		e.preventDefault()
		setLeads([])
		if (isCNPJ) {
			setLoadingCNPJ(true)
			const newState = { ...formData, pagina: 1 }
			consultarCNPJ(newState)
				.then(data => {
					setCNPJCount(data.count)
					setCNPJResult(data.result)
				})
				.finally(() => {
					setLoadingCNPJ(false)
					setFormData(newState)
				})
		}
		if (isMEI) {
			setLoadingMEI(true)
			const newState = { ...formData, pagina: 1 }
			consultarMEI(newState)
				.then(data => {
					setMEICount(data.count)
					setMEIResult(data.result)
				})
				.finally(() => {
					setLoadingMEI(false)
					setFormData(newState)
				})
		}

		if (isSOCIOS) {
			setLoading_SOCIOS(true)
			const newState = { ...formData, pagina: 1 }
			consultar_SOCIOS_NEW(newState)
				.then(data => {
					setSOCIOSCount(data.count)
					setSOCIOSResult(data.result)
				})
				.finally(() => {
					setLoading_SOCIOS(false)
					setFormData(newState)
				})
		}

		if (isHOLDINGS) {
			setLoadingHolding(true)
			const newState = { ...formData, pagina: 1 }
			consultarHOLDING(newState)
				.then(data => {
					setHoldingCount(data.count)
					setHoldingResult(data.result)
				})
				.finally(() => {
					setLoadingHolding(false)
					setFormData(newState)
				})
		}

		if (isECA) {
			setLoadingECA(true)
			const newState = { ...formData, pagina: 1 }
			consultarECA(newState)
				.then(data => {
					setECACount(data.count)
					setECAResult(data.result)
				})
				.finally(() => {
					setLoadingECA(false)
					setFormData(newState)
				})
		}

		if (isCnae) {
			setLoadingCnae(true)
			const newState = { ...formData, pagina: 1 }
			consultarCnae(newState)
				.then(data => {
					setCnaeCount(data.count)
					setCnaeResult(data.result)
				})
				.finally(() => {
					setLoadingCnae(false)
					setFormData(newState)
				})
		}
		if (isDividas) {
			setLoadingDividas(true)
			const newState = { ...formData, pagina: 1 }
			consultarDividas(newState)
				.then(data => {
					setDividasCount(data.count)
					// Mudança para retornar "Nenhum Resultado Encontrado" quando pesquisa não retorna resultado (problema na query)
					//const count = (data.result && data.result.length) || 0
					//console.log("count: ", count)
					//setDividasCount(count)
					setDividasResult(data.result)
				})
				.finally(() => {
					setLoadingDividas(false)
					setFormData(newState)
				})
		}
		if (isGEOM) {
			setLoadingGEOM(true)
			const newState = { ...formData, pagina: 1 }
			consultarGEOM(newState)
				.then(data => {
					setGEOMCount(data.count)
					// Mudança para retornar "Nenhum Resultado Encontrado" quando pesquisa não retorna resultado (problema na query)
					//const count = (data.result && data.result.length) || 0
					//console.log("count: ", count)
					//setGEOMCount(count)
					setGEOMResult(data.result)
					setGEOMResult2(data.resultado_GEOM)
					setGEOMResult_GEOM_Grafico(data.GEOM_Grafico)
					//dados de estado
					setGEOMResult_empresas_total(data.empresas_total)
					setGEOMResult_ativa(data.ativa)
					setGEOMResult_n_ativa(data.n_ativa)
					setGEOMResult_matriz(data.matriz)
					setGEOMResult_filial(data.filial)
					setGEOMResult_mei(data.mei)
					setGEOMResult_mei_ativo(data.mei_ativo)
					setGEOMResult_simples(data.simples)
					setGEOMResult_simples_ativo(data.simples_ativo)
					setGEOMResult_estado(data.estado)
					setGEOMResult_cidade(data.cidade)
					setGEOMResult_bairro(data.bairro)

					//dados cidade
					setGEOMResult_total_empresas_bairro(data.total_empresas_bairro)
					setGEOMResult_atv_bairro(data.atv_bairro)
					setGEOMResult_n_atv_bairro(data.n_atv_bairro)
					setGEOMResult_matriz_bairro(data.matriz_bairro)
					setGEOMResult_n_matriz_bairro(data.n_matriz_bairro)
					setGEOMResult_total_empresas_bairro_perc(data.total_empresas_bairro_perc)
					setGEOMResult_atv_bairro_perc(data.atv_bairro_perc)
					setGEOMResult_n_atv_bairro_perc(data.n_atv_bairro_perc)
					setGEOMResult_matriz_bairro_perc(data.matriz_bairro_perc)
					setGEOMResult_n_matriz_bairro_perc(data.n_matriz_bairro_perc)
					setGEOMResult_total_cidade(data.total_cidade)
					setGEOMResult_ativos_cidade(data.ativos_cidade)
					setGEOMResult_n_ativos_cidade(data.n_ativos_cidade)
				})
				.finally(() => {
					setLoadingGEOM(false)
					setFormData(newState)
				})
		}

		if (isNCM) {
			setLoadingNcm(true)
			const newState = { ...formData, pagina: 1 }
			consultarNCM(newState)
				.then(data => {
					setNcmCount(data.count)
					// Mudança para retornar "Nenhum Resultado Encontrado" quando pesquisa não retorna resultado (problema na query)
					//const count = (data.result && data.result.length) || 0
					//setNcmCount(count)
					setNcmResult(data.result)
				})
				.finally(() => {
					setLoadingNcm(false)
					setFormData(newState)
				})
		}

		if (isDASH) {
			setLoadingDASH(true)
			const newState = { ...formData, pagina: 1 }
			consultarDASH(newState)
				.then(data => {
					setDASHCount(data.count)
					// Mudança para retornar "Nenhum Resultado Encontrado" quando pesquisa não retorna resultado (problema na query)
					//const count = (data.result && data.result.length) || 0
					//console.log("count: ", count)
					//setDASHCount(count)
					setDASHResult(data.result)
					setDASHResult2(data.resultado_DASH)
					setDASHResult_DASH_Grafico(data.DASH_Grafico)
					//dados de estado
					setDASHResult_empresas_total(data.empresas_total)
					setDASHResult_ativa(data.ativa)
					setDASHResult_n_ativa(data.n_ativa)
					setDASHResult_bandeira(data.bandeira)
					setDASHResult_matriz(data.matriz)
					setDASHResult_filial(data.filial)
					setDASHResult_mei(data.mei)
					setDASHResult_mei_ativo(data.mei_ativo)
					setDASHResult_simples(data.simples)
					setDASHResult_simples_ativo(data.simples_ativo)
					setDASHResult_estado(data.estado)
					setDASHResult_cidade(data.cidade)
					setDASHResult_bairro(data.bairro)

					//dados cidade
					setDASHResult_total_empresas_bairro(data.total_empresas_bairro)
					setDASHResult_atv_bairro(data.atv_bairro)
					setDASHResult_n_atv_bairro(data.n_atv_bairro)
					setDASHResult_matriz_bairro(data.matriz_bairro)
					setDASHResult_n_matriz_bairro(data.n_matriz_bairro)
					setDASHResult_total_empresas_bairro_perc(data.total_empresas_bairro_perc)
					setDASHResult_atv_bairro_perc(data.atv_bairro_perc)
					setDASHResult_n_atv_bairro_perc(data.n_atv_bairro_perc)
					setDASHResult_matriz_bairro_perc(data.matriz_bairro_perc)
					setDASHResult_n_matriz_bairro_perc(data.n_matriz_bairro_perc)

					//dividas
										
					setDASHResult_dividas(data.dividas)
					setDASHResult_vlr_dividas(data.vlr_dividas)
					setDASHResult_qtd_dividas_prev(data.qtd_dividas_prev)
					setDASHResult_vlr_dividas_prev(data.vlr_dividas_prev)
					setDASHResult_qtd_dividas_nprev(data.qtd_dividas_nprev)
					setDASHResult_vlr_dividas_nprev(data.vlr_dividas_nprev)
					setDASHResult_qtd_dividas_fgts(data.qtd_dividas_fgts)
					setDASHResult_vlr_dividas_fgts(data.vlr_dividas_fgts)
					setDASHResult_tipo_pessoa_pf(data.tipo_pessoa_pf)
					setDASHResult_tipo_pessoa_pj(data.tipo_pessoa_pj)
					setDASHResult_tipo_situacao_inscricao_bf(data.tipo_situacao_inscricao_bf)
					setDASHResult_tipo_situacao_inscricao_cb(data.tipo_situacao_inscricao_cb)
					setDASHResult_tipo_situacao_inscricao_emgarantia(data.tipo_situacao_inscricao_emgarantia)
					setDASHResult_tipo_situacao_inscricao_judicial(data.tipo_situacao_inscricao_judicial)
					setDASHResult_indicador_ajuizado_sim(data.indicador_ajuizado_sim)
					setDASHResult_indicador_ajuizado_nao(data.indicador_ajuizado_nao)
					setDASHResult_valor_prev(data.valor_prev)
					setDASHResult_valor_nprev(data.valor_nprev)
					setDASHResult_valor_fgts(data.valor_fgts)
					setDASHResult_valor_prev_regular(data.valor_prev_regular)
					setDASHResult_valor_prev_irregular(data.valor_prev_irregular)
					setDASHResult_valor_nprev_regular(data.valor_nprev_regular)
					setDASHResult_valor_nprev_irregular(data.valor_nprev_irregular)
					setDASHResult_valor_fgts_regular(data.valor_fgts_regular)
					setDASHResult_valor_fgts_irregular(data.valor_fgts_irregular)
					setDASHResult_situacao_regular(data.situacao_regular)
					setDASHResult_situacao_irregular(data.situacao_irregular)

					setDASHResult_dividas_total(data.dividas_total)
					setDASHResult_vlr_dividas_total(data.vlr_dividas_total)
					setDASHResult_qtd_dividas_prev_total(data.qtd_dividas_prev_total)
					setDASHResult_vlr_dividas_prev_total(data.vlr_dividas_prev_total)
					setDASHResult_qtd_dividas_nprev_total(data.qtd_dividas_nprev_total)
					setDASHResult_vlr_dividas_nprev_total(data.vlr_dividas_nprev_total)
					setDASHResult_qtd_dividas_fgts_total(data.qtd_dividas_fgts_total)
					setDASHResult_vlr_dividas_fgts_total(data.vlr_dividas_fgts_total)
					setDASHResult_tipo_pessoa_pf_total(data.tipo_pessoa_pf_total)
					setDASHResult_tipo_pessoa_pj_total(data.tipo_pessoa_pj_total)
					setDASHResult_tipo_situacao_inscricao_bf_total(data.tipo_situacao_inscricao_bf_total)
					setDASHResult_tipo_situacao_inscricao_cb_total(data.tipo_situacao_inscricao_cb_total)
					setDASHResult_tipo_situacao_inscricao_emgarantia_total(data.tipo_situacao_inscricao_emgarantia_total)
					setDASHResult_tipo_situacao_inscricao_judicial_total(data.tipo_situacao_inscricao_judicial_total)
					setDASHResult_indicador_ajuizado_sim_total(data.indicador_ajuizado_sim_total)
					setDASHResult_indicador_ajuizado_nao_total(data.indicador_ajuizado_nao_total)
					setDASHResult_valor_prev_total(data.valor_prev_total)
					setDASHResult_valor_nprev_total(data.valor_nprev_total)
					setDASHResult_valor_fgts_total(data.valor_fgts_total)
					setDASHResult_valor_prev_regular_total(data.valor_prev_regular_total)
					setDASHResult_valor_prev_irregular_total(data.valor_prev_irregular_total)
					setDASHResult_valor_nprev_regular_total(data.valor_nprev_regular_total)
					setDASHResult_valor_nprev_irregular_total(data.valor_nprev_irregular_total)
					setDASHResult_valor_fgts_regular_total(data.valor_fgts_regular_total)
					setDASHResult_valor_fgts_irregular_total(data.valor_fgts_irregular_total)
					setDASHResult_situacao_regular_total(data.situacao_regular_total)
					setDASHResult_situacao_irregular_total(data.situacao_irregular_total)


				})
				.finally(() => {
					setLoadingDASH(false)
					setFormData(newState)
				})
		}
	}

	const scrollToTop = () => {
		window.scrollTo({ left: 0, top: 0, behavior: "smooth" })
	}

	const scrollToBottom = () => {
		window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" })
	}

	const verDetalhesSocios = async (nome_socio, cpf) => {
		ressetarDados()
		setLeads([])
		setIsPopupOpenMEI(false)
		setIsPopupOpenHolding(false)
		setIsPopupOpenCNPJ(false)
		setIsPopupOpenCnae(false)
		setIsPopupOpenDividas(false)
		setIsPopupOpenGEOM(false)
		setIsPopupOpenSOCIOS(true)
		setIsPopupOpen(true)
		setIsPopupLoading(true)
		await buscarDetalhesSocios(nome_socio, cpf)
		setIsPopupLoading(false)
	}

	const verDetalhesHoldings = async (cnpj, results_holdings, nome_fantasia, municipio, uf, razao_social, sit_cadastral_holdings) => {
		ressetarDados()
		setLeads([])
		setIsPopupOpenMEI(false)
		setIsPopupOpenSOCIOS(false)
		setIsPopupOpenCNPJ(false)
		setIsPopupOpenCnae(false)
		setIsPopupOpenDividas(false)
		setIsPopupOpenGEOM(false)
		setIsPopupOpenHolding(true)
		setIsPopupOpen(true)
		setIsPopupOpenHolding(true)
		setIsPopupLoading(true)
		await buscarDetalhesHoldings(cnpj, results_holdings)
		//fetchGoogleInfo(cnpj, nome_fantasia, municipio, uf, razao_social, null, null, null, sit_cadastral_holdings)
		setIsPopupLoading(false)
	}

	const verDetalhesCNPJ = async (cnpj, nome_fantasia) => {
		ressetarDados()
		setLeads([])
		setIsPopupLoading(true)
		setIsPopupOpenMEI(false)
		setIsPopupOpenSOCIOS(false)
		setIsPopupOpenCnae(false)
		setIsPopupOpenDividas(false)
		setIsPopupOpenGEOM(false)
		setIsPopupOpenHolding(false)
		setIsPopupOpenCNPJ(true)
		setIsPopupOpen(true)
		await buscarDetalhesCNPJ(cnpj, nome_fantasia)
		setIsPopupLoading(false)
	}

	const verDetalhesECA = async cnpj => {
		ressetarDados()
		setLeads([])
		setIsPopupOpen(false)
		setIsPopupLoading(false)
		await buscarDetalhesECA(cnpj)
		setIsPopupLoading(false)
	}

	const verDetalhesCnae = async (cnpj, nome_fantasia, municipio, uf, razao_social) => {
		ressetarDados()
		setLeads([])
		setIsPopupOpen(true)
		setIsPopupOpenMEI(false)
		setIsPopupOpenSOCIOS(false)
		setIsPopupOpenHolding(false)
		setIsPopupOpenCNPJ(false)
		setIsPopupOpenDividas(false)
		setIsPopupOpenGEOM(false)
		setIsPopupOpenCnae(true)
		setIsPopupLoading(true)
		await buscarDetalhesCnae(cnpj)
	//	     fetchGoogleInfo(cnpj, nome_fantasia, municipio, uf, razao_social)
		setIsPopupLoading(false)
	}

	const verDetalhesMEI = async cnpj => {
		ressetarDados()
		setLeads([])
		setIsPopupOpen(true)
		setIsPopupOpenSOCIOS(false)
		setIsPopupOpenHolding(false)
		setIsPopupOpenCNPJ(false)
		setIsPopupOpenDividas(false)
		setIsPopupOpenCnae(false)
		setIsPopupOpenGEOM(false)
		setIsPopupOpenMEI(true)
		setIsPopupLoading(true)
		await buscarDetalhesMEI(cnpj)
		setIsPopupLoading(false)
	}

	const verDetalhesDividas = async (cnpj, nome_fantasia, municipio, uf, razao_social, sit_cadastral) => {
		ressetarDados()
		setLeads([])
		setIsPopupOpen(true)
		setIsPopupOpenMEI(false)
		setIsPopupOpenSOCIOS(false)
		setIsPopupOpenHolding(false)
		setIsPopupOpenCNPJ(false)
		setIsPopupOpenCnae(false)
		setIsPopupOpenGEOM(false)
		setIsPopupOpenDividas(true)
		setIsPopupLoading(true)
		await buscarDetalhesDividas(cnpj)
		fetchGoogleInfo(cnpj, nome_fantasia, municipio, uf, razao_social, sit_cadastral)
		setIsPopupLoading(false)
	}


	const verDetalhesGEOM = async cnpj => {
		ressetarDados()
		setLeads([])
		setIsPopupLoading(true)
		setIsPopupOpenMEI(false)
		setIsPopupOpenSOCIOS(false)
		setIsPopupOpenCnae(false)
		setIsPopupOpenDividas(false)
		setIsPopupOpenHolding(false)
		setIsPopupOpenCNPJ(false)
		setIsPopupOpenGEOM(true)
		setIsPopupOpen(true)
		await buscarDetalhesGEOM(cnpj)
		setIsPopupLoading(false)
	}


	const verDetalhesDASH = async cnpj => {
		ressetarDados()
		setLeads([])
		setIsPopupOpen(true)
		setIsPopupOpenMEI(false)
		setIsPopupOpenSOCIOS(false)
		setIsPopupOpenHolding(false)
		setIsPopupOpenCNPJ(false)
		setIsPopupOpenCnae(false)
		setIsPopupOpenDividas(true)
		setIsPopupOpenGEOM(false)
		setIsPopupLoading(true)
		await buscarDetalhesDASH(cnpj)

		setIsPopupLoading(false)
	}
	const numberFormat = value =>
		new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value)

	// Validar é chamada na Paginação. Faz uma nova pesquisa e retorna os 50 resultados ref. a página indicada
	const validar = async item => {
		ressetarDados()
		setLeads([])
		await executarAtualizacao(item)

		if (isCNPJ) {
			setLoadingCNPJ(true)
			const newState = { ...formData, pagina: item.numero }
			consultarCNPJ(newState)
				.then(data => {
					setCNPJCount(data.count)
					setCNPJResult(data.result)
				})
				.finally(() => {
					setLoadingCNPJ(false)
					setFormData(newState)
				})
		}

		if (isMEI) {
			setLoadingMEI(true)
			const newState = { ...formData, pagina: item.numero }
			consultarMEI(newState)
				.then(data => {
					setMEICount(data.count)
					setMEIResult(data.result)
				})
				.finally(() => {
					setLoadingMEI(false)
					setFormData(newState)
				})
		} else {
			buscarDados(formData)
		}

		if (isSOCIOS) {
			setLoading_SOCIOS(true)
			const newState = { ...formData, pagina: item.numero }
			consultar_SOCIOS_NEW(newState)
				.then(data => {
					setSOCIOSCount(data.count)
					setSOCIOSResult(data.result)
				})
				.finally(() => {
					setLoading_SOCIOS(false)
					setFormData(newState)
				})
		}

		if (isHOLDINGS) {
			setLoadingHolding(true)
			const newState = { ...formData, pagina: item.numero }
			consultarHOLDING(newState)
				.then(data => {
					setHoldingCount(data.count)
					setHoldingResult(data.result)
				})
				.finally(() => {
					setLoadingHolding(false)
					setFormData(newState)
				})
		}

		if (isECA) {
			setLoadingECA(true)
			const newState = { ...formData, pagina: item.numero }
			consultarECA(newState)
				.then(data => {
					setECACount(data.count)
					setECAResult(data.result)
				})
				.finally(() => {
					setLoadingECA(false)
					setFormData(newState)
				})
		}

		if (isCnae) {
			setLoadingCnae(true)
			// consultarCnae(formData)
			const newState = { ...formData, pagina: item.numero }
			consultarCnae(newState)
				.then(data => {
					setCnaeCount(data.count)
					setCnaeResult(data.result)
				})
				.finally(() => setLoadingCnae(false))
		}
		if (isDividas) {
			setLoadingDividas(true)
			consultarDividas(formData)
				.then(data => {
					setDividasCount(data.count)
					setDividasResult(data.result)
				})
				.finally(() => setLoadingDividas(false))
		}
		if (isNCM) {
			setLoadingNcm(true)
			const newState = { ...formData, pagina: item.numero }
			consultarNCM(newState)
				.then(data => {
					setNcmCount(data.count)
					setNcmResult(data.result)
				})
				.finally(() => {
					setLoadingNcm(false)
					setFormData(newState)
				})
		}

		if (isGEOM) {
			setLoadingGEOM(true)
			const newState = { ...formData, pagina: item.numero }
			consultarGEOM(newState)
				.then(data => {
					setGEOMCount(data.count)
					setGEOMResult(data.result)
					setGEOMResult2(data.resultado_GEOM)
					setGEOMResult_GEOM_Grafico(data.GEOM_Grafico)
					//dados de estado
					setGEOMResult_empresas_total(data.empresas_total)
					setGEOMResult_ativa(data.ativa)
					setGEOMResult_n_ativa(data.n_ativa)
					setGEOMResult_matriz(data.matriz)
					setGEOMResult_filial(data.filial)
					setGEOMResult_mei(data.mei)
					setGEOMResult_mei_ativo(data.mei_ativo)
					setGEOMResult_simples(data.simples)
					setGEOMResult_simples_ativo(data.simples_ativo)
					setGEOMResult_estado(data.estado)
					setGEOMResult_cidade(data.cidade)
					setGEOMResult_bairro(data.bairro)

					//dados cidade
					setGEOMResult_total_empresas_bairro(data.total_empresas_bairro)
					setGEOMResult_atv_bairro(data.atv_bairro)
					setGEOMResult_n_atv_bairro(data.n_atv_bairro)
					setGEOMResult_matriz_bairro(data.matriz_bairro)
					setGEOMResult_n_matriz_bairro(data.n_matriz_bairro)
				})
				.finally(() => {
					setLoadingGEOM(false)
					setFormData(newState)
				})
		}

		if (isDASH) {
			setLoadingDASH(true)
			const newState = { ...formData, pagina: item.numero }
			consultarDASH(newState)
				.then(data => {
					setDASHCount(data.count)
					setDASHResult(data.result)
					setDASHResult2(data.resultado_DASH)
					setDASHResult_DASH_Grafico(data.DASH_Grafico)
					//dados de estado
					setDASHResult_empresas_total(data.empresas_total)
					setDASHResult_ativa(data.ativa)
					setDASHResult_n_ativa(data.n_ativa)
					setDASHResult_bandeira(data.bandeira)
					setDASHResult_matriz(data.matriz)
					setDASHResult_filial(data.filial)
					setDASHResult_mei(data.mei)
					setDASHResult_mei_ativo(data.mei_ativo)
					setDASHResult_simples(data.simples)
					setDASHResult_simples_ativo(data.simples_ativo)
					setDASHResult_estado(data.estado)
					setDASHResult_cidade(data.cidade)
					setDASHResult_bairro(data.bairro)

					//dados cidade
					setDASHResult_total_empresas_bairro(data.total_empresas_bairro)
					setDASHResult_atv_bairro(data.atv_bairro)
					setDASHResult_n_atv_bairro(data.n_atv_bairro)
					setDASHResult_matriz_bairro(data.matriz_bairro)
					setDASHResult_n_matriz_bairro(data.n_matriz_bairro)
				})
				.finally(() => {
					setLoadingDASH(false)
					setFormData(newState)
				})
		}
	}

	async function executarAtualizacao(item) {
		setFormData({ ...formData, pagina: item.numero })
		scrollToTop()
	}

	function arrumatexto(string) {
		return string.replace(/\S*/g, function (word) {
			return word.charAt(0) + word.slice(1).toLowerCase()
		})
	}

	const handleShowMinimum = () => {
		if (!isMinimum || isLoading) {
			setShowMinimum(true)
		}
	}
	const handleHideMinimum = () => {
		setShowMinimum(false)
	}

	// Popup Starts

	const handleOpen = () => {
		setIsPopupOpen(true)
	}

	const handleClose = () => {
		setIsPopupOpen(false)
		ressetarDados()
		setLeads([])
	}
	const useStyles = makeStyles(theme => ({
		root: {
			backgroundColor: "transparent",
			maxHeight: "100vh",
			marginTop: 50,
			// IE 11
			"@media all and (-ms-high-contrast: none)": {
				display: "none",
			},
			focus: {
				outline: "none",
			},
		},
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
	}))

	const classes = useStyles()

	const renderPopupDetalhes = detalhes => {
		return (
			<div className={classes.root}>
				<Modal className={classes.modal} open={isPopupOpen} onClose={handleClose}>
					{detalhes}
				</Modal>
			</div>
		)
	}
	// Popup Ends

	return (
		<>
			{/* NAVBAR */}
			<Navbar visibilidadeCampos={visibilidadeCampos} />

			{/* SIDENAV */}
			<div id="mySidenav" className="sidenav">
				<div className="sidenav-title__container">
					<SidenavTitle isCNPJ={isCNPJ} isMEI={isMEI} isSOCIOS={isSOCIOS} isHOLDINGS={isHOLDINGS} isECA={isECA} isCnae={isCnae} isDividas={isDividas} isNCM={isNCM} isGEOM={isGEOM} isDASH={isDASH} />
				</div>
				<form id="formulario" onSubmit={onSubmit}>
					<div>
						<input type="hidden" name="pagina" id="pagina" value={pagina} />
					</div>

					<div className="container_menu" id="itens_menu">
						{isCnae && <CnaeFilter formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} isMinimum2={isMinimum2} showMinimum2={showMinimum2} />}
						{isDividas && <DividasFilter1 formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} />}
						{isNCM && <NcmFilter1 formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} />}
						{isGEOM && <GeoMarketingFilter formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} />}
						{isDASH && <DASHFilterFile formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} />}
						{isHOLDINGS && <HoldingsFilterFile formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} />}
						{isCNPJ && <CNPJFilterFile formData={formData} setFormData={setFormData} isMinimum={isMinimum} formatDocument={formatDocument} showMinimum={showMinimum} />}
						{isSOCIOS && <SOCIOSFilterFile formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} />}
						{isECA && <ECAFilterFile formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} />}
						{isMEI && <MEIFilterFile formData={formData} setFormData={setFormData} isMinimum={isMinimum} showMinimum={showMinimum} />}

						<button type="submit" disabled={!isMinimum || (isCnae && !isMinimum2) || isLoading} className="btn btn-reverse buscar_btn" onPointerEnter={() => handleShowMinimum()} onPointerLeave={handleHideMinimum} onClick={() => scrollToTop()}>
							<span>BUSCAR</span>
							<img src={searchIcon} alt="Buscar" />
						</button>
					</div>
				</form>
			</div>

			<div className="div_resultados" style={{ minHeight: "200px", minWidth: "200px" }}>
				<section id="section_resultados" style={{ overflowX: "auto" }}>
					{isLoading && <Spinner />}

					{/* RESULTADOS */}
					{!isLoading && CNPJResult && CNPJResult.length > 0 && isCNPJ && <CNPJResultFile resultados={CNPJResult} contagem={CNPJCount} verDetalhes={verDetalhesCNPJ} isLoading={isLoading} pagina={pagina} />}
					{!isLoading && MEIResult && MEIResult.length > 0 && isMEI && <MEIResultFile resultados={MEIResult} verDetalhes={verDetalhesMEI} contagem={MEICount} pagina={pagina} />}
					{!isLoading && SOCIOSResult && SOCIOSResult.length > 0 && isSOCIOS && <SOCIOSResultFile resultados={SOCIOSResult} verDetalhes={verDetalhesSocios} contagem={SOCIOSCount} pagina={pagina} />}
					{!isLoading && HoldingsResult && HoldingsResult.length > 0 && isHOLDINGS && <HoldingsResultFile resultados={HoldingsResult} verDetalhes={verDetalhesHoldings} contagem={HoldingsCount} pagina={pagina} />}
					{!isLoading && ECAResult && ECAResult.length > 0 && isECA && <ECAResultFile resultados={ECAResult} verDetalhes={verDetalhesECA} contagem={ECACount} pagina={pagina} />}
					{!isLoading && cnaeResult && cnaeResult.length > 0 && isCnae && <CnaeResult resultados={cnaeResult} verDetalhes={verDetalhesCnae} contagem={cnaeCount} pagina={pagina} />}
					{!isLoading && DividasResult && DividasResult.length > 0 && isDividas && <DividasResult1 resultados={DividasResult} verDetalhes={verDetalhesDividas} contagem={DividasCount} pagina={pagina} />}
					{!isLoading && NcmResult && NcmResult.length > 0 && isNCM && <NcmResult1 resultados={NcmResult} contagem={NcmCount} pagina={pagina} />}
					{!isLoading && GEOMResult && GEOMResult.length > 0 && isGEOM && <GeoMarketingResult resultados={GEOMResult} resultados2={GEOMResult2} resultados_empresas_total={GEOMResult_empresas_total} resultados_estado={GEOMResult_estado} resultados_cidade={GEOMResult_cidade} resultados_bairro={GEOMResult_bairro} resultados_total_empresas_bairro={GEOMResult_total_empresas_bairro} resultados_atv_bairro={GEOMResult_atv_bairro} resultados_n_atv_bairro={GEOMResult_n_atv_bairro} resultados_matriz_bairro={GEOMResult_matriz_bairro} resultados_n_matriz_bairro={GEOMResult_n_matriz_bairro} resultados_ativa={GEOMResult_ativa} resultados_n_ativa={GEOMResult_n_ativa} resultados_matriz={GEOMResult_matriz} resultados_filial={GEOMResult_filial} resultados_mei={GEOMResult_mei} resultados_mei_ativo={GEOMResult_mei_ativo} resultados_simples={GEOMResult_simples} resultados_simples_ativo={GEOMResult_simples_ativo} resultados_total_empresas_bairro_perc={GEOMResult_total_empresas_bairro_perc} resultados_atv_bairro_perc={GEOMResult_atv_bairro} resultados_n_atv_bairro_perc={GEOMResult_n_atv_bairro_perc} resultados_matriz_bairro_perc={GEOMResult_matriz_bairro_perc} resultados_n_matriz_bairro_perc={GEOMResult_n_matriz_bairro_perc} resultados_total_cidade={GEOMResult_total_cidade} resultados_ativos_cidade={GEOMResult_ativos_cidade} resultados_n_ativos_cidade={GEOMResult_n_ativos_cidade} verDetalhes={verDetalhesGEOM} geo_info={geo_info} contagem={GEOMCount} pagina={pagina} />}

					{!isLoading && DASHResult && DASHResult.length > 0 && isDASH && <DASHResultFile 
						resultados={DASHResult} 
						resultados2={DASHResult2} 
						resultados_empresas_total={DASHResult_empresas_total} 
						resultados_estado={DASHResult_estado} 
						resultados_cidade={DASHResult_cidade} 
						resultados_bairro={DASHResult_bairro} 
						resultados_total_empresas_bairro={DASHResult_total_empresas_bairro} 
						resultados_atv_bairro={DASHResult_atv_bairro} 
						resultados_n_atv_bairro={DASHResult_n_atv_bairro} 
						resultados_matriz_bairro={DASHResult_matriz_bairro} 
						resultados_n_matriz_bairro={DASHResult_n_matriz_bairro} 
						resultados_ativa={DASHResult_ativa} 
						resultados_n_ativa={DASHResult_n_ativa} 
						bandeira={DASHResult_bandeira} 
						resultados_matriz={DASHResult_matriz} 
						resultados_filial={DASHResult_filial} 
						resultados_mei={DASHResult_mei} 
						resultados_mei_ativo={DASHResult_mei_ativo} 
						resultados_simples={DASHResult_simples} 
						resultados_simples_ativo={DASHResult_simples_ativo} 
						resultados_dividas={DASHResult_dividas}
						resultados_vlr_dividas={DASHResult_vlr_dividas}
						resultados_qtd_dividas_prev={DASHResult_qtd_dividas_prev}
						resultados_vlr_dividas_prev={DASHResult_vlr_dividas_prev}
						resultados_qtd_dividas_nprev={DASHResult_qtd_dividas_nprev}
						resultados_vlr_dividas_nprev={DASHResult_vlr_dividas_nprev}
						resultados_qtd_dividas_fgts={DASHResult_qtd_dividas_fgts}
						resultados_vlr_dividas_fgts={DASHResult_vlr_dividas_fgts}
						resultados_tipo_pessoa_pf={DASHResult_tipo_pessoa_pf}
						resultados_tipo_pessoa_pj={DASHResult_tipo_pessoa_pj}
						resultados_tipo_situacao_inscricao_bf={DASHResult_tipo_situacao_inscricao_bf}
						resultados_tipo_situacao_inscricao_cb={DASHResult_tipo_situacao_inscricao_cb}
						resultados_tipo_situacao_inscricao_emgarantia={DASHResult_tipo_situacao_inscricao_emgarantia}
						resultados_tipo_situacao_inscricao_judicial={DASHResult_tipo_situacao_inscricao_judicial}
						resultados_indicador_ajuizado_sim={DASHResult_indicador_ajuizado_sim}
						resultados_indicador_ajuizado_nao={DASHResult_indicador_ajuizado_nao}
						resultados_valor_prev={DASHResult_valor_prev}
						resultados_valor_nprev={DASHResult_valor_nprev}
						resultados_valor_fgts={DASHResult_valor_fgts}
						resultados_valor_prev_regular={DASHResult_valor_prev_regular}
						resultados_valor_prev_irregular={DASHResult_valor_prev_irregular}
						resultados_valor_nprev_regular={DASHResult_valor_nprev_regular}
						resultados_valor_nprev_irregular={DASHResult_valor_nprev_irregular}
						resultados_valor_fgts_regular={DASHResult_valor_fgts_regular}
						resultados_valor_fgts_irregular={DASHResult_valor_fgts_irregular}
						resultados_situacao_regular={DASHResult_situacao_regular}
						resultados_situacao_irregular={DASHResult_situacao_irregular}
						resultados_dividas_total={DASHResult_dividas_total}
						resultados_vlr_dividas_total={DASHResult_vlr_dividas_total}
						resultados_qtd_dividas_prev_total={DASHResult_qtd_dividas_prev_total}
						resultados_vlr_dividas_prev_total={DASHResult_vlr_dividas_prev_total}
						resultados_qtd_dividas_nprev_total={DASHResult_qtd_dividas_nprev_total}
						resultados_vlr_dividas_nprev_total={DASHResult_vlr_dividas_nprev_total}
						resultados_qtd_dividas_fgts_total={DASHResult_qtd_dividas_fgts_total}
						resultados_vlr_dividas_fgts_total={DASHResult_vlr_dividas_fgts_total}
						resultados_tipo_pessoa_pf_total={DASHResult_tipo_pessoa_pf_total}
						resultados_tipo_pessoa_pj_total={DASHResult_tipo_pessoa_pj_total}
						resultados_tipo_situacao_inscricao_bf_total={DASHResult_tipo_situacao_inscricao_bf_total}
						resultados_tipo_situacao_inscricao_cb_total={DASHResult_tipo_situacao_inscricao_cb_total}
						resultados_tipo_situacao_inscricao_emgarantia_total={DASHResult_tipo_situacao_inscricao_emgarantia_total}
						resultados_tipo_situacao_inscricao_judicial_total={DASHResult_tipo_situacao_inscricao_judicial_total}
						resultados_indicador_ajuizado_sim_total={DASHResult_indicador_ajuizado_sim_total}
						resultados_indicador_ajuizado_nao_total={DASHResult_indicador_ajuizado_nao_total}
						resultados_valor_prev_total={DASHResult_valor_prev_total}
						resultados_valor_nprev_total={DASHResult_valor_nprev_total}
						resultados_valor_fgts_total={DASHResult_valor_fgts_total}
						resultados_valor_prev_regular_total={DASHResult_valor_prev_regular_total}
						resultados_valor_prev_irregular_total={DASHResult_valor_prev_irregular_total}
						resultados_valor_nprev_regular_total={DASHResult_valor_nprev_regular_total}
						resultados_valor_nprev_irregular_total={DASHResult_valor_nprev_irregular_total}
						resultados_valor_fgts_regular_total={DASHResult_valor_fgts_regular_total}
						resultados_valor_fgts_irregular_total={DASHResult_valor_fgts_irregular_total}
						resultados_situacao_regular_total={DASHResult_situacao_regular_total}
						resultados_situacao_irregular_total={DASHResult_situacao_irregular_total}
						
						verDetalhes={verDetalhesDASH} 
						geo_info={geo_info} 
						contagem={DASHCount} 
						 />}

					{!isLoading && (cnaeCount === 0 || DividasCount === 0 || NcmCount === 0 || HoldingsCount === 0 || CNPJCount === 0 || SOCIOSCount === 0 || ECACount === 0 || MEICount === 0 || GEOMCount === 0 || DASHCount === 0) && <NoResultsFound />}
					{!isLoading && CNPJResult && MEIResult && SOCIOSResult && HoldingsResult && ECAResult && cnaeResult && DividasResult && NcmResult && GEOMResult && DASHResult && !(cnaeCount === 0 || DividasCount === 0 || NcmCount === 0 || HoldingsCount === 0 || CNPJCount === 0 || SOCIOSCount === 0 || ECACount === 0 || MEICount === 0 || GEOMCount === 0 || DASHCount === 0) && !(cnaeCount > 0 || DividasCount > 0 || NcmCount > 0 || HoldingsCount > 0 || CNPJCount > 0 || SOCIOSCount > 0 || ECACount > 0 || MEICount > 0 || GEOMCount > 0 || DASHCount > 0) && <ResultsInitial />}

					{/* DETALHAMENTOS (POPUP) */}
					{isPopupOpen && isPopupOpenCNPJ && renderPopupDetalhes(<CNPJDetailsFile resultados_leads={resultados_leads} resultados_cnpj={resultados_cnpj} socios_cnpj={socios_cnpj} isPopupLoading={isPopupLoading} isPopupOpen={isPopupOpen} verDetalhesSocios={verDetalhesSocios} google_info={google_info} />)}
					{isPopupOpen && isPopupOpenMEI && renderPopupDetalhes(<MEIDetailsFile resultados_leads={resultados_leads} resultados_mei={resultados_mei} isPopupLoading={isPopupLoading} isPopupOpen={isPopupOpen} verDetalhesCNPJ={verDetalhesCNPJ} google_info={google_info} />)}
					{isPopupOpen && isPopupOpenSOCIOS && renderPopupDetalhes(<SOCIOSDetailsFile resultados_leads={resultados_leads} resultados_socios={resultados_socios} detalhes_SOCIOS={detalhes_SOCIOS} isPopupLoading={isPopupLoading} isPopupOpen={isPopupOpen} verDetalhesCNPJ={verDetalhesCNPJ} google_info={google_info} />)}
					{isPopupOpen && isPopupOpenHolding && renderPopupDetalhes(<HoldingsDetailsFile resultados_leads={resultados_leads} resultados_holdings={resultados_holdings} subsidiarias_holdings={subsidiarias_holdings} results_holdings={results_holdings} isPopupLoading={isPopupLoading} isPopupOpen={isPopupOpen} verDetalhesCNPJ={verDetalhesCNPJ} google_info={google_info} />)}
					{isPopupOpen && isPopupOpenECA && renderPopupDetalhes(<ECADetailsFile resultados_leads={resultados_leads} resultados_eca={resultados_eca} isPopupLoading={isPopupLoading} isPopupOpen={isPopupOpen} google_info={google_info} />)}
					{isPopupOpen && isPopupOpenCnae && renderPopupDetalhes(<CnaeDetailsFile resultados_leads={resultados_leads} resultados_cnae={resultados_cnae} socios_cnae={socios_cnae} isPopupLoading={isPopupLoading} isPopupOpen={isPopupOpen} verDetalhesCNPJ={verDetalhesCNPJ} verDetalhesSocios={verDetalhesSocios} google_info={google_info} />)}
					{isPopupOpen && isPopupOpenDividas && renderPopupDetalhes(<DividasDetailsFile resultados_leads={resultados_leads} resultados_dividas={resultados_dividas} detalhes_dividas={detalhes_dividas} isPopupLoading={isPopupLoading} isPopupOpen={isPopupOpen} verDetalhesCNPJ={verDetalhesCNPJ} google_info={google_info} />)}
					{isPopupOpen && isPopupOpenGEOM && renderPopupDetalhes(<GeoMarketingDetailsFile resultados_leads={resultados_leads} detalhes_GEOM={detalhes_GEOM} socios_cnpj_GEOM={socios_cnpj_GEOM} isPopupLoading={isPopupLoading} isPopupOpen={isPopupOpen} verDetalhesSocios={verDetalhesSocios} google_info={google_info} />)}
				</section>

				<section className="paginacao">
					{!isLoadingCNPJ && isCNPJ && CNPJCount > 0 && <Pagination pagina={pagina} contagem={CNPJCount} validar={validar} />}
					{!isLoadingMEI && isMEI && MEICount > 0 && <Pagination pagina={pagina} contagem={MEICount} validar={validar} />}
					{!isLoadingCnae && isCnae && cnaeCount > 0 && <Pagination pagina={pagina} contagem={cnaeCount} validar={validar} />}
					{!isLoadingDividas && isDividas && DividasCount > 0 && <Pagination pagina={pagina} contagem={DividasCount} validar={validar} />}
					{!isLoadingNcm && isNCM && NcmCount > 0 && <Pagination pagina={pagina} contagem={NcmCount} validar={validar} />}
					{!isLoadingGEOM && isGEOM && GEOMCount > 0 && <Pagination pagina={pagina} contagem={GEOMCount} validar={validar} />}

					{!isLoadingHolding && isHOLDINGS && HoldingsCount > 0 && <Pagination pagina={pagina} contagem={HoldingsCount} validar={validar} />}
					{!isLoadingSOCIOS && isSOCIOS && SOCIOSCount > 0 && <Pagination pagina={pagina} contagem={SOCIOSCount} validar={validar} />}
					{!isLoadingECA && isECA && ECACount > 0 && <Pagination pagina={pagina} contagem={ECACount} validar={validar} />}
				</section>
			</div>
		</>
	)
}
Principal.propTypes = {
	getDetalhe: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	detalhes: PropTypes.object.isRequired,
	buscarDados: PropTypes.func.isRequired,
	ressetarDados: PropTypes.func.isRequired,
	buscarDetalhesSocios: PropTypes.func.isRequired,
	buscarDetalhesDividas: PropTypes.func.isRequired,
	buscarDetalhesECA: PropTypes.func.isRequired,
	buscarDetalhesCnae: PropTypes.func.isRequired,
	buscarDetalhesMEI: PropTypes.func.isRequired,
	buscarDetalhesCNPJ: PropTypes.func.isRequired,
	buscarDetalhesHoldings: PropTypes.func.isRequired,
	buscarDetalhesNCM: PropTypes.func.isRequired,
	buscarDetalhesGEOM: PropTypes.func.isRequired,
	buscarDetalhesDASH: PropTypes.func.isRequired,
	buscarLeads: PropTypes.func.isRequired,
	result_socios: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	auth: state.auth,
	detalhes: state.detalhes,
	datacnpj: state.cnpj,
	result_socios: state.dados_socios,
	result_mei: state.dados_mei,
	result_eca: state.dados_eca,
	result_cnae: state.dados_cnae,
	result_dividas: state.dados_dividas,
	result_cnpj: state.dados_cnpj,
	result_detalhes_GEOM: state.dados_GEOM,
	result_holdings: state.dados_holdings,
	google_info: state.fetch_google_info,
	geo_info: state.fetch_geo_info,
	result_leads: state.dados_leads,
})

export default connect(mapStateToProps, { getDetalhe, buscarDados, ressetarDados, fetchGoogleInfo, eraseGoogleInfo, fetchGEOInfo, eraseGEOInfo, buscarDetalhesSocios, buscarDetalhesDividas, buscarDetalhesHoldings, buscarDetalhesECA, buscarDetalhesCnae, buscarDetalhesMEI, buscarDetalhesNCM, buscarDetalhesGEOM, buscarDetalhesDASH, buscarDetalhesCNPJ, buscarLeads })(Principal)
