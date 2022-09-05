import React from "react"


import cnpj from "../../img/icons/cnpj.svg"
import socios from "../../img/icons/socios.svg"
import holdings from "../../img/icons/holdings.svg"
import cnae from "../../img/icons/cnae.svg"
import dividas from "../../img/icons/dividas.svg"
import mei from "../../img/icons/mei.svg"

const SidenavTitle = props => {
	const { isCNPJ, isSOCIOS, isHOLDINGS, isCnae, isDividas, isNCM, isGEOM } = props

	const types = [
		{
			type: isCNPJ,
			icon: cnpj,
			msg: "BUSCAR EM TODAS EMPRESAS",
		},
		{
			type: isSOCIOS,
			icon: socios,
			msg: "BUSCAR SÓCIOS",
		},
		{
			type: isHOLDINGS,
			icon: holdings,
			msg: "BUSCAR HOLDINGS",
		},
		{
			type: isCnae,
			icon: cnae,
			msg: "BUSCAR POR ATIVIDADE",
		},
		{
			type: isDividas,
			icon: dividas,
			msg: "BUSCAR POR DÍVIDAS ATIVAS",
		},
		{
			type: isNCM,
			icon: mei,
			msg: "INTELIGÊNCIA FISCAL",
		},
		{
			type: isGEOM,
			icon: holdings,
			msg: "GEO MARKETING",
		},
	]

	return (
		<>
			{types.map(type => {
				return (
					type.type && (
						<div className="sidenav-title__inner">
							<img src={type.icon} alt={type.icon} className="sidenav-title__image" />
							<p className="sidenav-title__msg">{type.msg}</p>
						</div>
					)
				)
			})}
		</>
	)
}

export default SidenavTitle
