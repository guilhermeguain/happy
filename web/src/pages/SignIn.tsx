import React, { useRef, useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as Yup from 'yup'; 
import { SubmitHandler, FormHandles, UnformErrors } from '@unform/core';
import { Form } from '@unform/web';
import { useHistory } from "react-router-dom";

import { useAuth } from '../contexts/auth';

import Input from '../components/Form/input';
import CheckboxInput from '../components/Form/checkbox';

import '../styles/pages/login.css';

import logoImg from '../images/logo-2.svg';

interface FormData {
  email: string;
  password: string;
}

interface CheckboxOption {
  id: string;
  value: string;
  label: string;
}

function SignIn() {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const formRef = useRef<FormHandles>(null);
  const context = useAuth();

  const checkboxOptions: CheckboxOption[] = [
    { id: 'remember', value: 'remember', label: 'Lembrar-me' },
  ];

  const handleSubmit: SubmitHandler<FormData> = async (data:FormData) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email('Digite um email válido').required('O email é obrigatório'),
        password: Yup.string().required('Digite sua senha')
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      formRef.current?.setErrors({});

      await context.signIn(email, password);
      context.signed = true;
      history.push('/dashboard');
    } catch (err) {
      const validationErrors:UnformErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {  
          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      } 
    }
  }

  useEffect(() => {

  }, []);

  return (
    <div id="page-login">
      <div className="content-wrapper">
        <main>
          <img src={logoImg} alt="Happy"/>
          <div className="location">
            <strong>São Paulo</strong>
            <span>São Paulo</span>
          </div>
        </main>
      </div>
      <aside>
        <Link to="/" className="button-return">
          <FiArrowLeft size="26" color="#15C3D6" />
        </Link>
        <h2 className="title-login">Fazer login</h2>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="email" label="E-mail" onChange={ event => setEmail(event.target.value) } />
          <Input type="password" name="password" label="Senha" onChange={ event => setPassword(event.target.value) } />
          <div className="remember-forgot">
            <div className="checkbox-group">
              <CheckboxInput name="remember" options={checkboxOptions} />
            </div>
            {/* <Link to="/" className="link-forgot">
              Esqueci minha senha
            </Link> */}
          </div>
          <button type="submit">Entrar</button>
        </Form>
      </aside>
    </div>
  );
}

export default SignIn;