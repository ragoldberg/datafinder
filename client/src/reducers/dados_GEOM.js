/* eslint-disable import/no-anonymous-default-export */
import { DADOS_GEOM_IN, DADOS_GEOM_OUT } from "../actions/types"
const initialState = {
  detalhes_GEOM: null,
  socios_cnpj_GEOM: null,
  carregando: true
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case DADOS_GEOM_IN:
      return {
        ...state,
        detalhes_GEOM: payload.detalhes_GEOM,
        socios_cnpj_GEOM: payload.socios_cnpj_GEOM,
        carregando: false
      }
    case DADOS_GEOM_OUT:
      return {
        ...state,
        detalhes_GEOM: null,
        socios_cnpj_GEOM:null,
        carregando: false
      }

    default:
      return state
  }
}
