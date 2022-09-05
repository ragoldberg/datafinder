import { DADOS_NCM_IN, DADOS_NCM_OUT }  from '../actions/types';
const initialState = {
    resultados_NCM: null,
    NCM: null,
    carregando: true
}

export default function( state= initialState, action) {

    const { type, payload } = action;
    
    switch (type)
    {
        case DADOS_NCM_IN:
            return{
                ...state,
                resultados_NCM: payload.resultados_NCM,
                NCM: payload.NCM,
                carregando: false
            };
        case DADOS_NCM_OUT:
                return {
                    ...state,
                    resultados_NCM: null,
                    NCM: null,
                    carregando: false
                }

        default:
            return state
    }

}