
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


const MEIResultFile = ({ resultados, verDetalhes, contagem, pagina }) => {
  function arrumatexto(string) {
    return string.replace(/\S*/g, function (word) {
      return word.charAt(0) + word.slice(1).toLowerCase()
    })
  }

  return (
    <>
      <h1>Total de Resultados: {contagem}</h1>
      <table style={{ width: "100%", fontSize: "10px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>#</th>
            <th style={{ textAlign: "center" }}>CNPJ</th>
            <th style={{ textAlign: "center" }}>CPF</th>
            <th style={{ textAlign: "center" }}>Nome Empresario</th>
            <th style={{ textAlign: "center" }}>Tipo</th>
            <th style={{ textAlign: "center" }}>Situação Cadastral</th>
            <th style={{ textAlign: "center" }}>Natureza Jurídica</th>
            <th style={{ textAlign: "center" }}>Nome Fantasia</th>

            <th style={{ textAlign: "center" }}>Porte</th>
            <th style={{ textAlign: "center" }}>Tempo de Empresa (Anos)</th>
            <th style={{ textAlign: "center" }}>Propósito Fiscal</th>
            <th style={{ textAlign: "center" }}>Município</th>
            <th style={{ textAlign: "center" }}>UF</th>
          </tr>
        </thead>
        <tbody>
          {resultados &&
            resultados.map((resultado, index) => (
              <tr key={index} id="result" className="result_MEI">
                <td className="tableIndex">{(pagina - 1) * 50 + (index + 1)}</td>
     

                <td style={{ textAlign: "center", minWidth: "130px" }} className="tableLink">
                <grid-item>
                  <p onClick={() => verDetalhes(resultado.cnpj_cnpj)}>{formatDocument(resultado.cnpj_cnpj)} </p></grid-item>
                </td>
                <td style={{ textAlign: "center", minWidth: "130px" }} className="tableLink">
                  <grid-item>
                  <p onClick={() => verDetalhes(resultado.cnpj_cnpj)}>{formatDocument(resultado.cpf)} </p></grid-item>
                </td>
                <td style={{ textAlign: "left", minWidth: "130px" }} className="tableLink">
                <grid-item>
                  <p onClick={() => verDetalhes(resultado.cnpj_cnpj)}>{arrumatexto(resultado.nm_socio)} </p></grid-item>
                </td>
                <td style={{ textAlign: "left" }}>{arrumatexto(resultado.qualificacao)}</td>
                <td style={{ textAlign: "left" }}>{sit_cad(resultado.sit_cadastral)}</td>
                <td style={{ textAlign: "left" }}>{arrumatexto(resultado.natureza_juridica)}</td>
                <td style={{ textAlign: "left" }}>{arrumatexto(resultado.nome_fantasia)}</td>
                <td style={{ textAlign: "left" }}>{arrumatexto(resultado.nm_porte)}</td>
                <td style={{ textAlign: "center" }}>{resultado.age}</td>
                <td style={{ textAlign: "left" }}>{arrumatexto(resultado.nm_cnae)}</td>
                <td style={{ textAlign: "left" }}>{arrumatexto(resultado.municipio)}</td>
                <td style={{ textAlign: "center" }}>{resultado.uf}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

export default memo(MEIResultFile)
