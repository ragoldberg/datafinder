
/* eslint-disable import/no-anonymous-default-export */
import { DADOS_IN, DADOS_OUT, DADOS_SEARCHING }  from '../actions/types';
const initialState = {
    resultados: null,
    pg: null,
    contagem: null,
    carregando: false
}

export default function( state= initialState, action) {

    const { type, payload } = action;

    switch (type)
    {
        case DADOS_IN:
            return{
                ...state,
                resultados: payload.resultados,
                pg: payload.pagina,
                contagem: payload.contagem,
                carregando: false
            };
        case DADOS_OUT:
                return {
                    ...state,
                    resultados: null,
                    pg: null,
                    contagem: null,
                    carregando: false
                }

        case DADOS_SEARCHING:
            return{
                ...initialState,
                carregando: true
            };
        default:
            return state
    }

}