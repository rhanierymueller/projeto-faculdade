import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label, FormGroup } from '../../components';
import './Login.css';

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (isRegistering) {
      if (!name) {
        setError('Por favor, informe seu nome');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (onLogin) {
        onLogin(email, password);
      }
      navigate('/');
    }, 1000);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Serena AI</h1>
          <p className="login-subtitle">
            {isRegistering ? 'Crie sua conta para começar' : 'Faça login para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <FormGroup error={!!error} errorMessage={error}>
            {isRegistering && (
              <div style={{ marginBottom: '1rem' }}>
                <Label htmlFor="name" required>Nome</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  disabled={isLoading}
                  required={isRegistering}
                />
              </div>
            )}
            
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

          {isRegistering && (
            <FormGroup>
              <Label htmlFor="confirmPassword" required>
                Confirmar Senha
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                disabled={isLoading}
                required={isRegistering}
              />
            </FormGroup>
          )}

          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            size="large"
          >
            {isRegistering ? 'Registrar' : 'Entrar'}
          </Button>
        </form>

        <div className="login-footer">
          {!isRegistering && (
            <div className="forgot-password-container">
              <Button 
                type="button" 
                variant="ghost"
                onClick={() => alert('Funcionalidade em desenvolvimento')}
                className="forgot-password-btn"
              >
                Esqueceu sua senha?
              </Button>
            </div>
          )}
          
          <div className="signup-container">
            <Label className="signup-text-label">
              {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            </Label>
            <Button 
              type="button" 
              variant="ghost"
              onClick={toggleMode}
              className="signup-btn"
            >
              {isRegistering ? 'Fazer Login' : 'Cadastre-se'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
