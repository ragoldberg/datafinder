/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, memo, useEffect } from "react";
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
  tipodivida_extenso,
  sit_cad_extenso,
} from "../functions/formatos";
import Spinner from "../layout/Spinner";
import Loading from "../layout/Loading";
import states from "../../utils/states.json";

import sedeIcon from "../../img/icons/sede.svg";
import capitalIcon from "../../img/icons/capital-social.svg";
import contatoIcon from "../../img/icons/contato.svg";
import businessIcon from "../../img/icons/business.svg";
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

const DividasDetailsFile = ({
  resultados_dividas,
  detalhes_dividas,
  isPopupLoading,
  verDetalhesSocios,
  google_info,
  resultados_leads,
}) => {
  const [cnaes, setCnaes] = useState([]);
  const [cnaesLoaded, setCnaesLoaded] = useState([]);
  const [showGoogleAddress, setShowGoogleAddress] = useState(false);

  console.log("======= google_info: ", google_info);

  let cnae_secundario_array = [];
  let allCnaes;
  let cnae_primario = {};

  useEffect(() => {
    if (!resultados_dividas) return;

    cnae_primario = {
      code: formatDocument(resultados_dividas[0].cnae_primario),
      description: resultados_dividas[0].nome,
    };

    if (resultados_dividas[0].cnae_secundario_full) {
      const cnae_secundario_cods = resultados_dividas[0].cnae_secundario_full
        .split("-")[0]
        .split(",");
      const cnae_secundario_descs = resultados_dividas[0].cnae_secundario_full
        .split("-")[1]
        .split(",");

      console.log(cnae_secundario_cods, "cnae_secundario_cods");
      console.log(cnae_secundario_descs, "cnae_secundario_descs");

      for (let i = 0; i < cnae_secundario_cods.length; i++) {
        cnae_secundario_array[i] = {
          code: cnae_secundario_cods[i]?.trim(),
          description: cnae_secundario_descs[i]?.trim(),
        };
      }

      allCnaes = cnae_secundario_array;
      allCnaes.unshift(cnae_primario);
      setCnaesLoaded(allCnaes);
      setCnaes(allCnaes.slice(0, 2));
    } else if (cnae_primario) {
      setCnaes([cnae_primario]);
    } else {
      setCnaes([]);
    }
  }, [resultados_dividas]);

  console.log("/resultados_dividas/", resultados_dividas);
  console.log("/detalhes_dividas/", detalhes_dividas);
  console.log(allCnaes, "allCnaes outer scope");

  const {
    is_info_updated,
    updated_phone,
    updated_address,
    updated_url,
    updated_rating,
  } = google_info;

  return isPopupLoading ? (
    <Spinner style={{ position: "absolute" }} />
  ) : (
    resultados_dividas && (
      <div className="details-container">
		        <div className="details-icon">
          <div class="Icon">
            <img
              style={{ aspectRatio: 3 / 2 }}
              src={resultados_dividas[0].logo_url}
              className="esc-logo slide-top left"
              alt="logo"
              align="left"
              resizeMode="contain"
            />
          </div>
        </div>
  <div className="details-title-container">
          <div className="details-title-razao-cnpj">
            <p className="details-title-razao">
              {arrumatexto(resultados_dividas[0].razao_social)}
            </p>

            <p className="details-title-cnpj">
              {formatDocument(resultados_dividas[0].cnpj)}
            </p>
          </div>

          <div className="details-title-separator" />
          <div className="details-title-main">
            <div className="results-row-cnae-container4">
              <p className="cnae-title">
                {arrumatexto(resultados_dividas[0].nome_fantasia) || " - "}
              </p>
              <div className="primary-cnpj_status primary-razao-cnpj"></div>
            </div>

            <div className="details-title-status">
              <span>
                {mat_fil_extenso(
                  resultados_dividas[0].nm_matriz_filial.split(" ")[0]
                )}
              </span>
              <span>
                {sit_cad_extenso(resultados_dividas[0].situacao_cadastral_nome)}
              </span>
            </div>
          </div>
          <div className="details-title-separator" />
          <div className="details-title-location">
            <p className="details-title-municipio">
              {arrumatexto(resultados_dividas[0].municipio)}
            </p>
            <p className="details-title-uf">
              {arrumatexto(states[resultados_dividas[0].uf].name)}
            </p>
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
                      <h1>Informações</h1>
                    </div>
                    <div className="details-inner-left-description">
                      <div className="details-grid-five">
                        <span>
                          <p className="details-inner-left-description-title">
                            Descrição
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_dividas[0].description || "-"}
                          </p>
                        </span>
                      </div>

                      <div className="details-grid-one">
                        <span>
                          <p className="details-inner-left-description-title">
                            Abertura
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_dividas[0].data_inicio || "-"}
                          </p>
                        </span>
                        <span>
                          <p className="details-inner-left-description-title">
                            Receita
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_dividas[0].receita || "-"}
                          </p>
                        </span>
                        <span>
                          <p className="details-inner-left-description-title">
                            Funcionarios
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_dividas[0].num_funcionarios || "-"}
                          </p>
                        </span>
                        <span>
                          <p className="details-inner-left-description-title">
                            Natureza Jurídica
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {arrumatexto(
                              resultados_dividas[0].natureza_juridica
                            ) || "-"}
                          </p>
                        </span>
                      </div>
                      <div className="details-grid-five">
                        <span>
                          <p className="details-inner-left-description-title">
                            Status
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_dividas[0].Status || "-"}
                          </p>
                        </span>
                      </div>

                      <div className="details-grid-two">
                        <span>
                          <p className="details-inner-left-description-title">
                            Porte
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {arrumatexto(resultados_dividas[0].porte) || "-"}
                          </p>
                        </span>
                        <span>
                          <p className="details-inner-left-description-title">
                            MEI
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_dividas[0].microempreendedor_individual ||
                              "-"}
                          </p>
                        </span>
                        <span>
                          <p className="details-inner-left-description-title">
                            Simples
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {arrumatexto(resultados_dividas[0].simples_nacional) ||
                              "-"}
                          </p>
                        </span>
                        {/*					<div className="details-grid-five">
												<span>
													<p className="details-inner-left-description-title">Ações</p>
													<p className="details-inner-left-description-subtitle">{resultados_dividas[0].acoes || "-"}</p>
												</span>
											</div> */}
                      </div>
                    </div>
                  </div>

                  <div className="details-left-border details-left-contato">
                    <div className="details-left-title">
                      <h1>Contato</h1>
                    </div>
                    <img
                      src={contatoIcon}
                      alt="Contato"
                      className="details-left-icon"
                    />

                    <div className="details-inner-left-description">
                      <div className="details-grid-three">
                        <span>
                          <p className="details-inner-left-description-title">
                            Telefone
                          </p>
                          <span className="details-inner-left-description-subtitle details-phone">
                            {!is_info_updated ? (
                              <p>
                                Atualizando... <Loading />
                              </p>
                            ) : updated_phone === "Not found" ? null : (
                              <>
                                <p>{updated_phone}</p>
                              </>
                            )}
                            <p>{resultados_dividas[0].ddd_telefone_1}</p>
                            <p>{resultados_dividas[0].ddd_telefone_2}</p>
                          </span>
                        </span>
                        <span></span>
                        <span>
                          <p className="details-inner-left-description-title">
                            E-mail
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {resultados_dividas[0].email.toLowerCase() || "-"}
                          </p>
                        </span>
                        <span>
                          <p className="details-inner-left-description-title">
                            Site
                          </p>
                          <p
                            className="details-inner-left-description-subtitle"
                            style={{ wordBreak: "break-all" }}
                          >
                            {!is_info_updated ? (
                              <Loading />
                            ) : updated_url === "Not found" ? (
                              <p>{resultados_dividas[0].website}</p>
                            ) : (
                              <a
                                href={updated_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {updated_url}
                              </a>
                            )}
                          </p>
                        </span>
                      </div>
                      <div className="details-grid-four">
                        <span>
                          <p className="details-inner-left-description-title">
                            Endereço
                          </p>
                          <p className="details-inner-left-description-subtitle">
                            {arrumatexto(
                              resultados_dividas[0].descricao_tipo_logradouro
                            )}{" "}
                            {arrumatexto(resultados_dividas[0].logradouro)},{" "}
                            {resultados_dividas[0].numero}, Bairro{" "}
                            {arrumatexto(resultados_dividas[0].bairro)}, CEP -{" "}
                            {formatDocument(resultados_dividas[0].cep)},{" "}
                            {resultados_dividas[0].municipio} -{" "}
                            {resultados_dividas[0].uf}
                          </p>
                          {/*	{!is_info_updated ? null : updated_address === "Not found" ? null : !showGoogleAddress ? (
														<button onClick={() => setShowGoogleAddress(true)} style={{ color: "black" }}>
															Validador Datafinder
														</button>
													) : (
														<div style={{ color: "black" }}>
															<p>Validador Datafinder: {updated_address}</p>
														</div>
													)}*/}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="details-inner-right-container">
				<div className="details-inner-right-upper">
                    <div className="details-cnaes">
                      <h1 className="details-cnaes-title">CNAEs</h1>
                      <img
                        src={businessIcon}
                        alt="Negócios"
                        className="details-right-business-icon"
                      />
                      <div className="details-cnaes-map-container">
                        {cnaes && cnaes.length > 0
                          ? cnaes.map((cnae, index) => {
                              return (
                                <div className="details-single-container">
                                  <p>
                                    <span className="details-cnae-index">
                                      {index + 1}
                                    </span>{" "}
                                    <span className="details-cnaes-code">
                                      {cnae.code}
                                    </span>
                                  </p>
                                  <p className="details-cnae-description">
                                    {cnae.description}
                                  </p>
                                </div>
                              );
                            })
                          : null}
                      </div>
                      {cnaes.length > 2 ? (
                        cnaes.length < 3 ? (
                          <div
                            onClick={() => setCnaes(cnaesLoaded)}
                            className="details-cnae-button"
                          >
                            Ver mais{" "}
                            <span className="details-cnae-index">+</span>
                          </div>
                        ) : (
                          <div
                            onClick={() =>
                              setCnaes(cnaesLoaded && cnaesLoaded.slice(0, 2))
                            }
                            className="details-cnae-button"
                          >
                            Ver menos{" "}
                            <span className="details-cnae-index">-</span>
                          </div>
                        )
                      ) : null}
                    </div>
                    <div className="details-sede-capital">
                      <div className="details-sede-container">
                        <div className="details-capital-icon">
                          <img src={capitalIcon} alt="Prédio" />
                        </div>
                        <div className="details-sede-description">
                          <h2>Quantidade de Dívidas</h2>
                          <h3>{resultados_dividas[0].qtd_dividas || "-"}</h3>
                          <h2>Irregulares</h2>
                          <h3>{resultados_dividas[0].divida_sit_geral_iregular_estatisticas || "-"}</h3>
                          <h2>Regularizadas</h2>
                          <h3>{resultados_dividas[0].divida_sit_geral_regular_estatisticas || "-"}</h3>
                        </div>
                      </div>

                      <div className="details-capital-container">
                        <div className="details-capital-icon">
                          <img src={capitalIcon} alt="Sifrão" />
                        </div>
                        <div className="details-capital-description">
                          <h2>Valor Total Devido </h2>
                          <h2>
						  {(resultados_dividas[0].valor_consolidado_total &&
                              resultados_dividas[0].valor_consolidado_total.toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )) ||
                              "-"}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  {detalhes_dividas && detalhes_dividas.length > 0 && (
                    <div
                      className="details-inner-right-lower"
                      style={{ marginTop: "30px" }}
                    >
                      <h1>Dívidas</h1>

                      <img
                        src={socioIcon}
                        alt="Sócios"
                        className="details-right-socios-icon"
                      />

                      <div className="details-socios-container">
                        {detalhes_dividas.map((socio, index) => {
                          return (
                            <div className="details-socio-container">
                              <div className="details-socio-decorator" />
                              <div className="details-socio-content">
                                <h1 key={index} className="details-socio-name">
                                  {(socio.valor_consolidado &&
                                    parseFloat(
                                      socio.valor_consolidado
                                    ).toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })) ||
                                    "-"}
                                </h1>
                                <div className="details-socio-info-container">
                                  <span
                                    style={{
                                      textTransform: "capitalize",
                                      maxWidth: "12rem",
                                    }}
                                  >
                                    {socio.numero_inscricao &&
                                      `Inscrição: ${socio.numero_inscricao}`}{" "}
                                  </span>
                                  <p> </p>
                                  <span
                                    style={{
                                      textTransform: "capitalize",
                                      maxWidth: "12rem",
                                      marginLeft: "1rem",
                                    }}
                                  >
                                    {socio.age_divida &&
                                      `Idade:   ${socio.age_divida} Anos`}{" "}
                                  </span>
                                </div>
                                <div className="details-socio-info-container">
                                  <span
                                    style={{
                                      textTransform: "capitalize",
                                      maxWidth: "12rem",
                                    }}
                                  >
                                    {arrumatexto(socio.nome_devedor) || null}
                                  </span>
                                  <span className="details-socio-separator">
                                    /
                                  </span>
                                  <span>{tipodivida_extenso(socio.sit_geral)}</span>

                                  <span className="details-socio-separator">
                                    /
                                  </span>
                                  <span style={{ marginLeft: "0.3rem" }}>
                                    {socio.situacao_inscricao}
                                  </span>
                                </div>
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

export default memo(DividasDetailsFile);
