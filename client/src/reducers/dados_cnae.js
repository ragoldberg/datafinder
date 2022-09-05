/* eslint-disable import/no-anonymous-default-export */
import { DADOS_CNAE_IN, DADOS_CNAE_OUT } from "../actions/types"
const initialState = {
  resultados_cnae: null,
  socios_cnae: null,
  carregando: true
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case DADOS_CNAE_IN:
      return {
        ...state,
        resultados_cnae: payload.resultados_cnae,
        socios_cnae: payload.socios_cnae,
        carregando: false
      }
    case DADOS_CNAE_OUT:
      return {
        ...state,
        resultados_cnae: null,
        socios_cnae: null,
        carregando: false
      }

    default:
      return state
  }
}
