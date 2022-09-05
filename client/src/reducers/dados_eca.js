/* eslint-disable import/no-anonymous-default-export */
import { DADOS_ECA_IN, DADOS_ECA_OUT } from "../actions/types"
const initialState = {
  resultados_eca: null,
  carregando: true
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case DADOS_ECA_IN:
      return {
        ...state,
        resultados_eca: payload.resultados_eca,
        carregando: false
      }
    case DADOS_ECA_OUT:
      return {
        ...state,
        resultados_eca: null,
        carregando: false
      }

    default:
      return state
  }
}
