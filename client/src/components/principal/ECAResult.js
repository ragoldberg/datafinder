/* eslint-disable eqeqeq */
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



const ECAResult = ({ resultados, verDetalhes, contagem, pagina }) => {
  function arrumatexto(string) {
    return string.replace(/\S*/g, function (word) {
      return word.charAt(0) + word.slice(1).toLowerCase()
    })
  }

  function date(date) {
    return date.split("-").reverse().join("/")
  }

  return (
    <>
      <h1>Total de Resultados: {contagem}</h1>
      <table id="team-list" style={{ width: "100%", fontSize: "10px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>#</th>
            <th style={{ textAlign: "center" }}>CNPJ / CPF</th>
            <th style={{ textAlign: "center" }}>Razão Social / Devedor</th>
            <th style={{ textAlign: "center" }}>Situação Cadastral</th>
            <th style={{ textAlign: "center" }}>Porte</th>
            <th style={{ textAlign: "center" }}>Data de inscrição</th>
            <th style={{ textAlign: "center" }}>Capital Social (Declarado)</th>
            <th style={{ textAlign: "center" }}>Patrimônio Liquido (PL)</th>
            <th style={{ textAlign: "center" }}>Dividas Totais</th>

            <th style={{ textAlign: "center" }}>Município</th>
            <th style={{ textAlign: "center" }}>UF</th>
          </tr>
        </thead>

        <tbody>
          {resultados &&
            resultados.map((resultado, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }} className="tableIndex">
                  {(pagina - 1) * 50 + (index + 1)}
                </td>
                <td style={{ textAlign: "center" }}>
                  <grid-item>
                    <a href="#!" onClick={() => verDetalhes(resultado.cnpj)}>
                      {formatDocument(resultado.cpf_cnpj)}
                    </a>
                  </grid-item>
                </td>
                <td style={{ textAlign: "left" }}>
                  <a href="#!" onClick={() => verDetalhes(resultado.cnpj)}>
                    {arrumatexto(resultado.razao_social)}
                  </a>
                </td>
                <td style={{ textAlign: "center" }}>{arrumatexto(resultado.nm_sit_cadastral)}</td>
                <td style={{ textAlign: "center" }}>{arrumatexto(resultado.nm_porte)}</td>
                <td style={{ textAlign: "left" }}>{date(resultado.dt_patr_liq)}</td>
                <td style={{ textAlign: "left" }}>{numberFormat(resultado.capital_social_empresa)}</td>
                <td style={{ textAlign: "left" }}>{numberFormat(resultado.patrimonio)}</td>
                <td style={{ textAlign: "left" }}>{numberFormat(resultado.dividas)}</td>

                <td style={{ textAlign: "left" }}>{arrumatexto(resultado.municipio)}</td>
                <td style={{ textAlign: "left" }}>{resultado.uf}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

export default memo(ECAResult)
