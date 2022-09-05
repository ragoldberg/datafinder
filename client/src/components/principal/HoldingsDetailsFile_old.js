/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, memo, useEffect } from "react"

import { formatDocument } from "../../utils/string-utils"
import { cnpjMask,Info_adicional, sit_cad, mat_fil, ranking, date, e_mei, tem_div,numberFormat,arrumatexto,arrumatexto_1  } from "../functions/formatos"
import Spinner from "../layout/Spinner"
import Loading from "../layout/Loading"
import states from "../../utils/states.json"
import { Tooltip } from "antd"
import Rating from "@material-ui/lab/Rating"


import sedeIcon from "../../img/icons/sede.svg"
import capitalIcon from "../../img/icons/capital-social.svg"
import contatoIcon from "../../img/icons/contato.svg"
import businessIcon from "../../img/icons/business.svg"
import socioIcon from "../../img/icons/socio.svg"



const HoldingsDetailsFile = ({ resultados_holdings, subsidiarias_holdings, results_holdings, isPopupLoading, verDetalhesCNPJ, google_info, resultados_leads }) => {
	const [cnaes, setCnaes] = useState([])
	const [cnaesLoaded, setCnaesLoaded] = useState([])
	const [showGoogleAddress, setShowGoogleAddress] = useState(false)

	console.log("======= google_info: ", google_info)
	console.log("======= resultados_holdings: ", resultados_holdings)

	// Info referente à empresa detalhada no HoldingsResult
	console.log("======= results: ", results_holdings)

	let cnae_secundario_array = []
	let allCnaes
	let cnae_primario = {}

	useEffect(() => {
		if (!results_holdings) return

		cnae_primario = {
			code: formatDocument(results_holdings.cnae_fiscal),
			description: results_holdings.nome,
		}

		if (results_holdings.cnaes_secundarios) {
			const cnaes_secundarios = results_holdings.cnaes_secundarios.split(",")

			for (let i = 0; i < cnaes_secundarios.length; i++) {
				cnae_secundario_array[i] = {
					code: formatDocument(cnaes_secundarios[i].split("-")[0]),
					description: cnaes_secundarios[i].split("-")[1]?.trim(),
				}
			}

			allCnaes = cnae_secundario_array
			allCnaes.unshift(cnae_primario)
			console.log(allCnaes, "allCnaes inner scope")
			setCnaesLoaded(allCnaes)
			setCnaes(allCnaes.slice(0, 2))
		} else if (cnae_primario) {
			setCnaes([cnae_primario])
		} else {
			setCnaes([])
		}
	}, [results_holdings])

	console.log("/resultados_holdings/", resultados_holdings)
	console.log("/subsidiarias_holdings/", subsidiarias_holdings)
	console.log(cnaesLoaded, "cnaesLoaded outer scope")

	const { is_info_updated, updated_phone, updated_address, updated_url, updated_rating } = google_info

	return isPopupLoading ? (
		<Spinner style={{ position: "absolute" }} />
	) : (
		resultados_holdings && results_holdings && (
			<div className="details-container">
				<div className="details-title-container">
					<div className="details-title-razao-cnpj">
						<p className="details-title-razao">{arrumatexto(resultados_holdings[0].razao_social_socia)}</p>
						<p className="details-title-cnpj">{formatDocument(resultados_holdings[0].cnpj_socia)}</p>
					</div>
					<div className="details-title-separator" />
					<div className="details-title-main">
						<h1 className="details-title-name">{arrumatexto(results_holdings.razao_social_socia)}</h1>
						<div className="details-title-status">
							{/* <span>{mat_fil(resultados_holdings[0].nm_matriz_filial.split(" ")[0])}</span> */}
							<span>{sit_cad(results_holdings.sit_cadastral)}</span>
						</div>
					</div>
					<div className="details-title-separator" />
					<div className="details-title-location">
						<p className="details-title-municipio">{results_holdings.municipio}</p>
						<p className="details-title-uf">{arrumatexto(states[results_holdings.uf].name)}</p>
					</div>
				</div>
				<section id="gigs">
					<div className="result_box" style={{ marginBottom: 0, overflow: "scroll" }}>
						<div style={{ maxHeight: "90vh", margin: 0 }}>
							<div className="details-inner-container">
								<div className="details-inner-left-container">
									<div className="details-left-border details-left-empresa">
										<div className="details-left-title">
											<h1>Empresa</h1>
											<span style={{ height: "100%" }}>
												{!is_info_updated || !updated_rating ? null : updated_rating === "Not found" ? null : !updated_rating.value ? null : (
													<div className="details-left-review-container">
														<span>{updated_rating.value}</span>
														<Rating size="small" value={updated_rating.value} readOnly precision={0.1} />
														<span>{`(${updated_rating.votes_count})`}</span>
													</div>
												)}
											</span>
										</div>
										<div className="details-inner-left-description">
											<div className="details-grid-one">
												<span>
													<p className="details-inner-left-description-title">Porte</p>
													<p className="details-inner-left-description-subtitle">{arrumatexto(results_holdings.nm_porte) || "-"}</p>
												</span>

												<span>
													<p className="details-inner-left-description-title">Natureza Jurídica</p>
													<p className="details-inner-left-description-subtitle">{arrumatexto(results_holdings.natureza_juridica) || "-"}</p>
												</span>
											</div>
										</div>
									</div>

									<div className="details-left-border details-left-contato">
										<div className="details-left-title">
											<h1>Contato</h1>
										</div>
										<img src={contatoIcon} alt="Contato" className="details-left-icon" />

										<div className="details-inner-left-description">
											<div className="details-grid-three">
												<span>
													<p className="details-inner-left-description-title">Telefone</p>
													<span className="details-inner-left-description-subtitle details-phone">
													
														<p>{resultados_holdings[0].ddd_telefone_1}</p>
														<p>{resultados_holdings[0].ddd_telefone_2}</p>
													</span>
												</span>
												<span></span>
												<span>
													<p className="details-inner-left-description-title">E-mail</p>
													<p className="details-inner-left-description-subtitle">{resultados_holdings[0].email1.toLowerCase() || "-"}</p>
												</span>
												<span>
													<p className="details-inner-left-description-title">Site</p>
													<p className="details-inner-left-description-subtitle" style={{ wordBreak: "break-all" }}>
													
															<p>{resultados_holdings[0].website || "-"}</p>
														
													</p>
												</span>
											</div>
											<div className="details-grid-four">
												<span>
													<p className="details-inner-left-description-title">Endereço</p>
													<p className="details-inner-left-description-subtitle">
														{arrumatexto(resultados_holdings[0].descricao_tipo_logradouro)} {arrumatexto(resultados_holdings[0].logradouro)}, {resultados_holdings[0].numero}, Bairro {arrumatexto(resultados_holdings[0].bairro)}, CEP - {formatDocument(resultados_holdings[0].cep)}, {resultados_holdings[0].municipio} - {resultados_holdings[0].uf}
													</p>
												{/*	{!is_info_updated ? null : updated_address === "Not found" ? null : !showGoogleAddress ? (
														<button onClick={() => setShowGoogleAddress(true)} style={{ color: "black" }}>
															Validador Datafinder
														</button>
													) : (
														<div style={{ color: "black" }}>
															<p>Validador Datafinder: {updated_address}</p>
														</div>
													)}*/}
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className="details-inner-right-container">
									<div className="details-inner-right-upper">
										<div className="details-cnaes">
											<h1 className="details-cnaes-title">CNAEs</h1>
											<img src={businessIcon} alt="Negócios" className="details-right-business-icon" />
											<div className="details-cnaes-map-container">
												{cnaes && cnaes.length > 0
													? cnaes.map((cnae, index) => {
															return (
																<div className="details-single-container">
																	<p>
																		<span className="details-cnae-index">{index + 1}</span> <span className="details-cnaes-code">{cnae.code}</span>
																	</p>
																	<p className="details-cnae-description">{cnae.description}</p>
																</div>
															)
													  })
													: null}
											</div>
											{cnaesLoaded.length > 2 ? (
												cnaes.length < 3 && cnaesLoaded.length > 2 ? (
													<div onClick={() => setCnaes(cnaesLoaded)} className="details-cnae-button">
														Ver mais <span className="details-cnae-index">+</span>
													</div>
												) : (
													<div onClick={() => setCnaes(cnaesLoaded && cnaesLoaded.slice(0, 2))} className="details-cnae-button">
														Ver menos <span className="details-cnae-index">-</span>
													</div>
												)
											) : null}
										</div>
										<div className="details-sede-capital">
											<div className="details-sede-container">
												<div className="details-sede-icon">
													<img src={sedeIcon} alt="Prédio" />
												</div>
												<div className="details-sede-description">
													<h3>Subsidiarias</h3>
													<h2>{resultados_holdings[0].qtd_subsidiarias || "-"}</h2>
												</div>
											</div>

											<div className="details-capital-container">
												<div className="details-capital-icon">
													<img src={capitalIcon} alt="Sifrão" />
												</div>
												<div className="details-capital-description">
													<h3>Estados</h3>
													<h2>{resultados_holdings[0].qtd_estados || "-"}</h2>
													<p></p>
													<h3>Municípios</h3>
													<h2>{resultados_holdings[0].qtd_estados || "-"}</h2>
												</div>
											</div>
										</div>
									</div>
									{subsidiarias_holdings && subsidiarias_holdings.length > 0 && (
										<div className="details-inner-right-lower">
											<h1>Subsidiarias</h1>
											<img src={socioIcon} alt="Sócios" className="details-right-socios-icon" />

											<div className="details-socios-container">
												{subsidiarias_holdings.map((socio, index) => {
													return (
														<div
															className="details-socio-container"
															onClick={() => {
																verDetalhesCNPJ(socio.cnpj_sub)
															}}
														>
															<div className="details-socio-decorator" />
															<div className="details-socio-content">
																<h1 key={index} className="details-socio-name">
																	{arrumatexto(socio.nome_socio)}
																</h1>

																<div className="details-socio-info-container">
																	<span style={{ textTransform: "capitalize", maxWidth: "12rem" }}>{socio.rz_sc_sub.toLowerCase() || socio.razao_social.toLowerCase()}</span>
																	<span className="details-socio-separator">/</span>
																	<span>{formatDocument(socio.cnpj_sub) || "-"}</span>
																	<span className="details-socio-separator">/</span>
																	<span style={{ marginLeft: "0.3rem" }}>({socio.tempo_sociedade || socio.age} anos)</span>
																</div>
															</div>
														</div>
													)
												})}
											</div>
										</div>
									)}
									{resultados_leads && resultados_leads.length > 0 && resultados_leads !== 'error_leads' && (
										<div className="details-inner-right-lower">
											<h1>Outros Contatos</h1>
											<div className="details-leads-container">
												{resultados_leads.map((lead, index) => {
													return (
														<div
														className="details-lead-container"
														key={index}
													>
														<div className={'details-leads-decorator'} />
														<div className={'details-leads-content'}>
															<h1 className={'details-leads-name'}>
																{arrumatexto(lead.name)}
															</h1>
															<span className='lead-detail'>Cargo: {lead.position}</span>
															<span className='lead-detail'>Email: {lead.email}</span>
															{lead.twitter && <span className='lead-detail'>Twitter: {lead.twitter}</span>}
															{lead.department && <span className='lead-detail'>Departamento: {lead.department}</span>}
														</div>
													</div>
													)
												})}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		)
	)
}

export default memo(HoldingsDetailsFile)
