/* eslint-disable import/no-anonymous-default-export */
import { DADOS_MEI_IN, DADOS_MEI_OUT } from "../actions/types"
const initialState = {
  resultados_mei: null,
  carregando: true
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case DADOS_MEI_IN:
      return {
        ...state,
        resultados_mei: payload.resultados_mei,
        carregando: false
      }
    case DADOS_MEI_OUT:
      return {
        ...state,
        resultados_mei: null,
        carregando: false
      }

    default:
      return state
  }
}
