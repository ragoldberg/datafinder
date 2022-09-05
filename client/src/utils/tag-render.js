import React, { Component }  from 'react';
import { Tag, Tooltip } from "antd"

function tagRender(props) {
	const { label, closable, onClose } = props
	const onPreventMouseDown = event => {
		event.preventDefault()
		event.stopPropagation()
	}
	return (
		label && (
			<Tooltip title={label}>
				<Tag color="gray" onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose} style={{ marginRight: 3, borderRadius: 8, maxWidth: "100%", overflow: "hidden" }}>
					{label}
				</Tag>
			</Tooltip>
		)
	)
}

export { tagRender }
