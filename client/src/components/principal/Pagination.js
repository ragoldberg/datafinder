import React, { Fragment } from "react"

const Pagination = ({ contagem, pagina, validar }) => {
	const registrosPorPag = 20
	const numerosPaginas = []
	const totalPaginas = Math.ceil(contagem / registrosPorPag)
	var min = ""
	var max = ""
	var prox = ""
	var ant = ""

	const palavraPagina = numerosPaginas.length === 1 ? "PÁGINA" : "PÁGINAS"

	for (let i = 1; i <= totalPaginas; i++) {
		numerosPaginas.push(i)
	}

	min = pagina > 2 ? pagina - 3 : 0
	max = pagina + 2

	ant =
		pagina === 1 ? (
			<Fragment>
				<p key={0} className="btn btn-reverse btn_paginacao btn_paginacao_inativo" style={{ color: "black" }}>
					{" "}
					<i className="fas fa-backward"></i>
				</p>
				{"  "}{" "}
			</Fragment>
		) : (
			<Fragment>
				<p key={0} className="btn btn-reverse btn_paginacao btn_paginacao_ativo" onClick={() => validar({ numero: pagina - 1 })} style={{ color: "black" }}>
					{" "}
					<i className="fas fa-backward"></i>
				</p>
				{"  "}{" "}
			</Fragment>
		)

	prox =
		pagina === numerosPaginas.length ? (
			<Fragment>
				<p key={999999999} className="btn btn-reverse btn_paginacao btn_paginacao_inativo" style={{ color: "black" }}>
					{" "}
					<i className="fas fa-forward"></i>
				</p>
			</Fragment>
		) : (
			<Fragment>
				<p key={999999999} className="btn btn-reverse btn_paginacao btn_paginacao_ativo" onClick={() => validar({ numero: pagina + 1 })} style={{ color: "black" }}>
					{" "}
					<i className="fas fa-forward"></i>
				</p>
			</Fragment>
		)

	return (
		<div className="paginacao">
			<span>{`${contagem} RESULTADOS EM ${numerosPaginas.length} ${palavraPagina}`}</span>
			<div className="paginacao-btn-container">
				{ant}
				{numerosPaginas.slice(min, max).map((numero, index) =>
					numero === pagina ? (
						<Fragment key={index}>
							<p key={numero} className="btn btn-reverse btn_paginacao btn_paginacao_inativo btn_paginacao_current" style={{ color: "black" }}>
								{numero}
							</p>{" "}
							{"  "}{" "}
						</Fragment>
					) : (
						<Fragment key={index}>
							<p key={numero} className="btn btn-reverse btn_paginacao btn_paginacao_ativo" onClick={() => validar({ numero: numero })} style={{ color: "black" }}>
								{numero}
							</p>{" "}
							{"  "}{" "}
						</Fragment>
					)
				)}
				{prox}
			</div>
		</div>
	)
}

export default Pagination
