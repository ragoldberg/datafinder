/* eslint-disable import/no-anonymous-default-export */
import { FETCH_GOOGLE_IN, FETCH_GOOGLE_OUT } from "../actions/types"
const initialState = {
	is_info_updated: false,
	updated_phone: null,
	updated_address: null,
	updated_url: null,
	updated_rating: null,
	carregando: true,
}

export default function (state = initialState, action) {
	const { type, payload } = action

	switch (type) {
		case FETCH_GOOGLE_IN:
			return {
				...state,
				is_info_updated: payload.is_info_updated,
				updated_phone: payload.updated_phone,
				updated_address: payload.updated_address,
				updated_url: payload.updated_url,
				updated_rating: payload.updated_rating,
				carregando: false,
			}
		case FETCH_GOOGLE_OUT:
			return {
				...state,
				is_info_updated: false,
				updated_phone: null,
				updated_address: null,
				updated_url: null,
				updated_rating: null,
				carregando: false,
			}

		default:
			return state
	}
}
