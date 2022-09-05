/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo, useCallback, useEffect, useState } from "react"
import states from "../../utils/states.json"
import axios from "axios"
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

const cache = {}

//ARRUMA TEXTO


//ARRUMA TEXTO

const getResult = async path => {
  try {
    if (cache[path]) return cache[path]

    const { data } = await axios.get(path)

    cache[path] = data

    return data
  } catch (e) {
    console.error(`Loading error path [${path}]`, e)
    return []
  }
}

const ECAFilter = ({ formData, setFormData, isMinimum, showMinimum }) => {
  const [cnaes, setCnaes] = useState([])

  const [situacoesCadastrais, setSituacoesCadastrais] = useState([])
  const [porteEmpresas, setPorteEmpresas] = useState([])
  const [cnaesporclasse, setcnaesporclasse] = useState([])
  const [opcao_pelo_mei, setopcao_pelo_mei] = useState([])
  const [natureza_juridica, setNatureza_jur] = useState([])
  const [cidades, setCidades] = useState([])
  const [isLoadingCities, setLoadingCities] = useState(false)

  const [isLoadingcnaesporclasse, setLoadingcnaesporclasse] = useState(false)
  const [classecnae, setclassecnae] = useState([])

  useEffect(() => {
    ;(async () => {
      const [cnaesRes, sitCad, porEmp, classeCnae, opmei, natjur] = await Promise.all(["/cnaes", "/situacoes-cadastrais", "/porte-empresas", "/classecnae", "/sit-mei", "/natureza_juridica"].map(getResult))

      setCnaes(cnaesRes)

      setSituacoesCadastrais(sitCad)
      setPorteEmpresas(porEmp)
      setclassecnae(classeCnae)
      setopcao_pelo_mei(opmei)
      setNatureza_jur(natjur)
    })()
  }, [])

  const loadCidades = useCallback(
    async e => {
      if (e.target.value !== "") {
        setLoadingCities(true)
        const result = await getResult(`/cidades-por-estado/${e.target.value}`)
        setCidades(result)
        setLoadingCities(false)
      } else {
        setCidades([])
      }
    },
    [setCidades]
  )

  return (
    <div>
      {!isMinimum ? <div style={{ fontSize: 10, color: showMinimum ? "greenyellow" : "gray", height: "15px" }}>*Preencha ao menos um campo obrigatório</div> : <div style={{ height: "15px" }}></div>}

      <h3 className="titulo_h3" style={showMinimum ? { color: "greenyellow" } : { color: "white" }}>{`CNPJ${!isMinimum ? "*" : ""}`}</h3>
      <input className="largura_select" name="cnpj" value={formData.cnpj} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />

      <h3 className="titulo_h3" style={showMinimum ? { color: "greenyellow" } : { color: "white" }}>{`Razão Social${!isMinimum ? "*" : ""}`}</h3>
      <input className="largura_select" name="razao_social" value={formData.razao_social} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />

      <h3 className="titulo_h3" style={showMinimum ? { color: "greenyellow" } : { color: "white" }}>{`Valor patrimônio Acima de:${!isMinimum ? "*" : ""}`}</h3>
      <select className="largura_select" name="valor_patrimônio_acima" value={formData.valor_patrimônio_acima} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}>
        <option value="" />
        <option value="1000">1 Mil</option> <option value="10000">10 Mil</option> <option value="50000">50 Mil</option> <option value="100000">100 Mil</option> <option value="500000">500 Mil</option>
        <option value="1000000">1M</option>
        <option value="1000000">2,5M</option> <option value="5000000">5M</option> <option value="10000000">10M</option> <option value="20000000">20M</option> <option value="30000000">30M</option> <option value="40000000">40M</option> <option value="50000000">50M</option> <option value="100000000">100M</option> <option value="200000000">200M</option> <option value="300000000">300M</option> <option value="400000000">400M</option> <option value="500000000">500M</option>
      </select>

      <h3 className="titulo_h3" style={showMinimum ? { color: "greenyellow" } : { color: "white" }}>{`Valor patrimônio Abaixo de:${!isMinimum ? "*" : ""}`}</h3>
      <select className="largura_select" name="valor_patrimonio_abaixo" value={formData.valor_patrimonio_abaixo} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}>
        <option value="" />
        <option value="1000">1 Mil</option> <option value="10000">10 Mil</option> <option value="50000">50 Mil</option> <option value="100000">100 Mil</option> <option value="500000">500 Mil</option>
        <option value="1000000">1M</option>
        <option value="1000000">2,5M</option> <option value="5000000">5M</option> <option value="10000000">10M</option> <option value="20000000">20M</option> <option value="30000000">30M</option> <option value="40000000">40M</option> <option value="50000000">50M</option> <option value="100000000">100M</option> <option value="200000000">200M</option> <option value="300000000">300M</option> <option value="400000000">400M</option> <option value="500000000">500M</option>
      </select>

      <h3 className="titulo_h3">Situação Cadastral</h3>
      <select className="largura_select" name="cod_situacao_cadastral" value={formData.cod_situacao_cadastral} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}>
        <option value="" />
        {situacoesCadastrais.map(c => (
          <option key={c.cod_sit_cad} value={c.cod_sit_cad}>
            {arrumatexto(c.nm_sit_cadastral)}
          </option>
        ))}
      </select>

      <h3 className="titulo_h3">Porte da Empresa</h3>
      <select className="largura_select" name="porte_empresa" value={formData.porte_empresa} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}>
        <option value="" />
        {porteEmpresas.map(c => (
          <option key={c.id} value={c.id}>
            {arrumatexto(c.nm_porte)}
          </option>
        ))}
      </select>

      <h3 className="titulo_h3">Pesquisa UF</h3>
      <select
        className="largura_select"
        name="uf"
        value={formData.uf}
        onChange={e => {
          setFormData({ ...formData, [e.target.name]: e.target.value })
          loadCidades(e)
        }}
      >
        <option value="" />
        {Object.keys(states).map(acronym => (
          <option key={acronym} value={acronym}>
            {arrumatexto(states[acronym].name)}
          </option>
        ))}
      </select>

      <h3 className="titulo_h3">Município</h3>
      <select className="largura_select" name="municipio" value={formData.nome} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} disabled={isLoadingCities}>
        <option value="" />
        {cidades.map(c => (
          <option key={c.cod_tom} value={c.cod_tom}>
            {arrumatexto(c.nome)}
          </option>
        ))}
      </select>

      <h3 className="titulo_h3">{`Busca Por Data(Faixa):${!isMinimum ? "*" : ""}`}</h3>
      <h3 className="titulo_h3">Data Inicial</h3>

      <input type="date" id="start" name="data_inscricao_inicio" value={formData.data_inscricao_inicio} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />

      <h3 className="titulo_h3">Data final</h3>

      <input type="date" id="end" name="data_inscricao_fim" value={formData.data_inscricao_fim} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />
    </div>
  )
}

export default memo(ECAFilter)
