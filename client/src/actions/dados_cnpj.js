import axios from "axios"
import { DADOS_CNPJ_IN, DADOS_CNPJ_OUT } from "../actions/types"

// Fazer uma busca

export const buscarDetalhesCNPJ = (cnpj, nome_fantasia) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const queryParam = nome_fantasia ? `?nome_fantasia=${nome_fantasia}` : ''
    const body = null
    const res = await axios.get("/search/cnpj/" + cnpj + queryParam, body, config)

    dispatch({
      type: DADOS_CNPJ_IN,
      payload: res.data.respostas
    })
  } catch (error) {
    dispatch({
      type: DADOS_CNPJ_OUT
    })

    console.log(error)
  }
}
