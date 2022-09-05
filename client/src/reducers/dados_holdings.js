/* eslint-disable import/no-anonymous-default-export */
import { DADOS_HOLDINGS_IN, DADOS_HOLDINGS_OUT } from "../actions/types"
const initialState = {
	resultados_holdings: null,
	subsidiarias_holdings: null,
	results_holdings: null,
	carregando: true,
}

export default function (state = initialState, action) {
	const { type, payload } = action

	switch (type) {
		case DADOS_HOLDINGS_IN:
			return {
				...state,
				resultados_holdings: payload.details.resultados_holdings,
				subsidiarias_holdings: payload.details.subsidiarias_holdings,
				results_holdings: payload.results,
				carregando: false,
			}
		case DADOS_HOLDINGS_OUT:
			return {
				...state,
				resultados_holdings: null,
				subsidiarias_holdings: null,
				results_holdings: null,
				carregando: false,
			}

		default:
			return state
	}
}
