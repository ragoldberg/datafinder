import { combineReducers } from "redux"
import alert from "./alert"
import auth from "./auth"
import cnpj from "./cnpj"
import dados_socios from "./dados_socios"
import dados_mei from "./dados_mei"
import dados_cnpj from "./dados_cnpj"
import dados_GEOM from "./dados_GEOM"
import dados_eca from "./dados_eca"
import dados_cnae from "./dados_cnae"
import dados_dividas from "./dados_dividas"
import dados_holdings from "./dados_holdings"
import detalhes from "./detalhes"
import fetch_google_info from "./fetch_google_info"
import dados_leads from "./dados_leads"

export default combineReducers({
	alert,
	auth,
	cnpj,
	dados_socios,
	dados_mei,
	dados_cnpj,
	dados_GEOM,
	dados_eca,
	dados_cnae,
	dados_dividas,
	dados_holdings,
	detalhes,
	fetch_google_info,
	dados_leads,
})
