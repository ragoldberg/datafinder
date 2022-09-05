import axios from "axios"
import { DADOS_DIVIDAS_IN, DADOS_DIVIDAS_OUT } from "./types"

// Fazer uma busca

export const buscarDetalhesDividas = cnpj => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const body = null
    const res = await axios.get("/search/dividas/" + cnpj, body, config)
    console.log("res from buscarDetalhes Dividas", res)

    dispatch({
      type: DADOS_DIVIDAS_IN,
      payload: res.data.respostas
    })
  } catch (error) {
    dispatch({
      type: DADOS_DIVIDAS_OUT
    })

    console.log(error)
  }
}
