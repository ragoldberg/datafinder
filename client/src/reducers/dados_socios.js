/* eslint-disable import/no-anonymous-default-export */
import { DADOS_SOCIOS_IN, DADOS_SOCIOS_OUT } from "../actions/types"
const initialState = {
  resultados_socios: null,
  carregando: true
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case DADOS_SOCIOS_IN:
      return {
        ...state,
        resultados_socios: payload.resultados_socios,
        detalhes_SOCIOS: payload.detalhes_SOCIOS,
        carregando: false
      }
    case DADOS_SOCIOS_OUT:
      return {
        ...state,
        resultados_socios: null,
        carregando: false
      }

    default:
      return state
  }
}
