import React, { useState, useCallback, useEffect } from "react";
import { tarotCardsData } from './data/tarotMeanings';
import "./TarotSpreads.css";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';



interface Card {
  id: number;
  position: string | null;
  isReversed: boolean;
  randomAngle?: number;
  randomOffsetX?: number;
  randomOffsetY?: number;
}

const TarotSpreads: React.FC = () => {
  const [spreadType, setSpreadType] = useState('daily');
  const [cards, setCards] = useState<Card[]>([]);
  const [dragOverPosition, setDragOverPosition] = useState<string | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<number | null>(null);
  const [modalCard, setModalCard] = useState<number | null>(null);

  const initializeDeck = useCallback(() => {
    const newCards = tarotCardsData.map(c => ({
      id: c.id,
      position: null,
      isReversed: false,
      randomAngle: (Math.random() - 0.5) * 10,
      randomOffsetX: (Math.random() - 0.5) * 6,
      randomOffsetY: (Math.random() - 0.5) * 6
    }));
    setCards(newCards);
  }, []);

  useEffect(() => { initializeDeck(); }, [initializeDeck]);

  const shuffleCards = () => {
    setCards(prev => {
      const shuffled = [...prev]
        .sort(() => Math.random() - 0.5)
        .map(c => ({
          ...c,
          position: null,
          isReversed: Math.random() < 0.5,
          randomAngle: (Math.random() - 0.5) * 10,
          randomOffsetX: (Math.random() - 0.5) * 6,
          randomOffsetY: (Math.random() - 0.5) * 6
        }));
      return shuffled;
    });
  };

  const clearSpread = () => {
    setCards(prev => prev.map(c => ({ ...c, position: null })));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, cardId: number) => {
    e.dataTransfer.setData('cardId', cardId.toString());
    setDraggingCardId(cardId);
  };
  const handleDragEnd = () => setDraggingCardId(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, position: string) => {
    e.preventDefault();
    setDragOverPosition(position);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: string) => {
    e.preventDefault();
    const cardId = parseInt(e.dataTransfer.getData('cardId'), 10);
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, position } : c
    ));
    setDragOverPosition(null);
    setDraggingCardId(null);
  };

  const spreadPositions = (() => {
    switch(spreadType){
      case 'daily': return ["Energia do Dia", "Desafio", "Conselho"];
      case 'cross': return ["Presente", "Desafio", "Passado", "Futuro", "Acima", "Abaixo", "Conselho", "Resultado"];
      case 'celtic': return ["Presente", "Desafio", "Passado", "Futuro", "Acima", "Abaixo", "Conselho", "Influências Externas", "Esperanças", "Resultado"];
      case 'relationship': return ["Você", "Parceiro(a)", "Relacionamento", "Conselho", "Resultado"];
      default: return ["Posição 1", "Posição 2", "Posição 3"];
    }
  })();

  const openCardModal = (cardId: number) => setModalCard(cardId);
  const closeCardModal = () => setModalCard(null);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
    <div className="tarot-container">
      <div className="tarot-content">

        <header className="tarot-header">
          <h2 className="tarot-title">
            {spreadType === "daily" && "Leitura Diária"}
            {spreadType === "cross" && "Cruz Celta"}
            {spreadType === "celtic" && "Cruz Celta Completa"}
            {spreadType === "relationship" && "Relacionamento"}
          </h2>
        </header>

        <div className="spread-buttons">
          {[
            { type: 'daily', label: 'Leitura Diária' },
            { type: 'cross', label: 'Cruz Celta' },
            { type: 'celtic', label: 'Cruz Celta Completa' },
            { type: 'relationship', label: 'Relacionamento' },
          ].map(spread => (
            <button
              key={spread.type}
              className={`spread-button ${spreadType === spread.type ? 'active' : ''}`}
              onClick={() => setSpreadType(spread.type)}
            >
              {spread.label}
            </button>
          ))}
        </div>
        {/* Botões junto ao baralho */}
            <div className="deck-buttons">
              <button onClick={shuffleCards} className="action-button">Embaralhar</button>
              <button onClick={clearSpread} className="action-button">Limpar</button>
            </div>
          </div>

        <div className="deck-spread-wrapper">
          {/* Seção do Baralho */}
          <div className="deck-section">
            <div className="deck-container">
              {cards.filter(c => !c.position).map((card, idx, arr) => {
                const mid = arr.length / 2;
                const baseAngle = (idx - mid) * 2;
                const offsetX = (idx - mid) * 5 + card.randomOffsetX!;
                const offsetY = Math.abs(idx - mid) * -2 + card.randomOffsetY!;
                const rotate = baseAngle + card.randomAngle!;
                return (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={e => handleDragStart(e, card.id)}
                    onDragEnd={handleDragEnd}
                    className={`card-item ${draggingCardId === card.id ? 'dragging' : ''}`}
                    style={{
                      transform: `rotate(${rotate}deg) translate(${offsetX}px, ${offsetY}px)`,
                      zIndex: arr.length - idx
                    }}
                  >
                    <img src={require('./assets/costas.jpg')} alt="Verso" className="card-back" />
                  </div>
                );
              })}
            </div>

            

          {/* Área de Leitura */}
          <div className="spread-area">
            <div className="spread-grid">
              {spreadPositions.map(pos => {
                const placed = cards.filter(c => c.position === pos);
                return (
                  <div
                    key={pos}
                    className={`drop-zone ${dragOverPosition === pos ? 'drag-over' : ''}`}
                    onDragOver={e => handleDragOver(e, pos)}
                    onDrop={e => handleDrop(e, pos)}
                  >
                    <div className="position-label"><span>{pos}</span></div>
                    <div className="placed-cards-container">
                      {placed.length ? placed.map((c, idx) => {
                        const cardData = tarotCardsData.find(t => t.id === c.id);
                        if(!cardData) return null;
                        const randomAngle = (Math.random() - 0.5) * 10;
                        return (
                          <div
                            key={c.id}
                            className={`placed-card ${c.isReversed ? 'reversed' : ''}`}
                            style={{
                              transform: `translate(${idx * 2}px,${-idx * 2}px) rotate(${randomAngle}deg)`,
                              zIndex: idx + 1
                            }}
                            onClick={() => openCardModal(c.id)}
                          >
                            <img 
                              src={cardData.imageUrl} 
                              alt={cardData.name} 
                              className={`card-face ${!cardData.imageUrl ? 'loading' : ''}`} 
                              onError={(e) => e.currentTarget.classList.add('loading')}
                              onLoad={(e) => e.currentTarget.classList.remove('loading')}
                            />
                          </div>
                        );
                      }) : <div className="drop-placeholder"><span>Solte a carta aqui</span></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal de Detalhes da Carta */}
        {modalCard && (() => {
          const modalCardData = tarotCardsData.find(c => c.id === modalCard);
          const cardState = cards.find(c => c.id === modalCard);
          if (!modalCardData || !cardState) return null;
          return (
            <div className="card-details-modal" onClick={closeCardModal}>
              <div className="card-details-content" onClick={e => e.stopPropagation()}>
                <button className="card-details-close" onClick={closeCardModal}>×</button>
                <img src={modalCardData.imageUrl} alt={modalCardData.name} className="card-details-image" />
                <div className="card-details-info">
                  <h2>{modalCardData.name}</h2>
                  <p>{cardState.isReversed ? modalCardData.reversedMeaning : modalCardData.uprightMeaning}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      
<footer className="tarot-footer">
  <p>Desenvolvido por Esther Rodrigues | <a href="mailto:vrodrigues.esther@gmai.com">vrodrigues.esther@gmai.com</a> | <a href="https://www.linkedin.com/in/esther-rodrigues/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
</footer>

    </div>
    </DndProvider>
  );
};


export default TarotSpreads;
