import React, { Fragment } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { Redirect } from "react-router-dom"
import { Footer } from "./Footer"


const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/principal" />
  }

  return (
    <Fragment>
      <section id="search" className="search-wrap-home" style={{ height: "500px" }}>
        <h1> Encontre todas as informações corporativas</h1>
        <h1>Dados qualificados para alavancar seus negócios</h1>

       
      </section>

      <section id="section_depoimentos">
        <div className="depoimento">
          <div>
            <img src="./img/depoimento_1.png" alt="depoimento_foto" width="200" className="foto_depoimento" />
          </div>
          <h1 className="titulo_azul">Acesso Rápido e Fácil</h1>
          Plataforma amigável e rápida para resultados direcionados, baseados em filtros personalizados!
        </div>
        <div className="depoimento">
          <div>
            <img src="./img/depoimento_2.png" alt="depoimento_foto" width="200" className="foto_depoimento" />
          </div>
          <h1 className="titulo_azul">Inteligencia sobre dados</h1>
          Cruzamento vitais, com enfase na qualificação dos dados conforme as informações mais atuais, respeitando a LGPD, entregando qualidade, precisão e confiabilidade.
        </div>
        <div className="depoimento">
          <div>
            <img src="./img/depoimento_3.png" alt="depoimento_foto" width="200" className="foto_depoimento" />
          </div>
          <h1 className="titulo_azul">Better LEADS </h1>
          Resultados direcionados e posicionados conforme a sua necessidade.
        </div>
      </section>
      <Footer />
    </Fragment>
  )
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing)
