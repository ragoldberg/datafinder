/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { memo } from "react";

import { formatDocument } from "../../utils/string-utils";
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
  PhoneInput,
  CNPJinput,
} from "../functions/formatos";
import { Tooltip } from "antd";

import sizeIcon from "../../img/icons/size.svg";
import openSinceIcon from "../../img/icons/open-since.svg";
import locationIcon from "../../img/icons/location.svg";
import percentIcon from "../../img/icons/percent.svg";
import IncomeIcon from "../../img/icons/income.gif";
import ValueIcon from "../../img/icons/value.png";
import CapitalIcon from "../../img/icons/capital.png";
import CostIcon from "../../img/icons/cost.gif";
import StockIcon from "../../img/icons/stock.gif";
import Value_realIcon from "../../img/icons/value_real.gif";
import ApertomaoIcon from "../../img/icons/apertomao.gif";
import parentcomp from "../../img/icons/parentcompany.png";

//Constantes de formato

//ranking

//fim ranking
//pinta sit cadastral

// pinta matriz/filial

// pinta MEI

//Constantes de formato

const HoldingsResultFile = ({ resultados, verDetalhes, contagem, pagina }) => {
  console.log(" resultados from holdings result file ", resultados);
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
                <span
                  style={{ textAlign: "center" }}
                  className="results-row-index"
                >
                  {(pagina - 1) * 20 + (index + 1)}
                </span>
                <div
                  className="results-row-inner"
                  onClick={() =>
                    verDetalhes(
                      resultado.cnpj,
                      resultado,
                      resultado.nome_fantasia,
                      resultado.municipio,
                      resultado.uf,
                      resultado.razao_social,
                      resultado.sit_cadastral
                    )
                  }
                >
                  <div className="results-row-primary-container">
                    <span className="primary-nome_fantasia">
                      {arrumatexto(resultado.razao_social_socia)}
                    </span>
                    {/*	<span className="primary-razao-cnpj">{arrumatexto(resultado.razao_social_socia)}</span>*/}
                    <div className="primary-cnpj_status primary-razao-cnpj">
                      <span>{formatDocument(resultado.cnpj)} </span>
                      <span>{mat_fil(resultado.nm_matriz_filial)}</span>
                      <span>{sit_cad(resultado.sit_cadastral)}</span>
                    </div>
                  </div>

				   <div className="results-row-cnae-container4">
                    <p className="cnae-title">Informações Adicionais</p>
                    <div className="primary-cnpj_status primary-razao-cnpj">
                      {tem_div(resultado.tem_divida)}{" "}
                      {Info_adicional(resultado.lei_pcd)}{" "}
                      {Info_adicional(resultado.beneficiado)}{" "}
                      {Info_adicional(resultado.sancoes)}{" "}
                      {Info_adicional(resultado.acordo_leniencia)}{" "}
                      {Info_adicional(resultado.esfl_impedidas)}
                    </div>
                  </div>

                  <div className="results-row-cnae-container">
                    <p className="cnae-title">Propósito Fiscal</p>
                    <span>{arrumatexto(resultado.nome)}</span>
                  </div>

                  <div className="results-row-location-container">
                    <div className="location-inner-container">
                      <Tooltip title="Porte">
                        <img
                          src={sizeIcon}
                          alt="Porte da empresa"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>{arrumatexto(resultado.nm_porte)}</span>
                    </div>
                    <div className="location-inner-container">
                      <Tooltip title="Aberta desde">
                        <img
                          src={openSinceIcon}
                          alt="Aberta desde"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>Aberta há {resultado.age} anos</span>
                    </div>
                    <div className="location-inner-container">
                      <Tooltip title="subsidiarias">
                        <img
                          src={parentcomp}
                          alt="subsidiarias"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span> {resultado.qtd_subsidiarias} Subsidiarias</span>
                    </div>
                    <div className="location-inner-container">
                      <Tooltip title="Localização">
                        <img
                          src={locationIcon}
                          alt="Localização"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>
                        {arrumatexto(resultado.municipio)} - {resultado.uf}
                      </span>
                    </div>
                  </div>

                  <div className="results-row-ranking-container">
                    <div
                      className="ranking-container"
                      style={{
                        backgroundColor: ranking(resultado.ranking)
                          .backgroundColor,
                      }}
                    >
                      <img
                        src={percentIcon}
                        alt="%"
                        className="ranking-percentage-symbol"
                      />
                      <span className="ranking-number">
                        {ranking(resultado.ranking).number}
                      </span>
                      <div className="ranking-text-container">
                        <span className="ranking-text">ranking</span>
                        <span className="ranking-text">datafinder</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default memo(HoldingsResultFile);
