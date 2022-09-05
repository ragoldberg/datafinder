/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo } from "react"

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
import { Tooltip } from "antd"



import sizeIcon from "../../img/icons/size.svg"
import openSinceIcon from "../../img/icons/open-since.svg"
import locationIcon from "../../img/icons/location.svg"
import percentIcon from "../../img/icons/percent.svg"
import IncomeIcon from "../../img/icons/income.gif"
import ValueIcon from "../../img/icons/value.png"
import CapitalIcon from "../../img/icons/capital.png"
import CostIcon from "../../img/icons/cost.gif"
import StockIcon from "../../img/icons/stock.gif"
import Value_realIcon from "../../img/icons/value_real.gif"
import ApertomaoIcon from "../../img/icons/apertomao.gif"



const NcmResult = ({ resultados, verDetalhes, contagem, pagina }) => {
	console.log("resultados from NcmResult1", resultados)
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
								{/* <div className="results-row-inner" onClick={() => verDetalhes(resultado.cnpj, resultado.nome_fantasia, resultado.municipio, resultado.uf, resultado.razao_social)}> */}
								<div className="results-row-inner">
									<div className="results-row-primary-container" style={{ width: "70%" }}>
										<span className="primary-nome_fantasia">{arrumatexto(resultado.nome)}</span>
										<span className="primary-razao-cnpj">CNAE: {resultado.cnae} / Total de Empresas: {resultado.total} </span>
										<div className="primary-cnpj_status primary-razao-cnpj">
											<span>NCM: {resultado.ncm} </span>
											{/* <span>{mat_fil(resultado.nm_matriz_filial)}</span>
											<span>{sit_cad(resultado.sit_cadastral)}</span> */}
										</div>
									</div>

									<div className="caixinha_colorida" style={{ margin: "10px" }}>
											<p className="caixinha_colorida_title">Total de Empresas</p>
											<p className="caixinha_colorida_result">{resultado.total}</p>
											
										</div>

									{(resultado.classe_cnae || resultado.nm_classe) && (
										<div className="results-row-cnae-container" style={{ margin: "10px" }}>
											<p className="cnae-title">Classe Cnae</p>
											{resultado.classe_cnae && <span>{formatDocument(resultado.classe_cnae)}</span>}
											{resultado.nm_classe && <span>{arrumatexto(resultado.nm_classe)}</span>}
										</div>
									)}

									
								</div>
								
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default memo(NcmResult)