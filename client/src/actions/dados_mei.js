import axios from "axios"
import { DADOS_MEI_IN, DADOS_MEI_OUT } from "./types"

// Fazer uma busca

export const buscarDetalhesMEI = cnpj => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const body = null
    const res = await axios.get("/search/mei/" + cnpj, body, config)
    console.log("res from buscarDetalhes MEI", res)

    dispatch({
      type: DADOS_MEI_IN,
      payload: res.data.respostas
    })
  } catch (error) {
    dispatch({
      type: DADOS_MEI_OUT
    })

    console.log(error)
  }
}
