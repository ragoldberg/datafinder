const isBlank = str => {
	return !str || (isString(str) && str.trim() === "")
}
const isString = val => typeof val === "string" || val instanceof String

const convertNullOrUndefinedToBlank = (str) => {
  if (str === undefined || str === null) return '';
  else return str;
}

class ProdutoDAO {
	constructor(_conexao) {
		this.conexao = _conexao()
	}

	execQuery(query, params) {
		return new Promise((resolve, reject) => {
			this.conexao.query(query, params, (error, result) => {
				if (error) reject(error)
				else resolve(result)
			})
		})
	}


//CONSULTAS FILTERS
	listar(callback) {
		let cidade = `São P`
		this.conexao.query(
			`SELECT *
from estabelecimentos 
where municipio = ? limit 20`,
			cidade,
			function (error, resultados) {
				if (error) console.log(error)
				callback(null, resultados)
			}
		)
	}

	fechar() {
		this.conexao.end()
	}
	
	cnaes() {
		return this.execQuery("select distinct nome, cod_cnae from tab_cnae_up Order by nome")
	}

	cnaes_ncm() {
		return this.execQuery("select distinct tab_cnae_up.nome, tab_cnae_up.cod_cnae , count(tab_ncm.ncm) as qtd from tab_cnae_up inner join tab_ncm on tab_ncm.classe_cnae=tab_cnae_up.cod_classe group by tab_cnae_up.nome Order by qtd DESC")
	}

	classecnae() {
		return this.execQuery("select distinct nm_classe, cod_classe  from tab_cnae_up where nm_classe is not null order by nm_classe")
	}



	DASH_Empresas_fudidas() {
		return this.execQuery("select * from empresas_fudidas;")
	}
	zero() {
		return this.execQuery("SELECT * from cnpj_zero;")
	}

	//CNAES

	cnae_from_secao(cod_setor) {
		return this.execQuery(
			`select *
    from tab_cnae_up
    where cod_setor = ? group by nome order by nome`,
			[cod_setor]
		)
	}

	secao_cnae() {
		return this.execQuery("select distinct(cod_setor),nm_setor from tab_cnae_up   order by nm_setor ASC")
      
	}
	divisao_cnae(secao_cnae) {
		return this.execQuery(
			`select distinct(cod_divisao),nm_divisao 
	from tab_cnae_up
	where cod_setor = ? order by nm_divisao`,
			[secao_cnae]
		)
	}
	grupo_cnae(divisao_cnae) {
		return this.execQuery(
			`select distinct(cod_grupo),nm_grupo 
    from tab_cnae_up
    where cod_divisao = ? order by nm_grupo`,
			[divisao_cnae]
		)
	}
	classe_cnae(grupo_cnae) {
		return this.execQuery(
			`select distinct(cod_classe),nm_classe 
    from tab_cnae_up
    where cod_grupo = ? order by nm_classe`,
			[grupo_cnae]
		)
	}
	cod_cnae(classe_cnae) {
		return this.execQuery(
			`select distinct(cod_cnae),nome
    from tab_cnae_up
    where cod_classe = ? order by nome`,
			[classe_cnae]
		)
	}

	// FIM CNAES

	sit_cadastral() {
		return this.execQuery("SELECT cod_sit_cad, nm_sit_cadastral from cnpj_status")
	}
	porteEmpresas() {
		return this.execQuery("select id, nm_porte from tab_porte_empresa")
	}

	cidadesPorUf(uf) {
		return this.execQuery(`SELECT cod_tom, nome, uf from tab_cidade where uf = ? order by nome`, [uf])
	}

	sit_mei() {
		return this.execQuery(`select nome as opcao_pelo_mei from tab_mei `)
	}

	sit_divida() {
		return this.execQuery("select distinct(situacao), id as situacoes_divida from tab_dividas_tipo_sit_insc")
	}

	seleciona_ncm() {
		return this.execQuery("select distinct(nome), id as situacoes_divida from tab_dividas_tipo_sit_insc")
	}

	tipo_devedor() {
		return this.execQuery(" select distinct(cnpj_dividas.tipo_devedor) FROM cnpj_dividas")
	}
	tipo_situacao_inscricao() {
		return this.execQuery(" select distinct(cnpj_dividas.tipo_situacao_inscricao) FROM cnpj_dividas")
	}
	sit_geral() {
		return this.execQuery(" select distinct(cnpj_dividas.sit_geral) FROM cnpj_dividas")
	}
	tipo_divida() {
		return this.execQuery(" select distinct(cnpj_dividas.tipo_divida) FROM cnpj_dividas")
	}
	indicador_ajuizado() {
		return this.execQuery(" select distinct(cnpj_dividas.indicador_ajuizado) FROM cnpj_dividas")
	}
	natureza_juridica() {
		return this.execQuery(" SELECT cod_natureza_juridica,nm_natureza_juridica,cod_subclass_natureza_juridica,nm_subclass_natureza_juridica FROM tab_natureza_juridica order by nm_subclass_natureza_juridica ")
	}
	qualificacao_socia() {
		return this.execQuery(` SELECT distinct(qualificacao_socia) as nm_quali_socia FROM cnpj_holdings  order by qualificacao_socia`)
	}

	qualificacao_socio() {
		return this.execQuery(` SELECT cod_qualificacao_responsavel_socio,
        upper(nm_qualificacao_responsavel_socio) as nm_qualificacao_responsavel_socio
        from tab_qualificacao_responsavel_socio
        order by nm_qualificacao_responsavel_socio`)
	}

	buscar_qualificacao_socio(callback) {
		this.conexao.query(
			`SELECT qualificacao,
   upper(nm_qualificacao_responsavel_socio) as nm_qualificacao_responsavel_socio
from tab_qualificacao_responsavel_socio
order by nm_qualificacao_responsavel_socio;`,
			function (error, qualification) {
				if (error) console.log(error)
				callback(null, qualification)
			}
		)
	}
 


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////MODULOS//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CNPJ

consultarCNPJ(isCount, { cnpj, cod_situacao_cadastral, razao_social, nome_fantasia, email, porte_empresa, natureza_juridica, opcao_pelo_simples, opcao_pelo_mei, cnae, pagina, municipio, uf, idade_empresa_maior, idade_empresa_menor,tem_divida,capital_social,order_capital_social,ordenacao, callback }) {
  pagina = isBlank(pagina) ? 1 : parseInt(pagina)

  if (pagina === 1) {
    pagina = 0
  } else {
    pagina--
    pagina = parseInt(pagina) * 20 + 1
  }

  //arruma ordenacao
if (ordenacao == 1|| ordenacao == null) {
ordenacao = ''
} else if (ordenacao == 2) {
ordenacao = 'CAST(empresas.capital as UNSIGNED) DESC,'
}else if (ordenacao == 3) {
ordenacao = 'faturamento DESC,'
} else {
ordenacao = ' '
} 

//fim ordenacao
  let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)
 
  
  let projection = isCount
    ? "count(DISTINCT(CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv))) as count_query"
    : `
    DISTINCT
    'consultarCNPJ',
    (CASE when tab_ie.inscricao_estadual is not null then group_concat(DISTINCT(tab_ie.inscricao_estadual)) else 'Sem Inscrição Estadual' END) as ie, group_concat(DISTINCT(tab_ie.uf_ie)) as ie_uf, (CASE WHEN tab_pcd.id is not null then 'PCD' else 'Nenhuma' END) as lei_pcd,
    (CASE when a.id is not null then 'beneficio_sim' else 'beneficio_nao' END) as beneficiado,
    (CASE when b.id is not null then 'com_sancao' else 'sem_sancao' END ) as sancoes,
    (CASE when c.id is not null then 'acordo_leniencia_sim' else 'acordo_leniencia_nao' END) as acordo_leniencia,
    (CASE when d.id is not null then 'esfl_impedidas_sim' else 'esfl_impedidas_nao' END) as esfl_impedidas, CONCAT(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv), tab_dados_economicos.id_empresa AS id_empresa_bolsa,
    (CASE WHEN tab_cad_fi.tp_fundo = 'fi' AND tab_cad_fi.sit <> 'cancelado' THEN CONCAT('FI - ', tab_dados_economicos.ativo, ' - Fundo Ativo') WHEN tab_cad_fi.tp_fundo = 'fi' AND tab_cad_fi.sit = 'cancelado' THEN CONCAT('FI - ', tab_dados_economicos.ativo, ' - Fundo Cancelado') WHEN tab_dados_economicos.ativo IS NULL THEN 'Não Listado B.V.' ELSE tab_dados_economicos.ativo END) AS ativo,
    (CASE WHEN tab_dados_economicos.principal_acionista IS NULL THEN 'Sem informações' WHEN tab_dados_economicos.principal_acionista = '-' THEN 'Sem informações' WHEN CAST(tab_dados_economicos.principal_acionista AS UNSIGNED) <> 0 THEN 'Sem informações' ELSE tab_dados_economicos.principal_acionista END) AS principal_acionista,
    tab_dados_economicos.nome AS nome_empresa_bolsa,
    tab_dados_economicos.cnpj_base AS cnpj_base_bolsa,
    tab_dados_economicos.pais_sede,
    tab_dados_economicos.setor_naics,
    tab_dados_economicos.setor_economatica,
    tab_dados_economicos.setor_economico_bovespa,
    tab_dados_economicos.subsetor_bovespa,
    tab_dados_economicos.segmento_bovespa,
    tab_dados_economicos.situacao_cvm,
    tab_dados_economicos.ativo_cancelado,
    tab_dados_economicos.moeda_balancos,
    tab_dados_economicos.data_do_balanco,
    (CASE WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '01' THEN 'R$ 360.000,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '03' THEN 'R$ 4.800.000,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '05' THEN 'R$ 0,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte IS NULL AND dados_simples.opcao_mei IS NULL AND dados_simples.opcao_simples IS NULL THEN 'R$ 0,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND dados_simples.opcao_mei = 's' THEN 'R$ 81.000,00' ELSE CONCAT('R$ ',CAST(tab_dados_economicos.receita_liquida_faturamento AS UNSIGNED)) END) AS faturamento,
    (CASE WHEN tab_dados_economicos.valor_mercado_empresa_2022 IS NULL THEN '0' ELSE CAST(tab_dados_economicos.valor_mercado_empresa_2022 AS UNSIGNED) END) AS valor_mercado_atual,
    (CASE WHEN tab_dados_economicos.enterprise_value_2022 IS NULL THEN '0' ELSE CAST(tab_dados_economicos.enterprise_value_2022 AS UNSIGNED) END) AS valor_real_empresa,
    CAST(tab_dados_economicos.ativo_tot AS UNSIGNED) AS total_ativos,
    CAST(tab_dados_economicos.patrimonio_liquido AS UNSIGNED) AS patrimonio_liquido_bolsa,
    CAST(tab_dados_economicos.receita_liquida_faturamento AS UNSIGNED) AS receita_liquida_faturamento,
    CAST(tab_dados_economicos.lucro_bruto AS UNSIGNED) AS lucro_bruto,
    CAST(tab_dados_economicos.ebitda AS UNSIGNED) AS ebitda,
    CAST(tab_dados_economicos.lucro_liquido AS UNSIGNED) AS lucro_liquido,
    CAST(tab_dados_economicos.vendas_acao_2021 AS UNSIGNED) AS vendas_acao_2021,
    CAST(tab_dados_economicos.valor_mercado_empresa_2022 AS UNSIGNED) AS valor_mercado_atual,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez16 AS UNSIGNED) AS valor_mercado_empresa_2016,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez17 AS UNSIGNED) AS valor_mercado_empresa_2017,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez18 AS UNSIGNED) AS valor_mercado_empresa_2018,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez19 AS UNSIGNED) AS valor_mercado_empresa_2019,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez20 AS UNSIGNED) AS valor_mercado_empresa_2020,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez21 AS UNSIGNED) AS valor_mercado_empresa_2021,
    CAST(tab_dados_economicos.valor_mercado_empresa_22 AS UNSIGNED) AS valor_mercado_empresa_2022,
    CAST(tab_dados_economicos.enterprise_value_2022 AS UNSIGNED) AS valor_real_empresa,
    CAST(tab_dados_economicos.enterprise_value_31dez17 AS UNSIGNED) AS valor_real_empresa_2017,
    CAST(tab_dados_economicos.enterprise_value_31dez18 AS UNSIGNED) AS valor_real_empresa_2018,
    CAST(tab_dados_economicos.enterprise_value_31dez19 AS UNSIGNED) AS valor_real_empresa_2019,
    CAST(tab_dados_economicos.enterprise_value_31dez20 AS UNSIGNED) AS valor_real_empresa_2020,
    CAST(tab_dados_economicos.enterprise_value_31dez21 AS UNSIGNED) AS valor_real_empresa_2021,
    CAST(tab_dados_economicos.enterprise_value_2022_1 AS UNSIGNED) AS valor_real_empresa_2022,
    CAST(tab_dados_economicos.ativo_circulante AS UNSIGNED) AS ativo_circulante,
    CAST(tab_dados_economicos.capex AS UNSIGNED) AS capex,
    empresas.razao AS razao_social,
    empresas.natureza AS codigo_natureza_juridica,
    empresas.qualificacao_pf AS qualificacao_responsavel,
    CAST(empresas.capital as UNSIGNED) AS capital_social_empresa1,
    CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS capital_social_empresa,
    (CASE WHEN empresas.porte IS NULL THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END) AS porte_empresa,
    (CASE WHEN empresas.porte IS NULL THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END) AS nm_porte,
    (CASE WHEN empresas.porte IS NULL THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END) AS porte,
    (CASE WHEN estabelecimentos.cnpj IS NULL THEN empresas.cnpj ELSE CONCAT(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv) END) AS cnpj,
    estabelecimentos.cnpj AS cnpj_base,
    estabelecimentos.cnpj_ordem,
    estabelecimentos.cnpj_dv,
    (CASE WHEN estabelecimentos.nome IS NULL THEN '*****' ELSE estabelecimentos.nome END) AS nome_fantasia,
    estabelecimentos.matriz_filial,
    estabelecimentos.situacao AS sit_cadastral,
    estabelecimentos.data_situacao,
    estabelecimentos.motivo_situacao,
    estabelecimentos.cidade_exterior,
    (CASE WHEN estabelecimentos.pais IS NULL THEN 'Brasil' ELSE estabelecimentos.pais END) AS pais,
    estabelecimentos.inicio_atividade,
    estabelecimentos.cnae_fiscal,
    estabelecimentos.cnae_secundario,
    estabelecimentos.tipo_logradouro AS descricao_tipo_logradouro,
    estabelecimentos.logradouro,
    estabelecimentos.numero,
    TRIM(estabelecimentos.complemento),
    TRIM(estabelecimentos.bairro),
    estabelecimentos.cep,
    (CASE WHEN estabelecimentos.uf IS NULL OR estabelecimentos.uf = '' THEN 'SUF' ELSE estabelecimentos.uf END) AS uf, (CASE WHEN tab_cidade.nome IS NULL THEN 'Exterior' ELSE (tab_cidade.nome) END) AS municipio,
    estabelecimentos.ddd_1,
    estabelecimentos.telefone_1,
    estabelecimentos.ddd_2,
    estabelecimentos.telefone_2,
    estabelecimentos.ddd_fax,
    estabelecimentos.numero_fax,
    TRIM(estabelecimentos.email),
    estabelecimentos.situacao_especial,
    estabelecimentos.data_situacao_especial,
    cnpj_status.nm_sit_cadastral AS sit_cadastral,
    (CASE WHEN CHAR_LENGTH(GETNUMBER(empresas.razao)) > 8 THEN UEXTRACTNONNUMBERSFROMSTRING(empresas.razao) ELSE (empresas.razao) END) AS rs_1,
    (CASE WHEN (SELECT COUNT(id) FROM tab_pcd) > 0 THEN (SELECT COUNT(id) FROM tab_pcd) ELSE 'Sem autuacoes PCD' END) AS pcd,
    (CASE WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei IS NULL THEN CAST('100' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei = 'n' THEN CAST('100' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei = 's' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei IS NULL THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei = 'n' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei = 's' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei IS NULL THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei = 'n' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei = 's' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei IS NULL THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei = 'n' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei = 's' THEN CAST('25' AS DECIMAL) WHEN estabelecimentos.situacao <> '2' THEN CAST('0' AS DECIMAL) ELSE 'Faltando' END) AS ranking,
    tab_matriz_filial.nm_matriz_filial,
    (CASE WHEN tab_cidade.nome IS NULL THEN 'Exterior' ELSE (tab_cidade.nome) END) AS municipio,
    (CASE WHEN dados_simples.opcao_mei IS NULL THEN 'Não' WHEN dados_simples.opcao_mei = 'n' THEN 'Não' WHEN dados_simples.opcao_mei = 's' THEN 'Sim' END) AS opcao_pelo_mei,
    tab_cnae_up.nome AS nm_cnae,
    tab_cnae_up.nm_setor AS setor,
    estabelecimentos.telefone_1 AS fone_1,
    YEAR(CURDATE()) - YEAR(inicio_atividade) AS age,
    (SELECT (CASE WHEN (SELECT CAST(id AS DECIMAL) FROM cnpj_dividas WHERE cnpj_dividas.cpf_cnpj = CONCAT(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv) LIMIT 1) IS NULL THEN 0 ELSE 1 END) ) AS tem_divida,
    tab_cad_fi.tp_fundo,
    tab_cad_fi.sit,
    tab_cad_fi.classe,
    estabelecimentos.email AS email

`

  let query = `SELECT  ${projection}
  FROM
  empresas
      LEFT JOIN
  estabelecimentos ON empresas.cnpj = estabelecimentos.cnpj
      LEFT JOIN
  dados_simples ON estabelecimentos.cnpj = dados_simples.cnpj
      LEFT JOIN
  cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao
      LEFT JOIN
  tab_matriz_filial ON tab_matriz_filial.id = estabelecimentos.matriz_filial
      LEFT JOIN
  tab_porte_empresa ON tab_porte_empresa.id = empresas.porte
      LEFT JOIN
  tab_cnae_up ON estabelecimentos.cnae_fiscal = tab_cnae_up.cod_cnae
      LEFT JOIN
  tab_cidade ON estabelecimentos.municipio = tab_cidade.cod_tom
      LEFT JOIN
  cnpj_dividas ON estabelecimentos.cnpj = cnpj_dividas.cpf_cnpj
      LEFT JOIN
  tab_dados_economicos ON tab_dados_economicos.cnpj_base = empresas.cnpj
      LEFT JOIN
  socios ON estabelecimentos.cnpj = socios.cnpj
      LEFT JOIN
  tab_cad_fi ON tab_cad_fi.cnpj_fundo = CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)
      LEFT JOIN
  tab_pcd ON tab_pcd.cnpj = CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)
      LEFT JOIN
  tab_ie ON tab_ie.cnpj = CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)

          left join autuacoes.tab_cnpj_beneficiado a
          on
         a.cnpj=CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)

          left join autuacoes.tab_cnpj_iniesus b
          on
         b.cpf_ou_cnpj_do_sancionado=CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)

          left join autuacoes.tab_cnpj_acordo_leniencia c
          on
         c.cnpj_do_sancionado=CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)

          left join autuacoes.tab_cnpj_esfl_impedidas d
          on
         d.cnpj_entidade=CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)
          
     
  
WHERE
  1 = 1
      AND estabelecimentos.situacao = '02'
      
     
`
  const params = []
  if (!isBlank(cnpj_base)) {
    query += "and estabelecimentos.cnpj = ? "
    params.push(cnpj_base)
  }
  if (!isBlank(cnpj_ordem)) {
    query += "and estabelecimentos.cnpj_ordem = ? "
    params.push(cnpj_ordem)
  }
  if (!isBlank(cnpj_dv)) {
    query += "and estabelecimentos.cnpj_dv = ? "
    params.push(cnpj_dv)
  }
  if (!isBlank(cod_situacao_cadastral)) {
    query += " and estabelecimentos.situacao in (?) "
    const cod_situacao_cadastral_array = cod_situacao_cadastral.split(",")
    params.push(cod_situacao_cadastral_array)
  }
  if (!isBlank(razao_social)) {
    query += " and empresas.razao LIKE ? "
    params.push(`${razao_social}%`)
  }
  if (!isBlank(nome_fantasia)) {
    query += " and estabelecimentos.nome LIKE ? "
    params.push(`${nome_fantasia}%`)
  }

  if (!isBlank(email)) {
    query += " and estabelecimentos.email LIKE ? "
    params.push(`${email}%`)
  }

  if (!isBlank(opcao_pelo_mei)) {
    query += " and (select (CASE when dados_simples.opcao_mei is null then 'n' else dados_simples.opcao_mei END)) = ? "
    params.push(opcao_pelo_mei)
  }
  if (!isBlank(porte_empresa)) {
    query += " and empresas.porte in (?) "
    const porte_empresa_array = porte_empresa.split(",")
    params.push(porte_empresa_array)
  }
  if (!isBlank(natureza_juridica)) {
    query += " and empresas.natureza in (?) "
    const natureza_juridica_array = natureza_juridica.split(",")
    params.push(natureza_juridica_array)
  }
  if (!isBlank(opcao_pelo_simples)) {
    query += " and dados_simples.opcao_simples = ? "
    params.push(opcao_pelo_simples)
  }

  if (!isBlank(cnae)) {
    query += " and estabelecimentos.cnae_fiscal = ? "
    params.push(cnae)
  }
  if (!isBlank(uf)) {
    query += " and estabelecimentos.uf = ? "
    params.push(uf)
  }
  if (!isBlank(municipio)) {
    query += " and estabelecimentos.municipio in (?) "
    const municipio_array = municipio.split(",")
    params.push(municipio_array)
  }
  if (!isBlank(idade_empresa_maior)) {
    query += " and YEAR(CURDATE()) - YEAR(inicio_atividade) >= ?  "
    params.push(idade_empresa_maior)
  }
  if (!isBlank(idade_empresa_menor)) {
    query += " and YEAR(CURDATE()) - YEAR(inicio_atividade) <= ?  "
    params.push(idade_empresa_menor)
  }

  if (!isBlank(capital_social)) {
    if (capital_social == 1 ) {
      query += " " 
    } else if (capital_social == 2 ){
      query += " and CAST(empresas.capital AS UNSIGNED) > 1 " 
    } else if (capital_social == 3 ){
      query += "  and CAST(empresas.capital AS UNSIGNED) = 0 " 
    }else {
      query += "  " 
    }

    params.push(capital_social)
  }
    
  


  console.log("consultarCNPJ")
  console.log("cnpj completo", cnpj)
  console.log("cnpj_full sem pontos:", cnpj_full)
  console.log("cnpj_base:", cnpj_base)
  console.log("cnpj_ordem:", cnpj_ordem)
  console.log("cnpj_dv:", cnpj_dv)
  console.log("order_capital_social:", order_capital_social)
 

  if (!isCount) query += `group by CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem)  ORDER BY ${ordenacao} tab_matriz_filial.nm_matriz_filial DESC ,ranking * 1 DESC LIMIT ${pagina}, 20 `
console.log(query)
  return this.execQuery(query, params)

}

buscar_detalhes_CNPJ(cnpj, callback) {
  let cnpj1 = cnpj.replace(".", "").replace("-", "").replace("/", "").slice(0, 8)

  let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)
 
  let projection = ` 
  'buscar_detalhes_cnpj',
  datalake.tab_links_linkedin.link as link_linkedin,
  datalake.tab_links_linkedin.nome as nome_linkedin,
  (CASE when tab_ie.inscricao_estadual is not null then group_concat(DISTINCT(tab_ie.inscricao_estadual)) else 'Sem Inscrição Estadual' END) as ie, 
  group_concat(DISTINCT(tab_ie.uf_ie)) as ie_uf, 
  (CASE WHEN tab_pcd.id is not null then 'PCD' else 'Nenhuma' END) as lei_pcd,
    (CASE when a.id is not null then 'beneficio_sim' else 'beneficio_nao' END) as beneficiado,
    (CASE when b.tipo_sancao is not null then 'com_sancao' else 'sem_sancao' END ) as sancoes,
    (CASE when c.id is not null then 'acordo_leniencia_sim' else 'acordo_leniencia_nao' END) as acordo_leniencia,
  @calculo_ativo :=date_sub( date_sub( date_sub( current_date, interval year( estabelecimentos.inicio_atividade ) - 1 year ), interval month( estabelecimentos.inicio_atividade ) - 1 month ), interval day( estabelecimentos.inicio_atividade ) - 1 day ) as calculo_ativo,
  @calculo_nao_ativo :=date_sub( date_sub( date_sub( data_situacao, interval year( estabelecimentos.inicio_atividade ) - 1 year ), interval month( estabelecimentos.inicio_atividade ) - 1 month ), interval day( estabelecimentos.inicio_atividade ) - 1 day ) as calculo_nao_ativo,
  @calculo_alteracao :=date_sub( date_sub( date_sub( current_date, interval year( estabelecimentos.data_situacao ) - 1 year ), interval month( estabelecimentos.data_situacao ) - 1 month ), interval day( estabelecimentos.data_situacao ) - 1 day ) as calculo_alteracao,
  (case when char_length(getnumber(empresas.razao)) > 8 then uextractnonnumbersfromstring(empresas.razao) else (empresas.razao) end) as rs_1,
  (case when year(curdate()) - year(estabelecimentos.data_situacao) is not null and estabelecimentos.situacao ='08' then concat(year(curdate()) - year(estabelecimentos.data_situacao),' ano(s) baixada. funcionou por ', year(estabelecimentos.data_situacao) - year(estabelecimentos.inicio_atividade), ' anos') else concat('aberta a ', year(curdate()) - year(estabelecimentos.inicio_atividade),' anos. ', year(curdate()) - year(estabelecimentos.data_situacao),' anos desde ultima atualização') end) as status,
  (case when estabelecimentos.cnpj is null then empresas.cnpj else concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) end) as cnpj,
  (case when estabelecimentos.pais is null then 'brasil' else estabelecimentos.pais end) as pais,
  (case when estabelecimentos.nome is null or '' then '*****' else estabelecimentos.nome end) as nome_fantasia,
  concat(estabelecimentos.cnae_secundario, ' - ', group_concat(distinct b.nome)) as cnae_secundario_full,
  estabelecimentos.matriz_filial as identificador_matriz_filial,
  estabelecimentos.situacao as situacao_cadastral,
  estabelecimentos.data_situacao as data_situacao_cadastral,
  estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
  estabelecimentos.cidade_exterior as nm_cidade_exterior,
  estabelecimentos.pais as cod_pais,
  estabelecimentos.cnae_secundario,
  estabelecimentos.inicio_atividade as data_inicio_atividade,
  estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
  (case when tab_cidade.nome is null then 'exterior' else tab_cidade.nome end) as municipio,
  (case when tab_cidade.nome is null then 'exterior' else (tab_cidade.nome) end) as municipio,
  estabelecimentos.municipio as codigo_municipio,
  (case when estabelecimentos.ddd_1 ='' and estabelecimentos.telefone_1 =''  then tab_serp.númerodetelefone when estabelecimentos.ddd_1 is not null and estabelecimentos.telefone_1 is not null then concat(estabelecimentos.ddd_1,'-',estabelecimentos.telefone_1 ) else tab_serp.númerodetelefone end) as ddd_telefone_1,
  (case when estabelecimentos.ddd_2 is not null and estabelecimentos.telefone_2 is not null then concat(estabelecimentos.ddd_2,'-',estabelecimentos.telefone_2 ) end) as ddd_telefone_2,
  (case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_telefone_3,
  (case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_fax,
  estabelecimentos.email as correio_eletronico,
  tab_serp.domain,
  empresas.natureza as codigo_natureza_juridica,
  empresas.qualificacao_pf as qualificacao_responsavel,
  CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital_social_empresa,
  (case when empresas.porte is null then 'porte não declarado' else empresas.porte end) as porte_empresa,
  dados_simples.opcao_simples as opcao_pelo_simples,
  dados_simples.data_opcao_simples as data_opcao_pelo_simples,
  dados_simples.data_exclusao as data_exclusao_simples,
  dados_simples.opcao_mei as opcao_pelo_mei,
  (case when dados_simples.opcao_mei is null then 'não' when dados_simples.opcao_mei = 'n' then 'não' when dados_simples.opcao_mei = 's' then 'sim' end)as microempreendedor_individual,
  concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj,
  (case when estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos where cnpj like concat('${cnpj_base}' , '%')) = 0 then tab_matriz_filial.nm_matriz_filial when estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos where cnpj like concat('${cnpj_base}' , '%') and estabelecimentos.matriz_filial = 2) > 0 then concat(tab_matriz_filial.nm_matriz_filial, ' - ', ' filiais: ',(select count(1) from estabelecimentos where cnpj like concat( '${cnpj_base}' , '%') and estabelecimentos.matriz_filial = 2)) when estabelecimentos.matriz_filial = '2' then tab_matriz_filial.nm_matriz_filial else tab_matriz_filial.nm_matriz_filial end) as nm_matriz_filial,
  (case when char_length(getnumber(empresas.razao)) > 8 then uextractnonnumbersfromstring(empresas.razao) else (empresas.razao) end) as razao_social,
  (select cast(sum(case when (estabelecimentos.matriz_filial = 2) then 1 else 0 end)as decimal)) as filiais,
  cnpj_status.nm_sit_cadastral as situacao_cadastral,
  tab_situacao_cadastral.nm_situacao_cadastral as motivo_sit_cadastral,
  date_format(estabelecimentos.data_situacao, '%d/%m/%y') as data_atual_cadastral,
  estabelecimentos.cidade_exterior,
  tab_natureza_juridica.nm_subclass_natureza_juridica as natureza_juridica,
  date_format(estabelecimentos.inicio_atividade, '%d/%m/%y') as data_inicio,
  year(curdate()) - year(estabelecimentos.inicio_atividade) as age,
  estabelecimentos.cnae_fiscal as 'cnae_primario',
  tab_cnae_up.nome,
  estabelecimentos.logradouro,
  estabelecimentos.numero,
  trim(estabelecimentos.bairro),
  trim(estabelecimentos.complemento),
  estabelecimentos.cep,
  CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital,
  (CASE when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF' else estabelecimentos.uf END) as uf,
  estabelecimentos.telefone_1,
  estabelecimentos.telefone_2,
  estabelecimentos.numero_fax as 'fax',
  estabelecimentos.email as 'email1',
  (case when estabelecimentos.email is null and tab_serp.email is null then "sem e-mail cadastrado" when estabelecimentos.email is not null and tab_serp.email is null then estabelecimentos.email when estabelecimentos.email is not null and tab_serp.email is not null then concat(estabelecimentos.email, " ",tab_serp.email ) end)as email,
  tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio as qualificacao,
  CAST(empresas.capital as UNSIGNED) AS capital,
  tab_porte_empresa.nm_porte as porte,
  (case when dados_simples.opcao_simples is null then 'Não Optante' when dados_simples.opcao_simples = 'n' then 'Não Optante' when dados_simples.opcao_simples = 's' then 'Optante' end)as simples_nacional,
  estabelecimentos.data_situacao,
  estabelecimentos.motivo_situacao,
  tab_situacao_cadastral.nm_situacao_cadastral,
  (case when estabelecimentos.situacao = '02' then concat('funcionando desde ',date_format(estabelecimentos.inicio_atividade, '%y'), ', à ',year( @calculo_ativo ) - 1,' anos, ',month( @calculo_ativo ) - 1,' meses e ', day( @calculo_ativo ) - 1,' dias.' ,' ultima atualização à: ' ,year( @calculo_alteracao ) - 1,' anos, ',month( @calculo_alteracao ) - 1,' meses e ', day( @calculo_alteracao ) - 1,' dias' ) when estabelecimentos.situacao <> '2' then concat('foi aberta em: ',date_format(estabelecimentos.inicio_atividade, '%y'),', mas esta ',cnpj_status.nm_sit_cadastral,' desde ',date_format(estabelecimentos.data_situacao, '%y'),'. funcionou por: ',year( @calculo_nao_ativo ) - 1,' anos, ',month( @calculo_nao_ativo ) - 1,' meses e ', day( @calculo_nao_ativo ) - 1, ' dias. ultima alteração à: ' , year( @calculo_alteracao ) - 1,' anos, ',month( @calculo_alteracao ) - 1,' meses e ', day( @calculo_alteracao ) - 1,' dias, ' ) end) as status,
  tab_serp.cnpj_full,
  tab_serp.data_added,
  tab_serp.cnpj_base,
  tab_serp.cnpj_ordem,
  tab_serp.cnpj_dv,
  tab_serp.receita,
  tab_serp.num_funcionarios,
  tab_serp.website,
  tab_serp.ceo,
  tab_serp.acoes,
  tab_serp.fundadores,
  tab_serp.atendimento_cliente,
  tab_serp.presidente,
  tab_serp.subsidiarias,
  (case when tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.image_url is not null then (tab_serp.image_url) end)as image_url,
  tab_serp.sub_title,
  tab_serp.recursos,
  tab_serp.rating,
  tab_serp.faturamento as erp_fat,
  CONCAT('R$ ',FORMAT(CAST(tab_serp.faturamento as UNSIGNED),2,'de_DE')) AS  faturamento,
  tab_serp.banner,
  tab_serp.description,
  (case when tab_serp.logo_url is not null and tab_serp.logo_url <> '' then tab_serp.logo_url when tab_serp.logo_url is null and tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.logo_url = '' and tab_serp.image_url = '' then '../../img/defaultLOGO.png' when tab_serp.logo_url is null and tab_serp.image_url is not null then tab_serp.image_url when tab_serp.logo_url = '' and tab_serp.image_url <> '' then tab_serp.image_url else '../../img/defaultLOGO.png' end) as logo_url,
  tab_serp.tagline,
  tab_serp.followercount,
  tab_serp.site,
  tab_serp.setor,
  tab_serp.tamanhodaempresa,
  tab_serp.sede,
  tab_serp.tipo,
  tab_serp.companyaddress,
  tab_serp.maincompanyid,
  tab_serp.industrycode,
  tab_serp.salesnavigatorlink,
  tab_serp.employeesonlinkedin,
  tab_serp.query,
  tab_serp.timestamp,
  tab_serp.companyurl,
  tab_serp.companyurl as updated_url,
  tab_serp.fundadaem,
  tab_serp.especializações,
  tab_serp.relatedcompanies1,
  tab_serp.relatedcompanies2,
  tab_serp.relatedcompanies3,
  tab_serp.relatedcompanies4,
  tab_serp.relatedcompanies5,
  tab_serp.relatedcompanies6,
  tab_serp.relatedcompanies7,
  tab_serp.relatedcompanies8,
  tab_serp.relatedcompanies9,
  tab_serp.relatedcompanies10,
  tab_serp.isclaimable,
  tab_serp.savedimg,
  tab_serp.númerodetelefone,
  tab_serp.date_updatedname,
  cnpj_status.nm_sit_cadastral as situacao_cadastral_nome,
  tab_serp.date_serpsearch
  

 `
  let query = `SELECT  ${projection}

  from
  empresas
  left join estabelecimentos on empresas.cnpj=estabelecimentos.cnpj
  left join dados_simples on estabelecimentos.cnpj=dados_simples.cnpj
  left join tab_qualificacao_responsavel_socio on tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf
  left join tab_matriz_filial on tab_matriz_filial.id = estabelecimentos.matriz_filial
  left join cnpj_status on cnpj_status.cod_sit_cad = estabelecimentos.situacao
  left join tab_natureza_juridica on tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
  left join tab_cnae_up on tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
  left join tab_cnae_up b on estabelecimentos.cnae_secundario like concat('%', b.cod_cnae, '%')
  left join tab_opcao_simples on tab_opcao_simples.cod = dados_simples.opcao_simples
  left join tab_porte_empresa on tab_porte_empresa.id = empresas.porte
  left join tab_situacao_cadastral on estabelecimentos.motivo_situacao = tab_situacao_cadastral.cod_situacao_cadastral
  left join tab_cidade on tab_cidade.cod_tom=estabelecimentos.municipio
  left join tab_serp on empresas.cnpj=tab_serp.cnpj_base
  LEFT JOIN
  cnpj_dividas ON estabelecimentos.cnpj = cnpj_dividas.cpf_cnpj
  LEFT JOIN
  tab_pcd ON tab_pcd.cnpj = CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)
      LEFT JOIN
  tab_ie ON tab_ie.cnpj = CONCAT(estabelecimentos.cnpj,
          estabelecimentos.cnpj_ordem,
          estabelecimentos.cnpj_dv)
  left join autuacoes.tab_cnpj_beneficiado a
  on
 a.cnpj=CONCAT(estabelecimentos.cnpj,
  estabelecimentos.cnpj_ordem,
  estabelecimentos.cnpj_dv)

  left join autuacoes.tab_cnpj_iniesus b
  on
 b.cpf_ou_cnpj_do_sancionado=CONCAT(estabelecimentos.cnpj,
  estabelecimentos.cnpj_ordem,
  estabelecimentos.cnpj_dv)

  left join autuacoes.tab_cnpj_acordo_leniencia c
  on
 c.cnpj_do_sancionado=CONCAT(estabelecimentos.cnpj,
  estabelecimentos.cnpj_ordem,
  estabelecimentos.cnpj_dv)

  left join autuacoes.tab_cnpj_esfl_impedidas d
  on
 d.cnpj_entidade=CONCAT(estabelecimentos.cnpj,
  estabelecimentos.cnpj_ordem,
  estabelecimentos.cnpj_dv)
  left join datalake.tab_links_linkedin on
  datalake.tab_links_linkedin.nome = TRIM(REPLACE(empresas.razao,'LTDA',''))



  where 1 = 1

`

  const params = []
  if (!isBlank(cnpj_base)) {
    query += "and estabelecimentos.cnpj = ? "
    params.push(cnpj_base)
  }
  if (!isBlank(cnpj_ordem)) {
    query += "and estabelecimentos.cnpj_ordem = ? "
    params.push(cnpj_ordem)
  }
  if (!isBlank(cnpj_dv)) {
    query += "and estabelecimentos.cnpj_dv = ? "
    params.push(cnpj_dv)
  }

  console.log("buscar_detalhes_CNPJ")
  console.log("cnpj completo", cnpj)
  console.log("cnpj_full sem pontos:", cnpj_full)
  console.log("cnpj_base:", cnpj_base)
  console.log("cnpj_ordem:", cnpj_ordem)
  console.log("cnpj_dv:", cnpj_dv)
  // console.log("buscar_detalhes_CNPJ", query)

  return this.conexao.query(query, params, callback)
}


