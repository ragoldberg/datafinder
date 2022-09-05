import axios from "axios"
import { DADOS_GEOM_IN, DADOS_GEOM_OUT } from "./types"

// Fazer uma busca

export const buscarDetalhesGEOM= cnpj => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const body = null
    const res = await axios.get("/search/GEOM/" + cnpj, body, config)
    console.log("res from buscarDetalhes GEOM", res)

    dispatch({
      type: DADOS_GEOM_IN,
      payload: res.data.respostas
    })
  } catch (error) {
    dispatch({
      type: DADOS_GEOM_OUT
    })

    console.log(error)
  }
}
