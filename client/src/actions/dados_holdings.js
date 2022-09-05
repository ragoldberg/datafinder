import axios from "axios"
import { DADOS_HOLDINGS_IN, DADOS_HOLDINGS_OUT } from "./types"

// Fazer uma busca

export const buscarDetalhesHoldings = (cnpj, resultado_holding) => async dispatch => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		}

		const body = null
		const res = await axios.get(`/search/holdings/${cnpj}`, body, config)
		console.log("res from buscar detalhes holdings", res)
		console.log("resultado_holding from buscar detalhes holdings", resultado_holding)

		dispatch({
			type: DADOS_HOLDINGS_IN,
			payload: {
				details: res.data.respostas,
				results: resultado_holding,
			},
		})
	} catch (error) {
		dispatch({
			type: DADOS_HOLDINGS_OUT,
		})

		console.log(error)
	}
}
