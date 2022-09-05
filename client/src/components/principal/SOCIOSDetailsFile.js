/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useEffect } from "react";
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
  mat_fil_extenso,
  sit_cad_extenso,
  beneficios_cpf,
} from "../functions/formatos";
import Spinner from "../layout/Spinner";
import { Tooltip } from "antd";

import sedeIcon from "../../img/icons/sede.svg";
import capitalIcon from "../../img/icons/capital-social.svg";

import socioIcon from "../../img/icons/socio.svg";
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
import ieIcon from "../../img/icons/ie.png";
import porteIcon from "../../img/icons/porte.png";
import openIcon from "../../img/icons/open.png";

const SOCIOSDetailsFile = ({
  resultados_socios,
  detalhes_SOCIOS,
  isPopupLoading,
  verDetalhesCNPJ,
  google_info,
  resultados_leads,
}) => {
  useEffect(() => {
    if (!resultados_socios) return;
  }, [resultados_socios]);

  console.log("/resultados_socios/", resultados_socios);
  console.log("/detalhes_SOCIOS/", detalhes_SOCIOS);

  return isPopupLoading ? (
    <Spinner style={{ position: "absolute" }} />
  ) : (
    resultados_socios && (
      <div className="details-container">
        <div className="details-title-container">
          <div className="details-title-main-socio">
            <h1 className="details-title-socio-name">
              {arrumatexto(resultados_socios[0].nome_socio)}
            </h1>
          </div>
        </div>
        <section id="gigs">
          <div
            className="result_box"
            style={{ marginBottom: 0, overflow: "scroll" }}
          >
            <div style={{ maxHeight: "90vh", margin: 0 }}>
              <div className="details-inner-container">
                <div className="details-inner-left-container">
                  <div className="details-left-border details-left-empresa">
                    <div className="details-left-title">
                      <h1>Resumo</h1>
                    </div>
                    <div className="details-inner-left-description">
                      <div className="details-grid-one">
                        <span>
                          <p className="details-inner-left-description-title">
                            CPF
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_socios[0].cpf_cnpj || "-"}
                          </p>
                        </span>
                      </div>
                      <div className="details-grid-five">
                        <span>
                          <p className="details-inner-left-description-title">
                            Quantidade de Empresas
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_socios[0].qtd_empresas || "-"}
                          </p>
                        </span>
                      </div>
                      <div className="details-grid-two">
                        <span>
                          <p className="details-inner-left-description-title">
                            Quantidade de Estados
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_socios[0].qtd_estados || "-"}
                          </p>
                        </span>

                        <span>
                          <p className="details-inner-left-description-title">
                            Quantidade de Municípios
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_socios[0].qtd_municipios || "-"}
                          </p>
                        </span>

                        <span>
                          <p className="details-inner-left-description-title">
                            Quantidade de Holdings
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_socios[0].qtd_holdings || "-"}
                          </p>
                        </span>
                        <span>
                          <p className="details-inner-left-description-title">
                            Total de Auxilio Governamental Recebido
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {numberFormat(
                              resultados_socios[0].valor_beneficio
                            ) || "-"}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="details-inner-right-container">
                  <div className="details-inner-right-upper">
                    <div className="details-sede-capital">
                      <div className="details-sede-container">
                        <div className="details-sede-icon">
                          <img src={sedeIcon} alt="Prédio" />
                        </div>
                        <div className="details-sede-description">
                          <h3>Quantidade de Empresas</h3>
                          <h2>{resultados_socios[0].qtd_empresas || "-"}</h2>
                        </div>
                      </div>

                      <div className="details-capital-container">
                        <div className="details-capital-icon">
                          <img src={capitalIcon} alt="Sifrão" />
                        </div>
                        <div className="details-capital-description">
                          <h3>Patrimônio</h3>
                          <h2>
                            {resultados_socios[0].patrimonio.toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            ) || "-"}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  {detalhes_SOCIOS && detalhes_SOCIOS.length > 0 && (
                    <div
                      className="details-inner-right-lower"
                      style={{ marginTop: "20px" }}
                    >
                      <h1>Empresas Relacionadas</h1>
                      <img
                        src={socioIcon}
                        alt="Sócios"
                        className="details-right-socios-icon"
                      />

                      <div className="details-socios-container">
                        {detalhes_SOCIOS.map((socio, index) => {
                          return (
                            <div
                              className="details-socio-container"
                              onClick={() => {
                                verDetalhesCNPJ(
                                  socio.cnpj,
                                  socio.nome_fantasia,
                                  socio.municipio,
                                  socio.uf,
                                  socio.razao_social
                                );
                              }}
                            >
                              <div className="details-socio-decorator" />
                              <div className="details-socio-content">
                                <h1 key={index} className="details-socio-name">
                                  {arrumatexto(socio.nome_fantasia) ||
                                    arrumatexto(socio.razao_social)}
                                </h1>

                                <div className="details-socio-info-container">
                                  <span
                                    style={{
                                      textTransform: "capitalize",
                                      maxWidth: "12rem",
                                    }}
                                  >
                                    {socio.razao_social.toLowerCase()}
                                  </span>
                                  <span>
                                    {" "}
                                    {sit_cad_extenso(socio.sit_cadastral)}{" "}
                                  </span>
                                  <span className="details-socio-separator">
                                    /
                                  </span>
                                  <span>{socio.cnpj || socio.cpf_cnpj}</span>
                                  <span className="details-socio-separator">
                                    /
                                  </span>

                                  <span style={{ marginLeft: "0.3rem" }}>
                                    {socio.tempo_sociedade_total}
                                  </span>
                                  <div className="primary-cnpj_status primary-razao-cnpj">
                                    {tem_div(socio.tem_divida)}{" "}
                                    {Info_adicional(socio.lei_pcd)}{" "}
                                    {Info_adicional(socio.beneficiado)}{" "}
                                    {Info_adicional(socio.sancoes)}{" "}
                                    {Info_adicional(socio.acordo_leniencia)}{" "}
                                    {Info_adicional(socio.esfl_impedidas)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {resultados_leads &&
                    resultados_leads.length > 0 &&
                    resultados_leads !== "error_leads" && (
                      <div className="details-inner-right-lower">
                        <h1>Outros Contatos</h1>
                        <div className="details-leads-container">
                          {resultados_leads.map((lead, index) => {
                            return (
                              <div
                                className="details-lead-container"
                                key={index}
                              >
                                <div className={"details-leads-decorator"} />
                                <div className={"details-leads-content"}>
                                  <h1 className={"details-leads-name"}>
                                    {arrumatexto(lead.name)}
                                  </h1>
                                  <span className="lead-detail">
                                    Cargo: {lead.position}
                                  </span>
                                  <span className="lead-detail">
                                    Email: {lead.email}
                                  </span>
                                  {lead.twitter && (
                                    <span className="lead-detail">
                                      Twitter: {lead.twitter}
                                    </span>
                                  )}
                                  {lead.department && (
                                    <span className="lead-detail">
                                      Departamento: {lead.department}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  );
};

export default memo(SOCIOSDetailsFile);
