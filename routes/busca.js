const axios = require("axios")
const express = require("express")
const auth = require("../middleware/auth")
const fetch = require("node-fetch")
const router = express.Router()
const ProxyCrawl = require('../Adapters/ProxyCrawl')

// router.get("/", auth, (request, response) => {
//   let resultado = null
//   let logar = true
// })




router.post("/termo", auth, (request, response) => {
	let resultado = null
	let logar = true
	if (!autenticado_busca) response.render("resultados", { resultado, logar })

	const { termo, tipo } = request.body

	if (!termo) {
		let resultados = {}
		response.render("resultados", { resultados })
	}
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)

	produtoDAO.buscar(termo, tipo, function (erro, resultados) {
		if (!erro) response.render("resultados", { resultados, autenticado: autenticado_busca })

		if (erro) console.log(erro)
	})
})

router.post("/teste_api/:cnpj", auth, async (request, response) => {
	// let resultado = null
	// let logar = true
	// if (!autenticado_busca) response.render("resultados", { resultado, logar })
	let cnpj = request.params.cnpj
	
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)
	
	produtoDAO.buscar_teste_api(cnpj, async function (err, result) {
		if (!err) {
			const teste_api = result
	
			if (teste_api) {
				response.render("resultados", { result })
			}
	
			if (!teste_api) {
				const config = {
					headers: {
						"Content-Type": "application/json",
					},
					auth: {
						username: "admin@datafinder.com.br",
						password: "04532087c7b8e330",
					},
				}
				console.log("API fetch")
				try {
					const res = await axios.post("http://compras.dados.gov.br/contratos/v1/contratos.json?cnpj_contratada=", request.body, config)
					//algoritmo de busca aqui
					console.log("finished fetching: ", res.data.tasks[0].result[0].items[0].text[0])
					//se houver resultado enviar para o db, caso contrário enviar objeto vazio para o db (para não fazer a mesma requisição sem resultados)
					response.send(res.data.tasks[0].result[0].items[0].text[0])
					// return res.data.tasks[0].result[0].items[0].text[0]
				} catch (err) {
					console.log("finished fetching with error")
					console.log(err)
				}
			}
		}
	
		if (err) console.log(err)
	})
	})



router.post("/fetch_geo_info/:CEP", auth, async (request, response) => {
	// let resultado = null
	// let logar = true
	// if (!autenticado_busca) response.render("resultados", { resultado, logar })
	let CEP = request.params.CEP
	
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)
	
	produtoDAO.buscar_geo_info(CEP, async function (err, result) {
		if (!err) {
			const geo_info = result
	
			if (geo_info) {
				response.render("resultados", { result })
			}
	
			if (!geo_info) {
				const config = {
					headers: {
						"Content-Type": "application/json",
					},
					auth: {
						username: "admin@datafinder.com.br",
						password: "04532087c7b8e330",
					},
				}
				console.log("API fetch")
				try {
					const res = await axios.post("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", request.body, config)
					//algoritmo de busca aqui
					console.log("finished fetching: ", res.data.tasks[0].result[0].items[0].text[0])
					//se houver resultado enviar para o db, caso contrário enviar objeto vazio para o db (para não fazer a mesma requisição sem resultados)
					response.send(res.data.tasks[0].result[0].items[0].text[0])
					// return res.data.tasks[0].result[0].items[0].text[0]
				} catch (err) {
					console.log("finished fetching with error")
					console.log(err)
				}
			}
		}
	
		if (err) console.log(err)
	})
	})

	router.get("/leads/:domain", auth, async (req, res) => {
		const domain = req.params.domain;
		console.log('{BUSCA_API LEADS} - domain router', domain)
		const conexao = require("../config/connectionFactory")();
		const repository = require("../repository/produtoDAO")();
		const produtoDAO = new repository(conexao);
	
		produtoDAO.buscar_leads(domain, async (err, results) => {
			console.log('{BUSCA_API LEADS} - buscar_leads error', err)
			console.log('{BUSCA_API LEADS} - buscar_leads results', results)
			if (!err && results.length > 0) {
				// data found on database
				const leads = [];
				results.forEach((result) => {
					const lead = {
						domain: result.domain,
						accuracy: result.accuracy,
						position: result.position,
						twitter: result.twitter,
						first_name: result.first_name,
						name: result.name,
						department: result.department,
						email: result.email
					};
					leads.push(lead);
				});
				console.log('{BUSCA_API LEADS} - No banco:', leads)
				res.send(leads);
			} else {console.log('{BUSCA_API LEADS} - Nada no banco>> Chama API')
				// data not found on database, call api
				const config = {
					headers: {
						"Content-Type": "application/json"
						
					}
				}
	
				const body = null
				const leadsApiToken = process.env.leadsApiToken;
				const apiLink = "https://api.proxycrawl.com/leads?token=" + leadsApiToken + "&domain=" + domain
				console.log('apiLink', apiLink)
				const response = await axios.get(apiLink, body, config)
				console.log('{BUSCA_API LEADS} - response.data from leads', response.data)
				
				let leadsWithDomain;
				if (response.data.leads === null ) {
					console.log('{BUSCA_API LEADS} - Erro na API ' + response.data.error)
					leadsWithDomain = []
				} else {
					console.log('{BUSCA_API LEADS} - VEIO NULO DA API ')
					const { leads } = response.data;
					leadsWithDomain = leads.map((lead) => {
						lead.domain = domain;
						return lead;
					});
				}

				if (leadsWithDomain.length > 0 ) produtoDAO.inserir_leads(domain, leadsWithDomain)
				else {
					let test = 0;
					return test;
				}
	
				res.send(leadsWithDomain)
				
			}
		});
	});

