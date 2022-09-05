import React from "react"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const Loading = () => {
	const antIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />
	return <Spin indicator={antIcon} />
}

export default Loading
