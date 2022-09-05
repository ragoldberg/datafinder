import {
    DADOS_LEADS_FAILURE,
    DADOS_LEADS_SUCCESS
} from "../actions/types"

const initialState = {
    resultados_leads: null,
    carregando: true,
}

function leads_reducer (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case DADOS_LEADS_SUCCESS:
            return {
                ...state,
                resultados_leads: payload,
                carregando: false
            }
        case DADOS_LEADS_FAILURE:
            return {
                ...state,
                resultados_leads: 'error_leads',
                carregando: false
            }
        default:
            return state
    }
}

export default leads_reducer;