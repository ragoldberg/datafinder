/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Fragment } from "react"
import spinner from "../../img/icons/loading.gif"

export default () => {
	return (
		<Fragment>
			<p align="center">
				<img src={spinner} alt="loading..." />
			</p>
		</Fragment>
	)
}
