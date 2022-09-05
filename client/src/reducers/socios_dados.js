import { DADOS_SOCIOS_NEW_IN, DADOS_SOCIOS_NEW_OUT }  from '../actions/types';
const initialState = {
    resultados_SOCIOS: null,
    SOCIOS: null,
    carregando: true
}

export default function( state= initialState, action) {

    const { type, payload } = action;
    
    switch (type)
    {
        case DADOS_SOCIOS_NEW_IN:
            return{
                ...state,
                resultados_SOCIOS: payload.resultados_SOCIOS,
                SOCIOS: payload.SOCIOS,
                carregando: false
            };
        case DADOS_SOCIOS_NEW_OUT:
                return {
                    ...state,
                    resultados_SOCIOS: null,
                    SOCIOS: null,
                    carregando: false
                }

        default:
            return state
    }

}


