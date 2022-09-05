/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo } from "react"
import { Tooltip } from "antd"
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

import sizeIcon from "../../img/icons/size.svg"
import openSinceIcon from "../../img/icons/open-since.svg"
import locationIcon from "../../img/icons/location.svg"



const SOCIOSResultFile = ({ resultados, verDetalhes, contagem, pagina }) => {
	console.log("resultados from SOCIOSResultFile", resultados)
	return (
		<div className="results-container">
			<h1 className="results-title">
				<span className="results-title-secondary">Encontramos </span>
				<span className="results-title-primary">{contagem}</span>
				<span className="results-title-secondary">resultados</span>
			</h1>
			<div>
				<div>
					{resultados &&
						resultados.map((resultado, index) => (
							<div key={index} className="results-row" id="result">
								<span style={{ textAlign: "center" }} className="results-row-index">
									{(pagina - 1) * 20 + (index + 1)}
								</span>
								<div className="results-row-inner" onClick={() => verDetalhes(resultado.nome_socio, resultado.cpf)}>
									<div className="results-row-primary-container">
										<Tooltip title="Nome do Sócio">
											<span className="primary-nome_fantasia">{arrumatexto(resultado.nome_socio)} </span>
										</Tooltip>
										<Tooltip title="Razão Social da Empresa">
											<span className="primary-razao-cnpj">{arrumatexto(resultado.rs_1)}</span>
										</Tooltip>
										<div className="primary-cnpj_status primary-razao-cnpj">
											<Tooltip title="Nome Fantasia da Empresa">
												<span>{arrumatexto(resultado.nome_fantasia)} </span>
											</Tooltip>
										
											
										</div>
									</div>
									<div className="results-row-cnae-container">
										<p className="cnae-title">Informações</p>
										<span>{sit_cad(resultado.sit_cadastral)}</span>
									</div>
									<div className="results-row-cnae-container">
										<p className="cnae-title">Qualificação do sócio</p>
										<span>{arrumatexto(resultado.nm_qualificacao_responsavel_socio)}</span>
									</div>

									<div className="results-row-location-container">
										<div className="location-inner-container">
											<Tooltip title="Porte">
												<img src={sizeIcon} alt="Porte da empresa" className="location-icon" />
											</Tooltip>
											<span>{arrumatexto(resultado.nm_porte)}</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Aberta desde">
												<img src={openSinceIcon} alt="Aberta desde" className="location-icon" />
											</Tooltip>
											<span>Aberta há {resultado.age} anos</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Localização">
												<img src={locationIcon} alt="Localização" className="location-icon" />
											</Tooltip>
											<span>
												{arrumatexto(resultado.municipio)} - {resultado.uf}
											</span>
										</div>
									</div>

									{/* Caso seja implementado o Ranking na categoria Socios, basta descomentar o bloco abaixo */}
									{/* <div className="results-row-ranking-container">
										<div className="ranking-container" style={{ backgroundColor: ranking(resultado.ranking).backgroundColor }}>
											<img src={percentIcon} alt="%" className="ranking-percentage-symbol" />
											<span className="ranking-number">{ranking(resultado.ranking).number}</span>
											<div className="ranking-text-container">
												<span className="ranking-text">ranking</span>
												<span className="ranking-text">datafinder</span>
											</div>
										</div>
									</div> */}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default memo(SOCIOSResultFile)
