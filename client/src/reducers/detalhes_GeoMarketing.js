import { DADOS_GEOM_IN, DADOS_GEOM_OUT } from "../actions/types"
const initialState = {
  resultados_cnpj: null,
  socios_cnpj: null,
  carregando: true
}

export default function (state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case DADOS_GEOM_IN:
      return {
        ...state,
        resultados_cnpj: payload.resultados_cnpj,
        socios_cnpj: payload.socios_cnpj,
        carregando: false
      }
    case DADOS_GEOM_OUT:
      return {
        ...state,
        resultados_cnpj: null,
        socios_cnpj: null,
        carregando: false
      }

    default:
      return state
  }
}
