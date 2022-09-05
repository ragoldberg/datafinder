const axios = require('axios')
require('dotenv/config')

class ProxyCrawl {

	static linkedinUrl	= "https://www.linkedin.com/company/";

	static crawlerInfos = {
		token 	: process.env.PROXY_CRAWL_TOKEN,
		name 		: "LinkedinCrawler",
	}

	static crawler = {
		url			: "https://api.proxycrawl.com/?token=" + ProxyCrawl.crawlerInfos.token + "&callback=true&crawler=" + ProxyCrawl.crawlerInfos.name + "&scraper=linkedin-company&format=json&url=" + ProxyCrawl.linkedinUrl,
		storage : {
			url  : "https://api.proxycrawl.com/storage?token=" + ProxyCrawl.crawlerInfos.token + "&format=json&url=" + ProxyCrawl.linkedinUrl,
			rid  : "https://api.proxycrawl.com/storage?token=" + ProxyCrawl.crawlerInfos.token + "&format=json&rid=",
			bulk : "https://api.proxycrawl.com/storage/bulk?token=" + ProxyCrawl.crawlerInfos.token
		}
	}

	static async linkedin(domain, cnpj) {
		if(domain == "" | undefined) return

		const domainFiltered = domain?.toLowerCase()?.replace(" ", "");
	
		const infosObjectToThrow = {
			response : {
				status : 404
			}
		}

		try{
			let crawlerStorageDataJson;
			const crawlerStorageData = await ProxyCrawl.crawlerStorageGetAll();
	
			for(const domainInfoPCStorage of crawlerStorageData.data){
	
				const domainNotFound  = domainInfoPCStorage.original_status === 404;
				const crawlerBlocked 	= domainInfoPCStorage.original_status === 504;
				const lowInfo 			  = domainInfoPCStorage.body.length < 1000;
	
				if( domainNotFound || crawlerBlocked || lowInfo ) {
					ProxyCrawl.crawlerStorageDelete(domainInfoPCStorage.rid);
					continue;
				}
	
				if( ProxyCrawl.linkedinUrl + domainFiltered === domainInfoPCStorage.url ) {
					
					const infosDomain = await ProxyCrawl.crawlerStorageGet( domainInfoPCStorage.rid );
					const jsonIsValid = ProxyCrawl.isValidJson( infosDomain.data.body );
					
					if( jsonIsValid ) crawlerStorageDataJson = JSON.parse( infosDomain.data.body );

					break;
				}
				// console.log(domainFiltered);
				}

			if(crawlerStorageDataJson == undefined) throw new Object( infosObjectToThrow );
	
			// Filtra o conteudo para salvar no banco
			const {title, headline, cover_image, company_image, url, followersCount, tagging, description} = crawlerStorageDataJson
			const {numberOfEmployees, link} = crawlerStorageDataJson?.employees
			const basicInfo = crawlerStorageDataJson?.basicInfo

			let cnpj_full  = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "")
			let cnpj_base  = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(0, 8)
			let cnpj_ordem = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(8, 12)
			let cnpj_dv 	 = cnpj.replace(".", "").replace(".", "").replace("-", "").replace("/", "").slice(12, 14)

			const infosFinal = {
				title,
				headline,
				cover_image,
				company_image,
				url,
				numberofemployees: numberOfEmployees,
				link,
				followersCount,
				tagging,
				description,
				website:			basicInfo.filter(({name}) => name == "Website")[0]?.value,
				industries:		basicInfo.filter(({name}) => name == "Industries")[0]?.value,
				company_size:	basicInfo.filter(({name}) => name == "Company size")[0]?.value,
				headquarters:	basicInfo.filter(({name}) => name == "Headquarters")[0]?.value,
				type:					basicInfo.filter(({name}) => name == "Type")[0]?.value,
				founded:			basicInfo.filter(({name}) => name == "Founded")[0]?.value,
				specialties:	basicInfo.filter(({name}) => name == "Specialties")[0]?.value,
				cnpj_full,
				cnpj_base,
				cnpj_ordem,
				cnpj_dv,
				domain
			}

			try{
				const conexao = require("../config/connectionFactory")()
				const repository = require("../repository/produtoDAO")()
				const produtoDAO = new repository(conexao)
				produtoDAO.inserir_tab_linkedin_empresas(infosFinal)
			}catch(e){
				console.error(e)
				throw new Object({
					message: "Problema com a gravação no banco"
				})
			}

			return infosFinal;
	
		}catch(e){
	
			// Se não existe dados no Banco do ProxyCrawler
			if(e.response?.status === 404){
	
				ProxyCrawl.makeCrawlerRequest(domainFiltered);
				
				return {"message" : `Os dados da empresa estão sendo processadas!`};
			}
	
			console.error(e);
			return {"message":"Houve algum problema!"};
		}

	}

	static makeCrawlerRequest 	= (domainRequest) => axios.get( ProxyCrawl.crawler.url + domainRequest );
	static crawlerStorageGet		= (requestId)			=> axios.get( ProxyCrawl.crawler.storage.rid + requestId );
	static crawlerStorageGetAll = ()							=> axios.post( ProxyCrawl.crawler.storage.bulk );
	static crawlerStorageDelete = (requestId) 		=> axios.delete( ProxyCrawl.crawler.storage.rid + requestId );

	static isValidJson = (data) => {
		try {
			JSON.parse(data)
			return true;
		}catch(e) {
			return false;
		}
	}

}

module.exports = ProxyCrawl