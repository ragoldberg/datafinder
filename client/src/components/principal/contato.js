import React from 'react';
import * as emailjs from 'emailjs-com';

import { Field, Label, Control, Input, Button, Icon, Textarea, Notification } from 'rbx';

class ContactForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, email, subject, message } = this.state;
    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: 'leandro@datafinder.com.br',
      subject,
      message_html: message,
    };
    emailjs.send(
      'gmail',
      'contato',
       templateParams,
      'user_9WBhnc639T5accYrnsalV'
    )
    this.resetForm();
  };

  resetForm() {
    this.setState({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { name, email, subject, message, sentMessage } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <Field>
          <Label>Nome</Label>
          <Control>
            <Input
              name="name"
              type="text"
              placeholder="Seu nome aqui"
              value={name}
              onChange={this.handleChange}
            />
          </Control>
        </Field>
        <Field>
          <Label>Email</Label>
          <Control>
            <Input
              name="email"
              type="email"
              placeholder="Seu Email aqui"
              value={email}
              onChange={this.handleChange}
            />
          </Control>
        </Field>
        <Field>
          <Label>Assunto</Label>
          <Control>
            <Input
              name="subject"
              type="text"
              placeholder="Assunto..."
              value={subject}
              onChange={this.handleChange}
            />
          </Control>
        </Field>
        <Field>
          <Label>Menssagem</Label>
          <Control>
            <Textarea
              name="message"
              placeholder="Tell me more about..."
              value={message}
              onChange={this.handleChange}
            />
          </Control>
        </Field>

        <Field kind="group">
          <Control>
            <Button color="dark">Enviar</Button>
          </Control>
          <Control>
            <Button text>Cancelar</Button>
          </Control>
        </Field>
      </form>
    );
  }
}

export default ContactForm;


