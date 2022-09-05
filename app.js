const express = require("express")
const exphbs = require("express-handlebars")
const auth = require("./middleware/auth")
//const bodyParser = require("body-parser");
const path = require("path")
const cookieParser = require("cookie-parser")
const app = express()
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const ProxyCrawl = require("./Adapters/ProxyCrawl")
// require('log-timestamp');
//logar timestamp
//require('log-timestamp')(function() { return 'date="' + new Date().toISOString() + '" message="%s"' });




var log = require("loglevel")
log.trace("unreasonably simple")

dotenv.config()

var autenticado

// Redirect http to https
// app.get('*', function(req,res,next) {
//     if(req.headers['x-forwarded-proto'] != 'https' && process.env.NODE_ENV === 'production')
//       res.redirect('https://'+req.hostname+req.url);
//     else
//       next();
// });

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

// Body Parser - renderizar conteúdo enviado pelo form
//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Folder Estático
app.use(express.static(path.join(__dirname, "client", "src")))



// Favicon
//app.use(favicon(__dirname + '/public/img/favicon.ico'));

// Rotas
// app.get('/', verifyToken, (request,response)=>{

//     if ( autenticado ) response.redirect ('/principal');
//     response.render('index',{autenticado, layout: "landing" })

// });

app.get("/principal_select", auth, (request, response) => {
	let resultado = null
	let logar = true
	let naturezas = ""
	let opcoes = ""
	let situacoes = ""
	let identificacoes = ""
	let qualificacoes = ""

	//Buscar dados no banco
	const conexao = require("./config/connectionFactory")()
	const repository = require("./repository/produtoDAO")()
	const produtoDAO = new repository(conexao)

	/*const situac = produtoDAO.buscar_situacao_cadastral(function (erro, situacoes_cadastrais) {
				if (!erro) {
						situacoes = situacoes_cadastrais;
						produtoDAO.buscar_natureza_juridica(function (erro, naturezas_juridicas) {
								if (!erro) {
										naturezas = naturezas_juridicas;
										produtoDAO.buscar_opcao_simples(function (erro, opcoes_simples) {
												if (!erro) {
														opcoes = opcoes_simples;
														produtoDAO.buscar_identificacao_socio(function (erro, identification) {
																if (!erro) {
																		identificacoes = identification;
																		produtoDAO.buscar_qualificacao_socio(function (erro, qualification) {
																				if (!erro) {
																						qualificacoes = qualification;

																						const resultados = {
																								situacoes,
																								naturezas,
																								opcoes,
																								identificacoes,
																								qualificacoes,
																								autenticado
																						};

																						//console.log(resultados);


																						return response.json({resultados})
																				}
																		})

																}
														})

												}
										});
								}
						});

				} else {
						console.log(erro);
						return response.json({err: [{msg: "Conexão ao banco falhou"}]});
				}

		});

*/
})

app.post("/principal", auth, function (request, response) {
	const {
		tipo,
		cnpj,

		nome_fantasia,
		cnae,

		cod_situacao_cadastral,
		cod_natureza_juridica,
		opcao_pelo_simples,
		opcao_pelo_mei,
		socio,
		identificador_socio,
		cod_qualificacao_socio,
		pagina,
		municipio,
		uf,
		email,
	} = request.body

	//Buscar dados no banco
	const conexao = require("./config/connectionFactory")()
	const repository = require("./repository/produtoDAO")()
	const produtoDAO = new repository(conexao)

	if (tipo == "cnpj1") {
		const buscar_cnpj = produtoDAO.buscar(cnpj, razao_social, nome_fantasia, cnae, cod_situacao_cadastral, cod_natureza_juridica, opcao_pelo_simples, pagina, municipio, uf, email, function (erro, count) {
			if (!erro) {
				console.log("Contagem: " + count[0].count)
				if (count[0].count) {
					if (count[0].count >= 0) {
						const contagem = count[0].count

						produtoDAO.buscar(cnpj, razao_social, nome_fantasia, cnae, cod_situacao_cadastral, cod_natureza_juridica, opcao_pelo_simples, pagina, municipio, uf, email, function (erro, resultados) {
							if (!erro) {
								return response.json({ resultados, pagina, contagem })
							} else {
								console.log(erro)
							}
						})
					} else {
						return response.json({ resultados: [], pagina: "1", contagem: "0" })
					}
				} else {
					return response.json({ resultados: [], pagina: "1", contagem: "0" })
				}
			} else {
				return response.json({ resultados: [], pagina: "1", contagem: "0" })
			}
		})
	} else if (tipo == "dados_socios") {
		const buscar_dados_soc = produtoDAO.buscar_dados_socios_count(socio, identificador_socio, cod_qualificacao_socio, function (erro, count) {
			if (!erro) {
				if (count[0].count) {
					if (count[0].count >= 0) {
						const contagem = count[0].count
						produtoDAO.buscar_dados_socios(socio, identificador_socio, cod_qualificacao_socio, pagina, function (erro, resultados) {
							if (!erro) {
								return response.json({ resultados, pagina, contagem })
							}
						})
					} else {
						return response.json({ resultados: [], pagina: "1", contagem: "0" })
					}
				} else {
					return response.json({ resultados: [], pagina: "1", contagem: "0" })
				}
			} else {
				return response.json({ resultados: [], pagina: "1", contagem: "0" })
			}
		})
	} else {
		let resultados = []
		return response.status(200).json({ resultados, autenticado })
	}
})

