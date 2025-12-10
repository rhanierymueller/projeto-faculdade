import React, { useState } from 'react';
import { Button } from '../../components';
import './SorteDoDia.css';

const FRASES_MOTIVACIONAIS = [
  "A persistência é o caminho do êxito.",
  "O sucesso nasce do querer, da determinação e da persistência.",
  "Não importa o que você decidiu. O que importa é que isso te faça feliz.",
  "Coragem é a resistência ao medo, domínio do medo, e não a ausência do medo.",
  "O único lugar onde o sucesso vem antes do trabalho é no dicionário.",
  "Você é mais forte do que imagina. Acredite.",
  "Pequenos progressos todos os dias somam grandes resultados.",
  "Não espere por oportunidades extraordinárias. Agarre ocasiões comuns e faça-as grandes.",
  "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
  "A única maneira de fazer um excelente trabalho é amar o que você faz."
];

export const SorteDoDia: React.FC = () => {
  const [frase, setFrase] = useState<string>('Clique no botão para descobrir sua sorte!');
  const [isSpinning, setIsSpinning] = useState(false);

  const gerarFrase = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length);
      setFrase(FRASES_MOTIVACIONAIS[randomIndex]);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="sorte-container">
      <div className="sorte-card">
        <h1 className="sorte-title">Sorte do Dia</h1>
        <p>Sua dose diária de inspiração.</p>
        
        <div className="sorte-message-box">
          <p className="sorte-message">{frase}</p>
        </div>

        <Button 
          onClick={gerarFrase} 
          disabled={isSpinning}
          size="large"
        >
          {isSpinning ? 'Sorteando...' : 'Gerar Nova Frase'}
        </Button>
      </div>
    </div>
  );
};

