import axios from "axios"
import { DADOS_ECA_IN, DADOS_ECA_OUT } from "./types"

// Fazer uma busca

export const buscarDetalhesECA = cnpj => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const body = null
    const res = await axios.get("/search/eca/" + cnpj, body, config)
    console.log("res from buscarDetalhesECA", res)

    dispatch({
      type: DADOS_ECA_IN,
      payload: res.data.respostas
    })
  } catch (error) {
    dispatch({
      type: DADOS_ECA_OUT
    })

    console.log(error)
  }
}