router.post("/fetch_google_info/:cnpj", auth, async (request, response) => {
	// let resultado = null
	// let logar = true
	// if (!autenticado_busca) response.render("resultados", { resultado, logar })
	let cnpj = request.params.cnpj

	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)

	produtoDAO.buscar_google_info(cnpj, async function (err, result) {
		let url = null
		let phone = null
		let address = null
		let funcionarios = null 
		let precoacoes = null  
		let Receita = null  
		let CEO = null  
		let totalrecursos = null  
		let image_url = null  
		let sub_title = null  
		let description = null 
		let rating = null 
		let logo_url = null 

		let last_updated = Date.now()
		if (!err) {
			const google_info = result && result.length > 0 ? result[0] : {}
	//		console.log("{API SERP} - google_info before testing if object is empty: ", google_info)
	//		console.log("{API SERP} - google_info.data_added: ", google_info.data_added)
			// console.log(google_info ? "true" : "false")
			// console.log(Object.keys(google_info).length !== 0 ? "true" : "false")
			// console.log(google_info.constructor !== Object ? "true" : "false")
			// console.log(google_info.last_updated ? "true" : "false")
			// console.log(google_info.last_updated > 0 ? "true" : "false")

			// Testa se objeto que retorna do DB já possui variável last_updated (já foi executada uma pesquisa com o cnpj)
			if (google_info.data_added) {
	//			console.log("{API SERP} - API fetch not necessary, DB fetch")
	//			console.log("{API SERP} - google_info: ", google_info)
				response.send(google_info)
			} else {
				const config = {
					headers: {
						"Content-Type": "application/json",
					},
					auth: {
						username: "admin@datafinder.com.br",
						password: "04532087c7b8e330",
					},
				}
	//			console.log("{API SERP} - API fetch")
	//			console.log("{API SERP} - result without any previous search", result)

				try {
					const res = await axios.post("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", request.body, config)
					// Algoritmo de busca aqui
					const result = res?.data?.tasks[0].result[0]

					// Se houver a caixa de informações situada à direita no Google (knowledge_graph)
					if (result.item_types.includes("knowledge_graph")) {
						try {
							const knowledge_graph = result.items.filter(item => {
								return item.type === "knowledge_graph"
							})
			//				console.log("{API SERP} - knowledge_graph.items: ", knowledge_graph[0]?.items)
			//				console.log("{API SERP} - knowledge_graph: ", knowledge_graph)

							// Salva url do site
							url = knowledge_graph[0]?.url
				//			console.log("{API SERP} - finished fetching with url: ", url)

							// Busca telefone
							const phoneContainer = knowledge_graph[0].items.filter(knowledge_graph_row_item => {
								return knowledge_graph_row_item.title === "Telefone"
							})
			//				console.log("{API SERP} - phoneContainer: ", phoneContainer)
							phone = phoneContainer && phoneContainer[0]?.text
			//				console.log("{API SERP} - finished fetching with phone: ", phone)
							
	
							// Busca endereço
							const addressContainer = knowledge_graph[0].items.filter(knowledge_graph_row_item => {
								return knowledge_graph_row_item.title === "Endereço"
							})
			//				console.log("{API SERP} - addressContainer: ", addressContainer)
							address = addressContainer && addressContainer[0]?.text
			//				console.log("{API SERP} - finished fetching with address: ", address)


							// Busca numero funcionarios @leandro
							const funcionariosContainer = knowledge_graph[0].items.filter(knowledge_graph_row_item => {
								return knowledge_graph_row_item.title === "Número de funcionários"
							})
						//	console.log("funcionariosContainer: ", funcionariosContainer)
							funcionarios = funcionariosContainer && funcionariosContainer[0]?.text
						//	console.log("finished fetching with funcionarios: ", funcionarios)
							
	
							// Busca numero Preço das ações @leandro
							const precoacoesContainer = knowledge_graph[0].items.filter(knowledge_graph_row_item => {
								return knowledge_graph_row_item.title === "Preço das ações"
							})
						//	console.log("precoacoesContainer: ", precoacoesContainer)
							precoacoes = precoacoesContainer && precoacoesContainer[0]?.text
						//	console.log("finished fetching with Preço das ações: ", precoacoes)

						
							// Busca numero Receita @leandro
							const ReceitaContainer = knowledge_graph[0].items.filter(knowledge_graph_row_item => {
								return knowledge_graph_row_item.title === "Receita"
							})
						//	console.log("ReceitaContainer: ", ReceitaContainer)
							Receita = ReceitaContainer && ReceitaContainer[0]?.text
						//	console.log("finished fetching with Receita: ", Receita)


							// Busca numero CEO @leandro
							const CEOContainer = knowledge_graph[0].items.filter(knowledge_graph_row_item => {
								return knowledge_graph_row_item.title === "CEO"
							})
							// console.log("{API SERP} - CEOContainer: ", CEOContainer)
							CEO = CEOContainer && CEOContainer[0]?.text
							// console.log("{API SERP} - finished fetching with CEO: ", CEO)

							// Busca numero totalrecursos @leandro
							const totalrecursosContainer = knowledge_graph[0].items.filter(knowledge_graph_row_item => {
								return knowledge_graph_row_item.title === "Total de recursos"
							})
							// console.log("{API SERP} - totalrecursosContainer: ", totalrecursosContainer)
							totalrecursos = totalrecursosContainer && totalrecursosContainer[0]?.text
							// console.log("{API SERP} - finished fetching with totalrecursosContainer: ", totalrecursosContainer)



							// Busca numero image_url @leandro
							image_url = knowledge_graph[0]?.image_url
							//console.log("finished fetching with url: ", image_url)


							// Salva sub_title
							sub_title = knowledge_graph[0]?.sub_title
							// console.log("{API SERP} - finished fetching with url: ", sub_title)



							// Salva description
							description = knowledge_graph[0]?.description
							//console.log("finished fetching with url: ", description)
														
							// Salva logo_url
							logo_url = knowledge_graph[0]?.logo_url
							// console.log("{API SERP} - finished fetching with logo_url: ", logo_url)

							// Se houver reviews no Google
							if (result.item_types.includes("google_reviews")) {
								try {
									const google_reviews = result.items.filter(item => {
										return item.type === "google_reviews"
									})

									rating = google_reviews[0].rating

									// console.log("{API SERP} - google_reviews.rating: ", rating)
								} catch (error) {
									// console.log("{API SERP} - error at rating: ", error)
									console.log(error)
								}
							}
							// Se houver resultado enviar para o db
							produtoDAO.inserir_google_info(cnpj, {
								url,
								phone,
								address,
								funcionarios,
								precoacoes,
								Receita,
								CEO,
								totalrecursos,
								image_url,
								sub_title,
								description,
								logo_url,
								rating,
								last_updated,
							})
							response.send({
								url,
								phone,
								address,
								funcionarios,
								precoacoes,
								Receita,
								CEO,
								totalrecursos,
								image_url,
								sub_title,
								description,
								logo_url,
								rating,
							})
						} catch (error) {
							// Se não houver resultado, enviar objeto com valores nulos e com data atual para o db (para não fazer a mesma requisição sem resultados)
							console.log("{API SERP} - error at main: ", error)
							produtoDAO.inserir_google_info(cnpj, {
								url: null,
								phone: null,
								address: null,
								funcionarios: null,
								precoacoes: null,
								Receita: null,
								CEO: null,
								totalrecursos: null,
								image_url: null,
								sub_title: null,
								description: null,
								logo_url: null,
								rating: null,
								last_updated,
							})
							response.send("Not found")
						}
					} else {
						// try {
						// 	if (result.items?.text) {
						// 		if (result.items[0].text[0] && result.items[0].text[0].charAt(0) === "(" && result.items[0].text[0].charAt(3) === ")") {
						// 			console.log("finished fetching with items[0].text[0]: ", result.items[0].text[0])
						// 			response.send(result.items[0].text[0])
						// 		}
						// 	} else {
						// 		produtoDAO.inserir_google_info(cnpj, {
						// 		url: null,
						// 		phone: null,
						// 		address: null,
						// 		rating: null,
						// 		last_updated: Date.now(),
						// 	})
						// 		console.log("Não encontrado")
						// 		response.send("Not found")
						// 	}
						// } catch (error) {
						// 	console.log("Error: ", error)
						// 	produtoDAO.inserir_google_info(cnpj, {
						// 		url: null,
						// 		phone: null,
						// 		address: null,
						// 		rating: null,
						// 		last_updated: Date.now(),
						// 	})
						// 	response.send("Not found")
						// }
						produtoDAO.inserir_google_info(cnpj, {
							url: null,
							phone: null,
							address: null,
							funcionarios: null,
							precoacoes: null,
							Receita: null,
							CEO: null,
							totalrecursos: null,
							image_url: null,
							sub_title: null,
							description: null,
							logo_url: null,
							rating: null,
							last_updated,
						})
						response.send("Not found")
					}
				} catch (err) {
					console.log("{API SERP} - finished fetching with error: ", err)
					produtoDAO.inserir_google_info(cnpj, {
						url: null,
						phone: null,
						address: null,
						funcionarios: null,

						precoacoes: null,
						Receita: null,
						CEO: null,
						totalrecursos: null,
						image_url: null,
						sub_title: null,
						description: null,
						logo_url: null,
						rating: null,
						last_updated,
					})
					response.send("Not found")
				}
			}
		} else {
			console.log("{API SERP} - ERRO: ", err)
			produtoDAO.inserir_google_info(cnpj, {
				url: null,
				phone: null,
				address: null,
				funcionarios: null,

				precoacoes: null,
				Receita: null,
				CEO: null,
				totalrecursos: null,
				image_url: null,
				sub_title: null,
				description: null,
				logo_url: null,
				rating: null,
				last_updated,
			})
			response.send("Not found")
		}
	})
})
//teste
router.get("/cnpj/:id", auth, async (request, response) => {
	let id = request.params.id
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)
	produtoDAO.insere_estatisticas_cnpj_count(id)

	// Trigger ProxyCrawl API
	const domain = request.query.razao_social || request.query.nome_fantasia
	ProxyCrawl.linkedin(domain, id)

	const resultados = produtoDAO.buscar_detalhes_CNPJ(id, function (erro, results_cnpj_details) {
		if (!erro) {
			const resultados_cnpj = results_cnpj_details
			produtoDAO.insere_estatisticas_CNPJ(id)
			produtoDAO.insere_estatisticas_cnpj_status(id)
			produtoDAO.buscar_listar_socios(id, function (erro, result_socio) {
				if (!erro) {
					const socios_cnpj = result_socio
					produtoDAO.buscar_tab_linkedin_empresas(id, function (erro, result_linkedin) {
						if(!erro){
							const respostas = { resultados_cnpj, socios_cnpj, result_linkedin }
							response.json({ respostas })
						}
						if (erro) {
							console.log(erro)
							return null
						}
					})
				}
				if (erro) {
					console.log(erro)
					return null
				}
			})
		}
	})
})

