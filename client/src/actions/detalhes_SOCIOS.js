import axios from "axios"
import { DADOS_SOCIOS_NEW_IN, DADOS_SOCIOS_NEW_OUT } from "../actions/types"

// Fazer uma busca

// export const buscarDetalhes_SOCIOS = (nome_socio, cpf) => async dispatch => {
export const buscarDetalhes_SOCIOS = cpf => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const body = null
    const res = await axios.get(`/socios/${cpf}`, body, config)
    console.log("from buscarDetalhes_SOCIOS: ", res.data)

    dispatch({
      type: DADOS_SOCIOS_NEW_IN,
      payload: res.data.respostas
    })
  } catch (error) {
    dispatch({
      type: DADOS_SOCIOS_NEW_OUT
    })

    console.log(error)
  }
}