buscar_listar_socios(cnpj, callback) {
  let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)

  let projection = ` 
 

  'buscar_listar_socios',
  CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj_full, empresas.razao as razao_social,
  (CASE when socios.cnpj is null then '' WHEN socios.nome is null then '' else socios.identificador_socio END) AS identificador_socio,
 
  b.cpf as cpf_bolsafamilia,
  b.nome as nome_bolsafamilia,
 
  (CASE when c.cpf is not null then CONCAT(c.descricao_funcao,' ',c.nome_orgao, ' : ' , c.data_inicio_exercicio, ' > ', c.data_fim_exercicio) else '' END) AS pessoa_publica,
  (CASE when a.id is not null then 'Beneficiado Aux. Emer.' when b.id is not null then 'Beneficiado Bolsa Fam' when a.id is not null and b.id is not null then 'Beneficiado Aux. Emer. e Bolsa Fam' when a.id is null and b.id is null then 'Nao Beneficiado' else '' END) beneficiado,
  (CASE when socios.cnpj is null then '' WHEN socios.nome is not null THEN (select DISTINCT socios.nome group by socios.nome) END) AS nome_socio, (CASE when socios.cnpj is null then '' WHEN socios.nome is not null THEN socios.cpf_cnpj END) AS cpf_cnpj,
  (CASE when socios.cnpj is null then '' WHEN socios.nome is not null THEN socios.cpf_cnpj END) AS cnpj_cpf_socio,
  (CASE when socios.cnpj is null then '' WHEN socios.nome is not null THEN DATE_FORMAT(socios.data_entrada_sociedade,'%d/%m/%Y') END) AS data_entrada_sociedade,
  (CASE when socios.cnpj is null then '' WHEN socios.nome is not null THEN nm_qualificacao_responsavel_socio END) AS nm_qualificacao_responsavel_socio,
  (CASE when socios.cnpj is null then '' WHEN socios.nome is not null and estabelecimentos.situacao = '08' THEN (select ABS(YEAR(estabelecimentos.data_situacao) - YEAR(socios.data_entrada_sociedade))) WHEN socios.nome is not null and estabelecimentos.situacao <> '08' THEN YEAR(CURDATE()) - YEAR(socios.data_entrada_sociedade) END) AS tempo_sociedade
  
  
  

 `
  let query = `SELECT  ${projection}


  FROM estabelecimentos
  left join socios on estabelecimentos.cnpj=socios.cnpj
  left join empresas on estabelecimentos.cnpj=empresas.cnpj
  left join dados_simples on estabelecimentos.cnpj=dados_simples.cnpj
  left join tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = socios.qualificacao
  left join autuacoes.tab_aux_emer a on a.cpf_beneficiario = socios.cpf_cnpj and a.nome_beneficiario = socios.nome
  left join autuacoes.tab_bolsafamilia b on b.cpf = socios.cpf_cnpj and b.nome = socios.nome
  left join autuacoes.tab_pessoas_publicas c on c.cpf = socios.cpf_cnpj and c.nome_pep = socios.nome
  where 1 = 1


`

  const params = []
  if (!isBlank(cnpj_base)) {
    query += "and estabelecimentos.cnpj = ? "
    params.push(cnpj_base)
  }
  if (!isBlank(cnpj_ordem)) {
    query += "and estabelecimentos.cnpj_ordem = ? "
    params.push(cnpj_ordem)
  }
  if (!isBlank(cnpj_dv)) {
    query += "and estabelecimentos.cnpj_dv = ? group by nome_socio "
    params.push(cnpj_dv)
  }

  console.log("buscar_listar_socios")
  console.log("cnpj completo", cnpj)
  console.log("cnpj_full sem pontos:", cnpj_full)
  console.log("cnpj_base:", cnpj_base)
  console.log("cnpj_ordem:", cnpj_ordem)
  console.log("cnpj_dv:", cnpj_dv)
  // console.log('select buscar_listar_socios: ',query)
  return this.conexao.query(query, params, callback)
}

//FIM CNPJ
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HOLDINGS

consultarHOLDINGS(isCount, { cnpj_socia, cod_situacao_cadastral, razao_social, email, porte_empresa, natureza_juridica, opcao_pelo_simples, cnae, qualificacao_socia, pagina, municipio, uf }) {
  pagina = isBlank(pagina) ? 1 : parseInt(pagina)

  if (pagina === 1) {
    pagina = 0
  } else {
    pagina--
    pagina = parseInt(pagina) * 20 + 1
  }
  let cnpj_socia1 = cnpj_socia.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let projection = isCount
    ? "count(distinct(cnpj_holdings.cnpj_socia)) as count_query"
    : `
    DISTINCT
    'consultarHOLDINGS',
    (CASE 
      when tab_ie.inscricao_estadual is not null then group_concat(DISTINCT(tab_ie.inscricao_estadual))
      else 'Sem Inscrição Estadual'
      
      END) as ie,
    
       
          group_concat(DISTINCT(tab_ie.uf_ie)) as ie_uf,
          (CASE 
            WHEN tab_pcd.id is not null then 'PCD'
            else 'Nenhuma'
            
            END) as lei_pcd,
          
    (CASE
      when a.id is not null then 'beneficio_sim'
      else 'beneficio_nao'
      END) as beneficiado,
      ( CASE
        when b.id is not null then 'com_sancao'
        else 'sem_sancao'
        END
        
        ) as sancoes,
    
        (CASE
          when c.id is not null then 'acordo_leniencia_sim'
          else 'acordo_leniencia_nao'
          
          END) as acordo_leniencia,
    
          (CASE
            when d.id is not null then 'esfl_impedidas_sim'
            else 'esfl_impedidas_nao'
            END) as esfl_impedidas,
    (cnpj_holdings.cnpj_socia) AS cnpj,
    YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) AS age,
    (CASE
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 <> ''
                AND estabelecimentos.email <> ''
                AND dados_simples.opcao_mei IS NULL
        THEN
            CAST('100' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 <> ''
                AND estabelecimentos.email <> ''
                AND dados_simples.opcao_mei = 'n'
        THEN
            CAST('100' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 <> ''
                AND estabelecimentos.email <> ''
                AND dados_simples.opcao_mei = 's'
        THEN
            CAST('75' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 <> ''
                AND estabelecimentos.email = ''
                AND dados_simples.opcao_mei IS NULL
        THEN
            CAST('75' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 <> ''
                AND estabelecimentos.email = ''
                AND dados_simples.opcao_mei = 'n'
        THEN
            CAST('75' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 <> ''
                AND estabelecimentos.email = ''
                AND dados_simples.opcao_mei = 's'
        THEN
            CAST('50' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 = ''
                AND estabelecimentos.email <> ''
                AND dados_simples.opcao_mei IS NULL
        THEN
            CAST('75' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 = ''
                AND estabelecimentos.email <> ''
                AND dados_simples.opcao_mei = 'n'
        THEN
            CAST('75' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 = ''
                AND estabelecimentos.email <> ''
                AND dados_simples.opcao_mei = 's'
        THEN
            CAST('50' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 = ''
                AND estabelecimentos.email = ''
                AND dados_simples.opcao_mei IS NULL
        THEN
            CAST('50' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 = ''
                AND estabelecimentos.email = ''
                AND dados_simples.opcao_mei = 'n'
        THEN
            CAST('50' AS DECIMAL)
        WHEN
            estabelecimentos.situacao = '02'
                AND estabelecimentos.telefone_1 = ''
                AND estabelecimentos.email = ''
                AND dados_simples.opcao_mei = 's'
        THEN
            CAST('25' AS DECIMAL)
        WHEN estabelecimentos.situacao <> '2' THEN CAST('0' AS DECIMAL)
        ELSE 'Faltando'
    END) AS ranking,
    SUBSTRING(cnpj_holdings.cnpj_socia,1,8) as cnpj_base_holding,
    substring(cnpj_holdings.cnpj_socia,9,4) as cnpj_ordem_holding,
    substring(cnpj_holdings.cnpj_socia,13,2) as cnpj_dv_holding,
    cnpj_holdings.razao_social_socia AS razao_social_socia,
    cnpj_holdings.razao_social AS razao_social,
    empresas.porte,
    (CASE
      when tab_porte_empresa.nm_porte is null then 'DEMAIS'
      else tab_porte_empresa.nm_porte
      END) as nm_porte,

    cnpj_holdings.qualificacao_socia,
    tab_natureza_juridica.nm_subclass_natureza_juridica AS natureza_juridica,
    estabelecimentos.cnae_fiscal,
    tab_cnae_up.nome,
        estabelecimentos.cnae_secundario,
    cnpj_status.nm_sit_cadastral AS sit_cadastral,
    (CASE
        WHEN tab_cidade.nome IS NULL THEN 'Exterior'
        ELSE (tab_cidade.nome)
    END) AS municipio,
    (Select  COUNT(DISTINCT (cnpj_holdings.cnpj)) where cnpj_holdings.cnpj_socia = CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)) AS qtd_subsidiarias,
    tab_matriz_filial.*,
    (CASE
      when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
      else estabelecimentos.uf
      END) as uf


`

  let query = `SELECT  ${projection}
  FROM cnpj_holdings
  left join estabelecimentos
  on
  substring(cnpj_holdings.cnpj_socia,1,8)=estabelecimentos.cnpj


  left join empresas
  on
  substring(cnpj_holdings.cnpj_socia,1,8)=empresas.cnpj

  left   join cnpj_status
  on     cnpj_status.cod_sit_cad=estabelecimentos.situacao


  left join tab_situacao_cadastral
  on tab_situacao_cadastral.cod_situacao_cadastral=estabelecimentos.situacao

  left join tab_natureza_juridica
  on tab_natureza_juridica.cod_subclass_natureza_juridica =empresas.natureza

  left join tab_cnae_up
  on tab_cnae_up.cod_cnae=estabelecimentos.cnae_fiscal



  left join tab_porte_empresa
  on
  tab_porte_empresa.id=empresas.porte

  left   join tab_cidade
  on
  tab_cidade.cod_tom=estabelecimentos.municipio

  left join tab_matriz_filial
  on
  tab_matriz_filial.id=estabelecimentos.matriz_filial

  left join dados_simples
  on
  substring(cnpj_holdings.cnpj_socia,1,8)=dados_simples.cnpj
left join
  tab_pcd ON tab_pcd.cnpj = CONCAT(estabelecimentos.cnpj,
    estabelecimentos.cnpj_ordem,
    estabelecimentos.cnpj_dv)
LEFT JOIN
tab_ie ON tab_ie.cnpj = CONCAT(estabelecimentos.cnpj,
    estabelecimentos.cnpj_ordem,
    estabelecimentos.cnpj_dv)

    left join autuacoes.tab_cnpj_beneficiado a
    on
   a.cnpj=CONCAT(estabelecimentos.cnpj,
    estabelecimentos.cnpj_ordem,
    estabelecimentos.cnpj_dv)

    left join autuacoes.tab_cnpj_iniesus b
    on
   b.cpf_ou_cnpj_do_sancionado=CONCAT(estabelecimentos.cnpj,
    estabelecimentos.cnpj_ordem,
    estabelecimentos.cnpj_dv)

    left join autuacoes.tab_cnpj_acordo_leniencia c
    on
   c.cnpj_do_sancionado=CONCAT(estabelecimentos.cnpj,
    estabelecimentos.cnpj_ordem,
    estabelecimentos.cnpj_dv)

    left join autuacoes.tab_cnpj_esfl_impedidas d
    on
   d.cnpj_entidade=CONCAT(estabelecimentos.cnpj,
    estabelecimentos.cnpj_ordem,
    estabelecimentos.cnpj_dv)

  where 1 = 1
  and estabelecimentos.matriz_filial = '1'
  and
  estabelecimentos.situacao = '02'
`
  const params = []

  if (!isBlank(cnpj_socia1)) {
    query += " and cnpj_holdings.cnpj_socia = ? "
    params.push(cnpj_socia1)
  }

  if (!isBlank(cod_situacao_cadastral)) {
    query += " and h.situacao in (?) "
    const cod_situacao_cadastral_array = cod_situacao_cadastral.split(",")
    params.push(cod_situacao_cadastral_array)
  }

  if (!isBlank(razao_social)) {
    query += " and cnpj_holdings.razao_social_socia LIKE ? "
    params.push(`${razao_social}%`)
  }

  if (!isBlank(email)) {
    query += " and h.email LIKE ? "
    params.push(`${email}%`)
  }

  if (!isBlank(porte_empresa)) {
    query += " and h.porte in (?) "
    const porte_empresa_array = porte_empresa.split(",")
    params.push(porte_empresa_array)
  }

  if (!isBlank(qualificacao_socia)) {
    query += " and cnpj_holdings.qualificacao_socia in (?) "
    const qualificacao_socia_array = qualificacao_socia.split(",")
    params.push(qualificacao_socia_array)
  }

  if (!isBlank(natureza_juridica)) {
    query += " and x.natureza in (?) "
    const natureza_juridica_array = natureza_juridica.split(",")
    params.push(natureza_juridica_array)
  }
  if (!isBlank(opcao_pelo_simples)) {
    query += " and h.opcao_simples = ? "
    params.push(opcao_pelo_simples)
  }

  if (!isBlank(cnae)) {
    query += " and h.cnae_fiscal in (?) "
    const cnae_array = cnae.split(",")
    params.push(cnae_array)
  }
  if (!isBlank(uf)) {
    query += " and h.uf = ? "
    params.push(uf)
  }

  if (!isBlank(municipio)) {
    query += " and g.cod_tom in (?) "
    const municipio_array = municipio.split(",")
    params.push(municipio_array)
  }

  console.log("BUSCANDO HOLDINGS...")
  console.log("BUSCANDO HOLDINGS...",query)

  if (!isCount) query += ` group by cnpj_holdings.cnpj_socia  ORDER BY qtd_subsidiarias DESC,ranking * 1 DESC LIMIT  ${pagina}, 20 `

  return this.execQuery(query, params)
}
buscar_detalhes_HOLDINGS(id, callback) {
  let id1 = id.replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  
  let cnpj_full = id.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = id.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = id.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = id.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)

  let projection = ` 
 DISTINCT
  'buscar_detalhes_HOLDINGS',
  (select COUNT(DISTINCT(socios.cnpj)) from socios where socios.cpf_cnpj =  '${cnpj_full}' group by socios.cpf_cnpj)AS qtd_subsidiarias,
  (select cast(sum(case when (estabelecimentos.matriz_filial = 2) then 1 else 0 end)as decimal) where estabelecimentos.cnpj = '${cnpj_base}') as filiais,
  (select (CASE WHEN estabelecimentos.cnae_fiscal = '6461100' THEN CONCAT('Holdings de instituições financeiras') WHEN estabelecimentos.cnae_fiscal = '6462000' THEN CONCAT('Holdings de instituições não financeiras') ELSE ('') END) from estabelecimentos where estabelecimentos.cnpj = '${cnpj_base}' and estabelecimentos.cnpj_ordem =  '${cnpj_ordem}' and estabelecimentos.cnpj_dv = '${cnpj_dv}')AS e_holding,
  
  @calculo_ativo :=date_sub( date_sub( date_sub( current_date, interval year( estabelecimentos.inicio_atividade ) - 1 year ), interval month( estabelecimentos.inicio_atividade ) - 1 month ), interval day( estabelecimentos.inicio_atividade ) - 1 day ) as calculo_ativo,
  @calculo_nao_ativo :=date_sub( date_sub( date_sub( data_situacao, interval year( estabelecimentos.inicio_atividade ) - 1 year ), interval month( estabelecimentos.inicio_atividade ) - 1 month ), interval day( estabelecimentos.inicio_atividade ) - 1 day ) as calculo_nao_ativo,
  @calculo_alteracao :=date_sub( date_sub( date_sub( current_date, interval year( estabelecimentos.data_situacao ) - 1 year ), interval month( estabelecimentos.data_situacao ) - 1 month ), interval day( estabelecimentos.data_situacao ) - 1 day ) as calculo_alteracao,
  (case when char_length(getnumber(empresas.razao)) > 8 then uextractnonnumbersfromstring(empresas.razao) else (empresas.razao) end) as rs_1,
  (case when year(curdate()) - year(estabelecimentos.data_situacao) is not null and estabelecimentos.situacao ='08' then concat(year(curdate()) - year(estabelecimentos.data_situacao),' ano(s) baixada. funcionou por ', year(estabelecimentos.data_situacao) - year(estabelecimentos.inicio_atividade), ' anos') else concat('aberta a ', year(curdate()) - year(estabelecimentos.inicio_atividade),' anos. ', year(curdate()) - year(estabelecimentos.data_situacao),' anos desde ultima atualização') end) as status,
  (case when estabelecimentos.cnpj is null then empresas.cnpj else concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) end) as cnpj,
  (case when estabelecimentos.pais is null then 'brasil' else estabelecimentos.pais end) as pais,
  (case when estabelecimentos.nome is null or '' then '*****' else estabelecimentos.nome end) as nome_fantasia,
  concat(estabelecimentos.cnae_secundario, ' - ', group_concat(distinct b.nome)) as cnae_secundario_full,
  estabelecimentos.matriz_filial as identificador_matriz_filial,
  estabelecimentos.situacao as situacao_cadastral,
  estabelecimentos.data_situacao as data_situacao_cadastral,
  estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
  estabelecimentos.cidade_exterior as nm_cidade_exterior,
  estabelecimentos.pais as cod_pais,
  estabelecimentos.cnae_secundario,
  estabelecimentos.inicio_atividade as data_inicio_atividade,
  estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
  (case when tab_cidade.nome is null then 'exterior' else tab_cidade.nome end) as municipio,
  (case when tab_cidade.nome is null then 'exterior' else (tab_cidade.nome) end) as municipio,
  estabelecimentos.municipio as codigo_municipio,
  (case when estabelecimentos.ddd_1 ='' and estabelecimentos.telefone_1 =''  then tab_serp.númerodetelefone when estabelecimentos.ddd_1 is not null and estabelecimentos.telefone_1 is not null then concat(estabelecimentos.ddd_1,'-',estabelecimentos.telefone_1 ) else tab_serp.númerodetelefone end) as ddd_telefone_1,
  (case when estabelecimentos.ddd_2 is not null and estabelecimentos.telefone_2 is not null then concat(estabelecimentos.ddd_2,'-',estabelecimentos.telefone_2 ) end) as ddd_telefone_2,
  (case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_telefone_3,
  (case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_fax,
  estabelecimentos.email as correio_eletronico,
  tab_serp.domain,
  empresas.natureza as codigo_natureza_juridica,
  empresas.qualificacao_pf as qualificacao_responsavel,
  CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital_social_empresa,
  (case when empresas.porte is null then 'porte não declarado' else empresas.porte end) as porte_empresa,
  dados_simples.opcao_simples as opcao_pelo_simples,
  dados_simples.data_opcao_simples as data_opcao_pelo_simples,
  dados_simples.data_exclusao as data_exclusao_simples,
  dados_simples.opcao_mei as opcao_pelo_mei,
  (case when dados_simples.opcao_mei is null then 'não' when dados_simples.opcao_mei = 'n' then 'não' when dados_simples.opcao_mei = 's' then 'sim' end)as microempreendedor_individual,
  concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj,
  (case when estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos where cnpj like concat('${cnpj_full}' , '%')) = 0 then tab_matriz_filial.nm_matriz_filial when estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos where cnpj like concat('${cnpj_full}' , '%') and estabelecimentos.matriz_filial = 2) > 0 then concat(tab_matriz_filial.nm_matriz_filial, ' - ', ' filiais: ',(select count(1) from estabelecimentos where cnpj like concat( '${cnpj_full}' , '%') and estabelecimentos.matriz_filial = 2)) when estabelecimentos.matriz_filial = '2' then tab_matriz_filial.nm_matriz_filial else tab_matriz_filial.nm_matriz_filial end) as nm_matriz_filial,
  (case when char_length(getnumber(empresas.razao)) > 8 then uextractnonnumbersfromstring(empresas.razao) else (empresas.razao) end) as razao_social,
  (select cast(sum(case when (estabelecimentos.matriz_filial = 2) then 1 else 0 end)as decimal)) as filiais,
  cnpj_status.nm_sit_cadastral as situacao_cadastral,
  tab_situacao_cadastral.nm_situacao_cadastral as motivo_sit_cadastral,
  date_format(estabelecimentos.data_situacao, '%d/%m/%y') as data_atual_cadastral,
  estabelecimentos.cidade_exterior,
  tab_natureza_juridica.nm_subclass_natureza_juridica as natureza_juridica,
  date_format(estabelecimentos.inicio_atividade, '%d/%m/%y') as data_inicio,
  year(curdate()) - year(estabelecimentos.inicio_atividade) as age,
  estabelecimentos.cnae_fiscal as 'cnae_primario',
  tab_cnae_up.nome,
  estabelecimentos.logradouro,
  estabelecimentos.numero,
  trim(estabelecimentos.bairro),
  trim(estabelecimentos.complemento),
  estabelecimentos.cep,
  CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital,
  
  
  (CASE
    when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
    else estabelecimentos.uf
    END) as uf,
  
  estabelecimentos.telefone_1,
  estabelecimentos.telefone_2,
  estabelecimentos.numero_fax as 'fax',
  estabelecimentos.email as 'email1',
  (case when estabelecimentos.email is null and tab_serp.email is null then "sem e-mail cadastrado" when estabelecimentos.email is not null and tab_serp.email is null then estabelecimentos.email when estabelecimentos.email is not null and tab_serp.email is not null then concat(estabelecimentos.email, " ",tab_serp.email ) end)as email,
  tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio as qualificacao,
  CAST(empresas.capital as UNSIGNED) AS capital,
  tab_porte_empresa.nm_porte as porte,
  (case when dados_simples.opcao_simples is null then 'Não Optante' when dados_simples.opcao_simples = 'n' then 'Não Optante' when dados_simples.opcao_simples = 's' then 'Optante' end)as simples_nacional,
  estabelecimentos.data_situacao,
  estabelecimentos.motivo_situacao,
  tab_situacao_cadastral.nm_situacao_cadastral,
  (case when estabelecimentos.situacao = '02' then concat('funcionando desde ',date_format(estabelecimentos.inicio_atividade, '%y'), ', à ',year( @calculo_ativo ) - 1,' anos, ',month( @calculo_ativo ) - 1,' meses e ', day( @calculo_ativo ) - 1,' dias.' ,' ultima atualização à: ' ,year( @calculo_alteracao ) - 1,' anos, ',month( @calculo_alteracao ) - 1,' meses e ', day( @calculo_alteracao ) - 1,' dias' ) when estabelecimentos.situacao <> '2' then concat('foi aberta em: ',date_format(estabelecimentos.inicio_atividade, '%y'),', mas esta ',cnpj_status.nm_sit_cadastral,' desde ',date_format(estabelecimentos.data_situacao, '%y'),'. funcionou por: ',year( @calculo_nao_ativo ) - 1,' anos, ',month( @calculo_nao_ativo ) - 1,' meses e ', day( @calculo_nao_ativo ) - 1, ' dias. ultima alteração à: ' , year( @calculo_alteracao ) - 1,' anos, ',month( @calculo_alteracao ) - 1,' meses e ', day( @calculo_alteracao ) - 1,' dias, ' ) end) as status,
  tab_serp.cnpj_full,
  tab_serp.data_added,
  tab_serp.cnpj_base,
  tab_serp.cnpj_ordem,
  tab_serp.cnpj_dv,
  tab_serp.receita,
  tab_serp.num_funcionarios,
  tab_serp.website,
  tab_serp.ceo,
  tab_serp.acoes,
  tab_serp.fundadores,
  tab_serp.atendimento_cliente,
  tab_serp.presidente,
  tab_serp.subsidiarias,
  (case when tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.image_url is not null then (tab_serp.image_url) end)as image_url,
  tab_serp.sub_title,
  tab_serp.recursos,
  tab_serp.rating,
  CONCAT('R$ ',FORMAT(CAST(tab_serp.faturamento as UNSIGNED),2,'de_DE')) AS  faturamento,
  tab_serp.banner,
  tab_serp.description,
  (case when tab_serp.logo_url is not null and tab_serp.logo_url <> '' then tab_serp.logo_url when tab_serp.logo_url is null and tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.logo_url = '' and tab_serp.image_url = '' then '../../img/defaultLOGO.png' when tab_serp.logo_url is null and tab_serp.image_url is not null then tab_serp.image_url when tab_serp.logo_url = '' and tab_serp.image_url <> '' then tab_serp.image_url else '../../img/defaultLOGO.png' end) as logo_url,

  tab_serp.tagline,
  tab_serp.followercount,
  tab_serp.site,
  tab_serp.setor,
  tab_serp.tamanhodaempresa,
  tab_serp.sede,
  tab_serp.tipo,
  tab_serp.companyaddress,
  tab_serp.maincompanyid,
  tab_serp.industrycode,
  tab_serp.salesnavigatorlink,
  tab_serp.employeesonlinkedin,
  tab_serp.query,
  tab_serp.timestamp,
  tab_serp.companyurl,
  tab_serp.companyurl as updated_url,
  tab_serp.fundadaem,
  tab_serp.especializações,
  tab_serp.relatedcompanies1,
  tab_serp.relatedcompanies2,
  tab_serp.relatedcompanies3,
  tab_serp.relatedcompanies4,
  tab_serp.relatedcompanies5,
  tab_serp.relatedcompanies6,
  tab_serp.relatedcompanies7,
  tab_serp.relatedcompanies8,
  tab_serp.relatedcompanies9,
  tab_serp.relatedcompanies10,
  tab_serp.isclaimable,
  tab_serp.savedimg,
  tab_serp.númerodetelefone,
  tab_serp.date_updatedname,
  cnpj_status.nm_sit_cadastral as situacao_cadastral_nome,
  tab_serp.date_serpsearch,
  tab_situacao_cadastral.nm_situacao_cadastral,
  tab_serp.date_serpsearch
    

 `
  let query = `SELECT  ${projection}
  FROM
  socios
  left join estabelecimentos
on
socios.cnpj=estabelecimentos.cnpj
left join empresas
on
socios.cnpj = empresas.cnpj
left join dados_simples
on
estabelecimentos.cnpj=dados_simples.cnpj
      LEFT JOIN
  tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf
      LEFT JOIN
  tab_matriz_filial ON tab_matriz_filial.id = estabelecimentos.matriz_filial
      LEFT JOIN
  cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao

      LEFT JOIN
  tab_natureza_juridica ON tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
      LEFT JOIN
  tab_cnae_up ON tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
      LEFT JOIN
  tab_cnae_up b ON estabelecimentos.cnae_secundario LIKE CONCAT('%', b.cod_cnae, '%')
      LEFT JOIN
  tab_opcao_simples ON tab_opcao_simples.cod = dados_simples.opcao_simples
      LEFT JOIN
  tab_porte_empresa ON tab_porte_empresa.id = empresas.porte

      LEFT JOIN
  tab_situacao_cadastral ON estabelecimentos.motivo_situacao = tab_situacao_cadastral.cod_situacao_cadastral
  left   join tab_cidade
  on
  tab_cidade.cod_tom=estabelecimentos.municipio

  left join tab_serp
  on empresas.cnpj=tab_serp.cnpj_base


  


  where  1 = 1

and estabelecimentos.cnpj = '${cnpj_base}'
and estabelecimentos.cnpj_ordem = '${cnpj_ordem}'
and estabelecimentos.cnpj_dv = '${cnpj_dv}'
`

  console.log("buscar_detalhes_HOLDINGS")
  console.log("buscar_detalhes_HOLDINGS",cnpj_base)
  console.log("buscar_detalhes_HOLDINGS",cnpj_ordem)
  console.log("buscar_detalhes_HOLDINGS",cnpj_dv)
  return this.conexao.query(query, callback)
}
buscar_detalhes_HOLDINGS_SUBSIDIARIAS(id, callback) {
  let id1 = id.replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let projection = ` 

  'buscar_detalhes_HOLDINGS_SUBSIDIARIAS',
  CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj_sub,
  (SELECT DISTINCT socios.cnpj),
  a.razao AS rz_sc_sub,
  socios.cpf_cnpj AS cnpj_socia,
  b.razao AS razao_social,
  DATE_FORMAT(estabelecimentos.inicio_atividade,'%d/%m/%Y') AS abertura_empresa,
  YEAR(CURDATE()) - YEAR(socios.data_entrada_sociedade) AS tempo_socio,
  socios.qualificacao AS qualificacao_socia,
  tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio AS qualificacao,
  cnpj_status.nm_sit_cadastral AS situacao_cadastral,
  estabelecimentos.cnae_fiscal AS cnae_primario,
  tab_cnae_up.nome,
  tab_porte_empresa.nm_porte AS porte



 `
  let query = `SELECT  ${projection}
from
  socios
  LEFT JOIN
empresas a ON SUBSTRING(socios.cpf_cnpj, 1, 8) = a.cnpj
  LEFT JOIN
empresas b ON SUBSTRING(socios.cnpj, 1, 8) = b.cnpj
  LEFT JOIN
estabelecimentos ON SUBSTRING(socios.cnpj, 1, 8) = estabelecimentos.cnpj
  LEFT JOIN
tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = socios.qualificacao
  LEFT JOIN
tab_matriz_filial ON tab_matriz_filial.id = estabelecimentos.matriz_filial
  LEFT JOIN
cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao
  LEFT JOIN
tab_cnae_up ON tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
  LEFT JOIN
tab_porte_empresa ON tab_porte_empresa.id = b.porte
  LEFT JOIN
tab_situacao_cadastral ON estabelecimentos.motivo_situacao = tab_situacao_cadastral.cod_situacao_cadastral
WHERE
socios.cpf_cnpj = '${id}' GROUP BY socios.cnpj
`

  console.log("buscar_detalhes_HOLDINGS_SUBSIDIARIAS")
  console.log("buscar_detalhes_HOLDINGS_SUBSIDIARIAS",id)
  return this.conexao.query(query, callback)
}