//Filtros e outros searches
app.get("/buscar-por-socios", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultar_SOCIOS_SQL(true, req.query), produtoDAO.consultar_SOCIOS_SQL(false, req.query)])

		res.json({
			count: resultCount[0].count_query,
			result,
		})
	} catch (e) {
		res.sendStatus(500)
	}
})

//cnae

app.get("/cnaes_ncm", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.cnaes_ncm()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})




//localizacao







app.get("/estado", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.estado()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/cidade/:estado", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.cidade(req.params.estado)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/bairro/:cidade", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.cidade(req.params.cidade)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})
//localizacao fim




app.get("/secao_cnae", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.secao_cnae()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/divisao_cnae/:secao_cnae", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.divisao_cnae(req.params.secao_cnae)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/grupo_cnae/:divisao_cnae", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.grupo_cnae(req.params.divisao_cnae)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/classe_cnae/:grupo_cnae", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.classe_cnae(req.params.grupo_cnae)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/cod_cnae/:classe_cnae", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.cod_cnae(req.params.classe_cnae)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/cnae_from_secao/:cod_setor", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.cnae_from_secao(req.params.cod_setor)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

//cnae

app.get("/seleciona_ncm", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.seleciona_ncm()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/cnaes", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.cnaes()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/classecnae", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.classecnae()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/natureza_juridica", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.natureza_juridica()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/qualificacao_socia", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.qualificacao_socia()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})
app.get("/qualificacao_socio", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.qualificacao_socio()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/situacoes-cadastrais", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.sit_cadastral()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})
/*
app.get('/situacoes-cadastrais', auth,  async (req, res) => {
		const conexao = require('./config/connectionFactory')();
		const repository = require('./repository/produtoDAO')();
		const produtoDAO = new repository(conexao);

		produtoDAO.buscar_situacao_cadastral((error, result) => {
				if (error) return res.json(error).sendStatus(500)
				else return res.json(result)
		})
})
*/
app.get("/porte-empresas", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.porteEmpresas()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})
app.get("/sit-divida", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.sit_divida()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})
app.get("/sit-mei", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.sit_mei()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/tipo_devedor", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.tipo_devedor()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/tipo_situacao_inscricao", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.tipo_situacao_inscricao()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/sit_geral", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.sit_geral()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/tipo_divida", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.tipo_divida()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/indicador_ajuizado", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.indicador_ajuizado()

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/cidades-por-estado/:uf", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.cidadesPorUf(req.params.uf)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/cnaeporclasse/", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.cnaeporclasse(req.params.cod_classe)

		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})
app.get("/buscar-por-eca", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultarECA(true, req.query), produtoDAO.consultarECA(false, req.query)])

		console.log(resultCount)
		res.json({
			count: resultCount[0].count_query,
			result,
		})
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/buscar-por-cnae", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultaCnae(true, req.query), produtoDAO.consultaCnae(false, req.query)])
		console.log(resultCount)

		res.json({
			count: resultCount[0].count_query,
			result,
		})
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/buscar-por-dividas", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultarDividas(true, req.query), produtoDAO.consultarDividas(false, req.query)])
		console.log(resultCount)
		console.log(req.query, "... reqrqerqrq")

		res.json({
			count: resultCount[0].count_query,
			result,
		})
	} catch (e) {
		res.sendStatus(500)
	}
})
app.get("/buscar-por-ncm", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultarNCM(true, req.query), produtoDAO.consultarNCM(false, req.query)])
		console.log(resultCount)
		res.json({
			count: resultCount[0].count_query,
			result,
		})
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/buscar-por-holdings", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultarHOLDINGS(true, req.query), produtoDAO.consultarHOLDINGS(false, req.query)])
		console.log(resultCount)
		res.json({
			count: resultCount[0].count_query,
			result,
		})
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/buscar-por-CNPJ", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const [resultCount, result] = await Promise.all([produtoDAO.consultarCNPJ(true, req.query), produtoDAO.consultarCNPJ(false, req.query)])

		res.json({
			count: resultCount[0].count_query,
			result,
		})
	} catch (e) {
		console.error(e);
		res.sendStatus(500)
	}
})

