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

import ResultsInitialImage from "../../img/results-initial.png"



const ResultsInitial = ({ contagem }) => {
	return (
		<div className="results-container">
			<h1 className="results-title results-h1-initial">
				<span className="results-title-primary results-title-initial">Pesquisa:</span>
				<span className="results-title-secondary results-title-initial"> Inicie sua pesquisa inserindo a categoria acima e, depois, os filtros ao lado.</span>
			</h1>
			<div className="results-image-container">
				<img src={ResultsInitialImage} alt="Comece sua pesquisa" className="results-initial-image" />
			</div>
		</div>
	)
}

export default memo(ResultsInitial)