//FIM HOLDINGS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// CNAE

	consultaCnae(isCount, { cnae, cod_cnae, desc_cnae, cod_situacao_cadastral, porte_empresa, opcao_pelo_mei, uf, municipio,capital_social,ordenacao, pagina }) {
		pagina = isBlank(pagina) ? 1 : parseInt(pagina)

		if (pagina === 1) {
			pagina = 0
		} else {
			pagina--
			pagina = parseInt(pagina) * 20 + 1
		}

    //arruma ordenacao
    if (ordenacao == 1|| ordenacao == null) {
      ordenacao = ''
    } else if (ordenacao == 2) {
      ordenacao = 'empresas.capital DESC,'
    }else if (ordenacao == 3) {
      ordenacao = 'faturamento DESC,'
    } else {
      ordenacao = ' '
    } 
    
    //fim ordenacao
    let cod_cnae_tratado = cod_cnae.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
		

		let projection = isCount
			? "count(distinct(empresas.razao)) as count_query"
			: `
      'consultaCnae',
      (CASE when tab_ie.inscricao_estadual is not null then group_concat(DISTINCT(tab_ie.inscricao_estadual)) else 'Sem Inscrição Estadual' END) as ie, group_concat(DISTINCT(tab_ie.uf_ie)) as ie_uf, (CASE WHEN tab_pcd.id is not null then 'PCD' else 'Nenhuma' END) as lei_pcd,
    (CASE when a.id is not null then 'beneficio_sim' else 'beneficio_nao' END) as beneficiado,
    (CASE when b.id is not null then 'com_sancao' else 'sem_sancao' END ) as sancoes,
    (CASE when c.id is not null then 'acordo_leniencia_sim' else 'acordo_leniencia_nao' END) as acordo_leniencia,
    (CASE when d.id is not null then 'esfl_impedidas_sim' else 'esfl_impedidas_nao' END) as esfl_impedidas, CONCAT(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv), tab_dados_economicos.id_empresa AS id_empresa_bolsa,
    (CASE WHEN tab_cad_fi.tp_fundo = 'fi' AND tab_cad_fi.sit <> 'cancelado' THEN CONCAT('FI - ', tab_dados_economicos.ativo, ' - Fundo Ativo') WHEN tab_cad_fi.tp_fundo = 'fi' AND tab_cad_fi.sit = 'cancelado' THEN CONCAT('FI - ', tab_dados_economicos.ativo, ' - Fundo Cancelado') WHEN tab_dados_economicos.ativo IS NULL THEN 'Não Listado B.V.' ELSE tab_dados_economicos.ativo END) AS ativo,
    (CASE WHEN tab_dados_economicos.principal_acionista IS NULL THEN 'Sem informações' WHEN tab_dados_economicos.principal_acionista = '-' THEN 'Sem informações' WHEN CAST(tab_dados_economicos.principal_acionista AS UNSIGNED) <> 0 THEN 'Sem informações' ELSE tab_dados_economicos.principal_acionista END) AS principal_acionista,
    tab_dados_economicos.nome AS nome_empresa_bolsa,
    tab_dados_economicos.cnpj_base AS cnpj_base_bolsa,
    tab_dados_economicos.pais_sede,
    tab_dados_economicos.setor_naics,
    tab_dados_economicos.setor_economatica,
    tab_dados_economicos.setor_economico_bovespa,
    tab_dados_economicos.subsetor_bovespa,
    tab_dados_economicos.segmento_bovespa,
    tab_dados_economicos.situacao_cvm,
    tab_dados_economicos.ativo_cancelado,
    tab_dados_economicos.moeda_balancos,
    tab_dados_economicos.data_do_balanco,
    (CASE WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '01' THEN 'R$ 360.000,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '03' THEN 'R$ 4.800.000,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '05' THEN 'R$ 0,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte IS NULL AND dados_simples.opcao_mei IS NULL AND dados_simples.opcao_simples IS NULL THEN 'R$ 0,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND dados_simples.opcao_mei = 's' THEN 'R$ 81.000,00' ELSE CONCAT('R$ ',CAST(tab_dados_economicos.receita_liquida_faturamento AS UNSIGNED)) END) AS faturamento,
    (CASE WHEN tab_dados_economicos.valor_mercado_empresa_2022 IS NULL THEN '0' ELSE CAST(tab_dados_economicos.valor_mercado_empresa_2022 AS UNSIGNED) END) AS valor_mercado_atual,
    (CASE WHEN tab_dados_economicos.enterprise_value_2022 IS NULL THEN '0' ELSE CAST(tab_dados_economicos.enterprise_value_2022 AS UNSIGNED) END) AS valor_real_empresa,
    CAST(tab_dados_economicos.ativo_tot AS UNSIGNED) AS total_ativos,
    CAST(tab_dados_economicos.patrimonio_liquido AS UNSIGNED) AS patrimonio_liquido_bolsa,
    CAST(tab_dados_economicos.receita_liquida_faturamento AS UNSIGNED) AS receita_liquida_faturamento,
    CAST(tab_dados_economicos.lucro_bruto AS UNSIGNED) AS lucro_bruto,
    CAST(tab_dados_economicos.ebitda AS UNSIGNED) AS ebitda,
    CAST(tab_dados_economicos.lucro_liquido AS UNSIGNED) AS lucro_liquido,
    CAST(tab_dados_economicos.vendas_acao_2021 AS UNSIGNED) AS vendas_acao_2021,
    CAST(tab_dados_economicos.valor_mercado_empresa_2022 AS UNSIGNED) AS valor_mercado_atual,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez16 AS UNSIGNED) AS valor_mercado_empresa_2016,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez17 AS UNSIGNED) AS valor_mercado_empresa_2017,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez18 AS UNSIGNED) AS valor_mercado_empresa_2018,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez19 AS UNSIGNED) AS valor_mercado_empresa_2019,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez20 AS UNSIGNED) AS valor_mercado_empresa_2020,
    CAST(tab_dados_economicos.valor_mercado_empresa_31dez21 AS UNSIGNED) AS valor_mercado_empresa_2021,
    CAST(tab_dados_economicos.valor_mercado_empresa_22 AS UNSIGNED) AS valor_mercado_empresa_2022,
    CAST(tab_dados_economicos.enterprise_value_2022 AS UNSIGNED) AS valor_real_empresa,
    CAST(tab_dados_economicos.enterprise_value_31dez17 AS UNSIGNED) AS valor_real_empresa_2017,
    CAST(tab_dados_economicos.enterprise_value_31dez18 AS UNSIGNED) AS valor_real_empresa_2018,
    CAST(tab_dados_economicos.enterprise_value_31dez19 AS UNSIGNED) AS valor_real_empresa_2019,
    CAST(tab_dados_economicos.enterprise_value_31dez20 AS UNSIGNED) AS valor_real_empresa_2020,
    CAST(tab_dados_economicos.enterprise_value_31dez21 AS UNSIGNED) AS valor_real_empresa_2021,
    CAST(tab_dados_economicos.enterprise_value_2022_1 AS UNSIGNED) AS valor_real_empresa_2022,
    CAST(tab_dados_economicos.ativo_circulante AS UNSIGNED) AS ativo_circulante,
    CAST(tab_dados_economicos.capex AS UNSIGNED) AS capex,
    empresas.razao AS razao_social,
    empresas.natureza AS codigo_natureza_juridica,
    empresas.qualificacao_pf AS qualificacao_responsavel,
    CAST(empresas.capital as UNSIGNED) AS capital_social_empresa1,
    CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS capital_social_empresa,
    (CASE WHEN empresas.porte IS NULL THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END) AS porte_empresa,
    (CASE WHEN empresas.porte IS NULL THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END) AS nm_porte,
    (CASE WHEN empresas.porte IS NULL THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END) AS porte,
    (CASE WHEN estabelecimentos.cnpj IS NULL THEN empresas.cnpj ELSE CONCAT(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv) END) AS cnpj,
    estabelecimentos.cnpj AS cnpj_base,
    estabelecimentos.cnpj_ordem,
    estabelecimentos.cnpj_dv,
    (CASE WHEN estabelecimentos.nome IS NULL THEN '*****' ELSE estabelecimentos.nome END) AS nome_fantasia,
    estabelecimentos.matriz_filial,
    estabelecimentos.situacao AS sit_cadastral,
    estabelecimentos.data_situacao,
    estabelecimentos.motivo_situacao,
    estabelecimentos.cidade_exterior,
    (CASE WHEN estabelecimentos.pais IS NULL THEN 'Brasil' ELSE estabelecimentos.pais END) AS pais,
    estabelecimentos.inicio_atividade,
    estabelecimentos.cnae_fiscal,
    estabelecimentos.cnae_secundario,
    estabelecimentos.tipo_logradouro AS descricao_tipo_logradouro,
    estabelecimentos.logradouro,
    estabelecimentos.numero,
    TRIM(estabelecimentos.complemento),
    TRIM(estabelecimentos.bairro),
    estabelecimentos.cep,
    (CASE WHEN estabelecimentos.uf IS NULL OR estabelecimentos.uf = '' THEN 'SUF' ELSE estabelecimentos.uf END) AS uf, (CASE WHEN tab_cidade.nome IS NULL THEN 'Exterior' ELSE (tab_cidade.nome) END) AS municipio,
    estabelecimentos.ddd_1,
    estabelecimentos.telefone_1,
    estabelecimentos.ddd_2,
    estabelecimentos.telefone_2,
    estabelecimentos.ddd_fax,
    estabelecimentos.numero_fax,
    TRIM(estabelecimentos.email),
    estabelecimentos.situacao_especial,
    estabelecimentos.data_situacao_especial,
    cnpj_status.nm_sit_cadastral AS sit_cadastral,
    (CASE WHEN CHAR_LENGTH(GETNUMBER(empresas.razao)) > 8 THEN UEXTRACTNONNUMBERSFROMSTRING(empresas.razao) ELSE (empresas.razao) END) AS rs_1,
    (CASE WHEN (SELECT COUNT(id) FROM tab_pcd) > 0 THEN (SELECT COUNT(id) FROM tab_pcd) ELSE 'Sem autuacoes PCD' END) AS pcd,
    (CASE WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei IS NULL THEN CAST('100' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei = 'n' THEN CAST('100' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei = 's' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei IS NULL THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei = 'n' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 <> '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei = 's' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei IS NULL THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei = 'n' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email <> '' AND dados_simples.opcao_mei = 's' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei IS NULL THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei = 'n' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' AND estabelecimentos.telefone_1 = '' AND estabelecimentos.email = '' AND dados_simples.opcao_mei = 's' THEN CAST('25' AS DECIMAL) WHEN estabelecimentos.situacao <> '2' THEN CAST('0' AS DECIMAL) ELSE 'Faltando' END) AS ranking,
    tab_matriz_filial.nm_matriz_filial,
    (CASE WHEN tab_cidade.nome IS NULL THEN 'Exterior' ELSE (tab_cidade.nome) END) AS municipio,
    (CASE WHEN dados_simples.opcao_mei IS NULL THEN 'Não' WHEN dados_simples.opcao_mei = 'n' THEN 'Não' WHEN dados_simples.opcao_mei = 's' THEN 'Sim' END) AS opcao_pelo_mei,
    tab_cnae_up.nome AS nm_cnae,
    tab_cnae_up.nm_setor AS setor,
    estabelecimentos.telefone_1 AS fone_1,
    YEAR(CURDATE()) - YEAR(inicio_atividade) AS age,
    (SELECT (CASE WHEN (SELECT CAST(id AS DECIMAL) FROM cnpj_dividas WHERE cnpj_dividas.cpf_cnpj = CONCAT(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv) LIMIT 1) IS NULL THEN 0 ELSE 1 END) ) AS tem_divida,
    tab_cad_fi.tp_fundo,
    tab_cad_fi.sit,
    tab_cad_fi.classe,
    estabelecimentos.email AS email
      `
		let query = `SELECT  ${projection}

    FROM
    tab_cnae_up
    
    left join estabelecimentos on tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
    left join empresas on estabelecimentos.cnpj = empresas.cnpj
    left join dados_simples on estabelecimentos.cnpj = dados_simples.cnpj
    left join cnpj_status on cnpj_status.cod_sit_cad = estabelecimentos.situacao
    left join tab_matriz_filial on tab_matriz_filial.id = estabelecimentos.matriz_filial
    left join tab_porte_empresa on tab_porte_empresa.id = empresas.porte
    left join tab_cidade on estabelecimentos.municipio = tab_cidade.cod_tom
    left join tab_resumo_divida on tab_resumo_divida.cnpj = concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
    left join tab_dados_economicos on tab_dados_economicos.cnpj_base = empresas.cnpj
    left join socios on estabelecimentos.cnpj=socios.cnpj
    left join tab_cad_fi on tab_cad_fi.cnpj_fundo=concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
    left join tab_serp on empresas.cnpj=tab_serp.cnpj_base
    left join cnpj_dividas on estabelecimentos.cnpj = cnpj_dividas.cpf_cnpj
    left join tab_pcd on tab_pcd.cnpj = concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join tab_ie on tab_ie.cnpj = concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join autuacoes.tab_cnpj_beneficiado a on a.cnpj=concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join autuacoes.tab_cnpj_iniesus b on b.cpf_ou_cnpj_do_sancionado=concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join autuacoes.tab_cnpj_acordo_leniencia c on c.cnpj_do_sancionado=concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join autuacoes.tab_cnpj_esfl_impedidas d on d.cnpj_entidade=concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    

WHERE
    1 = 1
    AND estabelecimentos.situacao = '02'
                
`

		const params = []

		if (!isBlank(cnae)) {
			query += " and estabelecimentos.cnae_fiscal in (?) "
			const cnae_array = cnae.split(",")
			params.push(cnae_array)
		}
		if (!isBlank(cod_cnae_tratado)) {
			query += " and tab_cnae_up.cod_cnae = ? "
			params.push(cod_cnae_tratado)
		}
		if (!isBlank(desc_cnae)) {
			query += " and tab_cnae_up.nome LIKE ? "
			params.push(`${desc_cnae}%`)
		}

		if (!isBlank(cod_situacao_cadastral)) {
			query += " and estabelecimentos.situacao in (?) "
			const cod_situacao_cadastral_array = cod_situacao_cadastral.split(",")
			params.push(cod_situacao_cadastral_array)
		}

		if (!isBlank(porte_empresa)) {
			query += " and empresas.porte in (?) "
			const porte_empresa_array = porte_empresa.split(",")
			params.push(porte_empresa_array)
		}

		if (!isBlank(opcao_pelo_mei)) {
			query += " and dados_simples.opcao_mei = ? "
			params.push(opcao_pelo_mei)
		}

		if (!isBlank(uf)) {
			query += " and estabelecimentos.uf = ? "
			params.push(uf)
		}

		if (!isBlank(municipio)) {
			query += " and estabelecimentos.municipio in (?) "
			const municipio_array = municipio.split(",")
			params.push(municipio_array)
		}


    
  if (!isBlank(capital_social)) {
    if (capital_social == 1 ) {
      query += " " 
		} else if (capital_social == 2 ){
			query += " and CAST(empresas.capital AS UNSIGNED) > 1 " 
		} else if (capital_social == 3 ){
			query += "  and CAST(empresas.capital AS UNSIGNED) = 0 " 
		}else {
			query += "  " 
		}

    params.push(capital_social)
  }
    


  

		console.log("consultaCnae")
		//console.log(cod_cnae)
    console.log("ordem: " ,ordenacao)
    console.log("Capita_social: " ,capital_social)
    console.log("Parametros: " ,params)

		if (!isCount) query += ` group by empresas.razao ORDER BY ${ordenacao} estabelecimentos.matriz_filial DESC,ranking * 1 DESC LIMIT ${pagina}, 20 `

		return this.execQuery(query, params)
	}

  buscar_detalhes_CNAE(cnpj, callback) {
    let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
    let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
    let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
    let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)
  
    let projection = ` 
     
     'buscar_detalhes_CNAE',
     @calculo_ativo :=date_sub( date_sub( date_sub( current_date, interval year( estabelecimentos.inicio_atividade ) - 1 year ), interval month( estabelecimentos.inicio_atividade ) - 1 month ), interval day( estabelecimentos.inicio_atividade ) - 1 day ) as calculo_ativo,
     @calculo_nao_ativo :=date_sub( date_sub( date_sub( data_situacao, interval year( estabelecimentos.inicio_atividade ) - 1 year ), interval month( estabelecimentos.inicio_atividade ) - 1 month ), interval day( estabelecimentos.inicio_atividade ) - 1 day ) as calculo_nao_ativo,
     @calculo_alteracao :=date_sub( date_sub( date_sub( current_date, interval year( estabelecimentos.data_situacao ) - 1 year ), interval month( estabelecimentos.data_situacao ) - 1 month ), interval day( estabelecimentos.data_situacao ) - 1 day ) as calculo_alteracao,
     (case when char_length(getnumber(empresas.razao)) > 8 then uextractnonnumbersfromstring(empresas.razao) else (empresas.razao) end) as rs_1,
     (case when year(curdate()) - year(estabelecimentos.data_situacao) is not null and estabelecimentos.situacao ='08' then concat(year(curdate()) - year(estabelecimentos.data_situacao),' ano(s) baixada. funcionou por ', year(estabelecimentos.data_situacao) - year(estabelecimentos.inicio_atividade), ' anos') else concat('aberta a ', year(curdate()) - year(estabelecimentos.inicio_atividade),' anos. ', year(curdate()) - year(estabelecimentos.data_situacao),' anos desde ultima atualização') end) as status,
     (case when estabelecimentos.cnpj is null then empresas.cnpj else concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) end) as cnpj,
     (case when estabelecimentos.pais is null then 'brasil' else estabelecimentos.pais end) as pais,
     (case when estabelecimentos.nome is null or '' then '*****' else estabelecimentos.nome end) as nome_fantasia,
     concat(estabelecimentos.cnae_secundario, ' - ', group_concat(distinct b.nome)) as cnae_secundario_full,
     estabelecimentos.matriz_filial as identificador_matriz_filial,
     estabelecimentos.situacao as situacao_cadastral,
     estabelecimentos.data_situacao as data_situacao_cadastral,
     estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
     estabelecimentos.cidade_exterior as nm_cidade_exterior,
     estabelecimentos.pais as cod_pais,
     estabelecimentos.cnae_secundario,
     estabelecimentos.inicio_atividade as data_inicio_atividade,
     estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
     (case when tab_cidade.nome is null then 'exterior' else tab_cidade.nome end) as municipio,
     (case when tab_cidade.nome is null then 'exterior' else (tab_cidade.nome) end) as municipio,
     estabelecimentos.municipio as codigo_municipio,
     (case when estabelecimentos.ddd_1 ='' and estabelecimentos.telefone_1 =''  then tab_serp.númerodetelefone when estabelecimentos.ddd_1 is not null and estabelecimentos.telefone_1 is not null then concat(estabelecimentos.ddd_1,'-',estabelecimentos.telefone_1 ) else tab_serp.númerodetelefone end) as ddd_telefone_1,
     (case when estabelecimentos.ddd_2 is not null and estabelecimentos.telefone_2 is not null then concat(estabelecimentos.ddd_2,'-',estabelecimentos.telefone_2 ) end) as ddd_telefone_2,
     (case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_telefone_3,
     (case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_fax,
     estabelecimentos.email as correio_eletronico,
     tab_serp.domain,
     empresas.natureza as codigo_natureza_juridica,
     empresas.qualificacao_pf as qualificacao_responsavel,
     CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital_social_empresa,
     (case when empresas.porte is null then 'porte não declarado' else empresas.porte end) as porte_empresa,
     dados_simples.opcao_simples as opcao_pelo_simples,
     dados_simples.data_opcao_simples as data_opcao_pelo_simples,
     dados_simples.data_exclusao as data_exclusao_simples,
     dados_simples.opcao_mei as opcao_pelo_mei,
     (case when dados_simples.opcao_mei is null then 'não' when dados_simples.opcao_mei = 'n' then 'não' when dados_simples.opcao_mei = 's' then 'sim' end)as microempreendedor_individual,
     concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj,
     (case when estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos where cnpj like concat('${cnpj_base}' , '%')) = 0 then tab_matriz_filial.nm_matriz_filial when estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos where cnpj like concat('${cnpj_base}' , '%') and estabelecimentos.matriz_filial = 2) > 0 then concat(tab_matriz_filial.nm_matriz_filial, ' - ', ' filiais: ',(select count(1) from estabelecimentos where cnpj like concat( '${cnpj_base}' , '%') and estabelecimentos.matriz_filial = 2)) when estabelecimentos.matriz_filial = '2' then tab_matriz_filial.nm_matriz_filial else tab_matriz_filial.nm_matriz_filial end) as nm_matriz_filial,
     (case when char_length(getnumber(empresas.razao)) > 8 then uextractnonnumbersfromstring(empresas.razao) else (empresas.razao) end) as razao_social,
     (select cast(sum(case when (estabelecimentos.matriz_filial = 2) then 1 else 0 end)as decimal)) as filiais,
     cnpj_status.nm_sit_cadastral as situacao_cadastral,
     tab_situacao_cadastral.nm_situacao_cadastral as motivo_sit_cadastral,
     date_format(estabelecimentos.data_situacao, '%d/%m/%y') as data_atual_cadastral,
     estabelecimentos.cidade_exterior,
     tab_natureza_juridica.nm_subclass_natureza_juridica as natureza_juridica,
     date_format(estabelecimentos.inicio_atividade, '%d/%m/%y') as data_inicio,
     year(curdate()) - year(estabelecimentos.inicio_atividade) as age,
     estabelecimentos.cnae_fiscal as 'cnae_primario',
     tab_cnae_up.nome,
     estabelecimentos.logradouro,
     estabelecimentos.numero,
     trim(estabelecimentos.bairro),
     trim(estabelecimentos.complemento),
     estabelecimentos.cep,
     CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital,
     (CASE when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF' else estabelecimentos.uf END) as uf,
     estabelecimentos.telefone_1,
     estabelecimentos.telefone_2,
     estabelecimentos.numero_fax as 'fax',
     estabelecimentos.email as 'email1',
     (case when estabelecimentos.email is null and tab_serp.email is null then "sem e-mail cadastrado" when estabelecimentos.email is not null and tab_serp.email is null then estabelecimentos.email when estabelecimentos.email is not null and tab_serp.email is not null then concat(estabelecimentos.email, " ",tab_serp.email ) end)as email,
     tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio as qualificacao,
     CAST(empresas.capital as UNSIGNED) AS capital,
     tab_porte_empresa.nm_porte as porte,
     (case when dados_simples.opcao_simples is null then 'Não Optante' when dados_simples.opcao_simples = 'n' then 'Não Optante' when dados_simples.opcao_simples = 's' then 'Optante' end)as simples_nacional,
     estabelecimentos.data_situacao,
     estabelecimentos.motivo_situacao,
     tab_situacao_cadastral.nm_situacao_cadastral,
     (case when estabelecimentos.situacao = '02' then concat('funcionando desde ',date_format(estabelecimentos.inicio_atividade, '%y'), ', à ',year( @calculo_ativo ) - 1,' anos, ',month( @calculo_ativo ) - 1,' meses e ', day( @calculo_ativo ) - 1,' dias.' ,' ultima atualização à: ' ,year( @calculo_alteracao ) - 1,' anos, ',month( @calculo_alteracao ) - 1,' meses e ', day( @calculo_alteracao ) - 1,' dias' ) when estabelecimentos.situacao <> '2' then concat('foi aberta em: ',date_format(estabelecimentos.inicio_atividade, '%y'),', mas esta ',cnpj_status.nm_sit_cadastral,' desde ',date_format(estabelecimentos.data_situacao, '%y'),'. funcionou por: ',year( @calculo_nao_ativo ) - 1,' anos, ',month( @calculo_nao_ativo ) - 1,' meses e ', day( @calculo_nao_ativo ) - 1, ' dias. ultima alteração à: ' , year( @calculo_alteracao ) - 1,' anos, ',month( @calculo_alteracao ) - 1,' meses e ', day( @calculo_alteracao ) - 1,' dias, ' ) end) as status,
     tab_serp.cnpj_full,
     tab_serp.data_added,
     tab_serp.cnpj_base,
     tab_serp.cnpj_ordem,
     tab_serp.cnpj_dv,
     tab_serp.receita,
     tab_serp.num_funcionarios,
     tab_serp.website,
     tab_serp.ceo,
     tab_serp.acoes,
     tab_serp.fundadores,
     tab_serp.atendimento_cliente,
     tab_serp.presidente,
     tab_serp.subsidiarias,
     (case when tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.image_url is not null then (tab_serp.image_url) end)as image_url,
     tab_serp.sub_title,
     tab_serp.recursos,
     tab_serp.rating,
     tab_serp.faturamento as erp_fat,
     CONCAT('R$ ',FORMAT(CAST(tab_serp.faturamento as UNSIGNED),2,'de_DE')) AS  faturamento,
     tab_serp.banner,
     tab_serp.description,
     (case when tab_serp.logo_url is not null and tab_serp.logo_url <> '' then tab_serp.logo_url when tab_serp.logo_url is null and tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.logo_url = '' and tab_serp.image_url = '' then '../../img/defaultLOGO.png' when tab_serp.logo_url is null and tab_serp.image_url is not null then tab_serp.image_url when tab_serp.logo_url = '' and tab_serp.image_url <> '' then tab_serp.image_url else '../../img/defaultLOGO.png' end) as logo_url,
     tab_serp.tagline,
     tab_serp.followercount,
     tab_serp.site,
     tab_serp.setor,
     tab_serp.tamanhodaempresa,
     tab_serp.sede,
     tab_serp.tipo,
     tab_serp.companyaddress,
     tab_serp.maincompanyid,
     tab_serp.industrycode,
     tab_serp.salesnavigatorlink,
     tab_serp.employeesonlinkedin,
     tab_serp.query,
     tab_serp.timestamp,
     tab_serp.companyurl,
     tab_serp.companyurl as updated_url,
     tab_serp.fundadaem,
     tab_serp.especializações,
     tab_serp.relatedcompanies1,
     tab_serp.relatedcompanies2,
     tab_serp.relatedcompanies3,
     tab_serp.relatedcompanies4,
     tab_serp.relatedcompanies5,
     tab_serp.relatedcompanies6,
     tab_serp.relatedcompanies7,
     tab_serp.relatedcompanies8,
     tab_serp.relatedcompanies9,
     tab_serp.relatedcompanies10,
     tab_serp.isclaimable,
     tab_serp.savedimg,
     tab_serp.númerodetelefone,
     tab_serp.date_updatedname,
     cnpj_status.nm_sit_cadastral as situacao_cadastral_nome,
     tab_serp.date_serpsearch
     `
    let query = `SELECT  ${projection}
  
    from
    empresas
    left join estabelecimentos on empresas.cnpj=estabelecimentos.cnpj
    left join dados_simples on estabelecimentos.cnpj=dados_simples.cnpj
    left join tab_qualificacao_responsavel_socio on tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf
    left join tab_matriz_filial on tab_matriz_filial.id = estabelecimentos.matriz_filial
    left join cnpj_status on cnpj_status.cod_sit_cad = estabelecimentos.situacao
    left join tab_natureza_juridica on tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
    left join tab_cnae_up on tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
    left join tab_cnae_up b on estabelecimentos.cnae_secundario like concat('%', b.cod_cnae, '%')
    left join tab_opcao_simples on tab_opcao_simples.cod = dados_simples.opcao_simples
    left join tab_porte_empresa on tab_porte_empresa.id = empresas.porte
    left join tab_situacao_cadastral on estabelecimentos.motivo_situacao = tab_situacao_cadastral.cod_situacao_cadastral
    left join tab_cidade on tab_cidade.cod_tom=estabelecimentos.municipio
    left join tab_serp on empresas.cnpj=tab_serp.cnpj_base
    where 1 = 1
   and estabelecimentos.cnpj = '${cnpj_base}' and estabelecimentos.cnpj_ordem = '${cnpj_ordem}' and estabelecimentos.cnpj_dv = '${cnpj_dv}' group by estabelecimentos.cnpj
    `
  
    
    console.log("buscar_detalhes_CNAE")
    console.log("cnpj completo", cnpj)
    console.log("cnpj_full sem pontos:", cnpj_full)
    console.log("cnpj_base:", cnpj_base)
    console.log("cnpj_ordem:", cnpj_ordem)
    console.log("cnpj_dv:", cnpj_dv)
    //console.log("select buscar_detalhes_CNAE: ", query)
    return this.conexao.query(query, callback)
  }
  
	// CNAE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //SOCIOS

	consultar_SOCIOS_SQL(isCount, { nome_socio, cpf, cnpj, identificador_socio, cod_qualificacao_responsavel_socio, porte_empresa, uf, municipio, cod_situacao_cadastral, razao_social, cod_natureza_juridica, cnae, pagina }) {
		pagina = isBlank(pagina) ? 1 : parseInt(pagina)

		if (pagina === 1) {
			pagina = 0
		} else {
			pagina--
			pagina = parseInt(pagina) * 20 + 1
		}
		let cnpj1 = cnpj.replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
		let projection = isCount
			? "count(1) as count_query"
			: `
      'consultar_SOCIOS_SQL',
      
      (
        CASE 
            WHEN CHAR_LENGTH(GetNumber(empresas.razao)) > 8
            THEN uExtractNonNumbersFromString(empresas.razao)
            ELSE (empresas.razao)
        END
      ) AS rs_1,
     (
                  CASE 
                      WHEN YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao) is not null and  estabelecimentos.situacao ='08'
                      THEN CONCAT(YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao),' ano(s) baixada. Funcionou por ', YEAR(estabelecimentos.data_situacao) - YEAR(estabelecimentos.inicio_atividade), ' anos')
                      ELSE CONCAT('Aberta a ', YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade),' Anos. ', YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao),' anos desde ultima atualização')
                  END
                ) AS Status,
   

  
    (
          CASE
         when estabelecimentos.cnpj is null then empresas.cnpj
         else CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
         END
          ) as cnpj,
       (CASE
          When estabelecimentos.pais is NULL then 'Brasil'
          Else estabelecimentos.pais
          END) as pais,
          (case
            WHEN estabelecimentos.nome is NULL 
            then '*****' 
            Else
            estabelecimentos.nome
            END
            ) as nome_fantasia,
      estabelecimentos.matriz_filial as identificador_matriz_filial,
      estabelecimentos.situacao as situacao_cadastral,
      estabelecimentos.data_situacao as data_situacao_cadastral,
      estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
      estabelecimentos.cidade_exterior as nm_cidade_exterior,
      estabelecimentos.pais as cod_pais,
      estabelecimentos.inicio_atividade as data_inicio_atividade,
      estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
      (
        CASE
            WHEN tab_cidade.nome  is  null
            THEN 'Exterior'
            ELSE (tab_cidade.nome)
        END
      ) AS municipio,
      estabelecimentos.municipio as codigo_municipio,
    
    (CASE
    When estabelecimentos.ddd_1 is not null and estabelecimentos.telefone_1 is not null then CONCAT(estabelecimentos.ddd_1,'-',estabelecimentos.telefone_1 )
    
    END) as ddd_telefone_1,
    (CASE
    When estabelecimentos.ddd_2 is not null and estabelecimentos.telefone_2 is not null then CONCAT(estabelecimentos.ddd_2,'-',estabelecimentos.telefone_2 )
    
    END) as ddd_telefone_2,
    (CASE
    When estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then CONCAT(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax )
    
    END) as ddd_telefone_2,
      estabelecimentos.email as correio_eletronico,
 

      socios.cnpj,
      socios.identificador_socio,
      socios.nome AS nome_socio,
      socios.cpf_cnpj AS cpf,
      socios.qualificacao,
      socios.data_entrada_sociedade,
      socios.codigo_pais,
      socios.cpf_representante_legal,
      socios.nome_representante_legal,
      socios.qualificacao_representante_legal,
      socios.faixa_etaria,
     (Select (CASE
      when cnpj_holdings.cnpj_socia is not null then concat(empresas.razao, ' - Holding')
      else  empresas.razao
        END)) as razao_social,
      
      cnpj_status.nm_sit_cadastral AS sit_cadastral,
      (CASE
          WHEN
              tab_cidade.nome IS NULL
          THEN
              CONCAT((estabelecimentos.municipio),
                      ' / ',
                      (estabelecimentos.pais))
          ELSE (tab_cidade.nome)
      END) AS municipio,
      estabelecimentos.uf AS uf,
      tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio AS qualificacao,
      DATE_FORMAT(socios.data_entrada_sociedade,
              '%d/%m/%Y') AS data_entrada,
      YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) AS age,
      YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) AS tempo_empresa,
      YEAR(CURDATE()) - YEAR(socios.data_entrada_sociedade) AS tempo_sociedade,
      estabelecimentos.telefone_1 AS fone_principal,
      estabelecimentos.email AS email,
      tab_qualificacao_responsavel_socio.*,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS porte_empresa,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS nm_porte,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS porte,
      tab_identifica_socio.idt_socio AS tipo_socio`
		let query = `SELECT  ${projection}

    FROM
    socios
        LEFT JOIN
    estabelecimentos ON socios.cnpj = estabelecimentos.cnpj
        LEFT JOIN
    dados_simples ON socios.cnpj = dados_simples.cnpj
        LEFT JOIN
    empresas ON socios.cnpj = empresas.cnpj
        LEFT JOIN
    tab_identifica_socio ON tab_identifica_socio.cod = socios.identificador_socio
        LEFT JOIN
    cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao
        LEFT JOIN
    tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = socios.qualificacao
        LEFT JOIN
    tab_cidade ON estabelecimentos.municipio = tab_cidade.cod_tom
        LEFT JOIN
    tab_porte_empresa ON tab_porte_empresa.id = empresas.porte
    left join cnpj_holdings
    on cnpj_holdings.cnpj_socia = CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)

where  1 = 1 
and estabelecimentos.situacao = '02'
                
`

		const params = []

		if (!isBlank(nome_socio)) {
			query += " and socios.nome  LIKE ? "
			params.push(`${nome_socio}%`)
		}
		if (!isBlank(cpf)) {
			query += " and socios.cpf_cnpj = REPLACE(REPLACE(REPLACE(CONCAT('***',substring(?,4,8),'**'),'.', ''),'-', ''),'/', '')  "
			params.push(cpf)
		}
		if (!isBlank(cnpj)) {
			query += " and socios.cpf_cnpj = REPLACE(REPLACE(REPLACE(?,'.', ''),'-', ''),'/', '')"
			params.push(cnpj)
		}
		if (!isBlank(identificador_socio)) {
			query += " and socios.identificador_socio = ? "
			params.push(identificador_socio)
		}
		if (!isBlank(cod_qualificacao_responsavel_socio)) {
			query += " and socios.qualificacao in (?) "
			const cod_qualificacao_responsavel_socio_array = cod_qualificacao_responsavel_socio.split(",")
			params.push(cod_qualificacao_responsavel_socio_array)
		}
		if (!isBlank(porte_empresa)) {
			query += " and empresas.porte = ? "
			const porte_empresa_array = porte_empresa.split(",")
			params.push(porte_empresa_array)
		}

		if (!isBlank(uf)) {
			query += " and estabelecimentos.uf = ? "
			params.push(uf)
		}

		if (!isBlank(municipio)) {
			query += " estabelecimentos.municipio in (?) "
			const municipio_array = municipio.split(",")
			params.push(municipio_array)
		}

		if (!isBlank(cod_situacao_cadastral)) {
			query += " and estabelecimentos.situacao in (?) "
			const cod_situacao_cadastral_array = cod_situacao_cadastral.split(",")
			params.push(cod_situacao_cadastral_array)
		}

		if (!isBlank(razao_social)) {
			query += " and empresas.razao LIKE ? "
			params.push(`${razao_social}%`)
		}

		if (!isBlank(cod_natureza_juridica)) {
			query += " and empresas.natureza = ? "
			params.push(cod_natureza_juridica)
		}

		console.log("consultar_SOCIOS_SQL")

		if (!isCount) query += ` LIMIT ${pagina}, 20 `

		return this.execQuery(query, params)
	}

	buscar_detalhes_SOCIOS(nome_socio, cpf, callback) {
		let projection = ` 
  
    'buscar_detalhes_SOCIOS',
  
  socios.nome as nome_socio,
  socios.cpf_cnpj,
  
    (select count(Distinct(socios.cnpj)) from socios
     where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}')
  as qtd_empresas,
 
  (
  select count(DISTINCT(estabelecimentos.uf)) FROM datafinder.estabelecimentos
  where estabelecimentos.cnpj in
    (
    select Distinct(socios.cnpj) from socios
     where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'))
    
    
  AS qtd_estados,
  
  
    (select sum(empresas.capital) FROM datafinder.empresas
   
    where empresas.cnpj
  in
  (
    select Distinct(socios.cnpj) from socios
     where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'))
  
  as patrimonio,

  
  
  (select count(distinct(estabelecimentos.municipio)) FROM datafinder.estabelecimentos
    left join socios
    on
    socios.cnpj=estabelecimentos.cnpj
    where estabelecimentos.cnpj
   in
  (
    select Distinct(socios.cnpj) from socios
     where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'))
  
    as qtd_municipios,
  
    (select count(distinct(cnpj_dividas.numero_inscricao)) FROM datafinder.cnpj_dividas
  
    where cnpj_dividas.cpf_cnpj
  in
  (
    select CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
    from socios
    left join estabelecimentos
    on
    socios.cnpj=estabelecimentos.cnpj
     where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'))
  
    as dividas,
    (select SUM(cnpj_dividas.valor_consolidado) FROM datafinder.cnpj_dividas
  
    where cnpj_dividas.cpf_cnpj
  in
  (
    select CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
    from socios
    left join estabelecimentos
    on
    socios.cnpj=estabelecimentos.cnpj
     where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'))
  
    as divida_total,
  
    (select count(distinct(cnpj_holdings.cnpj_socia)) FROM datafinder.cnpj_holdings
  
    where cnpj_holdings.cnpj_socia
    in
  (
    select CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
    from socios
    left join estabelecimentos
    on
    socios.cnpj=estabelecimentos.cnpj
     where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'))
  
    as qtd_holdings,
  
    (select count(distinct(cnpj_holdings.cnpj))as qtd_subsidiarias FROM datafinder.cnpj_holdings
  
    where cnpj_holdings.cnpj_socia
    in
  (
    select CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
    from socios
    left join estabelecimentos
    on
    socios.cnpj=estabelecimentos.cnpj
     where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'))
  
    as qtd_subsidiarias
  
   `
		let query = `SELECT  ${projection}

  from socios
  where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'
  group by socios.nome


  `

		console.log("buscar_detalhes_SOCIOS")

		return this.conexao.query(query, callback)
	}

	buscar_detalhes_SOCIOS_inner(nome_socio, cpf, callback) {
		let projection = `
    'buscar_detalhes_SOCIOS_inner',
  (
    CASE
   when estabelecimentos.cnpj is null then empresas.cnpj
   else CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
   END
    ) as cnpj,
  socios.id,

  socios.identificador_socio,
  
  socios.cpf_cnpj,
  socios.qualificacao,
  (  CASE
    when estabelecimentos.situacao <> '02'  and YEAR(estabelecimentos.data_situacao) - YEAR(estabelecimentos.inicio_atividade) < 1 then   CONCAT(TIMESTAMPDIFF(MONTH, estabelecimentos.inicio_atividade,estabelecimentos.data_situacao ), ' Mes(es)')
     when estabelecimentos.situacao <> '02'  and YEAR(estabelecimentos.data_situacao) - YEAR(estabelecimentos.inicio_atividade) > 1 then   CONCAT(YEAR(estabelecimentos.data_situacao) - YEAR(estabelecimentos.inicio_atividade), ' Ano(s)')
     when estabelecimentos.situacao <> '02'  and YEAR(CURDATE()) - YEAR(inicio_atividade) < 1 then   CONCAT(TIMESTAMPDIFF(MONTH, estabelecimentos.inicio_atividade,YEAR(CURDATE()) ), ' Mes(es)')
        when estabelecimentos.situacao = '02'  then   CONCAT(YEAR(CURDATE()) - YEAR(inicio_atividade), ' Ano(s)')
         ELSE '' 
  
      END)  AS tempo_funcionamento,
      
           (  CASE
     when estabelecimentos.situacao <> '02'   and  estabelecimentos.matriz_filial = '1' and YEAR(estabelecimentos.data_situacao) - YEAR(socios.data_entrada_sociedade) < 1 then   CONCAT(TIMESTAMPDIFF(MONTH, socios.data_entrada_sociedade,estabelecimentos.data_situacao ), ' Mes(es) ')
     when estabelecimentos.situacao <> '02'   and  estabelecimentos.matriz_filial = '2' and YEAR(estabelecimentos.data_situacao) - YEAR(estabelecimentos.inicio_atividade) < 1 then   CONCAT(TIMESTAMPDIFF(MONTH, estabelecimentos.inicio_atividade,estabelecimentos.data_situacao ), ' Mes(es) ')
     when estabelecimentos.situacao <> '02'   and  estabelecimentos.matriz_filial = '1' and YEAR(estabelecimentos.data_situacao) - YEAR(socios.data_entrada_sociedade) > 1 then   CONCAT(YEAR(estabelecimentos.data_situacao) - YEAR(socios.data_entrada_sociedade), ' Ano(s) ')
    when estabelecimentos.situacao = '02'   and YEAR(CURDATE()) - YEAR(socios.data_entrada_sociedade) < 1 then   CONCAT(TIMESTAMPDIFF(MONTH, socios.data_entrada_sociedade,YEAR(CURDATE()) ), ' Mes(es) ')
      when estabelecimentos.situacao = '02'   and YEAR(CURDATE()) - YEAR(socios.data_entrada_sociedade) > 1 then   CONCAT(YEAR(CURDATE()) - YEAR(socios.data_entrada_sociedade), ' Ano(s) ')
         ELSE '' 
  
      END)  AS tempo_sociedade_total,
      
  socios.codigo_pais,
  socios.cpf_representante_legal,
  socios.nome_representante_legal,
  socios.qualificacao_representante_legal,
  socios.faixa_etaria,
socios.nome as nome_socio,
socios.cpf_cnpj,
socios.qualificacao,

(CASE
  when socios.cnpj is null then ''
        WHEN
            socios.nome is not  null
  
        THEN
          DATE_FORMAT(socios.data_entrada_sociedade,'%d/%m/%Y')
  
    END)  AS data_entrada_sociedade,


socios.cpf_representante_legal,


(case
  WHEN estabelecimentos.nome is NULL 
  then '*****' 
  Else
  estabelecimentos.nome
  END
  ) as nome_fantasia,
    estabelecimentos.matriz_filial as identificador_matriz_filial,
    estabelecimentos.situacao as situacao_cadastral,
    estabelecimentos.data_situacao as data_situacao_cadastral,
    estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
    estabelecimentos.cidade_exterior as nm_cidade_exterior,
    estabelecimentos.pais as cod_pais,
    estabelecimentos.inicio_atividade as data_inicio_atividade,
    
					 
    estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
    (
      CASE
          WHEN tab_cidade.nome  is  null
          THEN 'Exterior'
          ELSE (tab_cidade.nome)
      END
    ) AS municipio,
    estabelecimentos.municipio as codigo_municipio,
	
	(CASE
	When estabelecimentos.ddd_1 is not null and estabelecimentos.telefone_1 is not null then CONCAT(estabelecimentos.ddd_1,'-',estabelecimentos.telefone_1 )
	
	END) as ddd_telefone_1,
	(CASE
	When estabelecimentos.ddd_2 is not null and estabelecimentos.telefone_2 is not null then CONCAT(estabelecimentos.ddd_2,'-',estabelecimentos.telefone_2 )
	
	END) as ddd_telefone_2,
	(CASE
	When estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then CONCAT(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax )
	
	END) as ddd_telefone_2,
						
    estabelecimentos.email as correio_eletronico,

    tab_serp.domain,

    empresas.razao as razao_social,
    empresas.natureza as codigo_natureza_juridica,
    empresas.qualificacao_pf as qualificacao_responsavel,
   CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital_social_empresa,
    empresas.porte as porte_empresa,

cnpj_status.nm_sit_cadastral as sit_cadastral,

tab_matriz_filial.nm_matriz_filial,
tab_cnae_up.nome as nm_cnae,
tab_cnae_up.nm_setor as setor,
(
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS porte_empresa,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS nm_porte,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS porte,
estabelecimentos.telefone_1 as fone_1,
  
(CASE
  WHEN tab_pcd.id IS NOT NULL THEN 'PCD'
  ELSE 'Nenhuma'
END) AS lei_pcd,
(CASE
  WHEN a.id IS NOT NULL THEN 'beneficio_sim'
  ELSE 'beneficio_nao'
END) AS beneficiado,
(CASE
  WHEN b.id IS NOT NULL THEN 'com_sancao'
  ELSE 'sem_sancao'
END) AS sancoes,
(CASE
  WHEN c.id IS NOT NULL THEN 'acordo_leniencia_sim'
  ELSE 'acordo_leniencia_nao'
END) AS acordo_leniencia,
(CASE
  WHEN d.id IS NOT NULL THEN 'esfl_impedidas_sim'
  ELSE 'esfl_impedidas_nao'
END) AS esfl_impedidas,
(CASE
  WHEN
      (SELECT 
              COUNT(id)
          FROM
              tab_pcd) > 0
  THEN
      (SELECT 
              COUNT(id)
          FROM
              tab_pcd)
  ELSE 'Sem autuacoes PCD'
END) AS pcd,
(SELECT 
      (CASE
              WHEN
                  (SELECT 
                          CAST(id AS DECIMAL)
                      FROM
                          cnpj_dividas
                      WHERE
                          cnpj_dividas.cpf_cnpj = CONCAT(estabelecimentos.cnpj,
                                  estabelecimentos.cnpj_ordem,
                                  estabelecimentos.cnpj_dv)
                      LIMIT 1) IS NULL
              THEN
                  0
              ELSE 1
          END)
  ) AS tem_divida,
  
YEAR(CURDATE()) - YEAR(inicio_atividade) AS age
   `
		let query = `SELECT  ${projection}
  
  FROM socios
  socios
  LEFT JOIN
empresas ON socios.cnpj = empresas.cnpj
  LEFT JOIN
estabelecimentos ON empresas.cnpj = estabelecimentos.cnpj
  LEFT JOIN
dados_simples ON estabelecimentos.cnpj = dados_simples.cnpj
  LEFT JOIN
cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao
  LEFT JOIN
tab_matriz_filial ON tab_matriz_filial.id = estabelecimentos.matriz_filial
  LEFT JOIN
tab_porte_empresa ON tab_porte_empresa.id = empresas.porte
  LEFT JOIN
tab_cnae_up ON tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
  LEFT JOIN
tab_cidade ON tab_cidade.cod_tom = estabelecimentos.municipio
  LEFT JOIN
tab_serp ON empresas.cnpj = tab_serp.cnpj_base
 LEFT JOIN
tab_pcd ON tab_pcd.cnpj = CONCAT(estabelecimentos.cnpj,
      estabelecimentos.cnpj_ordem,
      estabelecimentos.cnpj_dv)
  LEFT JOIN
tab_ie ON tab_ie.cnpj = CONCAT(estabelecimentos.cnpj,
      estabelecimentos.cnpj_ordem,
estabelecimentos.cnpj_dv)
      left join autuacoes.tab_cnpj_beneficiado a
      on
     a.cnpj=CONCAT(estabelecimentos.cnpj,
      estabelecimentos.cnpj_ordem,
      estabelecimentos.cnpj_dv)

      left join autuacoes.tab_cnpj_iniesus b
      on
     b.cpf_ou_cnpj_do_sancionado=CONCAT(estabelecimentos.cnpj,
      estabelecimentos.cnpj_ordem,
      estabelecimentos.cnpj_dv)

      left join autuacoes.tab_cnpj_acordo_leniencia c
      on
     c.cnpj_do_sancionado=CONCAT(estabelecimentos.cnpj,
      estabelecimentos.cnpj_ordem,
      estabelecimentos.cnpj_dv)

      left join autuacoes.tab_cnpj_esfl_impedidas d
      on
     d.cnpj_entidade=CONCAT(estabelecimentos.cnpj,
      estabelecimentos.cnpj_ordem,
      estabelecimentos.cnpj_dv)
      
  where  socios.nome = '${nome_socio}'  and socios.cpf_cnpj = '${cpf}'
  group by estabelecimentos.cnpj ,estabelecimentos.cnpj_ordem order by sit_cadastral
  `

	
		console.log("DETALHES_SOCIOS_inner")

		return this.conexao.query(query, callback)
	}


  //FIM SOCIOS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DIVIDAS
	consultarDividas(isCount, { razao_social, nome_socio, cnpj, cpf, cod_situacao_cadastral, porte_empresa, numero_inscricao, tipo_devedor, tipo_situacao_inscricao, sit_geral, tipo_divida, indicador_ajuizado, uf, municipio, data_inscricao_inicio, data_inscricao_fim, valor_divida_acima, valor_divida_abaixo, pagina }) {
		pagina = isBlank(pagina) ? 1 : parseInt(pagina)

		if (pagina === 1) {
			pagina = 0
		} else {
			pagina--
			pagina = parseInt(pagina) * 20 + 1
		}
		let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
		let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
		let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
		let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)

		let projection = isCount
			? "count(DISTINCT(cnpj_dividas.cpf_cnpj)) as count_query"
			: `
      'consultarDividas',
      (CASE when tab_ie.inscricao_estadual is not null then group_concat(DISTINCT(tab_ie.inscricao_estadual)) else 'Sem Inscrição Estadual' END) as ie, group_concat(DISTINCT(tab_ie.uf_ie)) as ie_uf, (CASE WHEN tab_pcd.id is not null then 'PCD' else 'Nenhuma' END) as lei_pcd,
      (CASE when a.id is not null then 'beneficio_sim' else 'beneficio_nao' END) as beneficiado,
      (CASE when b.id is not null then 'com_sancao' else 'sem_sancao' END ) as sancoes,
      (CASE when c.id is not null then 'acordo_leniencia_sim' else 'acordo_leniencia_nao' END) as acordo_leniencia,
      substring(cnpj_dividas.cpf_cnpj,1,8) as cnpj_base,
      substring(cnpj_dividas.cpf_cnpj,9,4) as cnpj_ordem,
      substring(cnpj_dividas.cpf_cnpj,13,2) as cnpj_dv,
      (CASE WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email <> '' and dados_simples.opcao_mei is NULL THEN CAST('100' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email <> '' and dados_simples.opcao_mei = 'n' THEN CAST('100' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email <> '' and dados_simples.opcao_mei = 's' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email = '' and dados_simples.opcao_mei is NULL THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email = '' and dados_simples.opcao_mei = 'n' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email = '' and dados_simples.opcao_mei = 's' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email <> '' and dados_simples.opcao_mei is NULL THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email <> '' and dados_simples.opcao_mei = 'n' THEN CAST('75' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email <> '' and dados_simples.opcao_mei = 's' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email = '' and dados_simples.opcao_mei is NULL THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email = '' and dados_simples.opcao_mei = 'n' THEN CAST('50' AS DECIMAL) WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email = '' and dados_simples.opcao_mei = 's' THEN CAST('25' AS DECIMAL) WHEN estabelecimentos.situacao <> '2' THEN CAST('0' AS DECIMAL) ELSE 'Faltando' END ) AS ranking,
      cnpj_dividas.id,
      cnpj_dividas.cpf_cnpj,
      cnpj_dividas.tipo_pessoa,
      cnpj_dividas.tipo_devedor,
      cnpj_dividas.nome_devedor,
      cnpj_dividas.uf_unidade_responsavel,
      cnpj_dividas.unidade_responsavel,
      cnpj_dividas.entidade_responsavel,
      cnpj_dividas.unidade_inscricao,
      cnpj_dividas.numero_inscricao,
      cnpj_dividas.tipo_situacao_inscricao,
      cnpj_dividas.situacao_inscricao,
      cnpj_dividas.receita_principal,
      cnpj_dividas.data_inscricao,
      cnpj_dividas.indicador_ajuizado,
      count(distinct(numero_inscricao)) as qtd_dividas,
      cnpj_dividas.valor_consolidado,
      cnpj_dividas.tipo_credito,
      cnpj_dividas.tipo_divida,
      cnpj_dividas.sit_geral,
      cnpj_dividas.tipo_situacao_inscricao as situacao_inscricao,
      cnpj_dividas.nome_devedor as razao_social,
      (case WHEN estabelecimentos.nome is NULL then '*****' Else estabelecimentos.nome END ) as nome_fantasia,
      estabelecimentos.matriz_filial as identificador_matriz_filial,
      (CASE when estabelecimentos.situacao is null then 'Baixada' else estabelecimentos.situacao END)as situacao_cadastral,
      estabelecimentos.data_situacao as data_situacao_cadastral,
      estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
      estabelecimentos.cidade_exterior as nm_cidade_exterior,
      estabelecimentos.pais as cod_pais,
      estabelecimentos.inicio_atividade as data_inicio_atividade,
      estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
      estabelecimentos.municipio as codigo_municipio,
     
      estabelecimentos.situacao,
      cnpj_status.nm_sit_cadastral as sit_cadastral,
      tab_situacao_cadastral.nm_situacao_cadastral,
      (CASE when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF' else estabelecimentos.uf END) as uf,
      estabelecimentos.telefone_1,
      (CASE WHEN empresas.porte is null THEN 'Porte não Declarado' ELSE empresas.porte END ) AS porte_empresa,
      (CASE WHEN empresas.porte is null THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END ) AS porte_empresa,
      (CASE WHEN empresas.porte is null THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END ) AS nm_porte,
      tab_matriz_filial.nm_matriz_filial,
      (CASE WHEN empresas.porte is null THEN 'Porte não Declarado' ELSE tab_porte_empresa.nm_porte END ) AS porte,
      CAST(empresas.capital as UNSIGNED) AS capital,
      (Select SUM(DISTINCT(cnpj_dividas.valor_consolidado)) )as valor_consolidado_total,
      CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS capital_social_empresa,
      tab_dados_economicos.id_empresa as id_empresa_bolsa,
      (Case when tab_cad_fi.tp_fundo = 'fi' and tab_cad_fi.sit <> 'cancelado' then CONCAT('FI - ',tab_dados_economicos.ativo,' - Fundo Ativo') when tab_cad_fi.tp_fundo = 'fi' and tab_cad_fi.sit = 'cancelado' then CONCAT('FI - ',tab_dados_economicos.ativo,' - Fundo Cancelado') when tab_dados_economicos.ativo is null then 'Não Listado B.V.' else tab_dados_economicos.ativo end ) as ativo,
      (case when tab_dados_economicos.principal_acionista is null then 'Sem informações' when tab_dados_economicos.principal_acionista = '-' then 'Sem informações' when CAST( tab_dados_economicos.principal_acionista AS UNSIGNED ) <> 0 then 'Sem informações' else tab_dados_economicos.principal_acionista END) as principal_acionista ,
      tab_dados_economicos.nome as nome_empresa_bolsa,
      tab_dados_economicos.cnpj_base as cnpj_base_bolsa ,
      tab_dados_economicos.pais_sede,
      tab_dados_economicos.setor_naics,
      tab_dados_economicos.setor_economatica,
      tab_dados_economicos.setor_economico_bovespa,
      tab_dados_economicos.subsetor_bovespa,
      tab_dados_economicos.segmento_bovespa,
      tab_dados_economicos.situacao_cvm,
      tab_dados_economicos.ativo_cancelado,
      tab_dados_economicos.moeda_balancos,
      tab_dados_economicos.data_do_balanco,
      (CASE WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '01' THEN 'R$ 360.000,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '03' THEN 'R$ 4.800.000,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte = '05' THEN 'R$ 0,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND empresas.porte IS NULL AND dados_simples.opcao_mei IS NULL AND dados_simples.opcao_simples IS NULL THEN 'R$ 0,00' WHEN tab_dados_economicos.receita_liquida_faturamento IS NULL AND dados_simples.opcao_mei = 's' THEN 'R$ 81.000,00' ELSE CONCAT('R$ ',CAST(tab_dados_economicos.receita_liquida_faturamento AS UNSIGNED)) END) AS faturamento,
      (case when tab_dados_economicos.valor_mercado_empresa_2022 is null then '0' else CAST(tab_dados_economicos.valor_mercado_empresa_2022 AS UNSIGNED) end) as valor_mercado_atual,
      (case when tab_dados_economicos.enterprise_value_2022 is null then '0' else CAST(tab_dados_economicos.enterprise_value_2022 AS UNSIGNED) end) as valor_real_empresa,
      CAST(tab_dados_economicos.ativo_tot AS UNSIGNED) as total_ativos,
      CAST(tab_dados_economicos.patrimonio_liquido AS UNSIGNED) as patrimonio_liquido_bolsa,
      CAST(tab_dados_economicos.receita_liquida_faturamento AS UNSIGNED) as receita_liquida_faturamento,
      CAST(tab_dados_economicos.lucro_bruto AS UNSIGNED) as lucro_bruto,
      CAST(tab_dados_economicos.ebitda AS UNSIGNED) as ebitda,
      CAST(tab_dados_economicos.lucro_liquido AS UNSIGNED) as lucro_liquido,
      CAST(tab_dados_economicos.vendas_acao_2021 AS UNSIGNED) as vendas_acao_2021,
      CAST(tab_dados_economicos.valor_mercado_empresa_2022 AS UNSIGNED)as valor_mercado_atual ,
      CAST(tab_dados_economicos.valor_mercado_empresa_31dez16 AS UNSIGNED) as valor_mercado_empresa_2016,
      CAST(tab_dados_economicos.valor_mercado_empresa_31dez17 AS UNSIGNED)as valor_mercado_empresa_2017,
      CAST(tab_dados_economicos.valor_mercado_empresa_31dez18 AS UNSIGNED)as valor_mercado_empresa_2018,
      CAST(tab_dados_economicos.valor_mercado_empresa_31dez19 AS UNSIGNED)as valor_mercado_empresa_2019,
      CAST(tab_dados_economicos.valor_mercado_empresa_31dez20 AS UNSIGNED)as valor_mercado_empresa_2020,
      CAST(tab_dados_economicos.valor_mercado_empresa_31dez21 AS UNSIGNED)as valor_mercado_empresa_2021,
      CAST(tab_dados_economicos.valor_mercado_empresa_22 AS UNSIGNED)as valor_mercado_empresa_2022,
      CAST(tab_dados_economicos.enterprise_value_2022 AS UNSIGNED)as valor_real_empresa,
      CAST(tab_dados_economicos.enterprise_value_31dez17 AS UNSIGNED) as valor_real_empresa_2017,
      CAST(tab_dados_economicos.enterprise_value_31dez18 AS UNSIGNED) as valor_real_empresa_2018,
      CAST(tab_dados_economicos.enterprise_value_31dez19 AS UNSIGNED) as valor_real_empresa_2019,
      CAST(tab_dados_economicos.enterprise_value_31dez20 AS UNSIGNED) as valor_real_empresa_2020,
      CAST(tab_dados_economicos.enterprise_value_31dez21 AS UNSIGNED) as valor_real_empresa_2021,
      CAST(tab_dados_economicos.enterprise_value_2022_1 AS UNSIGNED) as valor_real_empresa_2022,
      CAST(tab_dados_economicos.ativo_circulante AS UNSIGNED) as ativo_circulante,
      CAST(tab_dados_economicos.capex AS UNSIGNED) as capex
  
  
       `
		let query = ` select  ${projection}
     
    from
    cnpj_dividas
    left join estabelecimentos on estabelecimentos.cnpj=substring(cnpj_dividas.cpf_cnpj,1,8) and estabelecimentos.cnpj_ordem=substring(cnpj_dividas.cpf_cnpj,9,4)
    left join empresas on empresas.cnpj=substring(cnpj_dividas.cpf_cnpj,1,8)
    left join dados_simples on dados_simples.cnpj=substring(cnpj_dividas.cpf_cnpj,1,8)
    left join cnpj_status on cnpj_status.cod_sit_cad = estabelecimentos.situacao
    left join tab_qualificacao_responsavel_socio on tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf
    left join tab_matriz_filial on tab_matriz_filial.id = estabelecimentos.matriz_filial
    left join tab_situacao_cadastral on tab_situacao_cadastral.cod_situacao_cadastral = estabelecimentos.situacao
    left join tab_natureza_juridica on tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
    left join tab_opcao_simples on tab_opcao_simples.cod = dados_simples.opcao_simples
    left join tab_porte_empresa on tab_porte_empresa.id = empresas.porte
    left join tab_cidade on tab_cidade.cod_tom = estabelecimentos.municipio
    left join tab_dividas_tipo_sit_insc on cnpj_dividas.tipo_situacao_inscricao = tab_dividas_tipo_sit_insc.id
    left join tab_dados_economicos on tab_dados_economicos.cnpj_base = empresas.cnpj
    left join socios on estabelecimentos.cnpj=socios.cnpj
    left join tab_cad_fi on tab_cad_fi.cnpj_fundo=concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
    left join tab_pcd on tab_pcd.cnpj = concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join tab_ie on tab_ie.cnpj = concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join autuacoes.tab_cnpj_beneficiado a on a.cnpj=concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join autuacoes.tab_cnpj_iniesus b on b.cpf_ou_cnpj_do_sancionado=concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join autuacoes.tab_cnpj_acordo_leniencia c on c.cnpj_do_sancionado=concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    left join autuacoes.tab_cnpj_esfl_impedidas d on d.cnpj_entidade=concat(estabelecimentos.cnpj, estabelecimentos.cnpj_ordem, estabelecimentos.cnpj_dv)
    
    where
    1 = 1
    and estabelecimentos.situacao = '02'
      `

		const params = []

    if (!isBlank(cnpj_full)) {
			query += " and cnpj_dividas.cpf_cnpj LIKE ?  "
			params.push(`${cnpj_full}%`)
		}
    
		if (!isBlank(cpf)) {
			query += " and socios.cpf_cnpj = REPLACE(REPLACE(REPLACE(CONCAT('***',substring(?,4,8),'**'),'.', ''),'-', ''),'/', '') "
			params.push(cpf)
		}
		if (!isBlank(cod_situacao_cadastral)) {
			query += " and estabelecimentos.situacao in (?) "
			const cod_situacao_cadastral_array = cod_situacao_cadastral.split(",")
			params.push(cod_situacao_cadastral_array)
		}
		if (!isBlank(razao_social)) {
			query += " and cnpj_dividas.nome_devedor LIKE ? "
			params.push(`${razao_social}%`)
		}

		if (!isBlank(nome_socio)) {
			query += " and socios.nome LIKE ? "
			params.push(`${nome_socio}%`)
		}
		if (!isBlank(porte_empresa)) {
			query += " and empresas.porte in (?) "
			const porte_empresa_array = porte_empresa.split(",")
			params.push(porte_empresa_array)
		}
		if (!isBlank(numero_inscricao)) {
			query += " and cnpj_dividas.numero_inscricao = ? "
			params.push(numero_inscricao)
		}
		if (!isBlank(tipo_devedor)) {
			query += " and cnpj_dividas.tipo_devedor in (?) "
			const tipo_devedor_array = tipo_devedor.split(",")
			params.push(tipo_devedor_array)
		}
		if (!isBlank(tipo_situacao_inscricao)) {
			query += " and cnpj_dividas.tipo_situacao_inscricao in (?) "
			const tipo_situacao_inscricao_array = tipo_situacao_inscricao.split(",")
			params.push(tipo_situacao_inscricao_array)
		}
		if (!isBlank(sit_geral)) {
			query += " and cnpj_dividas.sit_geral in (?) "
			const sit_geral_array = sit_geral.split(",")
			params.push(sit_geral_array)
		}
		if (!isBlank(tipo_divida)) {
			query += " and cnpj_dividas.tipo_divida in (?) "
			const tipo_divida_array = tipo_divida.split(",")
			params.push(tipo_divida_array)
		}
		if (!isBlank(indicador_ajuizado)) {
			query += " and cnpj_dividas.indicador_ajuizado = ? "
			params.push(indicador_ajuizado)
		}

		if (!isBlank(uf)) {
			query += " and estabelecimentos.uf = ? "
			params.push(uf)
		}

		if (!isBlank(municipio)) {
			query += " estabelecimentos.municipio = ?  "
			params.push(municipio)
		}
		if (!isBlank(data_inscricao_inicio)) {
			query += " and cnpj_dividas.data_inscricao >= ?  "
			params.push(data_inscricao_inicio)
		}
		if (!isBlank(data_inscricao_fim)) {
			query += " and cnpj_dividas.data_inscricao <= ?  "
			params.push(data_inscricao_fim)
		}
		if (!isBlank(valor_divida_acima)) {
			query += " and cnpj_dividas.valor_consolidado >= convert(?, decimal)  "
			params.push(valor_divida_acima)
		}

		if (!isBlank(valor_divida_abaixo)) {
			query += " and cnpj_dividas.valor_consolidado <= convert(?, decimal)  "
			params.push(valor_divida_abaixo)
		}

		console.log("consultarDividas")
		console.log(cnpj_base)

		if (!isCount) query += `  group by cnpj_dividas.cpf_cnpj ORDER BY ranking * 1 DESC,tab_matriz_filial.nm_matriz_filial DESC LIMIT ${pagina}, 20 `

		return this.execQuery(query, params)
	}

	buscar_detalhes_DIVIDAS(cpf_cnpj, callback) {
    let cnpj_full = cpf_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
		let cnpj_base = cpf_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
		let cnpj_ordem = cpf_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
		let cnpj_dv = cpf_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)

		let projection = `
     
    distinct cnpj_dividas.cpf_cnpj,
'buscar_detalhes_dividas',
datalake.tab_estatisticas_cnpj.pcd as pcd_estatisticas,
datalake.tab_estatisticas_cnpj.beneficiado as beneficiado_estatisticas,
datalake.tab_estatisticas_cnpj.sancoes as sancoes_estatisticas,
datalake.tab_estatisticas_cnpj.acordo_leniencia as acordo_leniencia_estatisticas,
datalake.tab_estatisticas_cnpj.divida_sit_geral_regular as divida_sit_geral_regular_estatisticas,
datalake.tab_estatisticas_cnpj.divida_sit_geral_iregular as divida_sit_geral_iregular_estatisticas,
datalake.tab_estatisticas_cnpj.divida_valor_consolidado_total as divida_valor_consolidado_total_estatisticas,
datalake.tab_estatisticas_cnpj.divida_qtd_dividas as divida_qtd_dividas_estatisticas,
(case when char_length(getnumber(empresas.razao)) > 8 then uextractnonnumbersfromstring(empresas.razao) else (empresas.razao) end ) as rs_1,
(case when year(curdate()) - year(estabelecimentos.data_situacao) is not null and estabelecimentos.situacao ='08' then concat(year(curdate()) - year(estabelecimentos.data_situacao),' ano(s) baixada. funcionou por ', year(estabelecimentos.data_situacao) - year(estabelecimentos.inicio_atividade), ' anos') else concat('aberta a ', year(curdate()) - year(estabelecimentos.inicio_atividade),' anos. ', year(curdate()) - year(estabelecimentos.data_situacao),' anos desde ultima atualização') end ) as status,
(case when estabelecimentos.cnpj is null then empresas.cnpj else concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) end ) as cnpj,
(case when estabelecimentos.pais is null then 'brasil' else estabelecimentos.pais end) as pais,
(case when estabelecimentos.nome is null then '*****' else estabelecimentos.nome end ) as nome_fantasia,
tab_matriz_filial.nm_matriz_filial,
cnpj_status.nm_sit_cadastral as sit_cadastral,
estabelecimentos.matriz_filial as identificador_matriz_filial,
estabelecimentos.situacao as situacao_cadastral,
estabelecimentos.data_situacao as data_situacao_cadastral,
estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
estabelecimentos.cidade_exterior as nm_cidade_exterior,
estabelecimentos.pais as cod_pais,
estabelecimentos.cnae_secundario,
estabelecimentos.inicio_atividade as data_inicio_atividade,
estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
(case when tab_cidade.nome is null then 'exterior' else tab_cidade.nome end) as municipio,
(case when tab_cidade.nome is null then 'exterior' else (tab_cidade.nome) end) as municipio,
estabelecimentos.municipio as codigo_municipio,
(case when estabelecimentos.ddd_1 ='' and estabelecimentos.telefone_1 =''  then tab_serp.númerodetelefone when estabelecimentos.ddd_1 is not null and estabelecimentos.telefone_1 is not null then concat(estabelecimentos.ddd_1,'-',estabelecimentos.telefone_1 ) else tab_serp.númerodetelefone end) as ddd_telefone_1,
(case when estabelecimentos.ddd_2 is not null and estabelecimentos.telefone_2 is not null then concat(estabelecimentos.ddd_2,'-',estabelecimentos.telefone_2 ) end) as ddd_telefone_2,
(case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_telefone_3,
(case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_fax,
estabelecimentos.email as correio_eletronico,
tab_serp.domain,
empresas.natureza as codigo_natureza_juridica,
empresas.qualificacao_pf as qualificacao_responsavel,
concat('R$ ',format(cast(empresas.capital as unsigned),2,'de_de')) as capital_social_empresa,
(case when empresas.porte is null then 'porte não declarado' else empresas.porte end) as porte_empresa,
dados_simples.opcao_simples as opcao_pelo_simples,
dados_simples.data_opcao_simples as data_opcao_pelo_simples,
dados_simples.data_exclusao as data_exclusao_simples,
dados_simples.opcao_mei as opcao_pelo_mei,
(case when dados_simples.opcao_mei is null then 'não' when dados_simples.opcao_mei = 'n' then 'não' when dados_simples.opcao_mei = 's' then 'sim' end)as microempreendedor_individual,
concat(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj,
(case when estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos where cnpj like concat('${cnpj_base}' , '%')) = 0 then tab_matriz_filial.nm_matriz_filial when estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos where cnpj like concat('${cnpj_base}' , '%') and estabelecimentos.matriz_filial = 2) > 0 then concat(tab_matriz_filial.nm_matriz_filial, ' - ', ' filiais: ',(select count(1) from estabelecimentos where cnpj like concat( '${cnpj_base}' , '%') and estabelecimentos.matriz_filial = 2)) when estabelecimentos.matriz_filial = '2' then tab_matriz_filial.nm_matriz_filial else tab_matriz_filial.nm_matriz_filial end) as nm_matriz_filial,
(case when char_length(getnumber(empresas.razao)) > 8 then uextractnonnumbersfromstring(empresas.razao) else (empresas.razao) end) as razao_social,
(select cast(sum(case when (estabelecimentos.matriz_filial = 2) then 1 else 0 end)as decimal)) as filiais,
cnpj_status.nm_sit_cadastral as situacao_cadastral,
tab_situacao_cadastral.nm_situacao_cadastral as motivo_sit_cadastral,
date_format(estabelecimentos.data_situacao, '%d/%m/%y') as data_atual_cadastral,
estabelecimentos.cidade_exterior,
tab_natureza_juridica.nm_subclass_natureza_juridica as natureza_juridica,
date_format(estabelecimentos.inicio_atividade, '%d/%m/%y') as data_inicio,
year(curdate()) - year(estabelecimentos.inicio_atividade) as age,
estabelecimentos.cnae_fiscal as 'cnae_primario',
tab_cnae_up.nome,
estabelecimentos.logradouro,
estabelecimentos.numero,
trim(estabelecimentos.bairro),
trim(estabelecimentos.complemento),
estabelecimentos.cep,
concat('R$ ',format(cast(empresas.capital as unsigned),2,'de_de')) as capital,
(case when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'suf' else estabelecimentos.uf end) as uf,
estabelecimentos.telefone_1,
estabelecimentos.telefone_2,
estabelecimentos.numero_fax as 'fax',
estabelecimentos.email as 'email1',
(case when estabelecimentos.email is null and tab_serp.email is null then "sem e-mail cadastrado" when estabelecimentos.email is not null and tab_serp.email is null then estabelecimentos.email when estabelecimentos.email is not null and tab_serp.email is not null then concat(estabelecimentos.email, " ",tab_serp.email ) end)as email,
tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio as qualificacao,
cast(empresas.capital as unsigned) as capital,
tab_porte_empresa.nm_porte as porte,
(case when dados_simples.opcao_simples is null then 'não optante' when dados_simples.opcao_simples = 'n' then 'não optante' when dados_simples.opcao_simples = 's' then 'optante' end)as simples_nacional,
estabelecimentos.data_situacao,
estabelecimentos.motivo_situacao,
tab_situacao_cadastral.nm_situacao_cadastral,
(case when estabelecimentos.situacao = '02' then concat('funcionando desde ',date_format(estabelecimentos.inicio_atividade, '%y'), ', à ',year( @calculo_ativo ) - 1,' anos, ',month( @calculo_ativo ) - 1,' meses e ', day( @calculo_ativo ) - 1,' dias.' ,' ultima atualização à: ' ,year( @calculo_alteracao ) - 1,' anos, ',month( @calculo_alteracao ) - 1,' meses e ', day( @calculo_alteracao ) - 1,' dias' ) when estabelecimentos.situacao <> '2' then concat('foi aberta em: ',date_format(estabelecimentos.inicio_atividade, '%y'),', mas esta ',cnpj_status.nm_sit_cadastral,' desde ',date_format(estabelecimentos.data_situacao, '%y'),'. funcionou por: ',year( @calculo_nao_ativo ) - 1,' anos, ',month( @calculo_nao_ativo ) - 1,' meses e ', day( @calculo_nao_ativo ) - 1, ' dias. ultima alteração à: ' , year( @calculo_alteracao ) - 1,' anos, ',month( @calculo_alteracao ) - 1,' meses e ', day( @calculo_alteracao ) - 1,' dias, ' ) end) as status,
tab_serp.cnpj_full,
tab_serp.data_added,
tab_serp.cnpj_base,
tab_serp.cnpj_ordem,
tab_serp.cnpj_dv,
tab_serp.receita,
tab_serp.num_funcionarios,
tab_serp.website,
tab_serp.ceo,
tab_serp.acoes,
tab_serp.fundadores,
tab_serp.atendimento_cliente,
tab_serp.presidente,
tab_serp.subsidiarias,
(case when tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.image_url is not null then (tab_serp.image_url) end)as image_url,
tab_serp.sub_title,
tab_serp.recursos,
tab_serp.rating,
concat('R$ ',format(cast(tab_serp.faturamento as unsigned),2,'de_de')) as faturamento,
tab_serp.banner,
tab_serp.description,
(case when tab_serp.logo_url is not null and tab_serp.logo_url <> '' then tab_serp.logo_url when tab_serp.logo_url is null and tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.logo_url = '' and tab_serp.image_url = '' then '../../img/defaultLOGO.png' when tab_serp.logo_url is null and tab_serp.image_url is not null then tab_serp.image_url when tab_serp.logo_url = '' and tab_serp.image_url <> '' then tab_serp.image_url else '../../img/defaultLOGO.png' end) as logo_url,
tab_serp.tagline,
tab_serp.followercount,
tab_serp.site,
tab_serp.setor,
tab_serp.tamanhodaempresa,
tab_serp.sede,
tab_serp.tipo,
tab_serp.companyaddress,
tab_serp.maincompanyid,
tab_serp.industrycode,
tab_serp.salesnavigatorlink,
tab_serp.employeesonlinkedin,
tab_serp.query,
tab_serp.timestamp,
tab_serp.companyurl,
tab_serp.companyurl as updated_url,
tab_serp.fundadaem,
tab_serp.especializações,
tab_serp.relatedcompanies1,
tab_serp.relatedcompanies2,
tab_serp.relatedcompanies3,
tab_serp.relatedcompanies4,
tab_serp.relatedcompanies5,
tab_serp.relatedcompanies6,
tab_serp.relatedcompanies7,
tab_serp.relatedcompanies8,
tab_serp.relatedcompanies9,
tab_serp.relatedcompanies10,
tab_serp.isclaimable,
tab_serp.savedimg,
tab_serp.númerodetelefone,
tab_serp.date_updatedname,
cnpj_status.nm_sit_cadastral as situacao_cadastral_nome,
tab_serp.date_serpsearch,
(case when tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.image_url is not null then (tab_serp.image_url) end )as image_url,
(case when tab_cidade.nome is null then 'exterior' else (tab_cidade.nome) end ) as municipio,
(case when estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then concat(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax ) end) as ddd_telefone_2,
count(distinct(nome_devedor)) as nomes_diferentes,
count(distinct(cnpj_dividas.cpf_cnpj)) as cpfs_cnpjs,
group_concat(distinct(cnpj_dividas.cpf_cnpj)),
count(distinct(socios.cnpj)) as socios,
count(distinct(numero_inscricao)) as qtd_dividas,
(select DISTINCT cast(sum(case when (cnpj_dividas.sit_geral = 'regular') then 1 else 0 end ) as decimal (20,0))) as sit_geral_regular,
(select DISTINCT cast(sum(case when (cnpj_dividas.sit_geral = 'irregular') then 1 else 0 end ) as decimal (20,0))) as sit_geral_irregular,
count(distinct(tipo_situacao_inscricao)) as dif_situacoes,
cnpj_dividas.uf_unidade_responsavel as uf_responsavel,
count(distinct(cnpj_dividas.uf_unidade_responsavel)) as qtd_estados,
(select cast(sum(case when (tipo_situacao_inscricao = 'em cobrança') then 1 else 0 end ) as decimal (20,0))) as sit_insc_em_cobranca,
(select cast(sum(case when (tipo_situacao_inscricao = 'benefício fiscal') then 1 else 0 end ) as decimal (20,0))) as sit_insc_beneficio_fiscal,
(select cast(sum(case when (tipo_situacao_inscricao = 'em negociação') then 1 else 0 end ) as decimal (20,0))) as sit_insc_em_negociacao,
(select cast(sum(case when (tipo_situacao_inscricao = 'garantia') then 1 else 0 end ) as decimal (20,0))) as sit_insc_garantia,
(select cast(sum(case when (tipo_situacao_inscricao = 'suspenso por decisão judicial') then 1 else 0 end ) as decimal (20,0))) as sit_insc_suspenso_dec_judicial,
(select cast(sum(case when (cnpj_dividas.tipo_devedor = 'corresponsavel') then 1 else 0 end ) as decimal (20,0))) as tip_dev_corresponsavel,
(select cast(sum(case when (cnpj_dividas.tipo_devedor = 'solidario') then 1 else 0 end ) as decimal (20,0))) as tip_dev_solidario,
(select cast(sum(case when (cnpj_dividas.tipo_devedor = 'principal') then 1 else 0 end ) as decimal (20,0))) as tip_dev_principal,
(select sum(distinct(cnpj_dividas.valor_consolidado)) )as valor_consolidado_total
              
     `
		let query = `SELECT  ${projection}
    
FROM

  cnpj_dividas
  LEFT JOIN
estabelecimentos ON estabelecimentos.cnpj = SUBSTRING(cnpj_dividas.cpf_cnpj, 1, 8)
  AND estabelecimentos.cnpj_ordem = SUBSTRING(cnpj_dividas.cpf_cnpj, 9, 4)
  LEFT JOIN
empresas ON empresas.cnpj = SUBSTRING(cnpj_dividas.cpf_cnpj, 1, 8)
  LEFT JOIN
dados_simples ON dados_simples.cnpj = SUBSTRING(cnpj_dividas.cpf_cnpj, 1, 8)
  LEFT JOIN
socios ON socios.cnpj = SUBSTRING(cnpj_dividas.cpf_cnpj, 1, 8)
  LEFT JOIN
cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao
  LEFT JOIN
tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf
  LEFT JOIN
tab_matriz_filial ON tab_matriz_filial.id = estabelecimentos.matriz_filial
  LEFT JOIN
tab_situacao_cadastral ON tab_situacao_cadastral.cod_situacao_cadastral = estabelecimentos.situacao
  LEFT JOIN
tab_natureza_juridica ON tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
  LEFT JOIN
tab_opcao_simples ON tab_opcao_simples.cod = dados_simples.opcao_simples
  LEFT JOIN
tab_porte_empresa ON tab_porte_empresa.id = empresas.porte
  LEFT JOIN
tab_cidade ON tab_cidade.cod_tom = estabelecimentos.municipio
  LEFT JOIN
tab_dividas_tipo_sit_insc ON cnpj_dividas.tipo_situacao_inscricao = tab_dividas_tipo_sit_insc.id
  LEFT JOIN
tab_serp ON tab_serp.cnpj_base = ${cnpj_base}
  LEFT JOIN
tab_cnae_up ON tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
  LEFT JOIN
tab_cnae_up b ON estabelecimentos.cnae_secundario LIKE CONCAT('%', b.cod_cnae, '%')
LEFT JOIN
datalake.tab_estatisticas_cnpj on datalake.tab_estatisticas_cnpj.cnpj = '${cnpj_full}'


    where  1 = 1 
   
    and cnpj_dividas.cpf_cnpj  = '${cnpj_full}'
    `

		
		console.log("buscar_detalhes_DIVIDAS")
		console.log("cpf_cnpj: ", cpf_cnpj)

		return this.conexao.query(query, callback)
	}

	buscar_detalhes_DIVIDAS_inner(cpf_cnpj, callback) {
    let cnpj_full = cpf_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
		let cnpj_base = cpf_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
		let cnpj_ordem = cpf_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
		let cnpj_dv = cpf_cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)
		let projection = `
    
    DISTINCT cnpj_dividas.numero_inscricao,
    'buscar_detalhes_DIVIDAS_inner',
    YEAR(CURDATE()) - CAST(substring(data_inscricao,7,4) AS UNSIGNED) AS age_divida,
    CAST(substring(data_inscricao,7,4) as UNSIGNED) as ano_divida,
    cnpj_dividas.cpf_cnpj,
    cnpj_dividas.tipo_pessoa,
    cnpj_dividas.tipo_devedor,
    cnpj_dividas.nome_devedor,
    cnpj_dividas.uf_unidade_responsavel,
    cnpj_dividas.unidade_responsavel,
    cnpj_dividas.entidade_responsavel,
    cnpj_dividas.unidade_inscricao,
    cnpj_dividas.tipo_situacao_inscricao,
    cnpj_dividas.situacao_inscricao,
    cnpj_dividas.receita_principal,
    cnpj_dividas.data_inscricao,
    cnpj_dividas.indicador_ajuizado,
    cnpj_dividas.valor_consolidado,
    cnpj_dividas.tipo_credito,
    cnpj_dividas.tipo_divida,
    cnpj_dividas.sit_geral,
    cnpj_dividas.tipo_situacao_inscricao as situacao_inscricao
        
              
     `
		let query = `SELECT  ${projection}
    
    FROM cnpj_dividas
   
    where  1 = 1 
    and cnpj_dividas.cpf_cnpj  = '${cnpj_full}'
    Group by cnpj_dividas.numero_inscricao
    order by cnpj_dividas.sit_geral DESC,convert(valor_consolidado, decimal) DESC
                    
    `

		

		console.log("buscar_detalhes_DIVIDAS_inner")
		//console.log(cpf_cnpj)
    console.log(query)
		return this.conexao.query(query, callback)
	}
 
 
  insere_estatisticas_cnpj_count(id, callback) {
    let cnpj_full = id.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
		let cnpj_base = id.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
		let cnpj_ordem = id.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
		let cnpj_dv = id.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)
  
    let query = `
    INSERT IGNORE INTO datalake.tab_estatisticas_cnpj 
(
cnpj,
cnpj_base,
cnpj_ordem,
cnpj_dv,
divida_qtd_dividas,
divida_sit_geral_regular,
divida_sit_geral_iregular,
divida_valor_consolidado_total
)
SELECT 
'${id}' as cnpj,
'${cnpj_base}' as cnpj_base,
'${cnpj_ordem}' as cnpj_ordem,
'${cnpj_dv}' as cnpj_dv,
count(distinct(numero_inscricao)) as qtd_dividas,
(select DISTINCT cast(sum(case when (cnpj_dividas.sit_geral = 'regular') then 1 else 0 end ) as decimal (20,0))) as sit_geral_regular,
(select DISTINCT cast(sum(case when (cnpj_dividas.sit_geral = 'irregular') then 1 else 0 end ) as decimal (20,0))) as sit_geral_irregular,
concat('R$ ',format(cast(SUM(DISTINCT(cnpj_dividas.valor_consolidado)) as unsigned),2,'de_de')) as valor_consolidado_total
 FROM datafinder.cnpj_dividas
 left join estabelecimentos on estabelecimentos.cnpj='${cnpj_base}' and estabelecimentos.cnpj_ordem='${cnpj_ordem}' and estabelecimentos.cnpj_dv='${cnpj_dv}'
where cpf_cnpj = '${id}'
    
    `
  
    const params = []
  console.log('insere_estatisticas_cnpj_count:',id)
  console.log('insere_estatisticas_cnpj_count:',query)
    return this.conexao.query(query, callback)
  }
  
  insere_estatisticas_cnpj_status(id, callback) {
    
  
    let query = `
    
UPDATE datalake.tab_estatisticas_cnpj 
set 
datalake.tab_estatisticas_cnpj.pcd = (select (CASE when count(id)>0  then 'PCD' else 'Nenhuma' END) from datafinder.tab_pcd where tab_pcd.cnpj = '${id}'),
datalake.tab_estatisticas_cnpj.beneficiado=(select (CASE  when count(id)>0  then 'beneficio_sim' else 'beneficio_nao' END) from autuacoes.tab_cnpj_beneficiado where autuacoes.tab_cnpj_beneficiado.cnpj = '${id}' ),
datalake.tab_estatisticas_cnpj.sancoes=(select (CASE when   count(id)>0  then 'com_sancao' else  'sem_sancao' END) from autuacoes.tab_cnpj_iniesus where autuacoes.tab_cnpj_iniesus.cpf_ou_cnpj_do_sancionado = '${id}'),
datalake.tab_estatisticas_cnpj.acordo_leniencia=(select (CASE when count(id)>0  then 'acordo_leniencia_sim' else 'acordo_leniencia_nao' END) from autuacoes.tab_cnpj_acordo_leniencia where autuacoes.tab_cnpj_acordo_leniencia.cnpj_do_sancionado = '${id}'),
tab_estatisticas_cnpj.inscricao_estadual=(select (CASE when ie.inscricao_estadual is not null then group_concat(DISTINCT(ie.inscricao_estadual)) else 'Sem Inscrição Estadual' END) from datafinder.tab_ie ie where ie.cnpj = '${id}' ),
tab_estatisticas_cnpj.inscricao_estadual_uf= (select (CASE when ie.inscricao_estadual is not null then group_concat(DISTINCT(ie.uf_ie)) else 'Sem Inscrição Estadual' END) from datafinder.tab_ie ie where ie.cnpj = '${id}')


where datalake.tab_estatisticas_cnpj.cnpj = '${id}'

    
    `
  
    const params = []
    console.log('insere_estatisticas_cnpj_status:',id)
    console.log('insere_estatisticas_cnpj_status:',query)
    return this.conexao.query(query, callback)
  }
  



	//FIM DIVIDAS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //NCM INTELIGENCIA FISCAL

	consultarNCM(isCount, { ncm, nome_produto, cod_situacao_cadastral, cnae, cod_cnae, desc_cnae, porte_empresa, uf, municipio, pagina, classe_cnae }) {
		pagina = isBlank(pagina) ? 1 : parseInt(pagina)

		if (pagina === 1) {
			pagina = 0
		} else {
			pagina--
			pagina = parseInt(pagina) * 20 + 1
		}
   
		let projection = isCount
			? " count(1) as count_query"
			: `
      'consultarNCM',
      tab_ncm.ncm,
 
    tab_ncm.nome,
    tab_ncm.nome as nome_produto,
     tab_ncm.classe_cnae,
     tab_cnae_up.nm_classe ,
     tab_cnae_up.cod_cnae as cnae,
     vw_dash_cnaes.total
  
    `

		let query = `SELECT  ${projection}

    from tab_ncm

    inner join tab_cnae_up
    on
    tab_ncm.classe_cnae=tab_cnae_up.cod_classe
    left join vw_dash_cnaes
    on
    vw_dash_cnaes.cod_cnae=tab_cnae_up.cod_cnae


    where  1 = 1
    and tab_cnae_up.cod_cnae is not null

`

		const params = []
		if (!isBlank(ncm)) {
			query += " and tab_ncm.ncm = ? "
			params.push(`%${ncm}%`)
		}
		if (!isBlank(nome_produto)) {
			query += " and  tab_ncm.nome LIKE ? "
			params.push(`%${nome_produto}%`)
		}

		if (!isBlank(desc_cnae)) {
			query += " and tab_cnae_up.nome LIKE ? "
			params.push(`%${desc_cnae}%`)
		}

		if (!isBlank(cod_cnae)) {
			query += " and tab_cnae_up.cod_cnae = ? "
			params.push(cod_cnae)
		}
		if (!isBlank(cnae)) {
			query += " and tab_cnae_up.cod_cnae in (?) "
			const cnae_array = cnae.split(",")
			params.push(cnae_array)
		}

		if (!isBlank(classe_cnae)) {
			query += " and tab_cnae_up.cod_classe = ? "
			params.push(classe_cnae)
		}

		console.log("NCM")
    console.log(query)
		console.log(cnae, "....cod cnae")

		//return this.execQuery(query +` group by nome LIMIT 50 ` , params);

		if (!isCount) query += ` group by tab_ncm.ncm  order by vw_dash_cnaes.total DESC,tab_cnae_up.cod_cnae DESC  `

		return this.execQuery(query, params)
	}

