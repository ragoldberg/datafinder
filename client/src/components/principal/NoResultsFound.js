
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

import NoResultsImage from "../../img/no-results-found.png"


import sizeIcon from "../../img/icons/size.svg"
import openSinceIcon from "../../img/icons/open-since.svg"
import locationIcon from "../../img/icons/location.svg"
import percentIcon from "../../img/icons/percent.svg"

//Constantes de formato

//ranking


//fim ranking
//pinta sit cadastral


// pinta matriz/filial


// pinta MEI






//Constantes de formato

const NoResultsFound = ({ contagem }) => {
	return (
		<div className="results-container">
			<h1 className="results-title results-h1-initial">
				<span className="results-title-secondary results-title-initial">Nenhum resultado encontrado.</span>
			</h1>
			<div className="results-image-container">
				<img src={NoResultsImage} alt="Nenhum resultado encontrado" className="results-not-found-image" />
			</div>
		</div>
	)
}

export default memo(NoResultsFound)
