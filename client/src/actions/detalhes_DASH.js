import axios from "axios";
import {DADOS_DASH_IN, DADOS_DASH_OUT} from './types';

// Fazer uma busca

export const buscarDetalhesDASH = (uf) => async dispatch => {

    try {
        
        const config = {

            headers: {
                "Content-Type" : "application/json"
            }
        }

        const body = null;
        const res = await axios.get('/search/'+uf, body, config);

        dispatch({
            type: DADOS_DASH_IN,
            payload: res.data.respostas
        });
        
    } catch (error) {

        dispatch({
            type: DADOS_DASH_OUT,
        })

        console.log(error);
        
    }
}