router.get("/mei/:id", auth, async (request, response) => {
	let id = request.params.id
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)

	const resultados = produtoDAO.buscar_detalhes(id, function (erro, results) {
		if (!erro) {
			const resultados_mei = results
			const respostas = { resultados_mei }
			response.json({ respostas })
		} else {
			console.log(erro)
			response.sendStatus(500)
		}
	})
})



router.get("/GEOM/:id", auth, async (request, response) => {
	let id = request.params.id
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)

	const resultados = produtoDAO.buscar_detalhes_CNPJ_GEOM(id, function (erro, results) {
		if (!erro) {
			const detalhes_GEOM = results
			produtoDAO.buscar_listar_socios_GEOM(id, function (erro, socio) {
				if (!erro) {
					const socios_cnpj_GEOM = socio
					const respostas = { detalhes_GEOM, socios_cnpj_GEOM }
					response.json({ respostas })
				}
				if (erro) {
					console.log(erro)
					return null
				}
			})
		}
	})
})



router.get("/buscar-por-DASH/:id", auth, async (request, response) => {
	let id = request.params.id
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)

	const resultados = produtoDAO.consultarDASH(id, function (erro, results) {
		if (!erro) {
			const resultados_DASH = results
			produtoDAO.DASH_graph(id, function (erro, DASH_g) {
				if (!erro) {
					const DASH_graficos = DASH_g
					const respostas = { resultados_DASH, DASH_graficos }
					response.json({ respostas })
				}
				if (erro) {
					console.log(erro)
					return null
				}
			})
		}
	})
})








