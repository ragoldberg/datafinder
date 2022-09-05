import { useState } from 'react';
import InputMask from 'react-input-mask';
function PhoneInput(props) {
  return (
    <InputMask 
      mask='(+55 99) 9999-99999' 
      value={props.value} 
      onChange={props.onChange}>
    </InputMask>
  );
}
function App() {
  const [phone, setPhone] = useState('');
  const handleInput = ({ target: { value } }) => setPhone(value);
  return (
    <div>
      <PhoneInput 
        value={phone} 
        onChange={handleInput}>
      </PhoneInput>
      <div style={{paddingTop: '12px'}}>Phone: {phone}</div>
    </div>
  );
}
export default App;