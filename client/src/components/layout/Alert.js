import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Alert = ({ alerts }) => 
  alerts !== null &&  alerts.length > 0 && alerts.map( alert => (
            <div id={alert.id} className ={alert.alertType} style={{textAlign:'center', color: '#04738f',display: 'block',height: '30px', margin: 'auto',marginTop:'30px'}}>
                {alert.msg}
            </div>))



Alert.propTypes = {

    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert);