app.get("/buscar-por-DASH", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultarDASH(true, req.query), produtoDAO.consultarDASH(false, req.query)])
		// const [resultado_DASH] = await Promise.all([produtoDAO.buscar_detalhes_DASH(true, req.query), produtoDAO.buscar_detalhes_DASH(false, req.query)])
		//const [resultado_cnae] = await Promise.all([produtoDAO.buscar_detalhes_DASH_CNAE(true, req.query), produtoDAO.buscar_detalhes_DASH_CNAE(false, req.query)])

		const [DASH_Grafico] = await Promise.all([produtoDAO.DASH_graph(true, req.query), produtoDAO.DASH_graph(false, req.query)])

		// console.log("/buscar-por-DASH",resultCount)
		console.log("/buscar-por-DASH", "DASH_Grafico", DASH_Grafico)
		// console.log("/buscar-por-DASH","resultados Gerais", result)
		res.json({
			count: resultCount[0].count_query,
			result,
			//  resultado_DASH,
			//resultado_cnae
			DASH_Grafico,
			empresas_total: DASH_Grafico[0].empresas_total,
			ativa: DASH_Grafico[0].ativa,
			n_ativa: DASH_Grafico[0].n_ativa,
			matriz: DASH_Grafico[0].matriz,
			filial: DASH_Grafico[0].filial,
			mei: DASH_Grafico[0].mei,
			mei_ativo: DASH_Grafico[0].mei_ativo,
			simples: DASH_Grafico[0].simples,
			simples_ativo: DASH_Grafico[0].simples_ativo,
			estado: DASH_Grafico[0].estado,
			bairro: DASH_Grafico[0].bairro,
			descricao_cidade: DASH_Grafico[0].descricao_cidade,
			total_empresas_bairro: DASH_Grafico[0].total_empresas_bairro,
			atv_bairro: DASH_Grafico[0].atv_bairro,
			n_atv_bairro: DASH_Grafico[0].n_atv_bairro,
			matriz_bairro: DASH_Grafico[0].matriz_bairro,
			total_empresas_bairro_perc: DASH_Grafico[0].total_empresas_bairro_perc,
			atv_bairro_perc: DASH_Grafico[0].atv_bairro_perc,
			n_atv_bairro_perc: DASH_Grafico[0].n_atv_bairro_perc,
			matriz_bairro_perc: DASH_Grafico[0].matriz_bairro_perc,
			bandeira: DASH_Grafico[0].bandeira,
			dividas: DASH_Grafico[0].dividas,
			vlr_dividas: DASH_Grafico[0].vlr_dividas,
			qtd_dividas_prev: DASH_Grafico[0].qtd_dividas_prev,
			vlr_dividas_prev: DASH_Grafico[0].vlr_dividas_prev,
			qtd_dividas_nprev: DASH_Grafico[0].qtd_dividas_nprev,
			vlr_dividas_nprev: DASH_Grafico[0].vlr_dividas_nprev,
			qtd_dividas_fgts: DASH_Grafico[0].qtd_dividas_fgts,
			vlr_dividas_fgts: DASH_Grafico[0].vlr_dividas_fgts,
			tipo_pessoa_pf: DASH_Grafico[0].tipo_pessoa_pf,
			tipo_pessoa_pj: DASH_Grafico[0].tipo_pessoa_pj,
			tipo_situacao_inscricao_bf: DASH_Grafico[0].tipo_situacao_inscricao_bf,
			tipo_situacao_inscricao_cb: DASH_Grafico[0].tipo_situacao_inscricao_cb,
			tipo_situacao_inscricao_emgarantia: DASH_Grafico[0].tipo_situacao_inscricao_emgarantia,
			tipo_situacao_inscricao_judicial: DASH_Grafico[0].tipo_situacao_inscricao_judicial,
			indicador_ajuizado_sim: DASH_Grafico[0].indicador_ajuizado_sim,
			indicador_ajuizado_nao: DASH_Grafico[0].indicador_ajuizado_nao,
			valor_prev: DASH_Grafico[0].valor_prev,
			valor_nprev: DASH_Grafico[0].valor_nprev,
			valor_fgts: DASH_Grafico[0].valor_fgts,
			valor_prev_regular: DASH_Grafico[0].valor_prev_regular,
			valor_prev_irregular: DASH_Grafico[0].valor_prev_irregular,
			valor_nprev_regular: DASH_Grafico[0].valor_nprev_regular,
			valor_nprev_irregular: DASH_Grafico[0].valor_nprev_irregular,
			valor_fgts_regular: DASH_Grafico[0].valor_fgts_regular,
			valor_fgts_irregular: DASH_Grafico[0].valor_fgts_irregular,
			situacao_regular: DASH_Grafico[0].situacao_regular,
			situacao_irregular: DASH_Grafico[0].situacao_irregular,
			dividas_total: DASH_Grafico[0].dividas_total,
			vlr_dividas_total: DASH_Grafico[0].vlr_dividas_total,
			qtd_dividas_prev_total: DASH_Grafico[0].qtd_dividas_prev_total,
			vlr_dividas_prev_total: DASH_Grafico[0].vlr_dividas_prev_total,
			qtd_dividas_nprev_total: DASH_Grafico[0].qtd_dividas_nprev_total,
			vlr_dividas_nprev_total: DASH_Grafico[0].vlr_dividas_nprev_total,
			qtd_dividas_fgts_total: DASH_Grafico[0].qtd_dividas_fgts_total,
			vlr_dividas_fgts_total: DASH_Grafico[0].vlr_dividas_fgts_total,
			tipo_pessoa_pf_total: DASH_Grafico[0].tipo_pessoa_pf_total,
			tipo_pessoa_pj_total: DASH_Grafico[0].tipo_pessoa_pj_total,
			tipo_situacao_inscricao_bf_total: DASH_Grafico[0].tipo_situacao_inscricao_bf_total,
			tipo_situacao_inscricao_cb_total: DASH_Grafico[0].tipo_situacao_inscricao_cb_total,
			tipo_situacao_inscricao_emgarantia_total: DASH_Grafico[0].tipo_situacao_inscricao_emgarantia_total,
			tipo_situacao_inscricao_judicial_total: DASH_Grafico[0].tipo_situacao_inscricao_judicial_total,
			indicador_ajuizado_sim_total: DASH_Grafico[0].indicador_ajuizado_sim_total,
			indicador_ajuizado_nao_total: DASH_Grafico[0].indicador_ajuizado_nao_total,
			valor_prev_total: DASH_Grafico[0].valor_prev_total,
			valor_nprev_total: DASH_Grafico[0].valor_nprev_total,
			valor_fgts_total: DASH_Grafico[0].valor_fgts_total,
			valor_prev_regular_total: DASH_Grafico[0].valor_prev_regular_total,
			valor_prev_irregular_total: DASH_Grafico[0].valor_prev_irregular_total,
			valor_nprev_regular_total: DASH_Grafico[0].valor_nprev_regular_total,
			valor_nprev_irregular_total: DASH_Grafico[0].valor_nprev_irregular_total,
			valor_fgts_regular_total: DASH_Grafico[0].valor_fgts_regular_total,
			valor_fgts_irregular_total: DASH_Grafico[0].valor_fgts_irregular_total,
			situacao_regular_total: DASH_Grafico[0].situacao_regular_total,
			situacao_irregular_total: DASH_Grafico[0].situacao_irregular_total







		})
	} catch (e) {
		console.error(`Loading error /buscar-por-DASH search`, e)
		res.sendStatus(500)
	}
})

