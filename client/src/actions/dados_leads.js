import axios from "axios"
import { DADOS_LEADS_FAILURE, DADOS_LEADS_SUCCESS } from "./types"

// Busca na API de Leads

export const buscarLeads = (domain) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const body = null
        let response
        if (domain !== '' && domain !== null && domain !== undefined && domain !== 'null' && domain !== 'undefined' && domain.includes(".")) {
            response = await axios.get("/search/leads/" + domain, body, config)
            console.log('res from buscarLeads backend', response)

            dispatch({
                type: DADOS_LEADS_SUCCESS,
                payload: response.data
            })
        } else {
            console.log('no domain')
            dispatch({
                type: DADOS_LEADS_FAILURE
            })
        }      
        
        
    } catch (e) {
        

        console.log('Error getting leads API', e)
    }
}