router.get("/holdings/:id", auth, async (request, response) => {
	let id = request.params.id
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)
	produtoDAO.insere_estatisticas_cnpj_count(id)
	
	const resultados = produtoDAO.buscar_detalhes_HOLDINGS(id, function (erro, results) {
		if (!erro) {
			const resultados_holdings = results
			produtoDAO.insere_estatisticas_HOLDINGS(id)
			produtoDAO.insere_estatisticas_cnpj_status(id)
			produtoDAO.buscar_detalhes_HOLDINGS_SUBSIDIARIAS(id, function (erro, subsidiarias) {
				if (!erro) {
					const subsidiarias_holdings = subsidiarias
					const respostas = { resultados_holdings, subsidiarias_holdings }
					response.json({ respostas })
				}
				if (erro) {
					console.log(erro)
					return null
				}
			})
		}
	})
})

router.get("/eca/:id", auth, async (request, response) => {
	let id = request.params.id
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)

	const resultados = produtoDAO.buscar_detalhes_ECA(id, function (erro, results) {
		if (!erro) {
			const resultados_eca = results
			const respostas = { resultados_eca }
			response.json({ respostas })
		} else {
			console.log(erro)
			response.sendStatus(500)
		}
	})
})

router.get("/cnae/:id", auth, async (request, response) => {
	let id = request.params.id
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)
	
	const resultados = produtoDAO.buscar_detalhes_CNAE(id, function (erro, results) {
	produtoDAO.insere_estatisticas_cnpj_count(id)
	
		if (!erro) {
			const resultados_cnae = results
			produtoDAO.insere_estatisticas_CNAE(id)
			produtoDAO.insere_estatisticas_cnpj_status(id)
			produtoDAO.buscar_listar_socios(id, function (erro, socio) {
				if (!erro) {
					const socios_cnae = socio
					const respostas = { resultados_cnae, socios_cnae }
					response.json({ respostas })
				}
				if (erro) {
					console.log(erro)
					return null
				}
			})
		}
	})
})

