/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { memo } from "react"

import { Tooltip } from "antd"


import { Chart } from "react-google-charts"

const numberFormat = value =>
	new Intl.NumberFormat("pt-BR", {
		 maximumSignificantDigits: 3,
		style: "currency",
		currency: "BRL",
	}).format(value)

const DASHResult = ({
	resultados,
	verDetalhes,
	contagem,
	resultados_empresas_total,
	resultados6,
	resultados_cidade,
	resultados_estado,
	resultados_bairro,
	resultados_total_empresas_bairro,
	resultados_atv_bairro,
	resultados_n_atv_bairro,
	resultados_matriz_bairro,
	resultados_n_matriz_bairro,

bandeira,

	resultados_ativa,
	resultados_n_ativa,
	resultados_matriz,
	resultados_filial,
	resultados_mei,
	resultados_mei_ativo,
	resultados_simples,
	resultados_simples_ativo,
	resultados_dividas,
	resultados_vlr_dividas,
	resultados_qtd_dividas_prev,
	resultados_vlr_dividas_prev,
	resultados_qtd_dividas_nprev,
	resultados_vlr_dividas_nprev,
	resultados_qtd_dividas_fgts,
	resultados_vlr_dividas_fgts,
	resultados_tipo_pessoa_pf,
	resultados_tipo_pessoa_pj,
	resultados_tipo_situacao_inscricao_bf,
	resultados_tipo_situacao_inscricao_cb,
	resultados_tipo_situacao_inscricao_emgarantia,
	resultados_tipo_situacao_inscricao_judicial,
	resultados_indicador_ajuizado_sim,
	resultados_indicador_ajuizado_nao,
	resultados_valor_prev,
	resultados_valor_nprev,
	resultados_valor_fgts,
	resultados_valor_prev_regular,
	resultados_valor_prev_irregular,
	resultados_valor_nprev_regular,
	resultados_valor_nprev_irregular,
	resultados_valor_fgts_regular,
	resultados_valor_fgts_irregular,
	resultados_situacao_regular,
	resultados_situacao_irregular,
	resultados_dividas_total,
	resultados_vlr_dividas_total,
	resultados_qtd_dividas_prev_total,
	resultados_vlr_dividas_prev_total,
	resultados_qtd_dividas_nprev_total,
	resultados_vlr_dividas_nprev_total,
	resultados_qtd_dividas_fgts_total,
	resultados_vlr_dividas_fgts_total,
	resultados_tipo_pessoa_pf_total,
	resultados_tipo_pessoa_pj_total,
	resultados_tipo_situacao_inscricao_bf_total,
	resultados_tipo_situacao_inscricao_cb_total,
	resultados_tipo_situacao_inscricao_emgarantia_total,
	resultados_tipo_situacao_inscricao_judicial_total,
	resultados_indicador_ajuizado_sim_total,
	resultados_indicador_ajuizado_nao_total,
	resultados_valor_prev_total,
	resultados_valor_nprev_total,
	resultados_valor_fgts_total,
	resultados_valor_prev_regular_total,
	resultados_valor_prev_irregular_total,
	resultados_valor_nprev_regular_total,
	resultados_valor_nprev_irregular_total,
	resultados_valor_fgts_regular_total,
	resultados_valor_fgts_irregular_total,
	resultados_situacao_regular_total,
	resultados_situacao_irregular_total,


	


	pagina,
}) => {
	console.log("resultados from DASHResult", )
	return (
		<div className="results-container">
			<h1 className="results-title">
				
				<span className="results-title-secondary"><img style={{ aspectRatio: 1/1 }} src={bandeira} height = "64" width = "64"/>     {resultados_estado}</span>
			</h1>
			{/* Grafico Estado */}

			<div className="graph_pais" >


			<h2>Geral</h2>
				<Chart



				
					width={"500"}
					height={"500"}
					chartType="PieChart"
					loader={<div>Loading Chart</div>}
					data={[
						["Status", " Total"],
						["Não Ativas", resultados_n_ativa],
						["Ativas", resultados_ativa],
					]}
					options={{
						title: " Total",
						legend: {
							position: "labeled",
						},
						pieSliceText: "value",
						// Just add this option
						is3D: true,
						slices: {
							0: { color: "Red" },
							1: { color: "rgb(8, 84, 116)" },
							2: { color: "green" },
							3: { color: "grey" },
						},

						titleTextStyle: {
							color: "rgb(8, 84, 116)", // any HTML string color ('red', '#cc00cc')
							//fontName: 'Times New Roman', // i.e. 'Times New Roman'
							fontSize: 20, // 12, 18 whatever you want (don't specify px)
							bold: true, // true or false
							italic: false, // true of false
						},
					}}
					rootProps={{ "data-testid": "Geral" }}
				/>
	</div>
	<div className="graph_pais" >
	<h2>Numeros do Estado</h2>
				<Chart
					width={"600"}
					height={"400"}
					chartType="PieChart"
					loader={<div>Loading Chart</div>}
					data={[
						["Status", " Total"],
						["Filiais", resultados_filial],
						["Matrizes", resultados_matriz],
					]}
					options={{
						title: "Matriz / Filial",
						legend: {
							position: "labeled",
						},
						pieSliceText: "value",
						// Just add this option
						is3D: true,
						slices: {
							0: { color: "Red" },
							1: { color: "rgb(8, 84, 116)" },
							2: { color: "green" },
							3: { color: "grey" },
						},

						titleTextStyle: {
							color: "rgb(8, 84, 116)", // any HTML string color ('red', '#cc00cc')
							//fontName: 'Times New Roman', // i.e. 'Times New Roman'
							fontSize: 20, // 12, 18 whatever you want (don't specify px)
							bold: true, // true or false
							italic: false, // true of false
						},
					}}
					rootProps={{ "data-testid": "Geral" }}
				/>
	<Chart
					width={"600"}
					height={"400"}
					chartType="PieChart"
					loader={<div>Loading Chart</div>}
					data={[
						["Status", " Total"],
						["TOTAL", resultados_mei],
						["Ativos", resultados_mei_ativo],
					]}
					options={{
						title: " MEI",
						legend: {
							position: "labeled",
						},
						pieSliceText: "value",
						// Just add this option
						is3D: true,
						slices: {
							0: { color: "Red" },
							1: { color: "rgb(8, 84, 116)" },
							2: { color: "green" },
							3: { color: "grey" },
						},

						titleTextStyle: {
							color: "rgb(8, 84, 116)", // any HTML string color ('red', '#cc00cc')
							//fontName: 'Times New Roman', // i.e. 'Times New Roman'
							fontSize: 20, // 12, 18 whatever you want (don't specify px)
							bold: true, // true or false
							italic: false, // true of false
						},
					}}
					rootProps={{ "data-testid": "Geral" }}
				/>



<Chart
					width={"600"}
					height={"400"}
					chartType="PieChart"
					loader={<div>Loading Chart</div>}
					data={[
						["Status", " Total"],
						["TOTAL", resultados_simples],
						["Ativos", resultados_simples_ativo],
					]}
					options={{
						title: " Simples",
						legend: {
							position: "labeled",
						},
						pieSliceText: "value",
						// Just add this option
						is3D: true,
						slices: {
							0: { color: "Red" },
							1: { color: "rgb(8, 84, 116)" },
							2: { color: "green" },
							3: { color: "grey" },
						},

						titleTextStyle: {
							color: "rgb(8, 84, 116)", // any HTML string color ('red', '#cc00cc')
							//fontName: 'Times New Roman', // i.e. 'Times New Roman'
							fontSize: 20, // 12, 18 whatever you want (don't specify px)
							bold: true, // true or false
							italic: false, // true of false
						},
					}}
					rootProps={{ "data-testid": "Geral" }}
				/>


</div>
<div className="graph" >
<h2>Dividas</h2>
<Chart
  width={'300px'}
  height={'150px'}
  chartType="BarChart"
  loader={<div>Loading Chart</div>}
  data={[
    [
      'Tipo',
      'Dividas',
      { role: 'style' },
      {
        sourceColumn: 0,
        role: 'annotation',
        type: 'string',
        calc: 'stringify',
      },
    ],
    ['Pais', resultados_dividas_total, 'red', resultados_dividas_total],
    ['Estado', resultados_dividas, 'blue', resultados_dividas],
   
  ]}
  options={{
    title: 'Dividas Totais',
    
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
  }}
  // For tests
  rootProps={{ 'data-testid': '6' }}
/>
<Chart
  width={'300px'}
  height={'150px'}
  chartType="BarChart"
  loader={<div>Loading Chart</div>}
  data={[
    [
      'Tipo',
      'Dividas',
      { role: 'style' },
      {
        sourceColumn: 0,
        role: 'annotation',
        type: 'string',
        calc: 'stringify',
      },
    ],
    ['Pais', resultados_vlr_dividas_total, 'red', numberFormat(resultados_vlr_dividas_total)],
    ['Estado', resultados_vlr_dividas, 'blue', numberFormat(resultados_vlr_dividas)],
   
  ]}
  options={{
    title: 'Dividas Totais em R$',
   
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
  }}
  // For tests
  rootProps={{ 'data-testid': '6' }}
/>


<Chart
  width={'300px'}
  height={'150px'}
  chartType="BarChart"
  loader={<div>Loading Chart</div>}
  data={[
    [
      'Tipo',
      'Dividas',
      { role: 'style' },
      {
        sourceColumn: 0,
        role: 'annotation',
        type: 'string',
        calc: 'stringify',
      },
    ],
    ['Regular', resultados_situacao_regular , 'red', resultados_situacao_regular],
    ['Irregular', resultados_situacao_irregular, 'blue', resultados_situacao_irregular],
   
  ]}
  options={{
    title: 'Status das Dividas',
   
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
  }}
  // For tests
  rootProps={{ 'data-testid': '6' }}
/>


<Chart
  width={'300px'}
  height={'150px'}
  chartType="BarChart"
  loader={<div>Loading Chart</div>}
  data={[
    [
      'Tipo',
      'Dividas',
      { role: 'style' },
      {
        sourceColumn: 0,
        role: 'annotation',
        type: 'string',
        calc: 'stringify',
      },
    ],
    ['PREV', resultados_qtd_dividas_prev , 'red', resultados_qtd_dividas_prev],
    ['Nao PREV', resultados_qtd_dividas_nprev, 'blue', resultados_qtd_dividas_nprev],
	['FGTS', resultados_qtd_dividas_fgts, 'green', resultados_qtd_dividas_fgts],
  ]}
  options={{
    title: 'Tipo das Dividas',
   
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
  }}
  // For tests
  rootProps={{ 'data-testid': '6' }}
/>

<Chart
  width={'300px'}
  height={'150px'}
  chartType="BarChart"
  loader={<div>Loading Chart</div>}
  data={[
    [
      'Tipo',
      'Dividas',
      { role: 'style' },
      {
        sourceColumn: 0,
        role: 'annotation',
        type: 'string',
        calc: 'stringify',
      },
    ],
    ['PREV', resultados_vlr_dividas_prev , 'red', numberFormat(resultados_vlr_dividas_prev)],
    ['Nao PREV', resultados_vlr_dividas_nprev, 'blue', numberFormat(resultados_vlr_dividas_nprev)],
	['FGTS', resultados_vlr_dividas_fgts, 'green', numberFormat(resultados_vlr_dividas_fgts)],
  ]}
  options={{
    title: 'Valor / Tipo das Dividas',
   
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
  }}
  // For tests
  rootProps={{ 'data-testid': '6' }}
/>


<Chart
  width={'300px'}
  height={'150px'}
  chartType="BarChart"
  loader={<div>Loading Chart</div>}
  data={[
    [
      'Tipo',
      'Dividas',
      { role: 'style' },
      {
        sourceColumn: 0,
        role: 'annotation',
        type: 'string',
        calc: 'stringify',
      },
    ],
    ['Sim', resultados_indicador_ajuizado_sim , 'red', resultados_indicador_ajuizado_sim],
    ['Nao', resultados_indicador_ajuizado_nao, 'blue', resultados_indicador_ajuizado_nao],
   
  ]}
  options={{
    title: 'Ajuizados',
   
    bar: { groupWidth: '95%' },
    legend: { position: 'none' },
  }}
  // For tests
  rootProps={{ 'data-testid': '6' }}
/>




</div>
		


		

		</div>
	)
}

export default memo(DASHResult)
