import axios from "axios"

import { FETCH_GEO_IN, FETCH_GEO_OUT } from "../actions/types"

export const fetchGEOInfo = (CEP) => async dispatch => {

	console.log("fetchGEOInfo: ", CEP)

	try {
		const body = [
			{
				
				url: `https://viacep.com.br/ws/${CEP}/json/ `,
				
				
			},
		]

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		}

		const res = await axios.post("/search/fetch_geo_info/" + CEP, body, config)
		console.log("******* fetchGEO: ", res.data)
		if (res.data) {
			dispatch({
				type: FETCH_GEO_IN,
				payload: {
					is_phone_updated: true,
					updated_phone: res.data,
					cep:res.data,
				logradouro: res.data,
				complemento: res.data ,
				bairro: res.data,
				localidade: res.data,
				uf: res.data,
				ibge: res.data,
				gia: res.data,
				ddd: res.data,
				siafi: res.data,
				},
			})
		} else {
			dispatch({
				type: FETCH_GEO_OUT,
			})
		}
	} catch (error) {
		dispatch({
			type: FETCH_GEO_OUT,
		})

		console.log(error)
	}
}

export const eraseGEOInfo = () => dispatch => {
	dispatch({
		type: FETCH_GEO_OUT,
	})
}