router.get("/dividas/:id", auth, async (request, response) => {
	let id = request.params.id
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)
	produtoDAO.insere_estatisticas_cnpj_count(id)
	produtoDAO.insere_estatisticas_cnpj_status(id)
	const resultados = produtoDAO.buscar_detalhes_DIVIDAS(id, function (erro, results) {
		if (!erro) {
			const resultados_dividas = results
			produtoDAO.insere_estatisticas_DIVIDAS(id)
			produtoDAO.insere_estatisticas_cnpj_status(id)
			produtoDAO.buscar_detalhes_DIVIDAS_inner(id, function (erro, dt_dividas) {
				if (!erro) {
					const detalhes_dividas = dt_dividas
					const respostas = { resultados_dividas, detalhes_dividas }
					response.json({ respostas })
				}
				if (erro) {
					console.log(erro)
					return null
				}
			})
		}
	})
})

router.get("/socios/:nome_socio/:cpf", auth, async (request, response) => {
	let nome_socio = request.params.nome_socio
	let cpf = request.params.cpf
	console.log(nome_socio)
	console.log(cpf)
	const conexao = require("../config/connectionFactory")()
	const repository = require("../repository/produtoDAO")()
	const produtoDAO = new repository(conexao)
	
	const resultados = produtoDAO.buscar_detalhes_SOCIOS(nome_socio, cpf, function (erro, results) {
		if (!erro) {
			const resultados_socios = results
			produtoDAO.insere_estatisticas_SOCIO(nome_socio,cpf)
			produtoDAO.buscar_detalhes_SOCIOS_inner(nome_socio, cpf, function (erro, dt_socios) {
				if (!erro) {
					const detalhes_SOCIOS = dt_socios

					const respostas = { resultados_socios, detalhes_SOCIOS }
					response.json({ respostas })
					console.log(respostas)
				}
				if (erro) {
					console.log(erro)
					return null
				}
			})
		}
	})
})
/*


*/
// router.get("/:id", auth, async (request, response) => {
//   let id = request.params.id
//   const conexao = require("../config/connectionFactory")()
//   const repository = require("../repository/produtoDAO")()
//   const produtoDAO = new repository(conexao)