//FIM NCM INTELIGENCIA FISCAL
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//GEOM

consultarGEOM(isCount, { CEP,cnpj, estado,cidade,cod_situacao_cadastral, secao_cnae, razao_social, nome_fantasia, email, porte_empresa, natureza_juridica, opcao_pelo_simples, opcao_pelo_mei, cnae, pagina, municipio, uf, idade_empresa_maior, idade_empresa_menor,capital_social, callback }) {
	pagina = isBlank(pagina) ? 1 : parseInt(pagina)

		if (pagina === 1) {
			pagina = 0
		} else {
			pagina--
			pagina = parseInt(pagina) * 20 + 1
		}
  let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)
 let cep_ajustado = CEP.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  

  let projection = isCount
    ? "count(DISTINCT(empresas.id)) as count_query"
    : `
    'consultarGEOM',
    empresas.razao as razao_social,
    empresas.natureza as codigo_natureza_juridica,
    empresas.qualificacao_pf as qualificacao_responsavel,
   CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital_social_empresa,
    (
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS porte_empresa,
    (
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS nm_porte,
    (
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS porte,
    (
      CASE
     when estabelecimentos.cnpj is null then empresas.cnpj
     else CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
     END
      ) as cnpj,
      
  estabelecimentos.cnpj_ordem,
  estabelecimentos.cnpj_dv,
  
  (case
    WHEN estabelecimentos.nome is NULL 
    then '*****' 
    Else
    estabelecimentos.nome
    END
    ) as nome_fantasia,
  estabelecimentos.matriz_filial,
  estabelecimentos.situacao as sit_cadastral,
  estabelecimentos.data_situacao,
  estabelecimentos.motivo_situacao,
  estabelecimentos.cidade_exterior,
 (CASE
      When estabelecimentos.pais is NULL then 'Brasil'
      Else estabelecimentos.pais
      END) as pais,
  estabelecimentos.inicio_atividade,
  estabelecimentos.cnae_fiscal,
  estabelecimentos.cnae_secundario,
  estabelecimentos.tipo_logradouro,
  estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
  estabelecimentos.logradouro,
  estabelecimentos.numero,
  TRIM(estabelecimentos.complemento),

  TRIM(estabelecimentos.bairro),

  estabelecimentos.cep,
  (CASE
  when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
  else estabelecimentos.uf
  END) as uf,
  (
    CASE
        WHEN tab_cidade.nome  is  null
        THEN 'Exterior'
        ELSE (tab_cidade.nome)
    END
  ) AS municipio,
  estabelecimentos.ddd_1,
  estabelecimentos.telefone_1,
  estabelecimentos.ddd_2,
  estabelecimentos.telefone_2,
  estabelecimentos.ddd_fax,
  estabelecimentos.numero_fax,
  TRIM(estabelecimentos.email),
  estabelecimentos.situacao_especial,
  estabelecimentos.data_situacao_especial,
  estabelecimentos.cnae_fiscal,  
cnpj_status.nm_sit_cadastral as sit_cadastral,


(
CASE

 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email <> '' and dados_simples.opcao_mei is NULL THEN CAST('100' AS DECIMAL)
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email <> '' and dados_simples.opcao_mei = 'n' THEN CAST('100' AS DECIMAL)
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email <> '' and dados_simples.opcao_mei = 's' THEN CAST('75' AS DECIMAL)


 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email = '' and dados_simples.opcao_mei is NULL THEN CAST('75' AS DECIMAL)  
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email = '' and dados_simples.opcao_mei = 'n' THEN CAST('75' AS DECIMAL)
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 <> '' and estabelecimentos.email = '' and dados_simples.opcao_mei = 's' THEN CAST('50' AS DECIMAL)
 
 
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email <> '' and dados_simples.opcao_mei is NULL THEN CAST('75' AS DECIMAL)
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email <> '' and dados_simples.opcao_mei = 'n' THEN CAST('75' AS DECIMAL)
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email <> '' and dados_simples.opcao_mei = 's' THEN CAST('50' AS DECIMAL)


 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email = '' and dados_simples.opcao_mei is NULL THEN CAST('50' AS DECIMAL)
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email = '' and dados_simples.opcao_mei = 'n' THEN CAST('50' AS DECIMAL)
 WHEN estabelecimentos.situacao = '02' and estabelecimentos.telefone_1 = '' and estabelecimentos.email = '' and dados_simples.opcao_mei = 's' THEN CAST('25' AS DECIMAL)


 WHEN estabelecimentos.situacao <> '2' THEN CAST('0' AS DECIMAL)

 ELSE 'Faltando'
END
) AS ranking,
tab_natureza_juridica.nm_subclass_natureza_juridica AS natureza_juridica,

tab_matriz_filial.nm_matriz_filial,
(
CASE
    WHEN tab_cidade.nome  is  null
    THEN 'Exterior'
    ELSE (tab_cidade.nome)
END
) AS municipio,
(
CASE
    WHEN dados_simples.opcao_mei is  null THEN 'Não'
    WHEN dados_simples.opcao_mei ='n'  THEN 'Não'
    WHEN dados_simples.opcao_mei = 's' THEN 'Sim'
   
END
) AS opcao_pelo_mei,

tab_cnae_up.nome as nm_cnae,
tab_cnae_up.nm_setor as setor,
(
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS porte_empresa,
    (
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS nm_porte,
    (
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS porte,
estabelecimentos.telefone_1 as fone_1,
YEAR(CURDATE()) - YEAR(inicio_atividade) AS age,
estabelecimentos.email as email,

CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital_social_empresa,
tab_dados_economicos.id_empresa as id_empresa_bolsa,
(Case 
  when tab_cad_fi.tp_fundo = 'fi' and tab_cad_fi.sit <> 'cancelado' then CONCAT('FI - ',tab_dados_economicos.ativo,' - Fundo Ativo')
  when tab_cad_fi.tp_fundo = 'fi' and tab_cad_fi.sit  = 'cancelado' then CONCAT('FI - ',tab_dados_economicos.ativo,' - Fundo Cancelado')
  when tab_dados_economicos.ativo is null then 'Não Listado B.V.' 
  else tab_dados_economicos.ativo end ) as ativo,
  (case  when tab_dados_economicos.principal_acionista is null  then 'Sem informações' when tab_dados_economicos.principal_acionista = '-' then 'Sem informações' when CAST( tab_dados_economicos.principal_acionista AS UNSIGNED ) <> 0  then 'Sem informações' else  tab_dados_economicos.principal_acionista END) as principal_acionista ,
tab_dados_economicos.nome as nome_empresa_bolsa,
tab_dados_economicos.cnpj_base as cnpj_base_bolsa ,
tab_dados_economicos.pais_sede,
tab_dados_economicos.setor_naics,
tab_dados_economicos.setor_economatica,
tab_dados_economicos.setor_economico_bovespa,
tab_dados_economicos.subsetor_bovespa,
tab_dados_economicos.segmento_bovespa,
tab_dados_economicos.situacao_cvm,
tab_dados_economicos.ativo_cancelado,
tab_dados_economicos.moeda_balancos,
tab_dados_economicos.data_do_balanco,

(CASE
  WHEN
      tab_dados_economicos.receita_liquida_faturamento IS NULL
          AND empresas.porte = '01'
  THEN
      'R$ 360.000,00'
  WHEN
      tab_dados_economicos.receita_liquida_faturamento IS NULL
          AND empresas.porte = '03'
  THEN
      'R$ 4.800.000,00'
  WHEN
      tab_dados_economicos.receita_liquida_faturamento IS NULL
          AND empresas.porte = '05'
  THEN
      'R$ 0,00'
  WHEN
      tab_dados_economicos.receita_liquida_faturamento IS NULL
          AND empresas.porte IS NULL
          AND dados_simples.opcao_mei IS NULL
          AND dados_simples.opcao_simples IS NULL
  THEN
      'R$ 0,00'
  WHEN
      tab_dados_economicos.receita_liquida_faturamento IS NULL
          AND dados_simples.opcao_mei = 's'
  THEN
      'R$ 81.000,00'
  ELSE CONCAT('R$ ',CAST(tab_dados_economicos.receita_liquida_faturamento
      AS UNSIGNED))
END) AS faturamento,
    (case when tab_dados_economicos.valor_mercado_empresa_2022 is null then '0' else  CAST(tab_dados_economicos.valor_mercado_empresa_2022 AS UNSIGNED) end) as valor_mercado_atual,
    (case when tab_dados_economicos.enterprise_value_2022 is null then '0' else  CAST(tab_dados_economicos.enterprise_value_2022 AS UNSIGNED) end) as valor_real_empresa,

CAST(tab_dados_economicos.ativo_tot AS UNSIGNED) as total_ativos,
CAST(tab_dados_economicos.patrimonio_liquido AS UNSIGNED) as patrimonio_liquido_bolsa,
CAST(tab_dados_economicos.receita_liquida_faturamento AS UNSIGNED) as receita_liquida_faturamento,
CAST(tab_dados_economicos.lucro_bruto AS UNSIGNED) as lucro_bruto,
CAST(tab_dados_economicos.ebitda AS UNSIGNED) as ebitda,
CAST(tab_dados_economicos.lucro_liquido AS UNSIGNED) as lucro_liquido,
CAST(tab_dados_economicos.vendas_acao_2021 AS UNSIGNED) as vendas_acao_2021,
CAST(tab_dados_economicos.valor_mercado_empresa_2022 AS UNSIGNED)as valor_mercado_atual ,
CAST(tab_dados_economicos.valor_mercado_empresa_31dez16 AS UNSIGNED) as valor_mercado_empresa_2016,
CAST(tab_dados_economicos.valor_mercado_empresa_31dez17 AS UNSIGNED)as valor_mercado_empresa_2017,
CAST(tab_dados_economicos.valor_mercado_empresa_31dez18 AS UNSIGNED)as valor_mercado_empresa_2018,
CAST(tab_dados_economicos.valor_mercado_empresa_31dez19 AS UNSIGNED)as valor_mercado_empresa_2019,
CAST(tab_dados_economicos.valor_mercado_empresa_31dez20 AS UNSIGNED)as valor_mercado_empresa_2020,
CAST(tab_dados_economicos.valor_mercado_empresa_31dez21 AS UNSIGNED)as valor_mercado_empresa_2021,
CAST(tab_dados_economicos.valor_mercado_empresa_22 AS UNSIGNED)as valor_mercado_empresa_2022,
CAST(tab_dados_economicos.enterprise_value_2022  AS UNSIGNED)as valor_real_empresa,
CAST(tab_dados_economicos.enterprise_value_31dez17 AS UNSIGNED) as valor_real_empresa_2017,
CAST(tab_dados_economicos.enterprise_value_31dez18 AS UNSIGNED)  as valor_real_empresa_2018,
CAST(tab_dados_economicos.enterprise_value_31dez19 AS UNSIGNED) as valor_real_empresa_2019,
CAST(tab_dados_economicos.enterprise_value_31dez20 AS UNSIGNED) as valor_real_empresa_2020,
CAST(tab_dados_economicos.enterprise_value_31dez21 AS UNSIGNED) as valor_real_empresa_2021,
CAST(tab_dados_economicos.enterprise_value_2022_1 AS UNSIGNED) as valor_real_empresa_2022,
CAST(tab_dados_economicos.ativo_circulante AS UNSIGNED) as ativo_circulante,
CAST(tab_dados_economicos.capex AS UNSIGNED) as capex

`

  let query = `SELECT  ${projection}
from empresas 
          

left join estabelecimentos
on
empresas.cnpj=estabelecimentos.cnpj
left join dados_simples
on
estabelecimentos.cnpj=dados_simples.cnpj

left join cnpj_status
on cnpj_status.cod_sit_cad=estabelecimentos.situacao
          
left join tab_matriz_filial
on
tab_matriz_filial.id=estabelecimentos.matriz_filial
          
left join tab_porte_empresa
on
tab_porte_empresa.id=empresas.porte

LEFT JOIN
tab_natureza_juridica ON tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza

left join tab_cnae_up
on estabelecimentos.cnae_fiscal=tab_cnae_up.cod_cnae

left   join tab_cidade
on 
estabelecimentos.municipio=tab_cidade.cod_tom


left join tab_dados_economicos
on
tab_dados_economicos.cnpj_base = empresas.cnpj 
left join socios
on
estabelecimentos.cnpj=socios.cnpj

left join tab_cad_fi
on
tab_cad_fi.cnpj_fundo=CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
          
where  1 = 1 
and estabelecimentos.situacao = '02'
          
`
  const params = []

  if (!isBlank(cep_ajustado)) {
    query += " and estabelecimentos.cep  = ?"  
    params.push(cep_ajustado)
  }

  if (!isBlank(cnae)) {
    query += " and estabelecimentos.cnae_fiscal = ? "
    params.push(cnae)
  }

  if (!isBlank(cnpj_base)) {
    query += "and estabelecimentos.cnpj = ? "
    params.push(cnpj_base)
  }
  if (!isBlank(cnpj_ordem)) {
    query += "and estabelecimentos.cnpj_ordem = ? "
    params.push(cnpj_ordem)
  }
  if (!isBlank(cnpj_dv)) {
    query += "and estabelecimentos.cnpj_dv = ? "
    params.push(cnpj_dv)
  }
  if (!isBlank(cod_situacao_cadastral)) {
    query += " and estabelecimentos.situacao = ? "
    params.push(cod_situacao_cadastral)
  }
  if (!isBlank(razao_social)) {
    query += " and empresas.razao LIKE ? "
    params.push(`${razao_social}%`)
  }
  if (!isBlank(nome_fantasia)) {
    query += " and estabelecimentos.nome LIKE ? "
    params.push(`${nome_fantasia}%`)
  }

  if (!isBlank(email)) {
    query += " and estabelecimentos.email LIKE ? "
    params.push(`${email}%`)
  }

  if (!isBlank(opcao_pelo_mei)) {
    query += " and (select (CASE when dados_simples.opcao_mei is null then 'n' else dados_simples.opcao_mei END)) = ? "
    params.push(opcao_pelo_mei)
  }
  if (!isBlank(porte_empresa)) {
    query += " and empresas.porte = ? "
    params.push(porte_empresa)
  }
  if (!isBlank(natureza_juridica)) {
    query += " and empresas.natureza = ? "
    params.push(natureza_juridica)
  }
  if (!isBlank(opcao_pelo_simples)) {
    query += " and dados_simples.opcao_simples = ? "
    params.push(opcao_pelo_simples)
  }
 

  if (!isBlank(uf)) {
    query += " and estabelecimentos.uf = ? "
    params.push(uf)
  }

  if (!isBlank(municipio)) {
    query += " and tab_cidade.cod_tom = ?  "
    params.push(municipio)
  }
  if (!isBlank(idade_empresa_maior)) {
    query += " and YEAR(CURDATE()) - YEAR(inicio_atividade) >= ?  "
    params.push(idade_empresa_maior)
  }
  if (!isBlank(idade_empresa_menor)) {
    query += " and YEAR(CURDATE()) - YEAR(inicio_atividade) <= ?  "
    params.push(idade_empresa_menor)
  }

  if (!isBlank(capital_social)) {
    if (capital_social == 1 ) {
      query += " " 
		} else if (capital_social == 2 ){
			query += " and empresas.capital > 1 " 
		}else {
			query += " and empresas.capital = 0 " 
		}

    params.push(capital_social)
  }
    
  
  console.log("GEOM")
  console.log("CEP: ", CEP)
  //COUNT EXCLUSIVO
  if (isCount) query += `  `
  //QUERY LISTA
  if (!isCount) query += ` group by empresas.razao  ORDER BY ranking * 1 DESC,estabelecimentos.numero *1  LIMIT ${pagina}, 20 `

  return this.execQuery(query, params)
}

