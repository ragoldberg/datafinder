import axios from "axios"

import { FETCH_GEO_IN, FETCH_GEO_OUT } from "../actions/types"

const initialState = {
	logradouro: null,
				complemento:null,
				bairro: null,
				localidade: null,
				uf: null,
				ibge: null,
				gia: null,
				ddd: null,
				siafi: null,
			
	carregando: true,
}

export default function (state = initialState, action) {
	const { type, payload } = action

	switch (type) {
		case FETCH_GEO_IN:
			return {
				...state,
				cep: payload.cep,
				logradouro: payload.logradouro,
				complemento: payload.complemento ,
				bairro: payload.bairro,
				localidade: payload.localidade,
				uf: payload.uf,
				ibge: payload.ibge,
				gia: payload.gia,
				ddd: payload.ddd,
				siafi: payload.siafi,
				carregando: false,
				

			}
		case FETCH_GEO_OUT:
			return {
				...state,
				cep: null,
				logradouro: null,
				complemento:null,
				bairro: null,
				localidade: null,
				uf: null,
				ibge: null,
				gia: null,
				ddd: null,
				siafi: null,
				carregando: false,
			}

		default:
			return state
	}
}
