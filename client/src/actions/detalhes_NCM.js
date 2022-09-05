import axios from "axios";
import {DADOS_NCM_IN, DADOS_NCM_OUT} from './types';

// Fazer uma busca

export const buscarDetalhesNCM = (cnpj) => async dispatch => {

    try {
        
        const config = {

            headers: {
                "Content-Type" : "application/json"
            }
        }

        const body = null;
        const res = await axios.get('/search/'+cnpj, body, config);

        dispatch({
            type: DADOS_NCM_IN,
            payload: res.data.respostas
        });
        
    } catch (error) {

        dispatch({
            type: DADOS_NCM_OUT,
        })

        console.log(error);
        
    }
}