buscar_detalhes_CNPJ_GEOM(cnpj, callback) {
  let cnpj1 = cnpj.replace(".", "").replace("-", "").replace("/", "").slice(0, 8)

  let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)

  let projection = ` 
@calculo_ativo :=
DATE_SUB( DATE_SUB( DATE_SUB( CURRENT_DATE,
         INTERVAL YEAR( estabelecimentos.inicio_atividade ) - 1 YEAR
      ), INTERVAL MONTH( estabelecimentos.inicio_atividade ) - 1 MONTH
      ), INTERVAL DAY( estabelecimentos.inicio_atividade ) - 1 DAY
) AS calculo_ativo,

@calculo_nao_ativo :=
DATE_SUB( DATE_SUB( DATE_SUB( data_situacao,
         INTERVAL YEAR( estabelecimentos.inicio_atividade ) - 1 YEAR
      ), INTERVAL MONTH( estabelecimentos.inicio_atividade ) - 1 MONTH
      ), INTERVAL DAY( estabelecimentos.inicio_atividade ) - 1 DAY
) AS calculo_nao_ativo,
'buscar_detalhes_CNPJ_GEOM',
 @calculo_alteracao :=
DATE_SUB( DATE_SUB( DATE_SUB( CURRENT_DATE,
         INTERVAL YEAR( estabelecimentos.data_situacao ) - 1 YEAR
      ), INTERVAL MONTH( estabelecimentos.data_situacao ) - 1 MONTH
      ), INTERVAL DAY( estabelecimentos.data_situacao ) - 1 DAY
) AS calculo_alteracao,
(
  CASE 
      WHEN CHAR_LENGTH(GetNumber(empresas.razao)) > 8
      THEN uExtractNonNumbersFromString(empresas.razao)
      ELSE (empresas.razao)
  END
) AS rs_1,
(
            CASE 
                WHEN YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao) is not null and  estabelecimentos.situacao ='08'
                THEN CONCAT(YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao),' ano(s) baixada. Funcionou por ', YEAR(estabelecimentos.data_situacao) - YEAR(estabelecimentos.inicio_atividade), ' anos')
                ELSE CONCAT('Aberta a ', YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade),' Anos. ', YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao),' anos desde ultima atualização')
            END
          ) AS Status,
   
(
    CASE
   when estabelecimentos.cnpj is null then empresas.cnpj
   else CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
   END
    ) as cnpj,
 (CASE
    When estabelecimentos.pais is NULL then 'Brasil'
    Else estabelecimentos.pais
    END) as pais,
(case
  WHEN estabelecimentos.nome is NULL or ''
  then '*****' 
  Else
  estabelecimentos.nome
  END
  ) as nome_fantasia,

CONCAT(estabelecimentos.cnae_secundario, ' - ', GROUP_CONCAT(DISTINCT b.nome)) as cnae_secundario_full,

estabelecimentos.matriz_filial as identificador_matriz_filial,
estabelecimentos.situacao as situacao_cadastral,
estabelecimentos.data_situacao as data_situacao_cadastral,
estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
estabelecimentos.cidade_exterior as nm_cidade_exterior,
estabelecimentos.pais as cod_pais,
estabelecimentos.cnae_secundario,
estabelecimentos.inicio_atividade as data_inicio_atividade,
estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
(
  CASE
      WHEN tab_cidade.nome  is  null
      THEN 'Exterior'
      ELSE tab_cidade.nome
  END
) AS municipio,
estabelecimentos.municipio as codigo_municipio,

(CASE
When estabelecimentos.ddd_1 is not null and estabelecimentos.telefone_1 is not null then CONCAT(estabelecimentos.ddd_1,'-',estabelecimentos.telefone_1 )

END) as ddd_telefone_1,
(CASE
When estabelecimentos.ddd_2 is not null and estabelecimentos.telefone_2 is not null then CONCAT(estabelecimentos.ddd_2,'-',estabelecimentos.telefone_2 )

END) as ddd_telefone_2,
(CASE
When estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then CONCAT(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax )

END) as ddd_telefone_2,
estabelecimentos.email as correio_eletronico,




empresas.razao as razao_social,
empresas.natureza as codigo_natureza_juridica,
empresas.qualificacao_pf as qualificacao_responsavel,
CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital_social_empresa,
(
CASE 
    WHEN empresas.porte is  null 
    THEN 'Porte não Declarado'
    ELSE empresas.porte
END
) AS porte_empresa,
empresas.porte as porte_empresa,





dados_simples.opcao_simples as opcao_pelo_simples,
dados_simples.data_opcao_simples as data_opcao_pelo_simples,
dados_simples.data_exclusao as data_exclusao_simples,
dados_simples.opcao_mei as opcao_pelo_mei,
(CASE
      WHEN dados_simples.opcao_mei is null then 'Não'
      when dados_simples.opcao_mei = 'n' then 'Não'
      when dados_simples.opcao_mei = 's' then 'Sim'
      END
      )AS microempreendedor_individual,
  
  
(
  CASE
 when estabelecimentos.cnpj is null then empresas.cnpj
 else CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
 END
  ) as cnpj,
  CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj,
(
  CASE
      WHEN estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos  where cnpj LIKE CONCAT('${cnpj_base}' , '%')) = 0 THEN tab_matriz_filial.nm_matriz_filial
      
      WHEN estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos  where cnpj LIKE CONCAT('${cnpj_base}' , '%') and  estabelecimentos.matriz_filial = 2) > 0 THEN CONCAT(tab_matriz_filial.nm_matriz_filial, ' - ', ' Filiais: ',(select count(1) from estabelecimentos  where cnpj LIKE CONCAT( '${cnpj_base}' , '%') and  estabelecimentos.matriz_filial = 2)) 

      WHEN estabelecimentos.matriz_filial = '2' THEN tab_matriz_filial.nm_matriz_filial
      ELSE tab_matriz_filial.nm_matriz_filial
  END
) AS nm_matriz_filial,


(
  CASE 
      WHEN CHAR_LENGTH(GetNumber(empresas.razao)) > 8
      THEN uExtractNonNumbersFromString(empresas.razao)
      ELSE (empresas.razao)
  END
) AS razao_social,
  (select  CAST(sum(
    case when 
     (estabelecimentos.matriz_filial = 2) 
         then 1 
         else 0 
 end )as DECIMAL)) as filiais,
 
cnpj_status.nm_sit_cadastral as situacao_cadastral,
tab_situacao_cadastral.nm_situacao_cadastral AS motivo_sit_cadastral,
DATE_FORMAT(estabelecimentos.data_situacao, '%d/%m/%Y') AS data_atual_cadastral,
estabelecimentos.cidade_exterior,
(CASE
      When estabelecimentos.pais is NULL then 'Brasil'
      Else estabelecimentos.pais
      END) as pais,

tab_natureza_juridica.nm_subclass_natureza_juridica AS natureza_juridica,
DATE_FORMAT(estabelecimentos.inicio_atividade, '%d/%m/%Y') AS data_inicio,
YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) AS age,
estabelecimentos.cnae_fiscal AS 'cnae_primario',
tab_cnae_up.nome,
estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
estabelecimentos.logradouro,
estabelecimentos.numero,
TRIM(estabelecimentos.complemento),

TRIM(estabelecimentos.bairro),

estabelecimentos.cep,
CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital,
(CASE
  when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
  else estabelecimentos.uf
  END) as uf,

(
  CASE
      WHEN tab_cidade.nome  is  null
      THEN 'Exterior'
      ELSE (tab_cidade.nome)
  END
) AS municipio,
estabelecimentos.telefone_1,
estabelecimentos.telefone_2,
estabelecimentos.numero_fax AS 'FAX',
estabelecimentos.email AS 'email1',

(CASE
  WHEN estabelecimentos.email is null and tab_serp.email is null then "Sem e-mail cadastrado"
  WHEN estabelecimentos.email is not null and tab_serp.email is null then estabelecimentos.email
  WHEN estabelecimentos.email is not null and tab_serp.email is not null then CONCAT(estabelecimentos.email, " - ",tab_serp.email )
  END
  )AS email,

tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio AS qualificacao,
CAST(empresas.capital as UNSIGNED) AS capital,
tab_porte_empresa.nm_porte AS porte,

(case when dados_simples.opcao_simples is null then 'não optante' when dados_simples.opcao_simples = 'n' then 'não optante' when dados_simples.opcao_simples = 's' then 'optante' end)as simples_nacional,
estabelecimentos.data_situacao,
estabelecimentos.motivo_situacao,
tab_situacao_cadastral.nm_situacao_cadastral,

(
  CASE 
      WHEN estabelecimentos.situacao = '02' THEN CONCAT('Funcionando desde ',DATE_FORMAT(estabelecimentos.inicio_atividade,  '%Y'), ', à ',YEAR( @calculo_ativo ) - 1,' Anos, ',MONTH( @calculo_ativo ) - 1,' Meses E ', DAY( @calculo_ativo ) - 1,' Dias.' ,' Ultima atualização à: ' ,YEAR( @calculo_alteracao ) - 1,' Anos, ',MONTH( @calculo_alteracao ) - 1,' Meses E ', DAY( @calculo_alteracao ) - 1,' Dias' )
      WHEN estabelecimentos.situacao <> '2' THEN CONCAT('Foi aberta em: ',DATE_FORMAT(estabelecimentos.inicio_atividade,  '%Y'),', mas esta ',cnpj_status.nm_sit_cadastral,' desde ',DATE_FORMAT(estabelecimentos.data_situacao,  '%Y'),'. Funcionou por: ',YEAR( @calculo_nao_ativo ) - 1,' Anos, ',MONTH( @calculo_nao_ativo ) - 1,' Meses E ', DAY( @calculo_nao_ativo ) - 1, ' dias. Ultima alteração à: ' , YEAR( @calculo_alteracao ) - 1,' Anos, ',MONTH( @calculo_alteracao ) - 1,' Meses E ', DAY( @calculo_alteracao ) - 1,' Dias, ' )
      
  END
) AS Status,


(CASE
        WHEN dados_simples.opcao_mei is null then 'Não'
        when dados_simples.opcao_mei = 'n' then 'Não'
        when dados_simples.opcao_mei = 's' then 'Sim'
        END
        )AS microempreendedor_individual,
        
        
        tab_serp.cnpj_full,
        tab_serp.data_added,
        tab_serp.cnpj_base,
        tab_serp.cnpj_ordem,
        tab_serp.cnpj_dv,
        tab_serp.receita,
        tab_serp.num_funcionarios,
        tab_serp.website,
        tab_serp.ceo,
        tab_serp.acoes,
        tab_serp.fundadores,
        tab_serp.atendimento_cliente,
        tab_serp.presidente,
        tab_serp.subsidiarias,
        (CASE
          when tab_serp.image_url is null then '../../img/defaultLOGO.png' 
          when tab_serp.image_url is not null then (tab_serp.image_url)
          END )AS image_url,
        tab_serp.sub_title,
        tab_serp.recursos,
        tab_serp.rating,
        CONCAT('R$ ',FORMAT(CAST(tab_serp.faturamento as UNSIGNED),2,'de_DE')) AS  faturamento,
        tab_serp.banner,
        tab_serp.description,
        (case when tab_serp.logo_url is not null and tab_serp.logo_url <> '' then tab_serp.logo_url when tab_serp.logo_url is null and tab_serp.image_url is null then '../../img/defaultLOGO.png' when tab_serp.logo_url = '' and tab_serp.image_url = '' then '../../img/defaultLOGO.png' when tab_serp.logo_url is null and tab_serp.image_url is not null then tab_serp.image_url when tab_serp.logo_url = '' and tab_serp.image_url <> '' then tab_serp.image_url else '../../img/defaultLOGO.png' end) as logo_url,
        tab_serp.tagline,
        tab_serp.followercount,
        tab_serp.domain,
        tab_serp.site,
        tab_serp.setor,
        tab_serp.tamanhodaempresa,
        tab_serp.sede,
        tab_serp.tipo,
        tab_serp.companyaddress,
        tab_serp.maincompanyid,
        tab_serp.industrycode,
        tab_serp.salesnavigatorlink,
        tab_serp.employeesonlinkedin,
        tab_serp.query,
        tab_serp.email as email2,
        tab_serp.timestamp,
        tab_serp.companyurl,
        tab_serp.companyurl as updated_url,
        tab_serp.fundadaem,
        tab_serp.especializações,
        tab_serp.relatedcompanies1,
        tab_serp.relatedcompanies2,
        tab_serp.relatedcompanies3,
        tab_serp.relatedcompanies4,
        tab_serp.relatedcompanies5,
        tab_serp.relatedcompanies6,
        tab_serp.relatedcompanies7,
        tab_serp.relatedcompanies8,
        tab_serp.relatedcompanies9,
        tab_serp.relatedcompanies10,
        tab_serp.isclaimable,
        tab_serp.savedimg,
        tab_serp.númerodetelefone,
        tab_serp.date_updatedname,
        tab_serp.date_serpsearch
    
    
       




 `
  let query = `SELECT  ${projection}

FROM
empresas
left join estabelecimentos
on
empresas.cnpj=estabelecimentos.cnpj
left join dados_simples
on
estabelecimentos.cnpj=dados_simples.cnpj
    LEFT JOIN
tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf
    LEFT JOIN
tab_matriz_filial ON tab_matriz_filial.id = estabelecimentos.matriz_filial
    LEFT JOIN
cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao
    
    LEFT JOIN
tab_natureza_juridica ON tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
    LEFT JOIN
tab_cnae_up ON tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
    LEFT JOIN 
tab_cnae_up b ON estabelecimentos.cnae_secundario LIKE CONCAT('%', b.cod_cnae, '%')
    LEFT JOIN
tab_opcao_simples ON tab_opcao_simples.cod = dados_simples.opcao_simples
    LEFT JOIN
tab_porte_empresa ON tab_porte_empresa.id = empresas.porte
  
    LEFT JOIN
tab_situacao_cadastral ON estabelecimentos.motivo_situacao = tab_situacao_cadastral.cod_situacao_cadastral
left   join tab_cidade
on 
tab_cidade.cod_tom=estabelecimentos.municipio

left join tab_serp
on empresas.cnpj=tab_serp.cnpj_base

where  1 = 1

`

  const params = []
  if (!isBlank(cnpj_base)) {
    query += "and estabelecimentos.cnpj = ? "
    params.push(cnpj_base)
  }
  if (!isBlank(cnpj_ordem)) {
    query += "and estabelecimentos.cnpj_ordem = ? "
    params.push(cnpj_ordem)
  }
  if (!isBlank(cnpj_dv)) {
    query += "and estabelecimentos.cnpj_dv = ? "
    params.push(cnpj_dv)
  }

  console.log(">>>>>>>>>>>>>>>>>>>>>buscar_detalhes_CNPJ_GEOM<<<<<<<<<<<<<<<<<<<<<<")
  console.log("cnpj buscar_detalhes_CNPJ_GEOM:  ", cnpj)
 // console.log("cnpj_full sem pontos:", cnpj_full)
  //console.log("cnpj_base:", cnpj_base)
  //console.log("cnpj_ordem:", cnpj_ordem)
  //console.log("cnpj_dv:", cnpj_dv)
  // console.log("buscar_detalhes_CNPJ", query)

  return this.conexao.query(query, params, callback)
}

