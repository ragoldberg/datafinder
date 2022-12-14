/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, memo, useEffect } from "react"

import { formatDocument } from "../../utils/string-utils"
import {
  cnpjMask,
  Info_adicional,
  sit_cad,
  mat_fil,
  ranking,
  date,
  e_mei,
  tem_div,
  numberFormat,
  arrumatexto,
  arrumatexto_1,
  CNPJinput,
  PhoneInput,
  mat_fil_extenso,
  sit_cad_extenso,
} from "../functions/formatos";
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



const GeoMarketingDetails = ({ detalhes_GEOM, socios_cnpj_GEOM, isPopupLoading, verDetalhesSocios, google_info, resultados_leads }) => {
	const [cnaes, setCnaes] = useState([])
	const [cnaesLoaded, setCnaesLoaded] = useState([])
	const [showGoogleAddress, setShowGoogleAddress] = useState(false)

	console.log("======= google_info GeoMarketingDetails: ", google_info)
	console.log("======= detalhes_GEOM: ", detalhes_GEOM)
	let cnae_secundario_array = []
	let allCnaes
	let cnae_primario = {}

	useEffect(() => {
		if (!detalhes_GEOM) return

		cnae_primario = {
			code: formatDocument(detalhes_GEOM[0].cnae_primario),
			description: detalhes_GEOM[0].nome,
		}

		if (detalhes_GEOM[0].cnae_secundario_full) {
			const cnae_secundario_cods = detalhes_GEOM[0].cnae_secundario_full.split("-")[0].split(",")
			const cnae_secundario_descs = detalhes_GEOM[0].cnae_secundario_full.split("-")[1].split(",")

			console.log(cnae_secundario_cods, "cnae_secundario_cods")
			console.log(cnae_secundario_descs, "cnae_secundario_descs")

			for (let i = 0; i < cnae_secundario_cods.length; i++) {
				cnae_secundario_array[i] = {
					code: cnae_secundario_cods[i]?.trim(),
					description: cnae_secundario_descs[i]?.trim(),
				}
			}

			allCnaes = cnae_secundario_array
			allCnaes.unshift(cnae_primario)
			setCnaesLoaded(allCnaes)
			setCnaes(allCnaes.slice(0, 2))
		} else if (cnae_primario) {
			setCnaes([cnae_primario])
		} else {
			setCnaes([])
		}
	}, [detalhes_GEOM])

	const { is_info_updated, updated_phone, updated_address, updated_url, updated_rating } = google_info
  console.log("resultados from GeoMarketingDetails", detalhes_GEOM)
	return isPopupLoading ? (
		<Spinner style={{ position: "absolute" }} />
	) : (
		detalhes_GEOM && (
			<div className="details-container">
			
				<div className="details-title-container">
				
					<div className="details-title-razao-cnpj">
					<div class="mydiv">
				 	<img style={{ aspectRatio: 3/2 }} src={detalhes_GEOM[0].logo_url} className="esc-logo slide-top left" alt="logo" align="left" resizeMode='contain' />                       
					</div>
				
						<p className="details-title-razao">{arrumatexto(detalhes_GEOM[0].razao_social)}</p>
						<p className="details-subtitle-razao">{arrumatexto(detalhes_GEOM[0].sub_title)}</p>
						<p className="details-title-cnpj">{formatDocument(detalhes_GEOM[0].cnpj)}</p>
					</div>
					
					<div className="details-title-separator" />
					<div className="details-title-main">
						<h1 className="details-title-name">{arrumatexto(detalhes_GEOM[0].nome_fantasia)}</h1>
						<div className="details-title-status">
							<span>{mat_fil(detalhes_GEOM[0].nm_matriz_filial.split(" ")[0])}</span>
							<span>{sit_cad(detalhes_GEOM[0].situacao_cadastral)}</span>
						</div>
					</div>
					<div className="details-title-separator" />
					<div className="details-title-location">
						<p className="details-title-municipio">{arrumatexto(detalhes_GEOM[0].municipio)}</p>
						<p className="details-title-uf">{arrumatexto(states[detalhes_GEOM[0].uf].name)}</p>
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
										<div className="details-grid-five">
												<span>
													<p className="details-inner-left-description-title">Descri????o</p>
													<p className="details-inner-left-description-subtitle">{detalhes_GEOM[0].description || "-"}</p>
												</span>
											</div>

											<div className="details-grid-one">
												<span>
													<p className="details-inner-left-description-title">Abertura</p>
													<p className="details-inner-left-description-subtitle">{detalhes_GEOM[0].data_inicio || "-"}</p>
												</span>
												<span>
													<p className="details-inner-left-description-title">Receita</p>
													<p className="details-inner-left-description-subtitle">{detalhes_GEOM[0].receita || "-"}</p>
												</span>
												<span>
													<p className="details-inner-left-description-title">Funcionarios</p>
													<p className="details-inner-left-description-subtitle">{detalhes_GEOM[0].num_funcionarios || "-"}</p>
												</span>
												<span>
													<p className="details-inner-left-description-title">Natureza Jur??dica</p>
													<p className="details-inner-left-description-subtitle">{arrumatexto(detalhes_GEOM[0].natureza_juridica) || "-"}</p>
												</span>
											</div>
											<div className="details-grid-five">
												<span>
													<p className="details-inner-left-description-title">Status</p>
													<p className="details-inner-left-description-subtitle">{detalhes_GEOM[0].Status || "-"}</p>
												</span>
											</div>
											
											<div className="details-grid-two">
												<span>
													<p className="details-inner-left-description-title">Porte</p>
													<p className="details-inner-left-description-subtitle">{arrumatexto(detalhes_GEOM[0].porte) || "-"}</p>
												</span>
												<span>
													<p className="details-inner-left-description-title">MEI</p>
													<p className="details-inner-left-description-subtitle">{detalhes_GEOM[0].microempreendedor_individual || "-"}</p>
												</span>
												<span>
													<p className="details-inner-left-description-title">Simples</p>
													<p className="details-inner-left-description-subtitle">{arrumatexto(detalhes_GEOM[0].simples_nacional) || "-"}</p>
												</span>
							{/*					<div className="details-grid-five">
												<span>
													<p className="details-inner-left-description-title">A????es</p>
													<p className="details-inner-left-description-subtitle">{detalhes_GEOM[0].acoes || "-"}</p>
												</span>
											</div> */}
											
											
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
														{!is_info_updated ? (
															<p>
																Atualizando... <Loading />
															</p>
														) : updated_phone === "Not found" ? null : (
															<>
																<p>{updated_phone}</p>
															</>
														)}
														<p>{detalhes_GEOM[0].ddd_telefone_1}</p>
														<p>{detalhes_GEOM[0].ddd_telefone_2}</p>
													</span>
												</span>
												<span></span>
												<span>
													<p className="details-inner-left-description-title">E-mail</p>
													<p className="details-inner-left-description-subtitle">{detalhes_GEOM[0].email.toLowerCase() || "-"}</p>
												</span>
												<span>
													<p className="details-inner-left-description-title">Site</p>
													<p className="details-inner-left-description-subtitle" style={{ wordBreak: "break-all" }}>
														{!is_info_updated ? (
															<Loading />
														) : updated_url === "Not found" ? (
															<p>{detalhes_GEOM[0].website}</p>
														) : (
															<a href={updated_url} target="_blank" rel="noreferrer">
																{updated_url}
															</a>
														)}
													</p>
												</span>
											</div>
											<div className="details-grid-four">
												<span>
													<p className="details-inner-left-description-title">Endere??o</p>
													<p className="details-inner-left-description-subtitle">
														{arrumatexto(detalhes_GEOM[0].descricao_tipo_logradouro)} {arrumatexto(detalhes_GEOM[0].logradouro)}, {detalhes_GEOM[0].numero}, Bairro {arrumatexto(detalhes_GEOM[0].bairro)}, CEP - {formatDocument(detalhes_GEOM[0].cep)}, {detalhes_GEOM[0].municipio} - {detalhes_GEOM[0].uf}
													</p>
														{/*{!is_info_updated ? null : updated_address === "Not found" ? null : !showGoogleAddress ? (
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
											<img src={businessIcon} alt="Neg??cios" className="details-right-business-icon" />
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
											{cnaes.length > 2 ? (
												cnaes.length < 3 ? (
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
													<img src={sedeIcon} alt="Pr??dio" />
												</div>
												<div className="details-sede-description">
													<h3>Sede</h3>
													<h2>{detalhes_GEOM[0].nm_matriz_filial || "-"}</h2>
												</div>
											</div>

											<div className="details-capital-container">
												<div className="details-capital-icon">
													<img src={capitalIcon} alt="Sifr??o" />
												</div>
												<div className="details-capital-description">
													<h3>Capital Social</h3>
													<h2>
														{detalhes_GEOM[0].capital.toLocaleString("pt-BR", {
															style: "currency",
															currency: "BRL",
														}) || "-"}
													</h2>
												</div>
											</div>
										</div>
									</div>
									{socios_cnpj_GEOM && socios_cnpj_GEOM.length > 0 && (
										<div className="details-inner-right-lower">
											<h1>S??cios</h1>
											<img src={socioIcon} alt="S??cios" className="details-right-socios-icon" />

											<div className="details-socios-container">
												{socios_cnpj_GEOM.map((socio, index) => {
													return (
														<div
															className="details-socio-container"
															onClick={() => {
																verDetalhesSocios(socio.nome_socio, socio.cnpj_cpf_socio)
															}}
														>
															<div className="details-socio-decorator" />
															<div className="details-socio-content">
																<h1 key={index} className="details-socio-name">
																	{arrumatexto(socio.nome_socio)}
																</h1>

																<div className="details-socio-info-container">
																	<span style={{ textTransform: "capitalize", maxWidth: "12rem" }}>{socio.nm_qualificacao_responsavel_socio.toLowerCase() || socio.razao_social.toLowerCase()}</span>
																	<span className="details-socio-separator">/</span>
																	<span>{socio.cnpj_cpf_socio || socio.cnpj_full}</span>
																	<span className="details-socio-separator">/</span>
																	<span>{socio.data_entrada_sociedade && `desde ${socio.data_entrada_sociedade}`}</span>
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

export default memo(GeoMarketingDetails)