//   const resultados = produtoDAO.buscar_detalhes(id, function (erro, results) {
//     if (!erro) {
//       const resultados_socios = results
//       //console.log(resultados);
//       produtoDAO.buscar_socios(id, function (erro, socio) {
//         if (!erro) {
//           const socios = socio
//           const respostas = { resultados_socios, socios }
//           //response.render("detalhes", { respostas, autenticado: autenticado_busca,layout:'detalhes' });
//           response.json({ respostas })
//         }
//         if (erro) {
//           console.log(erro)
//           return null
//         }
//       })

//       const resultados_consultarDividas = results
//       //console.log(resultados);
//       produtoDAO.consultarDividas(id, function (erro, dados_dividas) {
//         if (!erro) {
//           const dividas = dados_dividas
//           const respostas_dividas = { resultados_consultarDividas, dividas }
//           //response.render("detalhes", { respostas, autenticado: autenticado_busca,layout:'detalhes' });
//           response.json({ respostas_dividas })
//         }
//         if (erro) {
//           console.log(erro)
//           return null
//         }
//       })

//       const resultados_consultarSOCIOS = results
//       //console.log(resultados);
//       produtoDAO.consultar_SOCIOS_SQL(id, function (erro, dados_SOCIOS_NEW) {
//         if (!erro) {
//           const socios_new = dados_SOCIOS_NEW
//           const respostas_socios_new = { resultados_consultarSOCIOS, socios }
//           //response.render("detalhes", { respostas, autenticado: autenticado_busca,layout:'detalhes' });
//           response.json({ respostas_socios_new })
//         }
//         if (erro) {
//           console.log(erro)
//           return null
//         }
//       })

//       const resultados_consultarNCM = results
//       //console.log(resultados);
//       produtoDAO.consultarNCM(id, function (erro, dados_NCM) {
//         if (!erro) {
//           const ncms = dados_NCM
//           const respostas_ncm = { resultados_consultarNCM, ncms }
//           //response.render("detalhes", { respostas, autenticado: autenticado_busca,layout:'detalhes' });
//           response.json({ respostas_ncm })
//         }
//         if (erro) {
//           console.log(erro)
//           return null
//         }
//       })

//       const resultados_consultarDASH = results
//       //console.log(resultados);
//       produtoDAO.consultarDASH(id, function (erro, dados_DASH) {
//         if (!erro) {
//           const DASHs = dados_DASH
//           const respostas_DASH = { resultados_consultarDASH, DASHs }
//           //response.render("detalhes", { respostas, autenticado: autenticado_busca,layout:'detalhes' });
//           response.json({ respostas_DASH })
//         }
//         if (erro) {
//           console.log(erro)
//           return null
//         }
//       })

//       const resultados_consultarHOLDINGS = results
//       //console.log(resultados);
//       produtoDAO.consultarHOLDINGS(id, function (erro, dados_HOLDINGS) {
//         if (!erro) {
//           const HOLDINGS = dados_HOLDINGS
//           const respostas_HOLDINGS = { resultados_consultarHOLDINGS, HOLDINGS }
//           //response.render("detalhes", { respostas, autenticado: autenticado_busca,layout:'detalhes' });
//           response.json({ respostas_HOLDINGS })
//         }
//         if (erro) {
//           console.log(erro)
//           return null
//         }
//       })

//       const resultados_consultarECA = results
//       //console.log(resultados);
//       produtoDAO.consultarECA(id, function (erro, dados_ECA) {
//         if (!erro) {
//           const ECA = dados_ECA
//           const respostas_ECA = { resultados_consultarECA, ECA }
//           //response.render("detalhes", { respostas, autenticado: autenticado_busca,layout:'detalhes' });
//           response.json({ respostas_ECA })
//         }
//         if (erro) {
//           console.log(erro)
//           return null
//         }
//       })
//     }
//     if (erro) {
//       console.log(erro)
//       return null
//     }
//   })
// })

module.exports = router