buscar_listar_socios_GEOM(cnpj, callback) {
  let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)

  let projection = ` 
CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj_full,
empresas.razao as razao_social,
(CASE
when socios.cnpj is null then ''
    WHEN socios.nome is null  then ''
else  socios.identificador_socio

END) AS identificador_socio,

(CASE
when socios.cnpj is null then ''
        WHEN socios.nome is not  null THEN (select DISTINCT socios.nome group by socios.nome)



END) AS nome_socio,
 (CASE

when socios.cnpj is null then ''
    WHEN
        socios.nome is not  null

    THEN
      socios.cpf_cnpj

END) AS cpf_cnpj,
(CASE
when socios.cnpj is null then ''
    WHEN
        socios.nome is not  null

    THEN
      socios.cpf_cnpj

END) AS cnpj_cpf_socio,

(CASE
when socios.cnpj is null then ''
      WHEN
          socios.nome is not  null

      THEN
        DATE_FORMAT(socios.data_entrada_sociedade,'%d/%m/%Y')

  END)  AS data_entrada_sociedade,


(CASE
when socios.cnpj is null then ''

    WHEN
        socios.nome is not  null

    THEN
    nm_qualificacao_responsavel_socio   


END) AS nm_qualificacao_responsavel_socio,

(CASE
when socios.cnpj is null then ''
   
    WHEN socios.nome is not  null and estabelecimentos.situacao = '08' THEN (select ABS(YEAR(estabelecimentos.data_situacao) - YEAR(socios.data_entrada_sociedade)))
    WHEN socios.nome is not  null and estabelecimentos.situacao <> '08' THEN YEAR(CURDATE()) - YEAR(socios.data_entrada_sociedade)
    
END)  AS tempo_sociedade,


YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) AS age





 `
  let query = `SELECT  ${projection}

FROM estabelecimentos
left join socios
on
estabelecimentos.cnpj=socios.cnpj

left join empresas
on
estabelecimentos.cnpj=empresas.cnpj
left join dados_simples
on
estabelecimentos.cnpj=dados_simples.cnpj
left join
      tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = socios.qualificacao


where 1 = 1

`

  const params = []
  if (!isBlank(cnpj_base)) {
    query += "and estabelecimentos.cnpj = ? "
    params.push(cnpj_base)
  }
  if (!isBlank(cnpj_ordem)) {
    query += "and estabelecimentos.cnpj_ordem = ? "
    params.push(cnpj_ordem)
  }
  if (!isBlank(cnpj_dv)) {
    query += "and estabelecimentos.cnpj_dv = ? group by nome_socio "
    params.push(cnpj_dv)
  }

  console.log(">>>>>>>>>>>>>>buscar_listar_socios_GEOM<<<<<<<<<<<<<<<<<")
  console.log("cnpj buscar_listar_socios_GEOM: ", cnpj)
 // console.log("cnpj_full sem pontos:", cnpj_full)
  //console.log("cnpj_base:", cnpj_base)
  //console.log("cnpj_ordem:", cnpj_ordem)
  //console.log("cnpj_dv:", cnpj_dv)
  // console.log('select buscar_listar_socios: ',query)
  return this.conexao.query(query, params, callback)
}

GEOM_Endereco(CEP, callback) {
  let cep_ajustado = CEP.replace(".", "").replace(".", "").replace("-", "").replace("/", "")

  let query = 
  ` 
  SELECT 'GEOM_Endereco',tab_logradouro.descricao_sem_numero,tab_logradouro.bairro, tab_logradouro.descricao_cidade,tab_logradouro.uf FROM datafinder.tab_logradouro
  where cep = ${CEP}

  `

  const params = []
  if (!isBlank(cnpj_base)) {
    query += "and estabelecimentos.cnpj = ? "
    params.push(cnpj_base)
  }
  if (!isBlank(cnpj_ordem)) {
    query += "and estabelecimentos.cnpj_ordem = ? "
    params.push(cnpj_ordem)
  }
  if (!isBlank(cnpj_dv)) {
    query += "and estabelecimentos.cnpj_dv = ? group by nome_socio "
    params.push(cnpj_dv)
  }


 
  return this.conexao.query(query, params, callback)
}

