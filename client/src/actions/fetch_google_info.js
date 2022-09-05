/* eslint-disable array-callback-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios"
import states from "../../src/utils/states.json"
import { FETCH_GOOGLE_IN, FETCH_GOOGLE_OUT } from "../actions/types"

export const fetchGoogleInfo = (cnpj, nome_fantasia, municipio, uf, razao_social, resultados_cnpj, sit_cadastral_dividas, sit_cadastral_cnae, sit_cadastral_holdings) => async dispatch => {
	//ARRUMA TEXTO

	function arrumatexto(string) {
		return string.replace(/\S*/g, function (word) {
			return word.charAt(0) + word.slice(1).toLowerCase()
		})
	}
	//ARRUMA TEXTO

	const formattedState = uf => {
		if (!states[uf] || uf == "DF" || uf == "SP") return "Rio Grande do Sul"
		const selectedStateName = states[uf].name
		return arrumatexto(selectedStateName)
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
	}

	const razaoWithoutType = razao => {
		if (!razao) return razao
		const razaoTypes = ["s/a", "s.a", "s.a.", "sa", "ltda", "eireli", "- Edise"]

		const checkPresentType = razao => {
			const presentType = razaoTypes.filter(razaoType => {
				if (razao && razao.includes(razaoType)) {
					return razaoType
				}
			})
			return presentType
		}

		if (checkPresentType(razao)) {
			const newRazao = razao
			const newRazaoSplit = newRazao.split(" ")
			newRazaoSplit.pop()
			const newRazaoClean = newRazaoSplit.join(" ")
			return newRazaoClean
		} else {
			return razao
		}
	}







	const filteredUf = uf => {
		if (uf == "DF" || uf == "SP") {
			return ""
		} else {
			return uf
		}
	}

	console.log("fetchGoogleInfo: ", cnpj, nome_fantasia,razaoWithoutType(nome_fantasia), "filteredMunicipio: ", municipio, uf, razao_social, razaoWithoutType(razao_social), formattedState(uf), "filteredUf: ", filteredUf(uf))

	// se a situação cadastral não for ativa, não procurar no Google
	console.log("resultados_cnpj from fetch_google_info.js: ", resultados_cnpj)
	if (resultados_cnpj && resultados_cnpj[0].situacao_cadastral !== "Ativa" || resultados_cnpj[0].identificador_matriz_filial === 2){
	//if (resultados_cnpj && resultados_cnpj[0].situacao_cadastral !== "Ativa") {
		
		dispatch({
			type: FETCH_GOOGLE_IN,
			payload: {
				is_info_updated: true,
				updated_phone: "Not found",
				updated_address: "Not found",
				updated_url: "Not found",
				updated_rating: "Not found",
			},
		})
	}  else if (sit_cadastral_dividas && sit_cadastral_dividas !== "Ativa") {
		dispatch({
			type: FETCH_GOOGLE_IN,
			payload: {
				is_info_updated: true,
				updated_phone: "Not found",
				updated_address: "Not found",
				updated_url: "Not found",
				updated_rating: "Not found",
			},
		})
	} else if (sit_cadastral_cnae && sit_cadastral_cnae !== "Ativa") {
		dispatch({
			type: FETCH_GOOGLE_IN,
			payload: {
				is_info_updated: true,
				updated_phone: "Not found",
				updated_address: "Not found",
				updated_url: "Not found",
				updated_rating: "Not found",
			},
		})
	} else if (sit_cadastral_holdings && sit_cadastral_holdings !== "Ativa") {
		dispatch({
			type: FETCH_GOOGLE_IN,
			payload: {
				is_info_updated: true,
				updated_phone: "Not found",
				updated_address: "Not found",
				updated_url: "Not found",
				updated_rating: "Not found",
			},
		})
		//Aqui ele verifica se o nome fantasia e nulo. se for, executa pesquisa no google com razao social. se nao for, faz pesquisa no proximo ELSE com nome fantasia.
	} else if (nome_fantasia === "") {
		try {
			const body = [
				{
					language_code: "pt",

					keyword: `${razaoWithoutType(razao_social)}`,
				//	keyword: `${razaoWithoutType(razao_social)} ${municipio} ${filteredUf(uf)}`,

					location_name: `State of ${formattedState(uf)},Brazil`,
					depth: 700,
				},
			]

			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			}

			// console.log("******* sending body to produtoDAO: ", body)
			const res = await axios.post("/search/fetch_google_info/" + cnpj, body, config)
			console.log("******* fetchGoogleRAZAO: ", res.data)
			if (res.data && res.data !== "Not found") {
				let ratingFromGoogle = res.data.rating
				let ratingFromDB = {
					value: res.data.rating && res.data.rating.constructor !== Object && res.data.rating.split(" ")[0],
					votes_count: res.data.rating && res.data.rating.constructor !== Object && res.data.rating.split(" ")[1],
				}
				console.log("res.data.rating.constructor === Object: ", res.data.rating && res.data.rating.constructor === Object)
				console.log("ratingFromGoogle: ", ratingFromGoogle)
				console.log("ratingFromDB: ", ratingFromDB)

				let rating = res.data.rating && res.data.rating.constructor === Object ? ratingFromGoogle : ratingFromDB
				dispatch({
					type: FETCH_GOOGLE_IN,
					payload: {
						is_info_updated: true,
						updated_phone: res.data.phone || res.data.númerodetelefone,
						updated_address: res.data.address || res.data.companyaddress,
						updated_url: res.data.website || res.data.companyurl,
						updated_rating: rating,
					},
				})
			} else if (res.data && res.data === "Not found") {
				dispatch({
					type: FETCH_GOOGLE_IN,
					payload: {
						is_info_updated: true,
						updated_phone: "Not found",
						updated_address: "Not found",
						updated_url: "Not found",
						updated_rating: "Not found",
					},
				})
			} else {
				dispatch({
					type: FETCH_GOOGLE_OUT,
				})
			}
		} catch (error) {
			dispatch({
				type: FETCH_GOOGLE_OUT,
			})

			console.log(error)
		}
	}else {
	try {
		const body = [
			{
				language_code: "pt",
				keyword: `${nome_fantasia} ${municipio} ${filteredUf(uf)}`,
			//	keyword: `${nome_fantasia}`,
			//	keyword: `${razaoWithoutType(nome_fantasia)}`,
				location_name: `State of ${formattedState(uf)},Brazil`,
			},
		]

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		}

		 console.log("******* sending body to produtoDAO: ", body) 
		const res = await axios.post("/search/fetch_google_info/" + cnpj, body, config)
		console.log("******* fetchGoogleFANTASIA: ", res.data)
		if (res.data && res.data !== "Not found") {
			let ratingFromGoogle = res.data.rating
			let ratingFromDB = {
				value: res.data.rating && res.data.rating.constructor !== Object && res.data.rating.split(" ")[0],
				votes_count: res.data.rating && res.data.rating.constructor !== Object && res.data.rating.split(" ")[1],
			}
			console.log("res.data.rating.constructor === Object: ", res.data.rating && res.data.rating.constructor === Object)
		//	console.log("ratingFromGoogle: ", ratingFromGoogle)
		//	console.log("ratingFromDB: ", ratingFromDB)

			let rating = res.data.rating && res.data.rating.constructor === Object ? ratingFromGoogle : ratingFromDB
			dispatch({
				type: FETCH_GOOGLE_IN,
				payload: {
					is_info_updated: true,
					updated_phone: res.data.phone || res.data.númerodetelefone,
					updated_address: res.data.address || res.data.companyaddress,
					updated_url: res.data.website || res.data.companyurl,
					updated_rating: rating,
				},
			})
		} else if (res.data && res.data === "Not found") {
			dispatch({
				type: FETCH_GOOGLE_IN,
				payload: {
					is_info_updated: true,
					updated_phone: "Not found",
					updated_address: "Not found",
					updated_url: "Not found",
					updated_rating: "Not found",
				},
			})
		} else {
			dispatch({
				type: FETCH_GOOGLE_OUT,
			})
		}
	} catch (error) {
		dispatch({
			type: FETCH_GOOGLE_OUT,
		})

		console.log(error)
	}
}
}

export const eraseGoogleInfo = () => dispatch => {
	dispatch({
		type: FETCH_GOOGLE_OUT,
	})
}
