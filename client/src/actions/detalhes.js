import axios from "axios";
//import { setAlert } from "./alert";
import { GET_DETALHE, DETALHE_ERROR } from './types';


// Pegar os Dados Iniciais dos Selects da página principal
export const getDetalhe = () => async dispatch => {
    try {
        const res = await axios.get('/principal_select');

        dispatch({
            type: GET_DETALHE,
            payload: res.data
        })
        
    } catch (error) {

        dispatch({
            type: DETALHE_ERROR,
            payload: { msg : error, status: error }
        })
        
    }
}