GEOM_graph_cidade(CEP, callback) {
 


 
  let query = 
  ` 
  CALL sp_cidade('${CEP}')

  `

  const params = []
 


 
  return this.conexao.query(query, params, callback)
}
 
GEOM_graph(isCount, { CEP,cnpj, estado,cidade,cod_situacao_cadastral, secao_cnae, razao_social, nome_fantasia, email, porte_empresa, natureza_juridica, opcao_pelo_simples, opcao_pelo_mei, cnae, pagina, municipio, uf, idade_empresa_maior, idade_empresa_menor, callback }) {
  pagina = isBlank(pagina) ? 1 : parseInt(pagina)

  if (pagina === 1) {
    pagina = 0
  } else {
    pagina--
    pagina = parseInt(pagina) * 20 + 1
  }
  let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)
  let cep_ajustado = CEP.replace(".", "").replace(".", "").replace("-", "").replace("/", "")

  

  
  let query = `


    SELECT
'GEOM_graph',
    vw_dash_geral.uf,
    vw_dash_geral.empresas_total,
    vw_dash_geral.ativa,
    vw_dash_geral.n_ativa,
    vw_dash_geral.matriz,
    vw_dash_geral.filial,
    vw_dash_geral.mei,
    vw_dash_geral.mei_ativo,
    vw_dash_geral.simples,
    vw_dash_geral.simples_ativo,
    vw_dash_geral.dt_coleta,
    
	  vw_dash_cidades_bairros.id,
    vw_dash_cidades_bairros.cod_tom,
    vw_dash_cidades_bairros.bairro,
    vw_dash_cidades_bairros.data_coleta,

    vw_dash_cidades_bairros.total_empresas_bairro,
    vw_dash_cidades_bairros.atv_bairro,
    vw_dash_cidades_bairros.n_atv_bairro,
    vw_dash_cidades_bairros.matriz_bairro,
    vw_dash_cidades_bairros.n_matriz_bairro,
    vw_dash_cidades_bairros.atv_bairro_perc,
    vw_dash_cidades_bairros.n_atv_bairro_perc,
    vw_dash_cidades_bairros.matriz_bairro_perc,
    vw_dash_cidades_bairros.n_matriz_bairro_perc,
        
    CAST((select sum(total_empresas_bairro) from datafinder.vw_dash_cidades_bairros where cod_tom = (select cod_tom from tab_logradouro where cep = '${cep_ajustado}' )) AS UNSIGNED) as total_cidade,
    CAST((select sum(atv_bairro) from datafinder.vw_dash_cidades_bairros where cod_tom = (select cod_tom from tab_logradouro where cep = '${cep_ajustado}' ) ) AS UNSIGNED)as ativos_cidade,
    CAST((select sum(n_atv_bairro) from datafinder.vw_dash_cidades_bairros where cod_tom = (select cod_tom from tab_logradouro where cep = '${cep_ajustado}' ) ) AS UNSIGNED)as n_ativos_cidade,
    CAST((select sum(n_atv_bairro+atv_bairro) from datafinder.vw_dash_cidades_bairros where cod_tom = (select cod_tom from tab_logradouro where cep = '${cep_ajustado}' ) ) AS UNSIGNED)as provareal,


    
  
    tab_estados.descricao as estado,
    tab_cidade.nome as cidade,
    tab_cidade.nome as municipio,
    tab_cidade.*
    FROM datafinder.vw_dash_geral
    left join datafinder.tab_logradouro
    on
    tab_logradouro.cep= '${cep_ajustado}'
    left join tab_estados
    on
    datafinder.tab_logradouro.uf=tab_estados.sigla
    left join tab_cidade
    on
    tab_cidade.cod_tom=tab_logradouro.cod_tom
    left join datafinder.vw_dash_cidades_bairros
    on
    datafinder.vw_dash_cidades_bairros.cod_tom=tab_logradouro.cod_tom and datafinder.vw_dash_cidades_bairros.bairro=tab_logradouro.bairro
    left join datafinder.vw_valida_cidades
    on
    datafinder.vw_valida_cidades.cod_tom=tab_logradouro.cod_tom 
    where datafinder.vw_dash_geral.uf = datafinder.tab_logradouro.uf
    group by vw_dash_cidades_bairros.bairro




          
`
  const params = []


  if (!isBlank(cnae)) {
    query += " and estabelecimentos.cnae_fiscal = ? "
    params.push(cnae)
  }

  if (!isBlank(cnpj_base)) {
    query += "and estabelecimentos.cnpj = ? "
    params.push(cnpj_base)
  }
  if (!isBlank(cnpj_ordem)) {
    query += "and estabelecimentos.cnpj_ordem = ? "
    params.push(cnpj_ordem)
  }
  if (!isBlank(cnpj_dv)) {
    query += "and estabelecimentos.cnpj_dv = ? "
    params.push(cnpj_dv)
  }
  if (!isBlank(cod_situacao_cadastral)) {
    query += " and estabelecimentos.situacao = ? "
    params.push(cod_situacao_cadastral)
  }
  if (!isBlank(razao_social)) {
    query += " and empresas.razao LIKE ? "
    params.push(`${razao_social}%`)
  }
  if (!isBlank(nome_fantasia)) {
    query += " and estabelecimentos.nome LIKE ? "
    params.push(`${nome_fantasia}%`)
  }

  if (!isBlank(email)) {
    query += " and estabelecimentos.email LIKE ? "
    params.push(`${email}%`)
  }

  if (!isBlank(opcao_pelo_mei)) {
    query += " and (select (CASE when dados_simples.opcao_mei is null then 'n' else dados_simples.opcao_mei END)) = ? "
    params.push(opcao_pelo_mei)
  }
  if (!isBlank(porte_empresa)) {
    query += " and empresas.porte = ? "
    params.push(porte_empresa)
  }
  if (!isBlank(natureza_juridica)) {
    query += " and empresas.natureza = ? "
    params.push(natureza_juridica)
  }
  if (!isBlank(opcao_pelo_simples)) {
    query += " and dados_simples.opcao_simples = ? "
    params.push(opcao_pelo_simples)
  }
 
  if (!isBlank(uf)) {
    query += " and estabelecimentos.uf = ? "
    params.push(uf)
  }

  if (!isBlank(municipio)) {
    query += " and tab_cidade.cod_tom = ?  "
    params.push(municipio)
  }
  if (!isBlank(idade_empresa_maior)) {
    query += " and YEAR(CURDATE()) - YEAR(inicio_atividade) >= ?  "
    params.push(idade_empresa_maior)
  }
  if (!isBlank(idade_empresa_menor)) {
    query += " and YEAR(CURDATE()) - YEAR(inicio_atividade) <= ?  "
    params.push(idade_empresa_menor)
  }

  console.log("GEOM_graph")
  console.log("GEOM_graph cep", CEP)
  

  
  if (!isCount) query += ` `

  return this.execQuery(query, params)
}


//FIM GEOM
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////APIS//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  GOOGLE INFO - INÍCIO

inserir_google_info(cnpj, info) {
  console.log("{API SERP} - Inserindo Google Info de CNPJ: ", cnpj)
  console.log("{API SERP} - Inserindo Google Info: ", info)

  // const { url, address, phone, rating, last_updated } = info

  const { 
    last_updated, 
    phone, 
    address,
    funcionarios, 
    rating, 
    url,
    Receita,
    precoacoes,
    CEO,
    recursos,
    image_url,
    sub_title,
    description,
    logo_url,
    companyAddress,
    companyUrl
   
  } = info

  let cnpj_full = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
  let cnpj_base = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
  let cnpj_dv = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)
  
  let domain = url ? url.replace("www.", "").replace("/br", "").replace("https://", "").replace("http://", "").replace("/", "") : ""

  console.log("{API SERP} - Inserindo logo_url: ", logo_url)
  



  let projection = `
  
  (
  cnpj_base,
  cnpj_ordem,
  cnpj_dv,
  cnpj_full,
  rating,
  acoes,
  website,
  domain,
  num_funcionarios,
  receita,
  ceo,
  recursos,
  image_url,
  sub_title,
  description,
  logo_url,
  companyAddress,
  companyUrl,
  númeroDetelefone,
  date_serpsearch)
  VALUES
  ('${cnpj_base}',
  '${cnpj_ordem}',
  '${cnpj_dv}',
  '${cnpj_full}',
  ${rating ? `'${rating.value} ${rating.votes_count}'` : null},
  ${precoacoes ? `'${precoacoes}'` : null},
  ${url ? `'${url}'` : null},
  ${domain ? `'${domain}'` : null},
  ${funcionarios ? `'${funcionarios}'` : null},
  ${Receita ? `'${Receita}'` : null},
  ${CEO ? `'${CEO}'` : null},
  ${recursos ? `'${recursos}'` : null},
  ${image_url ? `'${image_url}'` : null},
  ${sub_title ? `'${sub_title}'` : null},
  ${description ? `"${description}"` : null},
  ${logo_url ? `'${logo_url}'` : null},
  ${address ? `'${address}'` : null},
  ${url ? `'${url}'` : null},
  ${phone ? `'${phone}'` : null},
  '${last_updated}');
  `

  let query = `INSERT IGNORE INTO tab_serp  ${projection}`

  console.log("{API SERP} -  query: ", query)

  const params = []

  return this.execQuery(query, params)
}

buscar_google_info(cnpj, callback) {
  console.log("{API SERP} - Buscando Google Info de CNPJ: ", cnpj)

  let query = `SELECT * from tab_serp where cnpj_full = ${cnpj};`

  const params = []

  return this.conexao.query(query, params, callback)
}

//  GOOGLE INFO - FINAL
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//INICIO LEADS
  buscar_leads(domain, callback) {
    console.log("{PRODUTODAO_API LEADS} - buscar_leads DOMAIN:", domain)
    
    const query = `
      SELECT *
      FROM datafinder.tab_leads
      WHERE tab_leads.domain = "${domain}";
    `;

    const params = [];

    return this.conexao.query(query, params, callback);

  }

  inserir_leads(domain, leads) {
    const leadsDataSQL = [];
    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      const leadDataSQL = `(
        "${convertNullOrUndefinedToBlank(lead.domain)}",
        "${convertNullOrUndefinedToBlank(lead.accuracy)}",
        "${convertNullOrUndefinedToBlank(lead.position)}",
        "${convertNullOrUndefinedToBlank(lead.twitter)}",
        "${convertNullOrUndefinedToBlank(lead.first_name)}",
        "${convertNullOrUndefinedToBlank(lead.last_name)}",
        "${convertNullOrUndefinedToBlank(lead.name)}",
        "${convertNullOrUndefinedToBlank(lead.department)}",
        "${convertNullOrUndefinedToBlank(lead.email)}"
      )`;

      leadsDataSQL.push(leadDataSQL);
    }
    console.log('{PRODUTODAO_API LEADS} - leadsDataSQL', leadsDataSQL)
    const query = `
      INSERT INTO datafinder.tab_leads
      (
        domain,
        accuracy,
        position,
        twitter,
        first_name,
        last_name,
        name,
        department,
        email
      )
      VALUES
      ${leadsDataSQL.join(',\n')}
    `;
    
    const params = [];

		return this.execQuery(query, params);
  }
//FIM LEADS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////ESTATISTICAS//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




insere_estatisticas_CNPJ(cnpj, callback) {
  let query = `
  INSERT INTO datafinder.tab_estatisticas_detalhamentos
(cnpj_cpf,modulo)
VALUES
('${cnpj}', 'Todas as Empresas');
`
  return this.conexao.query(query, callback)
}

//PAREI AAQUI ESTA INSERINDO VAZIO ACHO QUE SAO OS CAMPOS NAO DEFINDOS AQUI MESMO.
insere_estatisticas_BUSCA_CNPJ(cnpj, cod_situacao_cadastral, razao_social, nome_fantasia, email, porte_empresa, natureza_juridica, opcao_pelo_simples, opcao_pelo_mei, cnae, pagina, municipio, uf, idade_empresa_maior, idade_empresa_menor,tem_divida,capital_social,order_capital_social,ordenacao, callback) {
  let query = `
  INSERT INTO datafinder.tab_estatisticas_detalhamentos
(cnpj_cpf,modulo)
VALUES
(${cnpj}, 'Todas as Empresas Search');
`


      
console.log(cnpj)

console.log(query)

 return this.execQuery(query)
}


insere_estatisticas_CNAE(cnpj, callback) {
  let query = `
  INSERT INTO datafinder.tab_estatisticas_detalhamentos
(cnpj_cpf,modulo)
VALUES
('${cnpj}', 'CNAE');
`
  return this.conexao.query(query, callback)
}

insere_estatisticas_SOCIO(nome_socio,cpf, callback) {
  let query = `
  INSERT INTO datafinder.tab_estatisticas_detalhamentos
(cnpj_cpf,nome_socio,modulo)
VALUES
('${cpf}','${nome_socio}', 'Socios');
`
  return this.conexao.query(query, callback)
}

insere_estatisticas_HOLDINGS(cnpj, callback) {
  let query = `
  INSERT INTO datafinder.tab_estatisticas_detalhamentos
(cnpj_cpf,modulo)
VALUES
('${cnpj}', 'Holdings');
`
  return this.conexao.query(query, callback)
}


insere_estatisticas_DIVIDAS(cnpj, callback) {
  let query = `
  INSERT INTO datafinder.tab_estatisticas_detalhamentos
(cnpj_cpf,modulo)
VALUES
('${cnpj}', 'Dividas');
`
  return this.conexao.query(query, callback)
}


//FIM ESTATISTICAS



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////OUTROS//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DASH

consultarDASH(isCount, {  uf, callback }) {
  


  let query = `SELECT   id
from estabelecimentos 
          


where  1 = 1 

`
 
const params = []
  if (!isBlank(uf)) {
    query += " and estabelecimentos.uf = ? limit 1"
    params.push(uf)
  }

  console.log("DASH")
  console.log("CEP: ", uf)

  


  return this.execQuery(query,params)
  
}


DASH_graph(isCount, { uf, callback }) {
  

  

  
  let query = `
  
  SELECT
  'DASH_graph',
  vw_dash_geral.*,
  vw_dash_cidades_bairros.*,
 
  tab_logradouro.cep,
  tab_logradouro.id_logradouro,
  tab_logradouro.tipo,
  tab_logradouro.descricao,
  tab_logradouro.id_cidade,
  tab_logradouro.uf,
  tab_logradouro.complemento,
  tab_logradouro.descricao_sem_numero,
  tab_logradouro.descricao_cidade,
  tab_logradouro.codigo_cidade_ibge,
  tab_logradouro.bairro,
  tab_logradouro.cod_tom,
  vw_dash_dividas.dividas,
  vw_dash_dividas.dividas_total,
  vw_dash_dividas.vlr_dividas,
  vw_dash_dividas.vlr_dividas_total,
  vw_dash_dividas.qtd_dividas_prev,
  vw_dash_dividas.qtd_dividas_prev_total,
  vw_dash_dividas.vlr_dividas_prev,
  vw_dash_dividas.vlr_dividas_prev_total,
  vw_dash_dividas.qtd_dividas_nprev,
  vw_dash_dividas.qtd_dividas_nprev_total,
  vw_dash_dividas.vlr_dividas_nprev,
  vw_dash_dividas.vlr_dividas_nprev_total,
  vw_dash_dividas.qtd_dividas_fgts,
  vw_dash_dividas.qtd_dividas_fgts_total,
  vw_dash_dividas.vlr_dividas_fgts,
  vw_dash_dividas.vlr_dividas_fgts_total,
  vw_dash_dividas.tipo_pessoa_pf,
  vw_dash_dividas.tipo_pessoa_pf_total,
  vw_dash_dividas.tipo_pessoa_pj,
  vw_dash_dividas.tipo_pessoa_pj_total,
  vw_dash_dividas.tipo_situacao_inscricao_bf,
  vw_dash_dividas.tipo_situacao_inscricao_bf_total,
  vw_dash_dividas.tipo_situacao_inscricao_cb,
  vw_dash_dividas.tipo_situacao_inscricao_cb_total,
  vw_dash_dividas.tipo_situacao_inscricao_emgarantia,
  vw_dash_dividas.tipo_situacao_inscricao_emgarantia_total,
  vw_dash_dividas.tipo_situacao_inscricao_judicial,
  vw_dash_dividas.tipo_situacao_inscricao_judicial_total,
  vw_dash_dividas.indicador_ajuizado_sim,
  vw_dash_dividas.indicador_ajuizado_sim_total,
  vw_dash_dividas.indicador_ajuizado_nao,
  vw_dash_dividas.indicador_ajuizado_nao_total,
  vw_dash_dividas.valor_prev,
  vw_dash_dividas.valor_prev_total,
  vw_dash_dividas.valor_nprev,
  vw_dash_dividas.valor_nprev_total,
  vw_dash_dividas.valor_fgts,
  vw_dash_dividas.valor_fgts_total,
  vw_dash_dividas.valor_prev_regular,
  vw_dash_dividas.valor_prev_regular_total,
  vw_dash_dividas.valor_prev_irregular,
  vw_dash_dividas.valor_prev_irregular_total,
  vw_dash_dividas.valor_nprev_regular,
  vw_dash_dividas.valor_nprev_regular_total,
  vw_dash_dividas.valor_nprev_irregular,
  vw_dash_dividas.valor_nprev_irregular_total,
  vw_dash_dividas.valor_fgts_regular,
  vw_dash_dividas.valor_fgts_regular_total,
  vw_dash_dividas.valor_fgts_irregular,
  vw_dash_dividas.valor_fgts_irregular_total,
  vw_dash_dividas.situacao_regular,
  vw_dash_dividas.situacao_regular_total,
  vw_dash_dividas.situacao_irregular,
  vw_dash_dividas.situacao_irregular_total,
  vw_dash_dividas.dt_coleta,
  

  tab_estados.descricao as estado,
  CONCAT('../../img/estados/', tab_estados.sigla,'.png') as bandeira,
  tab_cidade.*

  FROM 
  
  datafinder.vw_dash_geral
 
 
  left join datafinder.tab_logradouro
  on
  tab_logradouro.cep= (select cep from  tab_logradouro where tab_logradouro.uf = '${uf}' limit 1)

  left join tab_estados
  on
  datafinder.tab_logradouro.uf=tab_estados.sigla
  left join tab_cidade
  on
  tab_cidade.cod_tom=tab_logradouro.cod_tom
  left join datafinder.vw_dash_cidades_bairros
  on
  datafinder.vw_dash_cidades_bairros.cod_tom=tab_logradouro.cod_tom and datafinder.vw_dash_cidades_bairros.bairro=tab_logradouro.bairro
  
  left join  datafinder.vw_dash_dividas
  on
  datafinder.vw_dash_dividas.uf = '${uf}'

  where datafinder.vw_dash_geral.uf = datafinder.tab_logradouro.uf


          
`
  const params = []


  if (!isBlank(uf)) {
    query += " and vw_dash_geral.uf = ? "
    params.push(uf)
  }


  console.log("DASH_graph")
  console.log("DASH_graph UF: >>>>>>>>>", uf)
  

  

  return this.execQuery(query, params)
}

//FIM DASH
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  fornecedor_gov

buscar_fornecedores(cnpj, callback) {
  console.log("{API fornec_gov} - Buscando fornec_gov de CNPJ: ", cnpj)

  let query = ` SELECT * FROM datafinder.tab_fornec_gov WHERE tab_fornec_gov.cnpj_contratada = ${cnpj_full};`

  const params = []

  return this.conexao.query(query, params, callback)
}

inserir_fornecedor_gov(cnpj, fornec_gov) {
const fornec_govDataSQL = [];
for (let i = 0; i < fornec_gov.length; i++) {
  const fornec = fornec_gov[i];
  const leadDataSQL = `(
  
"${convertNullOrUndefinedToBlank(fornec.identificador)}",
"${convertNullOrUndefinedToBlank(fornec.uasg)}",
"${convertNullOrUndefinedToBlank(fornec.modalidade_licitacao)}",
"${convertNullOrUndefinedToBlank(fornec.numero_aviso_licitacao)}",
"${convertNullOrUndefinedToBlank(fornec.codigo_contrato)}",
"${convertNullOrUndefinedToBlank(fornec.licitacao_associada)}",
"${convertNullOrUndefinedToBlank(fornec.origem_licitacao)}",
"${convertNullOrUndefinedToBlank(fornec.numero)}",
"${convertNullOrUndefinedToBlank(fornec.objeto)}",
"${convertNullOrUndefinedToBlank(fornec.numero_aditivo)}",
"${convertNullOrUndefinedToBlank(fornec.numero_processo)}",
"${convertNullOrUndefinedToBlank(fornec.cpfContratada)}",
"${convertNullOrUndefinedToBlank(fornec.cnpj_contratada)}",
"${convertNullOrUndefinedToBlank(fornec.data_assinatura)}",
"${convertNullOrUndefinedToBlank(fornec.fundamento_legal)}",
"${convertNullOrUndefinedToBlank(fornec.data_inicio_vigencia)}",
"${convertNullOrUndefinedToBlank(fornec.data_termino_vigencia)}",
"${convertNullOrUndefinedToBlank(fornec.valor_inicial)}"
  )`;

  fornec_govDataSQL.push(leadDataSQL);
}
console.log('{API fornec_gov} - fornec_govDataSQL', fornec_govDataSQL)
const query = `
INSERT INTO datafinder.tab_fornec_gov
(
cnpj_contratada,
cpfContratada,
identificador,
uasg,
modalidade_licitacao,
numero_aviso_licitacao,
codigo_contrato,
licitacao_associada,
origem_licitacao,
numero,
objeto,
numero_aditivo,
numero_processo,
data_assinatura,
fundamento_legal,
data_inicio_vigencia,
data_termino_vigencia,
valor_inicial
)
VALUES
  ${fornec_govDataSQL.join(',\n')}
`;

const params = [];

return this.execQuery(query, params);
}
//  fornecedor_gov FINAL
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









	//MEI 
	consultarMEI(isCount, { cnpj, cpf, cod_situacao_cadastral, razao_social, nome_fantasia, email, porte_empresa, natureza_juridica, opcao_pelo_simples, cnae, municipio, uf, idade_empresa_maior, idade_empresa_menor, pagina }) {
		pagina = isBlank(pagina) ? 1 : parseInt(pagina)

		if (pagina === 1) {
			pagina = 0
		} else {
			pagina--
			pagina = parseInt(pagina) * 20 + 1
		}
		let cnpj1 = cnpj.replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
		let projection = isCount
			? "count(1) as count_query"
			: `
  
      (
    CASE 
        WHEN CHAR_LENGTH(GetNumber(empresas.razao)) > 8
        THEN uExtractNonNumbersFromString(empresas.razao)
        ELSE (empresas.razao)
    END
  ) AS nm_socio,
(
    CASE
   when estabelecimentos.cnpj is null then empresas.cnpj
   else CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
   END
    ) as cnpj_cnpj,

  
  
    cnpj_status.nm_sit_cadastral AS sit_cadastral,

        tab_cnae_up.nome AS nm_cnae,
        tab_cnae_up.nm_setor as setor,
        (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS porte_empresa,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS nm_porte,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS porte,
        estabelecimentos.telefone_1 AS fone_1,
        YEAR(CURDATE()) - YEAR(inicio_atividade) AS age,
        estabelecimentos.email AS email,

        empresas.razao as razao_social,
        (case
          WHEN estabelecimentos.nome is NULL 
          then '*****' 
          Else
          estabelecimentos.nome
          END
          ) as nome_fantasia,
        cnpj_status.nm_sit_cadastral as situacao_cadastral,
        tab_situacao_cadastral.nm_situacao_cadastral AS motivo_sit_cadastral,
        DATE_FORMAT(estabelecimentos.data_situacao, '%d/%m/%Y') AS data_atual_cadastral,
        estabelecimentos.cidade_exterior,
      
        (CASE
        When estabelecimentos.pais is NULL then 'Brasil'
        Else estabelecimentos.pais
        END) as pais,
        tab_natureza_juridica.nm_subclass_natureza_juridica AS natureza_juridica,
        DATE_FORMAT(estabelecimentos.inicio_atividade, '%d/%m/%Y') AS data_inicio,
        YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) AS age,
        estabelecimentos.cnae_fiscal AS 'cnae_primario',
        tab_cnae_up.nome,
        estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
        estabelecimentos.logradouro,
        estabelecimentos.numero,
        TRIM(estabelecimentos.complemento),

        TRIM(estabelecimentos.bairro),

        estabelecimentos.cep,
        CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital,
        (CASE
  when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
  else estabelecimentos.uf
  END) as uf,
       (
  CASE
      WHEN tab_cidade.nome  is  null
      THEN 'Exterior'
      ELSE (tab_cidade.nome)
  END
) AS municipio,
        estabelecimentos.telefone_1,
        estabelecimentos.telefone_2,
        estabelecimentos.numero_fax AS 'FAX',
        estabelecimentos.email AS 'email',
        tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio AS qualificacao,
        CAST(empresas.capital as UNSIGNED) AS capital,
        tab_porte_empresa.nm_porte AS porte,
        (case when dados_simples.opcao_simples is null then 'não optante' when dados_simples.opcao_simples = 'n' then 'não optante' when dados_simples.opcao_simples = 's' then 'optante' end)as simples_nacional,
        estabelecimentos.data_situacao,
        estabelecimentos.motivo_situacao,
        tab_situacao_cadastral.nm_situacao_cadastral
    `

		let query = `SELECT  ${projection}
    
   

FROM empresas
left join estabelecimentos
on
empresas.cnpj=estabelecimentos.cnpj
left join dados_simples
on
estabelecimentos.cnpj=dados_simples.cnpj
  
   LEFT JOIN
cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao

   LEFT JOIN
tab_porte_empresa ON tab_porte_empresa.id = empresas.porte
   LEFT JOIN
tab_cnae_up ON tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
   LEFT JOIN
tab_cidade ON tab_cidade.cod_tom = estabelecimentos.municipio
   LEFT JOIN
tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf

   LEFT JOIN
tab_natureza_juridica ON tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
   LEFT JOIN
tab_opcao_simples ON tab_opcao_simples.cod = dados_simples.opcao_simples
   LEFT JOIN
tab_situacao_cadastral ON estabelecimentos.motivo_situacao = tab_situacao_cadastral.cod_situacao_cadastral

WHERE
1 = 1
AND empresas.natureza IN (2135 , 4120,
   2305,
   2313,
   4014,
   4081,
   4022,
   4081,
   4090,
   4111,
   3999)

    `
		const params = []
		if (!isBlank(cnpj1)) {
			query += " and estabelecimentos.cnpj = ?"
			params.push(cnpj1)
		}
		if (!isBlank(cpf)) {
			query += "and cnpj_mei.cpf = REPLACE(REPLACE(REPLACE(?,'.', ''),'-', ''),'/', '') "
			params.push(cpf)
		}
		if (!isBlank(cod_situacao_cadastral)) {
			query += " and estabelecimentos.situacao = ? "
			params.push(cod_situacao_cadastral)
		}
		if (!isBlank(razao_social)) {
			query += " and empresas.razao LIKE ?"
			params.push(`${razao_social}%`)
		}
		if (!isBlank(nome_fantasia)) {
			query += " and estabelecimentos.nome LIKE ? "
			params.push(`${nome_fantasia}%`)
		}

		if (!isBlank(email)) {
			query += " and estabelecimentos.email LIKE ? "
			params.push(`${email}%`)
		}

		if (!isBlank(porte_empresa)) {
			query += " and empresas.porte = ? "
			params.push(porte_empresa)
		}
		if (!isBlank(natureza_juridica)) {
			query += " and empresas.natureza = ? "
			params.push(natureza_juridica)
		}
		if (!isBlank(opcao_pelo_simples)) {
			query += " and dados_simples.opcao_simples = ? "
			params.push(opcao_pelo_simples)
		}

		if (!isBlank(cnae)) {
			query += " and estabelecimentos.cnae_fiscal = ? "
			params.push(cnae)
		}
		if (!isBlank(uf)) {
			query += " and estabelecimentos.uf = ? "
			params.push(uf)
		}

		if (!isBlank(municipio)) {
			query += " estabelecimentos.municipio = ?  "
			params.push(municipio)
		}
		if (!isBlank(idade_empresa_maior)) {
			query += " and YEAR(CURDATE()) - YEAR(inicio_atividade) >= ?  "
			params.push(idade_empresa_maior)
		}
		if (!isBlank(idade_empresa_menor)) {
			query += " and YEAR(CURDATE()) - YEAR(inicio_atividade) <= ?  "
			params.push(idade_empresa_menor)
		}

		console.log("consultarMEI")

		console.log(cnpj)
		console.log(cnpj1)
		if (!isCount) query += ` LIMIT  ${pagina}, 50 `

		return this.execQuery(query, params)
	}

	buscar_detalhes_MEI(cnpj, callback) {
		let cnpj1 = cnpj.replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
		let projection = ` 
  @calculo_ativo :=
  DATE_SUB( DATE_SUB( DATE_SUB( CURRENT_DATE,
           INTERVAL YEAR( estabelecimentos.inicio_atividade ) - 1 YEAR
        ), INTERVAL MONTH( estabelecimentos.inicio_atividade ) - 1 MONTH
        ), INTERVAL DAY( estabelecimentos.inicio_atividade ) - 1 DAY
  ) AS calculo_ativo,
@calculo_nao_ativo :=
  DATE_SUB( DATE_SUB( DATE_SUB( data_situacao,
           INTERVAL YEAR( estabelecimentos.inicio_atividade ) - 1 YEAR
        ), INTERVAL MONTH( estabelecimentos.inicio_atividade ) - 1 MONTH
        ), INTERVAL DAY( estabelecimentos.inicio_atividade ) - 1 DAY
  ) AS calculo_nao_ativo,
  
   @calculo_alteracao :=
  DATE_SUB( DATE_SUB( DATE_SUB( CURRENT_DATE,
           INTERVAL YEAR( estabelecimentos.data_situacao ) - 1 YEAR
        ), INTERVAL MONTH( estabelecimentos.data_situacao ) - 1 MONTH
        ), INTERVAL DAY( estabelecimentos.data_situacao ) - 1 DAY
  ) AS calculo_alteracao,
  
  (
    CASE
   when estabelecimentos.cnpj is null then empresas.cnpj
   else CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv)
   END
    ) as cnpj2,
    CONCAT(estabelecimentos.cnpj,estabelecimentos.cnpj_ordem,estabelecimentos.cnpj_dv) as cnpj,
  (
    CASE
        WHEN estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos  where cnpj LIKE CONCAT('${cnpj1}' , '%')) = 0 THEN tab_matriz_filial.nm_matriz_filial
        
        WHEN estabelecimentos.matriz_filial = '1' and (select count(1) from estabelecimentos  where cnpj LIKE CONCAT('${cnpj1}' , '%') and  estabelecimentos.matriz_filial = 2) > 0 THEN CONCAT(tab_matriz_filial.nm_matriz_filial, ' - ', ' Filiais: ',(select count(1) from estabelecimentos  where cnpj LIKE CONCAT( '${cnpj1}' , '%') and  estabelecimentos.matriz_filial = 2)) 
	
        WHEN estabelecimentos.matriz_filial = '2' THEN tab_matriz_filial.nm_matriz_filial
        ELSE tab_matriz_filial.nm_matriz_filial
    END
  ) AS nm_matriz_filial,
  (
    CASE
        WHEN (select count(id) from estabelecimentos  where cnpj LIKE CONCAT('${cnpj1}' , '%')) > 1 THEN 'Nenhuma Filial'
     
        ELSE (select count(id) from estabelecimentos  where cnpj LIKE CONCAT('${cnpj1}' , '%') -1
    END
  ) AS filiais,
  
  (
    CASE 
        WHEN CHAR_LENGTH(GetNumber(empresas.razao)) > 8
        THEN uExtractNonNumbersFromString(empresas.razao)
        ELSE (empresas.razao)
    END
  ) AS razao_social,
    (select  CAST(sum(
      case when 
       (estabelecimentos.matriz_filial = 2) 
           then 1 
           else 0 
   end )as DECIMAL)) as filiais,
   (case
    WHEN estabelecimentos.nome is NULL 
    then '*****' 
    Else
    estabelecimentos.nome
    END
    ) as nome_fantasia,
  cnpj_status.nm_sit_cadastral as situacao_cadastral,
  tab_situacao_cadastral.nm_situacao_cadastral AS motivo_sit_cadastral,
  DATE_FORMAT(estabelecimentos.data_situacao, '%d/%m/%Y') AS data_atual_cadastral,
  estabelecimentos.cidade_exterior,
 (CASE
        When estabelecimentos.pais is NULL then 'Brasil'
        Else estabelecimentos.pais
        END) as pais,

  tab_natureza_juridica.nm_subclass_natureza_juridica AS natureza_juridica,
  DATE_FORMAT(estabelecimentos.inicio_atividade, '%d/%m/%Y') AS data_inicio,
  YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) AS age,
  estabelecimentos.cnae_fiscal AS 'cnae_primario',
  tab_cnae_up.nome,
  estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
  estabelecimentos.logradouro,
  estabelecimentos.numero,
  TRIM(estabelecimentos.complemento),

  TRIM(estabelecimentos.bairro),

  estabelecimentos.cep,
  CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital,
  (CASE
  when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
  else estabelecimentos.uf
  END) as uf,

  (
    CASE
        WHEN tab_cidade.nome  is  null
        THEN 'Exterior'
        ELSE (tab_cidade.nome)
    END
  ) AS municipio,
  estabelecimentos.telefone_1,
  estabelecimentos.telefone_2,
  estabelecimentos.numero_fax AS 'FAX',
  estabelecimentos.email AS 'email',
  tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio AS qualificacao,
  CAST(empresas.capital as UNSIGNED) AS capital,
  tab_porte_empresa.nm_porte AS porte,
 
  (case when dados_simples.opcao_simples is null then 'não optante' when dados_simples.opcao_simples = 'n' then 'não optante' when dados_simples.opcao_simples = 's' then 'optante' end)as simples_nacional,
  estabelecimentos.data_situacao,
  estabelecimentos.motivo_situacao,
  tab_situacao_cadastral.nm_situacao_cadastral,
  
  (
    CASE 
        WHEN estabelecimentos.situacao = '02' THEN CONCAT('Funcionando desde ',DATE_FORMAT(estabelecimentos.inicio_atividade,  '%Y'), ', à ',YEAR( @calculo_ativo ) - 1,' Anos, ',MONTH( @calculo_ativo ) - 1,' Meses E ', DAY( @calculo_ativo ) - 1,' Dias.' ,' Ultima atualização à: ' ,YEAR( @calculo_alteracao ) - 1,' Anos, ',MONTH( @calculo_alteracao ) - 1,' Meses E ', DAY( @calculo_alteracao ) - 1,' Dias' )
        WHEN estabelecimentos.situacao <> '2' THEN CONCAT('Foi aberta em: ',DATE_FORMAT(estabelecimentos.inicio_atividade,  '%Y'),', mas esta ',cnpj_status.nm_sit_cadastral,' desde ',DATE_FORMAT(estabelecimentos.data_situacao,  '%Y'),'. Funcionou por: ',YEAR( @calculo_nao_ativo ) - 1,' Anos, ',MONTH( @calculo_nao_ativo ) - 1,' Meses E ', DAY( @calculo_nao_ativo ) - 1, ' dias. Ultima alteração à: ' , YEAR( @calculo_alteracao ) - 1,' Anos, ',MONTH( @calculo_alteracao ) - 1,' Meses E ', DAY( @calculo_alteracao ) - 1,' Dias, ' )
        
    END
  ) AS Status,
  
  tab_serp.domain,

  (CASE
          WHEN dados_simples.opcao_mei is null then 'Não'
          when dados_simples.opcao_mei = 'n' then 'Não'
          when dados_simples.opcao_mei = 's' then 'Sim'
          END
          )AS microempreendedor_individual


  
   `
		let query = `SELECT  ${projection}

  FROM
  empresas
  left join estabelecimentos
on
empresas.cnpj=estabelecimentos.cnpj
left join dados_simples
on
estabelecimentos.cnpj=dados_simples.cnpj
      LEFT JOIN
  tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf
      LEFT JOIN
  tab_matriz_filial ON tab_matriz_filial.id = estabelecimentos.matriz_filial
      LEFT JOIN
  cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao
      
      LEFT JOIN
  tab_natureza_juridica ON tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
      LEFT JOIN
  tab_cnae_up ON tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
      LEFT JOIN
  tab_opcao_simples ON tab_opcao_simples.cod = dados_simples.opcao_simples
      LEFT JOIN
  tab_porte_empresa ON tab_porte_empresa.id = empresas.porte
    
      LEFT JOIN
  tab_situacao_cadastral ON estabelecimentos.motivo_situacao = tab_situacao_cadastral.cod_situacao_cadastral
  left   join tab_cidade
  on 
  tab_cidade.cod_tom=estabelecimentos.municipio

  left join tab_serp
  on empresas.cnpj=tab_serp.cnpj_base

  where  1 = 1

  `

		const params = []

		if (!isBlank(cnpj1)) {
			query += " and estabelecimentos.cnpj LIKE CONCAT(? , '%') group by estabelecimentos.cnpj "
			params.push(cnpj1)
		}

		console.log("buscar_detalhes_MEI")
		console.log(cnpj)
		console.log(cnpj1)
		return this.conexao.query(query, params, callback)
	}

	// FIM MEI 

