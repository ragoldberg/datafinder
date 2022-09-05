/* eslint-disable react/jsx-no-target-blank */
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
const MEIDetailsFile = ({ resultados_mei, isPopupLoading, isPopupOpen, verDetalhesCNPJ, resultados_leads }) => {
  console.log("resultados_mei from MEI Details", resultados_mei)
  console.log("isPopupOpen: ", isPopupOpen)

  return isPopupLoading ? (
    <Spinner style={{ position: "absolute" }} />
  ) : (
    resultados_mei && (
      <div style={{ overflow: "scroll" }}>
        <h1 style={{ textAlign: "center" }}>Informações  de {arrumatexto(resultados_mei[0].razao_social)}</h1>
        <section id="gigs">
          <div className="result_box" style={{ overflowX: "auto", padding: 20, margin: 0 }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                 
                  
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Razão Social</td>
                  <td>{arrumatexto(resultados_mei[0].razao_social)}</td>
                </tr>
                <tr>
                  <td>CNPJ</td>
                  <td>
                   
                      {formatDocument(resultados_mei[0].cnpj)}
                  
                  </td>
                </tr>
                <tr>
                  <td>Matriz/Filial</td>
                  <td>{arrumatexto(resultados_mei[0].nm_matriz_filial)}</td>
                </tr>
                <tr>
                  <td>Inicio</td>
                  <td>{resultados_mei[0].data_inicio}</td>
                </tr>

                <tr>
                  <td>Status </td>
                  <td>{resultados_mei[0].Status}</td>
                </tr>

                <tr>
                  <td>Natureza Jurídica</td>
                  <td>{arrumatexto(resultados_mei[0].natureza_juridica)}</td>
                </tr>
                <tr>
                  <td>Situação Cadastral</td>
                  <td>{arrumatexto(resultados_mei[0].situacao_cadastral)}</td>
                </tr>
                <tr>
                  <td>Capital Social</td>
                  <td>{numberFormat(resultados_mei[0].capital)}</td>
                </tr>
                <tr>
                  <td>CNAE Primário</td>
                  <td>
                    {formatDocument(resultados_mei[0].cnae_primario)} / {resultados_mei[0].nome}
                  </td>
                </tr>

                <tr>
                  <td>Porte</td>
                  <td>{arrumatexto(resultados_mei[0].porte)}</td>
                </tr>
                <tr>
                  <td>Simples</td>
                  <td>{arrumatexto(resultados_mei[0].simples_nacional)}</td>
                </tr>
                <tr>
                  <td>MEI</td>
                  <td>{resultados_mei[0].microempreendedor_individual}</td>
                </tr>
                <tr>
                  <td>Telefone</td>
                  <td>
                    {resultados_mei[0].ddd_telefone_1} {resultados_mei[0].ddd_telefone_2} {resultados_mei[0].FAX}
                  </td>
                </tr>

               
                <tr>
                  <td>E-mail</td>
                  <td>
                  <a href={"mailto:" + resultados_mei[0].email} target="_blank">{resultados_mei[0].email} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
                  </svg>
                  </a>
                  </td>
                </tr>

                <tr>
                    <td>Endereço</td>
                    <td>
                    {arrumatexto(resultados_mei[0].descricao_tipo_logradouro)} {arrumatexto(resultados_mei[0].logradouro)} , {resultados_mei[0].numero} , Bairro {arrumatexto(resultados_mei[0].bairro)} CEP - {formatDocument(resultados_mei[0].cep)}, {arrumatexto(resultados_mei[0].municipio)}/{resultados_mei[0].uf}
                    </td>
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

export default memo(MEIDetailsFile)
