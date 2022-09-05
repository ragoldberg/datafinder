import React, { memo } from "react"

import {  ConfigProvider } from "antd"
import ptBR from "antd/lib/locale/pt_BR"





const DASHFilterFile = ({ formData, setFormData}) => {
	//-// Estados que controlam os CNAEs


			
	return (
		
		<ConfigProvider locale={ptBR}>
			<div>
			
			


		<div class="buttonbox">
			<form  method="post">
				
				<div class="columnbutton">
				<button class="button" name="uf" type="post" value="AC" onClick={e => setFormData({ ...formData, "uf": e.target.value = "AC" })} ><span>AC</span></button><div class="divider"/>
				<button class="button" name="uf" type="post" value="AL" onClick={e => setFormData({ ...formData, "uf": e.target.value = "AL" })} ><span>AL</span></button><div class="divider"/>
				<button class="button" name="uf" type="post" value="AP" onClick={e => setFormData({ ...formData, "uf": e.target.value = "AP" })} ><span>AP</span></button><div class="divider"/>
				<button class="button" name="uf" type="post" value="AM" onClick={e => setFormData({ ...formData, "uf": e.target.value = "AM" })} ><span>AM</span></button><div class="divider"/>
				<button class="button" name="uf" type="post" value="BA" onClick={e => setFormData({ ...formData, "uf": e.target.value = "BA" })} ><span>BA</span></button><div class="divider"/>
				<button class="button" name="uf" type="post" value="CE" onClick={e => setFormData({ ...formData, "uf": e.target.value = "CE" })} ><span>CE</span></button><div class="divider"/>
				<button class="button" name="uf" type="post" value="DF" onClick={e => setFormData({ ...formData, "uf": e.target.value = "DF" })} ><span>DF</span></button><div class="divider"/>
				<button class="button" name="uf" type="post" value="ES" onClick={e => setFormData({ ...formData, "uf": e.target.value = "ES" })} ><span>ES</span></button><div class="divider"/>
				<button class="button" name="uf" type="post" value="GO" onClick={e => setFormData({ ...formData, "uf": e.target.value = "GO" })} ><span>GO</span></button><div class="divider"/>
				
					<button class="button" name="uf" type="post" value="MA" onClick={e => setFormData({ ...formData, "uf": e.target.value = "MA" })} ><span>MA</span></button><div class="divider"/>
					<button class="button" name="uf" type="post" value="MT" onClick={e => setFormData({ ...formData, "uf": e.target.value = "MT" })} ><span>MT</span></button><div class="divider"/>
					<button class="button" name="uf" type="post" value="MS" onClick={e => setFormData({ ...formData, "uf": e.target.value = "MS" })} ><span>MS</span></button><div class="divider"/>
					<button class="button" name="uf" type="post" value="MG" onClick={e => setFormData({ ...formData, "uf": e.target.value = "MG" })} ><span>MG</span></button><div class="divider"/>
					</div>

						<div class="columnbutton">
					<button class="button" name="uf" type="post" value="PA" onClick={e => setFormData({ ...formData, "uf": e.target.value = "PA" })} ><span>PA</span></button><div class="divider"/>
					<button class="button" name="uf" type="post" value="PB" onClick={e => setFormData({ ...formData, "uf": e.target.value = "PB" })} ><span>PB</span></button><div class="divider"/>
					<button class="button" name="uf" type="post" value="PR" onClick={e => setFormData({ ...formData, "uf": e.target.value = "PR" })} ><span>PR</span></button><div class="divider"/>
					<button class="button" name="uf" type="post" value="PE" onClick={e => setFormData({ ...formData, "uf": e.target.value = "PE" })} ><span>PE</span></button><div class="divider"/>
					<button class="button" name="uf" type="post" value="PI" onClick={e => setFormData({ ...formData, "uf": e.target.value = "PI" })} ><span>PI</span></button><div class="divider"/>
				
						<button class="button" name="uf" type="post" value="RJ" onClick={e => setFormData({ ...formData, "uf": e.target.value = "RJ" })} ><span>RJ</span></button><div class="divider"/>
						<button class="button" name="uf" type="post" value="RN" onClick={e => setFormData({ ...formData, "uf": e.target.value = "RN" })} ><span>RN</span></button><div class="divider"/>
						<button class="button" name="uf" type="post" value="RS" onClick={e => setFormData({ ...formData, "uf": e.target.value = "RS" })} ><span>RS</span></button><div class="divider"/>
						<button class="button" name="uf" type="post" value="RO" onClick={e => setFormData({ ...formData, "uf": e.target.value = "RO" })} ><span>RO</span></button><div class="divider"/>
						<button class="button" name="uf" type="post" value="RR" onClick={e => setFormData({ ...formData, "uf": e.target.value = "RR" })} ><span>RR</span></button><div class="divider"/>
						<button class="button" name="uf" type="post" value="SC" onClick={e => setFormData({ ...formData, "uf": e.target.value = "SC" })} ><span>SC</span></button><div class="divider"/>
						<button class="button" name="uf" type="post" value="SP" onClick={e => setFormData({ ...formData, "uf": e.target.value = "SP" })} ><span>SP</span></button><div class="divider"/>
						<button class="button" name="uf" type="post" value="SE" onClick={e => setFormData({ ...formData, "uf": e.target.value = "SE" })} ><span>SE</span></button><div class="divider"/>
						<button class="button" name="uf" type="post" value="TO" onClick={e => setFormData({ ...formData, "uf": e.target.value = "TO" })} ><span>TO</span></button><div class="divider"/>
						</div>
				

				
			</form>
     	</div>
				




				
			</div>
		</ConfigProvider>
	)

}

export default memo(DASHFilterFile)
