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
  CNPJinput,
  PhoneInput,
  mat_fil_extenso,
  sit_cad_extenso,
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
import dividasIcon from "../../img/icons/dividas-icon.svg";

import ieIcon from "../../img/icons/ie.png";
import porteIcon from "../../img/icons/porte.png";
import openIcon from "../../img/icons/open.png";

const DividasResult = ({ resultados, verDetalhes, contagem, pagina }) => {
  console.log("resultados from DividasResult1", resultados);
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
                      resultado.cpf_cnpj,
                      resultado.nome_fantasia,
                      resultado.unidade_responsavel,
                      resultado.uf,
                      resultado.razao_social,
                      resultado.sit_cadastral
                    )
                  }
                >
                  <div className="results-row-primary-container">
                    <Tooltip title="Devedor">
                      <span className="primary-nome_fantasia">
                        {arrumatexto(resultado.razao_social)}
                      </span>
                    </Tooltip>
                    <Tooltip title="Nome Fantasia da Empresa">
                      <span className="primary-razao-cnpj">
                        {arrumatexto(resultado.nome_fantasia)}
                      </span>
                    </Tooltip>

                    <div className="primary-cnpj_status primary-razao-cnpj">
                      <Tooltip title="CNPJ da Empresa">
                        <span>{formatDocument(resultado.cpf_cnpj)} </span>
                      </Tooltip>

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
                    <p className="cnae-title">Valor da Dívida</p>
                    <span>
                      {resultado.valor_consolidado_total.toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </span>
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
                    {resultado?.qtd_dividas && (
                      <div className="location-inner-container">
                        <Tooltip title="Quantidade de dívidas">
                          <img
                            src={dividasIcon}
                            alt="Quantidade de dívidas"
                            className="location-icon"
                          />
                        </Tooltip>
                        <span>
                          {resultado.qtd_dividas}{" "}
                          {resultado.qtd_dividas > 1 ? "dívidas" : "dívida"}
                        </span>
                      </div>
                    )}
                    <div className="location-inner-container">
                      <Tooltip title="Unidade Responsável">
                        <img
                          src={locationIcon}
                          alt="Localização"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>{arrumatexto(resultado.unidade_responsavel)}</span>
                    </div>
                    <div className="location-inner-container">
                      <Tooltip title="Capital Declarado">
                        <img
                          src={CapitalIcon}
                          alt="Capital"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>{resultado.capital_social_empresa}</span>
                    </div>
                    <div className="location-inner-container">
                      <Tooltip title="Faturamento">
                        <img
                          src={IncomeIcon}
                          alt="Faturamento"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>{resultado.faturamento}</span>
                    </div>

                    <div className="location-inner-container">
                      <Tooltip title="Nome do Papel / Fundo">
                        <img
                          src={StockIcon}
                          alt="Nome do Papel / Fundo"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>{resultado.ativo}</span>
                    </div>
                    <div className="location-inner-container">
                      <Tooltip title="Principal Acionista / Socio">
                        <img
                          src={ApertomaoIcon}
                          alt="Principal Acionista / Socio"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>{arrumatexto(resultado.principal_acionista)}</span>
                    </div>
                    <div className="location-inner-container">
                      <Tooltip title="Inscricao Estadual">
                        <img
                          src={ieIcon}
                          alt="Inscricao Estadual"
                          className="location-icon"
                        />
                      </Tooltip>
                      <span>{resultado.ie}</span>
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

export default memo(DividasResult);