// EMPRESAS DE CAPITAL ABERTO

consultarECA(isCount, { cnpj, razao_social, data_inscricao_inicio, data_inscricao_fim, valor_patrimonio_abaixo, valor_patrimonio_acima, cod_situacao_cadastral, porte_empresa, uf, municipio, pagina, classe_cnae }) {
  pagina = isBlank(pagina) ? 1 : parseInt(pagina)

  if (pagina === 1) {
    pagina = 0
  } else {
    pagina--
    pagina = parseInt(pagina) * 20 + 1
  }
  let cnpj1 = cnpj.replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
  let projection = isCount
    ? "count(1) as count_query"
    : `
  

    (case
      WHEN estabelecimentos.nome is NULL 
      then '*****' 
      Else
      estabelecimentos.nome
      END
      ) as nome_fantasia,
estabelecimentos.matriz_filial as identificador_matriz_filial,
estabelecimentos.situacao as situacao_cadastral,
estabelecimentos.data_situacao as data_situacao_cadastral,
estabelecimentos.motivo_situacao as motivo_situacao_cadastral,
estabelecimentos.cidade_exterior as nm_cidade_exterior,
estabelecimentos.pais as cod_pais,
estabelecimentos.inicio_atividade as data_inicio_atividade,

       
estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,

estabelecimentos.municipio as codigo_municipio,

(CASE
When estabelecimentos.ddd_1 is not null and estabelecimentos.telefone_1 is not null then CONCAT(estabelecimentos.ddd_1,'-',estabelecimentos.telefone_1 )

END) as ddd_telefone_1,
(CASE
When estabelecimentos.ddd_2 is not null and estabelecimentos.telefone_2 is not null then CONCAT(estabelecimentos.ddd_2,'-',estabelecimentos.telefone_2 )

END) as ddd_telefone_2,
(CASE
When estabelecimentos.ddd_fax is not null and estabelecimentos.numero_fax is not null then CONCAT(estabelecimentos.ddd_fax,'-',estabelecimentos.numero_fax )

END) as ddd_telefone_2,
        
estabelecimentos.email as correio_eletronico,
  cnpj_dividas.*,
  cnpj_capital_aberto.*,
  estabelecimentos.cnpj,
  empresas.razao as razao_social,
  cnpj_status.nm_sit_cadastral,
  (CASE
  when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
  else estabelecimentos.uf
  END) as uf,
  estabelecimentos.telefone_1,
  (
CASE 
    WHEN empresas.porte is  null 
    THEN 'Porte não Declarado'
    ELSE empresas.porte
END
) AS porte_empresa,
  (
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS porte_empresa,
    (
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS nm_porte,
    (
      CASE
          WHEN empresas.porte is  null
          THEN 'Porte não Declarado'
          ELSE tab_porte_empresa.nm_porte
      END
    ) AS porte,
  CAST(empresas.capital as UNSIGNED) AS capital,
  cnpj_capital_aberto.val_patr_liq as patrimonio,
  SUM(cnpj_dividas.valor_consolidado ) as dividas,
  cnpj_capital_aberto.val_patr_liq - (SUM(cnpj_dividas.valor_consolidado)) as total
  `
  let query = `SELECT  ${projection} 
 
  FROM
  empresas

  inner join cnpj_capital_aberto
  on
  estabelecimentos.cnpj=cnpj_capital_aberto.cpf_cnpj

  left join cnpj_dividas
  on
  estabelecimentos.cnpj=cnpj_dividas.cpf_cnpj

  left join cnpj_status
  on cnpj_status.cod_sit_cad=estabelecimentos.situacao

  left join tab_matriz_filial
  on
  tab_matriz_filial.id=estabelecimentos.matriz_filial

  left join tab_porte_empresa
  on
  tab_porte_empresa.id=empresas.porte

  left join tab_cnae_up
  on tab_cnae_up.cod_cnae=estabelecimentos.cnae_fiscal

  left   join tab_cidade
  on
  tab_cidade.cod_tom=estabelecimentos.municipio


  


  where  1 = 1


  
  `

  const params = []

  if (!isBlank(cnpj)) {
    query += " and cnpj_dividas.cpf_cnpj = REPLACE(REPLACE(REPLACE(?,'.', ''),'-', ''),'/', '')"

    params.push(cnpj)
  }
  if (!isBlank(razao_social)) {
    query += " and empresas.razao LIKE ? "
    params.push(`${razao_social}%`)
  }

  if (!isBlank(data_inscricao_inicio)) {
    query += " and cnpj_capital_aberto.dt_patr_liq >= ?  "
    params.push(data_inscricao_inicio)
  }
  if (!isBlank(data_inscricao_fim)) {
    query += " and cnpj_capital_aberto.dt_patr_liq <= ?  "
    params.push(data_inscricao_fim)
  }
  if (!isBlank(valor_patrimonio_acima)) {
    query += " and cnpj_capital_aberto.val_patr_liq >= convert(?, decimal)  "
    params.push(valor_divida_acima)
  }

  if (!isBlank(valor_patrimonio_abaixo)) {
    query += " and cnpj_capital_aberto.val_patr_liq <= convert(?, decimal)  "
    params.push(valor_divida_abaixo)
  }
  if (!isBlank(cod_situacao_cadastral)) {
    query += " and estabelecimentos.situacao = ? "
    params.push(cod_situacao_cadastral)
  }

  if (!isBlank(porte_empresa)) {
    query += " and empresas.porte = ? "
    params.push(porte_empresa)
  }

  if (!isBlank(uf)) {
    query += " and estabelecimentos.uf = ? "
    params.push(uf)
  }

  if (!isBlank(municipio)) {
    query += " estabelecimentos.municipio = ?  "
    params.push(municipio)
  }

  console.log("ECA")

  if (!isCount) query += `group by estabelecimentos.cnpj order by cnpj_capital_aberto.val_patr_liq DESC LIMIT ${pagina}, 20 `

  return this.execQuery(query, params)
}

buscar_detalhes_ECA(id, callback) 
{
try {
  this.conexao.query(
    `    
    select 
    estabelecimentos.*,
    cnpj_dividas.*,
    cnpj_capital_aberto.*,
    estabelecimentos.cnpj,
    empresas.razao as razao_social,
    cnpj_status.nm_sit_cadastral,
    (CASE
  when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
  else estabelecimentos.uf
  END) as uf,
    estabelecimentos.telefone_1,
    (
CASE 
  WHEN empresas.porte is  null 
  THEN 'Porte não Declarado'
  ELSE empresas.porte
END
) AS porte_empresa,
    (
    CASE
        WHEN empresas.porte is  null
        THEN 'Porte não Declarado'
        ELSE tab_porte_empresa.nm_porte
    END
  ) AS porte_empresa,
  (
    CASE
        WHEN empresas.porte is  null
        THEN 'Porte não Declarado'
        ELSE tab_porte_empresa.nm_porte
    END
  ) AS nm_porte,
  (
    CASE
        WHEN empresas.porte is  null
        THEN 'Porte não Declarado'
        ELSE tab_porte_empresa.nm_porte
    END
  ) AS porte,
    CAST(empresas.capital as UNSIGNED) AS capital,
    tab_serp.domain,
    cnpj_capital_aberto.val_patr_liq as patrimonio,
    SUM(cnpj_dividas.valor_consolidado ) as dividas,
    cnpj_capital_aberto.val_patr_liq - (SUM(cnpj_dividas.valor_consolidado)) as total
    FROM empresas

    inner join cnpj_capital_aberto
    on
    estabelecimentos.cnpj=cnpj_capital_aberto.cpf_cnpj

    left join cnpj_dividas
    on
    estabelecimentos.cnpj=cnpj_dividas.cpf_cnpj

    left join cnpj_status
    on cnpj_status.cod_sit_cad=estabelecimentos.situacao

    left join tab_matriz_filial
    on
    tab_matriz_filial.id=estabelecimentos.matriz_filial

    left join tab_porte_empresa
    on
    tab_porte_empresa.id=empresas.porte

    left join tab_cnae_up
    on tab_cnae_up.cod_cnae=estabelecimentos.cnae_fiscal

    left   join tab_cidade
    on
    tab_cidade.cod_tom=estabelecimentos.municipio

    lef join tab_serp
    on empresas.cnpj=tab_serp.cnpj_base

where ?`,
    { cnpj: id },
    callback
  )
} catch (err) {
  console.log(err)
}
}
//FIM EMPRESAS DE CAPITAL ABERTO




/*

	buscar(cnpj, razao_social, nome_fantasia, cnae, cod_situacao_cadastral, cod_natureza_juridica, opcao_pelo_simples, opcao_pelo_mei, pagina, municipio, uf, email, callback) {
		if (pagina == 1) {
			pagina = 0
		} else {
			pagina -= 1
			pagina = parseInt(pagina) * 20 + 1
		}

		let criterio = ""
		if (cnpj != "") criterio += "  estabelecimentos.cnpj = " + this.conexao.escape("" + cnpj + "")
		//if (razao_social !='' && cnae !='' ) criterio += ' and ';
		//if (razao_social !='' && cod_situacao_cadastral !='' ) criterio += ' and ';
		// if (cnpj != ''  && (razao_social !='' || nome_fantasia !='' ) ) criterio += ' and ';
		if (razao_social != "") criterio += "  empresas.razao LIKE " + this.conexao.escape("" + razao_social + "%")
		// if (razao_social !='' && nome_fantasia !='' ) criterio += ' and ';
		if (nome_fantasia != "") criterio += "  estabelecimentos.nome LIKE " + this.conexao.escape("" + nome_fantasia + "%")
		if (cnae != "") criterio += "  and estabelecimentos.cnae_fiscal = " + this.conexao.escape("" + cnae + "")
		if (opcao_pelo_mei != "") criterio += "  and dados_simples.opcao_mei = " + this.conexao.escape(opcao_pelo_mei + "")
		if (cod_situacao_cadastral != "") criterio += "  and estabelecimentos.situacao = " + this.conexao.escape(cod_situacao_cadastral + "")
		if (cod_natureza_juridica != "") criterio += "  and empresas.natureza = " + this.conexao.escape(cod_natureza_juridica + "")
		if (opcao_pelo_simples != "") criterio += "  and dados_simples.opcao_simples = " + this.conexao.escape(opcao_pelo_simples + "")
		if (uf != "") criterio += "  and estabelecimentos.uf = " + this.conexao.escape(uf + "")
		if (municipio != "") criterio += " and estabelecimentos.municipio LIKE " + this.conexao.escape("" + municipio + "%")
		if (email != "") criterio += "  estabelecimentos.email LIKE " + this.conexao.escape("" + email + "%")

		try {
			var new_query = this.conexao.query(
				`select 
        
        (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS porte_empresa,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS nm_porte,
      (
        CASE
            WHEN empresas.porte is  null
            THEN 'Porte não Declarado'
            ELSE tab_porte_empresa.nm_porte
        END
      ) AS porte,
        estabelecimentos.telefone_1 as fone_1,
        YEAR(CURDATE()) - YEAR(inicio_atividade) AS age,
        cnpj_status.nm_sit_cadastral as sit_cadastral,
        tab_matriz_filial.nm_matriz_filial,
        estabelecimentos.email as email
       
        
        
               
        from estabelecimentos 

        left join cnpj_status
        on cnpj_status.cod_sit_cad=estabelecimentos.situacao

        left join tab_matriz_filial
        on
        tab_matriz_filial.id=estabelecimentos.matriz_filial

        left join tab_porte_empresa
        on
        tab_porte_empresa.id=empresas.porte
    

        where ${criterio} 
     
        ORDER BY sit_cadastral LIMIT  ${pagina}, 50;`,
				callback
			)
		} catch (err) {
			console.log(err)
		}
	}

	buscar_count(cnpj, razao_social, nome_fantasia, cnae, cod_situacao_cadastral, cod_natureza_juridica, opcao_pelo_simples, pagina, municipio, uf, email, callback) {
		let criterio = ""

		if (cnpj != "") criterio += "  estabelecimentos.cnpj = " + this.conexao.escape("" + cnpj + "")
		//if (razao_social !='' && cnae !='' ) criterio += ' and ';
		//if (razao_social !='' && cod_situacao_cadastral !='' ) criterio += ' and '; //Retirado pois ele coloca AND depois do primeiro statement e neste caso o cod_situacao_cadastral tem uma linha com AND ja.
		if (cnpj != "" && (razao_social != "" || nome_fantasia != "")) criterio += " and "
		if (razao_social != "") criterio += "  empresas.razao LIKE " + this.conexao.escape("" + razao_social + "%")
		if (razao_social != "" && nome_fantasia != "") criterio += " and "
		if (nome_fantasia != "") criterio += "  estabelecimentos.nome LIKE " + this.conexao.escape("" + nome_fantasia + "%")
		if (cnae != "") criterio += "  and estabelecimentos.cnae_fiscal = " + this.conexao.escape("" + cnae + "")
		if (cod_situacao_cadastral != "") criterio += "  and estabelecimentos.situacao = " + this.conexao.escape(cod_situacao_cadastral + "")
		if (cod_natureza_juridica != "") criterio += "  and empresas.natureza = " + this.conexao.escape(cod_natureza_juridica + "")
		if (opcao_pelo_simples != "") criterio += "  and dados_simples.opcao_simples = " + this.conexao.escape(opcao_pelo_simples + "")
		if (uf != "") criterio += "  and estabelecimentos.uf = " + this.conexao.escape(uf + "")
		if (municipio != "") criterio += "   and estabelecimentos.municipio LIKE " + this.conexao.escape("" + municipio + "%")
		if (email != "") criterio += "  estabelecimentos.email LIKE " + this.conexao.escape("" + email + "%")
		try {
			this.conexao.query(
				`select count(9) as count

        from estabelecimentos 
        

        left join cnpj_status
        on cnpj_status.cod_sit_cad=estabelecimentos.situacao

        left join tab_matriz_filial
        on
        tab_matriz_filial.id=estabelecimentos.matriz_filial

        left join tab_porte_empresa
        on
        tab_porte_empresa.id=empresas.porte



            where ${criterio} ;`,
				callback
			)
		} catch (err) {
			console.log(err)
		}
	}

	buscar_dados_socios(socio, identificador_socio, cod_qualificacao_socio, pagina, callback) {
		let criterio = ""
		if (pagina == 1) {
			pagina = 0
		} else {
			pagina -= 1
			pagina = parseInt(pagina) * 20 + 1
		}

		if (socio != "") criterio += " socios.nome LIKE " + this.conexao.escape("" + socio + "%")
		// if (identificador_socio !='')                   criterio += "socios.identificador_socio =  "+ this.conexao.escape(""+identificador_socio+"");
		if (identificador_socio != "" && identificador_socio != undefined) criterio += " and socios.identificador_socio = " + this.conexao.escape(identificador_socio + "")
		if (cod_qualificacao_socio != "" && cod_qualificacao_socio != undefined) criterio += " and cod_qualificacao_socio = " + this.conexao.escape(cod_qualificacao_socio + "")

		var sql = `SELECT 
socios.nome as nome,
socios.cpf_cnpj as cpf,
socios.cnpj as cnpj,
empresas.razao as razao_social,
(
  CASE 
      WHEN CHAR_LENGTH(GetNumber(empresas.razao)) > 8
      THEN uExtractNonNumbersFromString(empresas.razao)
      ELSE (empresas.razao)
  END
) AS rs_1,
cnpj_status.nm_sit_cadastral as sit_cadastral,
(
  CASE
      WHEN tab_cidade.nome  is  null
      THEN 'Exterior'
      ELSE (tab_cidade.nome)
  END
) AS municipio,
estabelecimentos.uf as uf,
tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio as qualificacao,
DATE_FORMAT(socios.data_entrada_sociedade,'%d/%m/%Y')  as data_entrada,
YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) as age,
YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) as tempo_empresa,
YEAR(CURDATE()) - YEAR(socios.data_entrada_sociedade) as tempo_sociedade,
estabelecimentos.telefone_1 as fone_principal,
estabelecimentos.email as email,

tab_identifica_socio.idt_socio as tipo_socio

                    
                    FROM socios
                    
                    left join estabelecimentos
                    on
                    socios.cnpj=estabelecimentos.cnpj
                    
                    left join tab_identifica_socio
                    on 
                    tab_identifica_socio.cod=socios.identificador_socio
                    
                    left join cnpj_status
                    on cnpj_status.cod_sit_cad=estabelecimentos.situacao
                    left   join tab_cidade
                    on 
                    estabelecimentos.municipio=tab_cidade.cod_tom
                    left join  tab_qualificacao_responsavel_socio
                    on
                    tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio=socios.qualificacao 
                    where  ${criterio} LIMIT ${pagina}, 20
                    ;`

		try {
			var query = this.conexao.query(sql, callback)
		} catch (err) {
			console.log(err)
		}
	}

	buscar_dados_socios_count(socio, identificador_socio, cod_qualificacao_socio, callback) {
		let criterio = ""

		if (socio != "") criterio += " `socios`.`nome_socio` LIKE " + this.conexao.escape("" + socio + "%")
		if (identificador_socio != "") criterio += " `socios.identificador_socio =  " + this.conexao.escape("" + identificador_socio + "")
		if (identificador_socio != "" && identificador_socio != undefined) criterio += " and identificador_socio = " + this.conexao.escape(identificador_socio + "")
		if (cod_qualificacao_socio != "" && cod_qualificacao_socio != undefined) criterio += " and cod_qualificacao_socio = " + this.conexao.escape(cod_qualificacao_socio + "")

		var sql = `SELECT count(9) as count
                    
                    FROM socios
                    
                    left join estabelecimentos
                    on
                    socios.cnpj=estabelecimentos.cnpj
                    
                    left join tab_identifica_socio
                    on 
                    tab_identifica_socio.cod=socios.identificador_socio
                    
                    left join  tab_qualificacao_responsavel_socio
                    on
                    tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio=socios.qualificacao 
                    
                    where ${criterio}; `
		try {
			this.conexao.query(sql, callback)
		} catch (err) {
			console.log(err)
		}
	}


	buscar_detalhes(id, callback) {
		try {
			this.conexao.query(
				`    SELECT 
        estabelecimentos.cnpj,
            tab_matriz_filial.nm_matriz_filial,
            empresas.razao as razao_social,
            uExtractNonNumbersFromString(empresas.razao) as razao_social_bonita,
            (
              CASE 
                  WHEN CHAR_LENGTH(GetNumber(empresas.razao)) > 8
                  THEN uExtractNonNumbersFromString(empresas.razao)
                  ELSE (empresas.razao)
              END
            ) AS rs_1,

            (case
              WHEN estabelecimentos.nome is NULL 
              then '*****' 
              Else
              estabelecimentos.nome
              END
              ) as nome_fantasia,
            cnpj_status.nm_sit_cadastral as situacao_cadastral,
            tab_situacao_cadastral.nm_situacao_cadastral AS motivo_sit_cadastral,
            DATE_FORMAT(estabelecimentos.data_situacao, '%d/%m/%Y') AS data_atual_cadastral,
            estabelecimentos.cidade_exterior,
           (CASE
        When estabelecimentos.pais is NULL then 'Brasil'
        Else estabelecimentos.pais
        END) as pais,
           (CASE
        When estabelecimentos.pais is NULL then 'Brasil'
        Else estabelecimentos.pais
        END) as pais,
        tab_serp.domain,
            tab_natureza_juridica.nm_subclass_natureza_juridica AS natureza_juridica,
            DATE_FORMAT(estabelecimentos.inicio_atividade, '%d/%m/%Y') AS data_inicio,
            YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade) AS age,
            estabelecimentos.cnae_fiscal AS 'cnae_primario',
            tab_cnae_up.nome,
            estabelecimentos.tipo_logradouro as descricao_tipo_logradouro,
            estabelecimentos.logradouro,
            estabelecimentos.numero,
            TRIM(estabelecimentos.complemento),

            TRIM(estabelecimentos.bairro),

            estabelecimentos.cep,
            CONCAT('R$ ',FORMAT(CAST(empresas.capital as UNSIGNED),2,'de_DE')) AS  capital,
            (CASE
  when estabelecimentos.uf is null or estabelecimentos.uf = '' then 'SUF'
  else estabelecimentos.uf
  END) as uf,
            (
              CASE
                  WHEN tab_cidade.nome  is  null
                  THEN 'Exterior'
                  ELSE (tab_cidade.nome)
              END
            ) AS municipio,
            estabelecimentos.telefone_1,
            estabelecimentos.telefone_2,
            estabelecimentos.numero_fax AS 'FAX',
            estabelecimentos.email AS 'email',
            tab_qualificacao_responsavel_socio.nm_qualificacao_responsavel_socio AS qualificacao,
            CAST(empresas.capital as UNSIGNED) AS capital,
            tab_porte_empresa.nm_porte AS porte,
            (
  CASE 
      WHEN empresas.porte is  null 
      THEN 'Porte não Declarado'
      ELSE empresas.porte
  END
) AS porte_empresa,
(case when dados_simples.opcao_simples is null then 'não optante' when dados_simples.opcao_simples = 'n' then 'não optante' when dados_simples.opcao_simples = 's' then 'optante' end)as simples_nacional,
            estabelecimentos.data_situacao,
            estabelecimentos.motivo_situacao,
            tab_situacao_cadastral.nm_situacao_cadastral,
            (
                CASE 
                    WHEN YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao) is not null and  estabelecimentos.situacao ='08'
                    THEN CONCAT(YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao),' ano(s) baixada. Funcionou por ', YEAR(estabelecimentos.data_situacao) - YEAR(estabelecimentos.inicio_atividade), ' anos')
                    ELSE CONCAT('Aberta a ', YEAR(CURDATE()) - YEAR(estabelecimentos.inicio_atividade),' Anos. ', YEAR(CURDATE()) - YEAR(estabelecimentos.data_situacao),' anos desde ultima atualização')
                END
              ) AS Status,

            (CASE
          WHEN dados_simples.opcao_mei is null then 'Não'
          when dados_simples.opcao_mei = 'n' then 'Não'
          when dados_simples.opcao_mei = 's' then 'Sim'
          END
          )AS microempreendedor_individual
        FROM empresas
        left join estabelecimentos
on
empresas.cnpj=estabelecimentos.cnpj
left join dados_simples
on
estabelecimentos.cnpj=dados_simples.cnpj
left   join tab_cidade
on 
estabelecimentos.municipio=tab_cidade.cod_tom

                LEFT JOIN
            tab_qualificacao_responsavel_socio ON tab_qualificacao_responsavel_socio.cod_qualificacao_responsavel_socio = empresas.qualificacao_pf
                LEFT JOIN
            tab_matriz_filial ON tab_matriz_filial.id = estabelecimentos.matriz_filial
                LEFT JOIN
            cnpj_status ON cnpj_status.cod_sit_cad = estabelecimentos.situacao
                
                LEFT JOIN
            tab_natureza_juridica ON tab_natureza_juridica.cod_subclass_natureza_juridica = empresas.natureza
                LEFT JOIN
            tab_cnae_up ON tab_cnae_up.cod_cnae = estabelecimentos.cnae_fiscal
                LEFT JOIN
            tab_opcao_simples ON tab_opcao_simples.cod = dados_simples.opcao_simples
                LEFT JOIN
            tab_porte_empresa ON tab_porte_empresa.id = empresas.porte
              
                LEFT JOIN
            tab_situacao_cadastral ON estabelecimentos.motivo_situacao = tab_situacao_cadastral.cod_situacao_cadastral
           LEFT JOIN tab_serp on empresas.cnpj=tab_serp.cnpj_base

where ?`,
				{ cnpj: id },
				callback
			)
		} catch (err) {
			console.log(err)
		}
	}




*/




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  LINKEDIN - INÍCIO

inserir_tab_linkedin_empresas (infos) {
  
  const {
    title,
    headline,
    cover_image,
    company_image,
    url,
    numberofemployees,
    link,
    followerscount,
    tagging,
    description,
    website,
    industries,
    company_size,
    headquarters,
    type,
    founded,
    specialties,
    address,
    cnpj_full,
    cnpj_base,
    cnpj_ordem,
    cnpj_dv,
    domain
  } = infos

  console.log("{API LINKEDIN} - Inserindo Google Info de CNPJ: ", domain)
  console.log("{API LINKEDIN} - Inserindo Google Info: ", infos)

  // const { url, address, phone, rating, last_updated } = info
  
  let query = `INSERT IGNORE INTO tab_linkedin_empresas  
  (
    title,
    headline,
    cover_image,
    company_image,
    url,
    numberofemployees,
    link,
    followerscount,
    tagging,
    description,
    website,
    industries,
    company_size,
    headquarters,
    type,
    founded,
    specialties,
    address,
    cnpj_full,
    cnpj_base,
    cnpj_ordem,
    cnpj_dv,
    domain
  )
  VALUES
  (
    ${title             ? `'${title}'`            : null},
    ${headline          ? `'${headline}'`         : null},
    ${cover_image       ? `'${cover_image}'`      : null},
    ${company_image     ? `'${company_image}'`    : null},
    ${url               ? `'${url}'`              : null},
    ${numberofemployees ? `'${numberofemployees}'`: null},
    ${link              ? `'${link}'`             : null},
    ${followerscount    ? `'${followerscount}'`   : null},
    ${tagging           ? `'${tagging}'`          : null},
    ${description       ? `'${description}'`      : null},
    ${website           ? `'${website}'`          : null},
    ${industries        ? `'${industries}'`       : null},
    ${company_size      ? `'${company_size}'`     : null},
    ${headquarters      ? `'${headquarters}'`     : null},
    ${type              ? `'${type}'`             : null},
    ${founded           ? `'${founded}'`          : null},
    ${specialties       ? `'${specialties}'`      : null},
    ${address           ? `'${address}'`          : null},
    ${cnpj_full         ? `'${cnpj_full}'`        : null},
    ${cnpj_base         ? `'${cnpj_base}'`        : null},
    ${cnpj_ordem        ? `'${cnpj_ordem}'`       : null},
    ${cnpj_dv           ? `'${cnpj_dv}'`          : null},
    ${domain            ? `'${domain}'`           : null}
  );`

  console.log("{API LINKEDIN} -  query: ", query)
  // console.log(err)
  

  return this.execQuery(query)
}

buscar_tab_linkedin_empresas(domain, callback) {
  console.log("{API LINKEDIN} - Buscando LINKEDIN: ", domain)
  // console.log(err)

  let query = `SELECT * FROM tab_linkedin_empresas WHERE cnpj_full = ${domain};`

  const params = []

  return this.conexao.query(query, params, callback);
}

//  LINKEDIN - FINAL
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







  //FIM DO ARQUIVO 
}






module.exports = () => ProdutoDAO
