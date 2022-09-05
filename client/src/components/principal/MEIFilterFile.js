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

const MEIFilterFile = ({ formData, setFormData, isMinimum, showMinimum }) => {
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
      const [cnaesRes, cnaesRes1, sitCad, porEmp, classeCnae, opmei, natjur] = await Promise.all(["/cnaes", "/situacoes-cadastrais", "/porte-empresas", "/classecnae", "/sit-mei", "/natureza_juridica"].map(getResult))

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

  const loadcnaes = useCallback(
    async e => {
      if (e.target.value !== "") {
        setLoadingcnaesporclasse(true)
        const result = await getResult(`'/cnaeporclasse/${e.target.value}`)
        setcnaesporclasse(result)
        setLoadingcnaesporclasse(false)
      } else {
        setcnaesporclasse([])
      }
    },
    [setcnaesporclasse]
  )

  return (
    <div>
      {!isMinimum ? <div style={{ fontSize: 10, color: showMinimum ? "greenyellow" : "gray", height: "15px" }}>*Preencha ao menos um campo obrigatório</div> : <div style={{ height: "15px" }}></div>}

      <h3 className="titulo_h3" style={showMinimum ? { color: "greenyellow" } : { color: "white" }}>{`CNPJ${!isMinimum ? "*" : ""}`}</h3>
      <input className="largura_select" name="cnpj" default="" value={formData.cnpj} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />

      <h3 className="titulo_h3" style={showMinimum ? { color: "greenyellow" } : { color: "white" }}>{`CPF${!isMinimum ? "*" : ""}`}</h3>
      <input className="largura_select" name="cpf" default="" value={formData.cpf} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />

      <h3 className="titulo_h3" style={showMinimum ? { color: "greenyellow" } : { color: "white" }}>{`Razão Social / Nome Empresário${!isMinimum ? "*" : ""}`}</h3>
      <input className="largura_select" name="razao_social" value={formData.razao_social} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />

      <h3 className="titulo_h3" style={showMinimum ? { color: "greenyellow" } : { color: "white" }}>{`Nome Fantasia${!isMinimum ? "*" : ""}`}</h3>
      <input className="largura_select" name="nome_fantasia" value={formData.nome_fantasia} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} />

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
    

      <h3 className="titulo_h3">Natureza Juridica</h3>
      <select className="largura_select" name="natureza_juridica" value={formData.natureza_juridica} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}>
        <option value="" />
        {natureza_juridica.map(c => (
          <option key={c.cod_subclass_natureza_juridica} value={c.cod_subclass_natureza_juridica}>
            {arrumatexto(c.nm_subclass_natureza_juridica)}
          </option>
        ))}
      </select>

      <h3 className="titulo_h3">Idade Empresa maior que:</h3>
      <select className="largura_select" name="idade_empresa_maior" value={formData.idade_empresa_maior} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}>
        <option value="" />
        <option value="10">10 anos</option>
        <option value="20">20 anos</option>
        <option value="30">30 anos</option>
        <option value="40">40 anos</option>
        <option value="50">50 anos</option>
        <option value="60">60 anos</option>
        <option value="70">70 anos</option>
        <option value="80">80 anos</option>
        <option value="90">90 anos</option>
        <option value="100">100 anos</option>
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
    </div>
  )
}

export default memo(MEIFilterFile)
