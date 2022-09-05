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
import { Tooltip } from "antd"



import sizeIcon from "../../img/icons/size.svg"
import openSinceIcon from "../../img/icons/open-since.svg"
import locationIcon from "../../img/icons/location.svg"
import percentIcon from "../../img/icons/percent.svg"
import IncomeIcon from "../../img/icons/income.gif"
import ValueIcon from "../../img/icons/value.png"
import CapitalIcon from "../../img/icons/capital.png"
import CostIcon from "../../img/icons/cost.gif"
import StockIcon from "../../img/icons/stock.gif"
import Value_realIcon from "../../img/icons/value_real.gif"
import ApertomaoIcon from "../../img/icons/apertomao.gif"


import { Chart } from "react-google-charts";
//teste upload


//teste upload




//Constantes de formato

//ranking


//fim ranking
//pinta sit cadastral


// pinta matriz/filial


// pinta MEI

const defaultLabelStyle = {
	fontSize: '5px',
	fontFamily: 'sans-serif',
  };


//Constantes de formato





const GeoMarketingResult = ({ 
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
	


	resultados_total_cidade,
	resultados_ativos_cidade,
	resultados_n_ativos_cidade,
	
	

	resultados_ativa,
	resultados_n_ativa,
	resultados_matriz,
	resultados_filial,
	resultados_mei,
	resultados_mei_ativo,
	resultados_simples,
	resultados_simples_ativo,

	
	pagina 
							}) => {

	



	  
	
  
	console.log("resultados from GeoMarketingResult", resultados)
	return (
		<div className="results-container">
			<h1 className="results-title">
				<span className="results-title-secondary">Estado:  </span>
				<span className="results-title-primary">{resultados_estado}</span>
				<span className="results-title-secondary">Na Cidade:  </span>
				<span className="results-title-primary">{resultados_cidade}</span>
			
				<span className="results-title-secondary">Bairro: </span>
				<span className="results-title-primary">{resultados_bairro}  </span>
			
				<span className="results-title-secondary">Total de empresas no Bairro: </span>
				<span className="results-title-primary">{resultados_total_empresas_bairro}  </span>
			</h1>
    {/* GRAFICO AQUI  */}
	
	<div className="graph">
	
{/* Estado  */}
	<Chart
  width={'600'}
  height={'400'}
  chartType="PieChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Status', ' Total'],
    ['Não Ativas', resultados_n_ativa],
    ['Ativas', resultados_ativa],
	
    
  ]}

  
  options={{
    title: arrumatexto(resultados_estado),
	legend: {
  position: 'labeled'
},
pieSliceText: 'value',
    // Just add this option
    is3D: true,
	slices: {
      0: { color: 'Red' },
      1: { color: 'rgb(8, 84, 116)' },
	  2: { color: 'green' },
      3: { color: 'grey' },
	},
	
	titleTextStyle: {
        color: 'rgb(8, 84, 116)',    // any HTML string color ('red', '#cc00cc')
        //fontName: 'Times New Roman', // i.e. 'Times New Roman'
        fontSize: 20, // 12, 18 whatever you want (don't specify px)
        bold: true,    // true or false
        italic: false   // true of false
    }
  }}
  rootProps={{ 'data-testid': 'estado' }}
/>
 

	
{/* cidade  */}
<Chart
  width={'600'}
  height={'400'}
  chartType="PieChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Status', ' Total'],
    ['Não Ativas', resultados_ativos_cidade],
    ['Ativas', resultados_n_ativos_cidade],
	
    
  ]}

  
  options={{
    title: arrumatexto(resultados_cidade),
	legend: {
  position: 'labeled'
},
pieSliceText: 'value',
    // Just add this option
    is3D: true,
	slices: {
      0: { color: 'Red' },
      1: { color: 'rgb(8, 84, 116)' },
	  2: { color: 'green' },
      3: { color: 'grey' },
	},
	
	titleTextStyle: {
        color: 'rgb(8, 84, 116)',    // any HTML string color ('red', '#cc00cc')
        //fontName: 'Times New Roman', // i.e. 'Times New Roman'
        fontSize: 20, // 12, 18 whatever you want (don't specify px)
        bold: true,    // true or false
        italic: false   // true of false
    }
  }}
  rootProps={{ 'data-testid': 'cidade' }}
/>
 

	
{/* bairro  */}
<Chart
  width={'600'}
  height={'400'}
  chartType="PieChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Status', ' Total'],
    ['Não Ativas', resultados_n_atv_bairro],
    ['Ativas', resultados_atv_bairro],
	
    
  ]}

  
  options={{
    title: arrumatexto(resultados_bairro),
	legend: {
  position: 'labeled'
},
pieSliceText: 'value',
    // Just add this option
    is3D: true,
	slices: {
      0: { color: 'Red' },
      1: { color: 'rgb(8, 84, 116)' },
	  2: { color: 'green' },
      3: { color: 'grey' },
	},
	
	titleTextStyle: {
        color: 'rgb(8, 84, 116)',    // any HTML string color ('red', '#cc00cc')
        //fontName: 'Times New Roman', // i.e. 'Times New Roman'
        fontSize: 20, // 12, 18 whatever you want (don't specify px)
        bold: true,    // true or false
        italic: false   // true of false
    }
  }}
  rootProps={{ 'data-testid': 'bairro' }}
