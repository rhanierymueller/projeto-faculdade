import React, { useState } from 'react';
import { Button, Input, Label, FormGroup } from '../../components';
import './Login.css';

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) {
        onLogin(email, password);
      } else {
        alert('Login realizado com sucesso!');
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Serena AI</h1>
          <p className="login-subtitle">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <FormGroup error={!!error} errorMessage={error}>
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password" required>
              Senha
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              disabled={isLoading}
              required
            />
          </FormGroup>

          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            size="large"
          >
            Entrar
          </Button>
        </form>

        <div className="login-footer">
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => alert('Funcionalidade em desenvolvimento')}
          >
            Esqueceu sua senha?
          </Button>
          <p className="signup-text">
            Não tem uma conta? 
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => alert('Funcionalidade em desenvolvimento')}
            >
              Cadastre-se
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;