app.get("/buscar-por-GEOM", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultarGEOM(true, req.query), produtoDAO.consultarGEOM(false, req.query)])
		// const [resultado_GEOM] = await Promise.all([produtoDAO.buscar_detalhes_GEOM(true, req.query), produtoDAO.buscar_detalhes_GEOM(false, req.query)])
		//const [resultado_cnae] = await Promise.all([produtoDAO.buscar_detalhes_GEOM_CNAE(true, req.query), produtoDAO.buscar_detalhes_GEOM_CNAE(false, req.query)])

		const [GEOM_Grafico] = await Promise.all([produtoDAO.GEOM_graph(true, req.query), produtoDAO.GEOM_graph(false, req.query)])
		//const [GEOM_Grafico_cidades] = await Promise.all([produtoDAO.GEOM_graph_cidade(true, req.query), produtoDAO.GEOM_graph_cidade(false, req.query)])
		console.log("/buscar-por-GEOM", resultCount)
		console.log("/buscar-por-GEOM", "GEOM_Grafico", GEOM_Grafico)
		// console.log("/buscar-por-GEOM","resultados Gerais", result)
		res.json({
			count: resultCount[0].count_query,
			result,
			//  resultado_GEOM,
			//resultado_cnae
			GEOM_Grafico,
			empresas_total: GEOM_Grafico[0].empresas_total,
			ativa: GEOM_Grafico[0].ativa,
			n_ativa: GEOM_Grafico[0].n_ativa,
			matriz: GEOM_Grafico[0].matriz,
			filial: GEOM_Grafico[0].filial,
			mei: GEOM_Grafico[0].mei,
			mei_ativo: GEOM_Grafico[0].mei_ativo,
			simples: GEOM_Grafico[0].simples,
			simples_ativo: GEOM_Grafico[0].simples_ativo,
			estado: GEOM_Grafico[0].estado,
			bairro: GEOM_Grafico[0].bairro,
			cidade: GEOM_Grafico[0].cidade,
			total_empresas_bairro: GEOM_Grafico[0].total_empresas_bairro,
			atv_bairro: GEOM_Grafico[0].atv_bairro,
			n_atv_bairro: GEOM_Grafico[0].n_atv_bairro,
			matriz_bairro: GEOM_Grafico[0].matriz_bairro,
			total_empresas_bairro_perc: GEOM_Grafico[0].total_empresas_bairro_perc,
			atv_bairro_perc: GEOM_Grafico[0].atv_bairro_perc,
			n_atv_bairro_perc: GEOM_Grafico[0].n_atv_bairro_perc,
			matriz_bairro_perc: GEOM_Grafico[0].matriz_bairro_perc,
			total_cidade: GEOM_Grafico[0].total_cidade,
			ativos_cidade: GEOM_Grafico[0].ativos_cidade,
			n_ativos_cidade: GEOM_Grafico[0].n_ativos_cidade,
			provareal: GEOM_Grafico[0].provareal





		})
	} catch (e) {
		res.sendStatus(500)
	}
})

