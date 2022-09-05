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

const DASHDetails = ({ resultados_socios, socios, isPopupLoading, isPopupOpen }) => {
  console.log("resultados_socios from NCM Details", resultados_socios)
  console.log("isPopupOpen: ", isPopupOpen)

  return isPopupLoading ? (
    <Spinner style={{ position: "absolute" }} />
  ) : (
    resultados_socios && (
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
                  <td>{arrumatexto(resultados_socios[0].razao_social)}</td>
                </tr>
                <tr>
                  <td>CNPJ</td>
                  <td>{formatDocument(resultados_socios[0].cnpj)}</td>
                </tr>
                <tr>
                  <td>Matriz/Filial</td>
                  <td>{arrumatexto(resultados_socios[0].nm_matriz_filial)}</td>
                </tr>
                <tr>
                  <td>Inicio</td>
                  <td>{resultados_socios[0].data_inicio}</td>
                </tr>

                <tr>
                  <td>Status Cadastral: </td>
                  <td>{resultados_socios[0].Status}</td>
                </tr>

                <tr>
                  <td>Natureza Jurídica</td>
                  <td>{arrumatexto(resultados_socios[0].natureza_juridica)}</td>
                </tr>
                <tr>
                  <td>Situação Cadastral</td>
                  <td>{arrumatexto(resultados_socios[0].situacao_cadastral)}</td>
                </tr>
                <tr>
                  <td>Capital Social</td>
                  <td>{numberFormat(resultados_socios[0].capital)}</td>
                </tr>
                <tr>
                  <td>CNAE Primário</td>
                  <td>
                    {formatDocument(resultados_socios[0].cnae_primario)} / {resultados_socios[0].nome}
                  </td>
                </tr>

                <tr>
                  <td>Porte da Empresa</td>
                  <td>{arrumatexto(resultados_socios[0].porte)}</td>
                </tr>
                <tr>
                  <td>Opção pelo Simples</td>
                  <td>{arrumatexto(resultados_socios[0].simples_nacional)}</td>
                </tr>
                <tr>
                  <td>Opção pelo MEI</td>
                  <td>{resultados_socios[0].microempreendedor_individual}</td>
                </tr>
                <tr>
                  <td>Telefone</td>
                  <td>
                    {resultados_socios[0].ddd_telefone_1} {resultados_socios[0].ddd_telefone_2} {resultados_socios[0].FAX}
                  </td>
                </tr>

                <tr>
                  <td>E-mail</td>
                  <td>{resultados_socios[0].email}</td>
                </tr>

                <tr>
                  <td>Endereço</td>
                  <td>
                    {arrumatexto(resultados_socios[0].descricao_tipo_logradouro)} {arrumatexto(resultados_socios[0].logradouro)} , {resultados_socios[0].numero}
                  </td>
                </tr>
                <tr>
                  <td>CEP</td>
                  <td>{formatDocument(resultados_socios[0].cep)}</td>
                </tr>
                <tr>
                  <td>Bairro</td>
                  <td>{arrumatexto(resultados_socios[0].bairro)}</td>
                </tr>
                <tr>
                  <td>Município</td>
                  <td>
                    {arrumatexto(resultados_socios[0].municipio)}/{resultados_socios[0].uf}
                  </td>
                </tr>
              </tbody>
            </table>

            {socios && socios.length > 0 && (
              <>
                <h1>Sócios</h1>
                <div id="socios">
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Nome</th>
                        <th style={{ textAlign: "left" }}>CPF</th>
                        <th style={{ textAlign: "left" }}>Qualificação</th>
                        <th style={{ textAlign: "left" }}>Data de Entrada</th>

                        <th style={{ textAlign: "left" }}>Tempo de Sociedade (Anos)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {socios.map((socio, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "left" }}>{arrumatexto(socio.nome_socio)}</td>
                          <td style={{ textAlign: "center" }}>{socio.cnpj_cpf_socio}</td>
                          <td style={{ textAlign: "left" }}>{arrumatexto(socio.nm_qualificacao_responsavel_socio)}</td>
                          <td style={{ textAlign: "center" }}>{socio.data_entrada_sociedade}</td>

                          <td style={{ textAlign: "center" }}>{socio.tempo_sociedade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    )
  )
}

export default memo(DASHDetails)