/>
 


	</div>


			<div>
				<div>
					{resultados &&
						resultados.map((resultado, index) => (
							<div key={index} className="results-row" id="result">
								<span style={{ textAlign: "center" }} className="results-row-index">
									{(pagina - 1) * 20 + (index + 1)}
								</span>
								<div className="results-row-inner" onClick={() => verDetalhes(resultado.cnpj, resultado.nome_fantasia, resultado.municipio, resultado.uf, resultado.razao_social)}>
									<div className="results-row-primary-container">
								{/*	<img src={`https://www.google.com/s2/favicons?domain=${resultado.URL}`} width="32" height="32"/> */}{/* Coloca icone em cada um dos resultados baseado na tabela tab_serp, campo companyurl*/}
									
										<span className="primary-nome_fantasia">{arrumatexto(resultado.nome_fantasia)}</span>
										<span className="primary-razao-cnpj">{arrumatexto(resultado.razao_social)}</span>
										<div className="primary-cnpj_status primary-razao-cnpj">
											<span>{formatDocument(resultado.cnpj)} </span>
											<span>{mat_fil(resultado.nm_matriz_filial)}</span>
											<span>{sit_cad(resultado.sit_cadastral)}</span>
										</div>
									</div>

									<div className="results-row-cnae-container2">
									<p className="cnae-title">Setor</p>
										<span>{arrumatexto(resultado.setor)}</span>
								
									</div>
									<div className="results-row-cnae-container3">
										<p className="cnae-title">Propósito Fiscal</p>
										<span>{arrumatexto(resultado.nm_cnae)}</span>
									</div>
									

									<div className="results-row-location-container">
										<div className="location-inner-container">
											<Tooltip title="Endereco">
												<img src={sizeIcon} alt="Endereço" className="location-icon" />
											</Tooltip>
											<span>{arrumatexto(resultado.tipo_logradouro)} {arrumatexto(resultado.logradouro)}  {resultado.numero}, {arrumatexto(resultado.municipio)} - {resultado.uf}</span>
										</div>
								
										<div className="location-inner-container">
											<Tooltip title="Localização">
												<img src={locationIcon} alt="Localização" className="location-icon" />
											</Tooltip>
											<span>
												{arrumatexto(resultado.municipio)} - {resultado.uf}
											</span>
										</div>

										<div className="results-row-location-container">
										<div className="location-inner-container">
											<Tooltip title="Porte">
												<img src={sizeIcon} alt="Porte da empresa" className="location-icon" />
											</Tooltip>
											<span>{arrumatexto(resultado.nm_porte)}</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Aberta desde">
												<img src={openSinceIcon} alt="Aberta desde" className="location-icon" />
											</Tooltip>
											<span>Aberta há {resultado.age} anos</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Localização">
												<img src={locationIcon} alt="Localização" className="location-icon" />
											</Tooltip>
											<span>
												{arrumatexto(resultado.municipio)} - {resultado.uf}
											</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Capital Declarado">
												<img src={CapitalIcon} alt="Capital" className="location-icon" />
											</Tooltip>
											<span>
												{numberFormat(resultado.capital_social_empresa)} 
											</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Faturamento">
												<img src={IncomeIcon} alt="Faturamento" className="location-icon" />
											</Tooltip>
											<span>
												{numberFormat(resultado.faturamento)} 
											</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Valor De Mercado da Empresa">
												<img src={CostIcon} alt="Valor de Mercado da Empresa" className="location-icon" />
											</Tooltip>
											<span>
												{numberFormat(resultado.valor_mercado_atual)} 
											</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Valor Real da Empresa = Ações + Ativos - Passivos">
												<img src={Value_realIcon} alt="Valor Real da Empresa" className="location-icon" />
											</Tooltip>
											<span>
												{numberFormat(resultado.valor_real_empresa)} 
											</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Nome do Papel / Fundo">
												<img src={StockIcon} alt="Nome do Papel / Fundo" className="location-icon" />
											</Tooltip>
											<span>
												{resultado.ativo} 
											</span>
										</div>
										<div className="location-inner-container">
											<Tooltip title="Principal Acionista / Socio">
												<img src={ApertomaoIcon} alt="Principal Acionista / Socio" className="location-icon" />
											</Tooltip>
											<span>
												{arrumatexto(resultado.principal_acionista)} 
											</span>
										</div>
										</div>
										
									</div>

									<div className="results-row-ranking-container">
										<div className="ranking-container" style={{ backgroundColor: ranking(resultado.ranking).backgroundColor }}>
											<img src={percentIcon} alt="%" className="ranking-percentage-symbol" />
											<span className="ranking-number">{ranking(resultado.ranking).number}</span>
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



	)
}

export default memo(GeoMarketingResult)