app.get("/GEOM-graph/:CEP", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.GEOM_graph(req.params.CEP)
		console.log("/GEOM-graph/:CEP", GEOM_Grafico)
		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})


app.get("/DASH-graph/:uf", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)
		const result = await produtoDAO.DASH_graph(req.params.CEP)
		console.log("/DASH-graph/:uf", DASH_Grafico)
		res.json(result)
	} catch (e) {
		res.sendStatus(500)
	}
})


app.get("/buscar-por-MEI", auth, async (req, res) => {
	try {
		const conexao = require("./config/connectionFactory")()
		const repository = require("./repository/produtoDAO")()
		const produtoDAO = new repository(conexao)

		const [resultCount, result] = await Promise.all([produtoDAO.consultarMEI(true, req.query), produtoDAO.consultarMEI(false, req.query)])
		console.log(resultCount)
		res.json({
			count: resultCount[0].count_query,
			result,
		})
	} catch (e) {
		res.sendStatus(500)
	}
})

app.use("/search", require("./routes/busca"))
app.use("/auth", require("./routes/auth"))


function verifyToken(request, response, next) {
	const token = request.cookies.loginDF

	if (!token) {
		autenticado = false
		next()
	} else {
		const decoded = jwt.verify(token, "SECRETps$&&**956")
		//console.log("token: "+ token);
		//console.log("decoded: "+ decoded);

		if (!decoded) {
			autenticado = false
			next()
		} else {
			autenticado = decoded.nome
			next()
		}
	}
}

function destroyToken(request, response, next) {
	autenticado = false
	response.clearCookie("loginDF")
	next()
}

// Folder estático de produção

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"))

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	})
}

app.use(function (request, response, next) {
	let error = "Página não encontrada"
	//response.sendStatus(404).send("Erro: " + request.originalUrl + " não encontrada")
	response.status(404).send('Not found - Erro 404' + request);
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Node Server rodando na porta ${PORT}`))
