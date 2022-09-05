/* eslint-disable import/no-anonymous-default-export */
import { GET_DETALHE, DETALHE_ERROR, DETALHE_OUT }  from '../actions/types';
const initialState = {
    cnpj: null,
    socios: [],
    loading: true,
    error: {}
}

export default function( state= initialState, action) {

    const { type, payload } = action;

    switch (type)
    {
        case GET_DETALHE:
            return{
                ...state,
                cnpj: payload,
                loading: false
            };
        case DETALHE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case DETALHE_OUT:
                return {
                    cnpj: null,
                    socios: [],
                    loading: true,
                    error: {}
                }

        default:
            return state
    }

}