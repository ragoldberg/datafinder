import axios from "axios"
import { DADOS_CNAE_IN, DADOS_CNAE_OUT } from "./types"

// Fazer uma busca

export const buscarDetalhesCnae = cnpj => async dispatch => {
  console.log("buscarDetalhes Cnae fired")

  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const body = null
    const res = await axios.get("/search/cnae/" + cnpj, body, config)

    console.log("res from actions cnae", res.data.respostas)

    dispatch({
      type: DADOS_CNAE_IN,
      payload: res.data.respostas
    })
  } catch (error) {
    dispatch({
      type: DADOS_CNAE_OUT
    })

    console.log(error)
  }
}
