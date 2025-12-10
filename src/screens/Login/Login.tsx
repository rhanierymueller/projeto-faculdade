import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label, FormGroup } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, error: authError } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Prencha todos os campos');
      return;
    }

    if (isRegistering) {
      if (!name) {
        setLocalError('Informe seu nome');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('As senhas não estão iguais');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setLocalError('');
    setPassword('');
    setConfirmPassword('');
  };

  const displayError = localError || authError;

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
          <FormGroup error={!!displayError} errorMessage={displayError || ''}>
            {isRegistering && (
              <div style={{ marginBottom: '16px' }}>
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
