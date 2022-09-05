/* eslint-disable react/jsx-no-duplicate-props */
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
import Spinner from "../layout/Spinner"
//Constantes de formato



  


//Constantes de formato

const ECADetailsFile = ({ resultados_eca, isPopupLoading, isPopupOpen, resultados_leads }) => {
  console.log("resultados_eca from ECA Details", resultados_eca)
  console.log("isPopupOpen: ", isPopupOpen)

  return isPopupLoading ? (
    <Spinner style={{ position: "absolute" }} />
  ) : (
    resultados_eca && (
      <div style={{ overflow: "scroll" }}>
        <h1 style={{ textAlign: "center" }}>Informações Gerais</h1>
        <section id="gigs">
          <div className="result_box" style={{ overflowX: "auto", padding: 20, margin: 0 }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Empresa</th>
                  <th style={{ textAlign: "left" }}>Dados</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Razão Social</td>
                  <td>{arrumatexto(resultados_eca[0].razao_social)}</td>
                </tr>
                <tr>
                  <td>Identificador Bolsa</td>
                  <td>{formatDocument(resultados_eca[0].ind_bolsa)}</td>
                </tr>
                <tr>
                  <td>Capital Social Declarado</td>
                  <td>{numberFormat(resultados_eca[0].capital_social_empresa)}</td>
                </tr>

                <tr>
                  <td>Patrimônio</td>
                  <td>{numberFormat(resultados_eca[0].patrimonio)}</td>
                </tr>
                <tr>
                  <td>Dívidas</td>
                  <td>{numberFormat(resultados_eca[0].dividas)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
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
        </section>
      </div>
    )
  )
}

export default memo(ECADetailsFile)
