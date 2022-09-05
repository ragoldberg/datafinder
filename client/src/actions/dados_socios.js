import axios from "axios"
import { DADOS_SOCIOS_IN, DADOS_SOCIOS_OUT } from "./types"

// Fazer uma busca

export const buscarDetalhesSocios = (nome_socio, cpf) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    const body = null
    console.log(`/search/socios/${nome_socio}/${cpf}`)
    const res = await axios.get(`/search/socios/${nome_socio}/${cpf}`, body, config)

    dispatch({
      type: DADOS_SOCIOS_IN,
      payload: res.data.respostas
    })
  } catch (error) {
    dispatch({
      type: DADOS_SOCIOS_OUT
    })

    console.log(error)
  }
}
