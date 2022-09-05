import axios from "axios"
import { DADOS_IN, DADOS_OUT, DADOS_SOCIOS_OUT, DADOS_SEARCHING } from "./types"

// Fazer uma busca

export const buscarDados = formData => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }

    dispatch({
      type: DADOS_SEARCHING
    })

    const body = formData
    const res = await axios.post("/principal", body, config)
    console.log("res ", res)

    dispatch({
      type: DADOS_IN,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: DADOS_OUT
    })
  }
}

// Ressetar objeto Dados

export const ressetarDados = formData => async dispatch => {
  dispatch({
    type: DADOS_OUT
  })

  dispatch({
    type: DADOS_SOCIOS_OUT
  })
}
