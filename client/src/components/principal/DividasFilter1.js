/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useState } from "react";
import states from "../../utils/states.json";
import axios from "axios";
import { Select, Input, ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
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

import { tagRender } from "../../utils/tag-render";

const cache = {};

//ARRUMA TEXTO

//ARRUMA TEXTO

const getResult = async (path) => {
  try {
    if (cache[path]) return cache[path];

    const { data } = await axios.get(path);

    cache[path] = data;

    return data;
  } catch (e) {
    console.error(`Loading error path [${path}]`, e);
    return [];
  }
};

const DividasFilter1 = ({ formData, setFormData, isMinimum, showMinimum }) => {
  const [cnaes, setCnaes] = useState([]);
  const [situacoesCadastrais, setSituacoesCadastrais] = useState([]);
  const [porteEmpresas, setPorteEmpresas] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [situacao_divida, setSitDivida] = useState([]);
  const [isLoadingCities, setLoadingCities] = useState(false);
  const [tipo_devedor, settipo_devedor] = useState([]);
  const [tipo_situacao_inscricao, settipo_situacao_inscricao] = useState([]);
  const [sit_geral, setsit_geral] = useState([]);
  const [tipo_divida, settipo_divida] = useState([]);
  const [indicador_ajuizado, setindicador_ajuizado] = useState([]);

  const allRanges = document.querySelectorAll(".range-wrap");
  allRanges.forEach((wrap) => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });

  function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  }

  useEffect(() => {
    (async () => {
      const [
        cnaesRes,
        sitCad,
        porEmp,
        sitdivida,
        tipdev,
        tipositinsc,
        sitger,
        tipdiv,
        indajuizado,
      ] = await Promise.all(
        [
          "/cnaes",
          "/situacoes-cadastrais",
          "/porte-empresas",
          "/sit-divida",
          "/tipo_devedor",
          "/tipo_situacao_inscricao",
          "/sit_geral",
          "/tipo_divida",
          "/indicador_ajuizado",
        ].map(getResult)
      );

      setCnaes(cnaesRes);
      setSituacoesCadastrais(sitCad);
      setPorteEmpresas(porEmp);
      setSitDivida(sitdivida);
      settipo_devedor(tipdev);
      settipo_situacao_inscricao(tipositinsc);
      setsit_geral(sitger);
      settipo_divida(tipdiv);
      setindicador_ajuizado(indajuizado);
    })();
  }, []);

  const loadCidades = async (e) => {
    if (e !== "") {
      setFormData({
        ...formData,
        uf: e,
        municipio: [],
      });
      setLoadingCities(true);
      const result = await getResult(`/cidades-por-estado/${e}`);
      setCidades(result);
      setLoadingCities(false);
    } else {
      setCidades([]);
      setFormData({
        ...formData,
        uf: "",
        municipio: [],
      });
    }
  };

  const { Option } = Select;

  console.log("-------------form data----------------: ", formData);

  const fieldFilter = (input, option) =>
    option.children &&
    option.children
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(
        input
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      );

  const ufFilter = (input, option) =>
    option.children &&
    option.children[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(
        input
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      );

  return (
    <ConfigProvider locale={ptBR}>
      <div>
        {!isMinimum ? (
          <div
            style={{
              fontSize: 10,
              color: showMinimum ? "red" : "gray",
              height: "15px",
            }}
          >
            *Preencha ao menos um campo obrigatório
          </div>
        ) : (
          <div style={{ height: "15px" }}></div>
        )}
        <div className="form-group">
          <h3
            className="titulo_h3"
            style={showMinimum ? { color: "red" } : { color: "black" }}
          >{`Razão Social${!isMinimum ? "*" : ""}`}</h3>
          <Input
            className="largura_select"
            name="razao_social"
            default=""
            value={formData.razao_social}
            allowClear
            onChange={(e) =>
              setFormData({ ...formData, razao_social: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <h3
            className="titulo_h3"
            style={showMinimum ? { color: "red" } : { color: "black" }}
          >{`CNPJ${!isMinimum ? "*" : ""}`}</h3>
          <Input
            className="largura_select"
            name="cnpj"
            default=""
            value={formData.cnpj}
            allowClear
            onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
          />
        </div>

        <div className="form-group">
          <h3
            className="titulo_h3"
            style={showMinimum ? { color: "red" } : { color: "black" }}
          >{`CPF${!isMinimum ? "*" : ""}`}</h3>
          <Input
            className="largura_select"
            name="cpf"
            default=""
            value={formData.cpf}
            allowClear
            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          />
        </div>

        <div className="form-group">
          <h3 className="titulo_h3">Número Inscrição Dívida</h3>
          <Input
            className="largura_select"
            name="numero_inscricao"
            value={formData.numero_inscricao}
            onChange={(e) =>
              setFormData({ ...formData, numero_inscricao: e.target.value })
            }
          />
        </div>

        {/*
				<div className="form-group">
					<h3 className="titulo_h3">Situação Cadastral</h3>
					<Select
						mode="multiple"
						showArrow
						allowClear
						tagRender={tagRender}
						style={{ width: "100%" }}
						name="cod_situacao_cadastral"
						onChange={e => {
							console.log(e)
							setFormData({
								...formData,
								["cod_situacao_cadastral"]: e,
							})
						}}
						showSearch
						optionFilterProp="children"
						filterOption={fieldFilter}
					>
						{situacoesCadastrais.map(c => (
							<option key={c.cod_sit_cad} value={c.cod_sit_cad}>
								{arrumatexto(c.nm_sit_cadastral)}
							</option>
						))}
					</Select>
				</div>
*/}

        <div className="form-group">
          <h3 className="titulo_h3">Porte da Empresa</h3>
          <Select
            mode="multiple"
            showArrow
            allowClear
            tagRender={tagRender}
            style={{ width: "100%" }}
            name="porte_empresa"
            onChange={(e) => {
              setFormData({
                ...formData,
                porte_empresa: e,
              });
            }}
            showSearch
            optionFilterProp="children"
            filterOption={fieldFilter}
          >
            {porteEmpresas.map((c) => (
              <option key={c.id} value={c.id}>
                {arrumatexto(c.nm_porte)}
              </option>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <h3 className="titulo_h3">Situação Geral</h3>
          <Select
            allowClear
            style={{ width: "100%" }}
            name="sit_geral"
            value={formData.sit_geral}
            onChange={(e) => setFormData({ ...formData, sit_geral: e })}
            showSearch
            optionFilterProp="children"
            filterOption={fieldFilter}
          >
            <option value="" />
            {sit_geral.map((c) => (
              <option key={c.sit_geral} value={c.sit_geral}>
                {arrumatexto(c.sit_geral)}
              </option>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <h3 className="titulo_h3">Situação Dívida</h3>
          <Select
            mode="multiple"
            showArrow
            allowClear
            tagRender={tagRender}
            style={{ width: "100%" }}
            name="tipo_situacao_inscricao"
            onChange={(e) => {
              setFormData({
                ...formData,
                tipo_situacao_inscricao: e,
              });
            }}
            showSearch
            optionFilterProp="children"
            filterOption={fieldFilter}
          >
            {tipo_situacao_inscricao.map((c) => (
              <option
                key={c.tipo_situacao_inscricao}
                value={c.tipo_situacao_inscricao}
              >
                {arrumatexto(c.tipo_situacao_inscricao)}
              </option>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <h3 className="titulo_h3">Tipo Dívida</h3>
          <Select
            mode="multiple"
            showArrow
            allowClear
            tagRender={tagRender}
            style={{ width: "100%" }}
            name="tipo_divida"
            onChange={(e) => {
              setFormData({
                ...formData,
                tipo_divida: e,
              });
            }}
            showSearch
            optionFilterProp="children"
            filterOption={fieldFilter}
          >
            {tipo_divida.map((c) => (
              <option key={c.tipo_divida} value={c.tipo_divida}>
                {arrumatexto(c.tipo_divida)}
              </option>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <h3 className="titulo_h3">Responsabilidade</h3>
          <Select
            mode="multiple"
            showArrow
            allowClear
            tagRender={tagRender}
            style={{ width: "100%" }}
            name="tipo_devedor"
            onChange={(e) => {
              setFormData({
                ...formData,
                tipo_devedor: e,
              });
            }}
            showSearch
            optionFilterProp="children"
            filterOption={fieldFilter}
            onClick={(e) => console.log(e.target.value)}
          >
            {tipo_devedor.map((c) => (
              <Option key={c.tipo_devedor} value={c.tipo_devedor}>
                {arrumatexto(c.tipo_devedor)}
              </Option>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <h3 className="titulo_h3">Ajuizado</h3>
          <Select
            allowClear
            style={{ width: "100%" }}
            name="indicador_ajuizado"
            value={formData.indicador_ajuizado}
            onChange={(e) =>
              setFormData({ ...formData, indicador_ajuizado: e })
            }
            showSearch
            optionFilterProp="children"
            filterOption={fieldFilter}
          >
            <option value="" />
            {indicador_ajuizado.map((c) => (
              <option key={c.indicador_ajuizado} value={c.indicador_ajuizado}>
                {arrumatexto(c.indicador_ajuizado)}
              </option>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <h3 className="titulo_h3">Pesquisa UF</h3>
          <Select
            style={{ width: "100%" }}
            allowClear
            name="uf"
            value={formData.uf}
            onChange={(e) => {
              e ? loadCidades(e) : setFormData({ ...formData, uf: "" });
            }}
            showSearch
            optionFilterProp="children"
            filterOption={ufFilter}
          >
            <Option value=""></Option>

            {Object.keys(states).map((acronym) => (
              <Option key={acronym} value={acronym}>
                {arrumatexto(states[acronym].name)}
                <span></span>
              </Option>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <h3 className="titulo_h3">Município</h3>
          <Select
            mode="multiple"
            allowClear
            showArrow
            tagRender={tagRender}
            style={{ width: "100%" }}
            name="municipio"
            onChange={(e) => {
              setFormData({
                ...formData,
                municipio: e,
              });
            }}
            value={formData.municipio}
            disabled={isLoadingCities}
            showSearch
            optionFilterProp="children"
            filterOption={fieldFilter}
          >
            {cidades.map(
              (c, index) =>
                c.cod_tom && (
                  <Option key={c.cod_tom + index} value={c.cod_tom}>
                    {arrumatexto(c.nome)}
                  </Option>
                )
            )}
          </Select>
        </div>

        {/*<h2 className="titulo_h3">Busca Por Data (Faixa)</h2>
				<div className="form-group">
					<h3 className="titulo_h3">Data Inicial</h3>
					<Input className="largura_select" type="date" id="start" name="data_inscricao_inicio" value={formData.data_inscricao_inicio} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />
				</div>

				<div className="form-group">
					<h3 className="titulo_h3">Data final</h3>
					<Input className="largura_select" type="date" id="end" name="data_inscricao_fim" value={formData.data_inscricao_fim} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />
								</div>*/}
      </div>
    </ConfigProvider>
  );
};

export default memo(DividasFilter1);
