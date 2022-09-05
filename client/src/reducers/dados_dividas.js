/* eslint-disable import/no-anonymous-default-export */
import { DADOS_DIVIDAS_IN, DADOS_DIVIDAS_OUT } from "../actions/types"
const initialState = {
  resultados_dividas: null,
  detalhes_dividas: null,
  carregando: true
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case DADOS_DIVIDAS_IN:
      return {
        ...state,
        resultados_dividas: payload.resultados_dividas,
        detalhes_dividas: payload.detalhes_dividas,
        carregando: false
      }
    case DADOS_DIVIDAS_OUT:
      return {
        ...state,
        resultados_dividas: null,
        detalhes_dividas: null,
        carregando: false
      }

    default:
      return state
  }
}
