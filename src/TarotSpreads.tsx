import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { tarotCardsData } from "./data/tarotMeanings";
import "./TarotSpreads.css";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import costasImg from "./assets/costas.jpg";

interface Card {
  id: number;
  position: string | null;
  isReversed: boolean;
  randomAngle?: number;
  randomOffsetX?: number;
  randomOffsetY?: number;
}

interface DropZoneProps {
  position: string;
  placedCards: Card[];
  onDropCard: (card: Card, position: string) => void;
  openCardModal: (id: number) => void;
}

const SPREADS = [
  { type: "daily", label: "Leitura Diária", positions: ["Energia do Dia", "Desafio", "Conselho"] },
  { type: "cross", label: "Cruz Celta", positions: ["Presente","Desafio","Passado","Futuro","Acima","Abaixo","Conselho","Resultado"] },
  { type: "celtic", label: "Cruz Celta Completa", positions: ["Presente","Desafio","Passado","Futuro","Acima","Abaixo","Conselho","Influências Externas","Esperanças","Resultado"] },
  { type: "relationship", label: "Relacionamento", positions: ["Você","Parceiro(a)","Relacionamento","Conselho","Resultado"] },
];

const TarotSpreads: React.FC = () => {
  const [spreadType, setSpreadType] = useState("daily");
  const [cards, setCards] = useState<Card[]>([]);
  const [modalCard, setModalCard] = useState<number | null>(null);

  // quick touch detection to avoid react-device-detect dependency
  const isTouch = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  const initializeDeck = useCallback(() => {
    const newCards = tarotCardsData.map((c) => ({
      id: c.id,
      position: null,
      isReversed: false,
      randomAngle: (Math.random() - 0.5) * 10,
      randomOffsetX: (Math.random() - 0.5) * 6,
      randomOffsetY: (Math.random() - 0.5) * 6,
    }));
    setCards(newCards);
  }, []);

  useEffect(() => {
    initializeDeck();
  }, [initializeDeck]);

  const shuffleCards = () => {
    setCards((prev) =>
      [...prev]
        .sort(() => Math.random() - 0.5)
        .map((c) => ({
          ...c,
          position: null,
          isReversed: Math.random() < 0.5,
          randomAngle: (Math.random() - 0.5) * 10,
          randomOffsetX: (Math.random() - 0.5) * 6,
          randomOffsetY: (Math.random() - 0.5) * 6,
        }))
    );
  };

  const clearSpread = () => {
    setCards((prev) => prev.map((c) => ({ ...c, position: null })));
  };

  const spreadPositions = useMemo(() => {
    const s = SPREADS.find((p) => p.type === spreadType);
    return s ? s.positions : ["Posição 1", "Posição 2", "Posição 3"];
  }, [spreadType]);

  const handleDropCard = (card: Card, position: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, position } : c))
    );
  };

  const openCardModal = (id: number) => setModalCard(id);
  const closeCardModal = () => setModalCard(null);

  return (
    <DndProvider backend={isTouch ? TouchBackend : HTML5Backend}>
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

          {/* Botões de seleção de spread */}
          <div className="spread-buttons">
            {SPREADS.map((spread) => (
              <button
                key={spread.type}
                className={`spread-button ${spreadType === spread.type ? "active" : ""}`}
                onClick={() => setSpreadType(spread.type)}
                aria-pressed={spreadType === spread.type}
                aria-label={`Selecionar spread ${spread.label}`}
              >
                {spread.label}
              </button>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="deck-buttons">
            <button onClick={shuffleCards} className="action-button" aria-label="Embaralhar cartas">
              Embaralhar
            </button>
            <button onClick={clearSpread} className="action-button" aria-label="Limpar spread">
              Limpar
            </button>
          </div>
        </div>

        <div className="deck-spread-wrapper">
          {/* Baralho */}
          <div className="deck-section">
            <div className="deck-container">
              {cards
                .filter((c) => !c.position)
                .map((card, idx, arr) => (
                  <DraggableCard key={card.id} card={card} index={idx} total={arr.length} />
                ))}
            </div>

            {/* Área de leitura */}
            <div className="spread-area">
              <div className="spread-grid">
                {spreadPositions.map((pos) => (
                  <DropZone
                    key={pos}
                    position={pos}
                    placedCards={cards.filter((c) => c.position === pos)}
                    onDropCard={handleDropCard}
                    openCardModal={openCardModal}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de detalhes */}
        {modalCard && (() => {
          const cardData = tarotCardsData.find((c) => c.id === modalCard);
          const cardState = cards.find((c) => c.id === modalCard);
          if (!cardData || !cardState) return null;
          return (
            <div className="card-details-modal" onClick={closeCardModal}>
              <div
                className="card-details-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                <button className="card-details-close" onClick={closeCardModal} aria-label="Fechar">
                  ×
                </button>
                <img
                  src={cardData.imageUrl}
                  alt={cardData.name}
                  className="card-details-image"
                  loading="lazy"
                />
                <div className="card-details-info">
                  <h2>{cardData.name}</h2>
                  <p>
                    {cardState.isReversed ? cardData.reversedMeaning : cardData.uprightMeaning}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        <footer className="tarot-footer">
          &copy; 2025 Tarot Spreads - Todos os direitos reservados
          <p>
            Desenvolvido por {" "}
            <a href="https://portfilio-topaz-one.vercel.app/" target="_blank" rel="noopener noreferrer">
             Esther Rodrigues
            </a>
          </p>
        </footer>
      </div>
    </DndProvider>
  );
};

/* === DRAGGABLE CARD === */
const DraggableCard: React.FC<{ card: Card; index: number; total: number }> = React.memo(({ card, index, total }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: card,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Conecta o React DnD ao ref manual
  drag(ref);

  const style = useMemo(() => {
    const mid = total / 2;
    const baseAngle = (index - mid) * 2;
    const offsetX = (index - mid) * 5 + (card.randomOffsetX ?? 0);
    const offsetY = Math.abs(index - mid) * -2 + (card.randomOffsetY ?? 0);
    const rotate = baseAngle + (card.randomAngle ?? 0);
    return {
      transform: `rotate(${rotate}deg) translate(${offsetX}px, ${offsetY}px)`,
      zIndex: total - index,
      opacity: isDragging ? 0.5 : 1,
    } as React.CSSProperties;
  }, [index, total, card, isDragging]);

  return (
    <div
      ref={ref}
      className={`card-item ${isDragging ? "dragging" : ""}`}
      style={style}
      role="button"
      aria-label="Carta do baralho (verso)"
    >
      <img src={costasImg} alt="Verso" className="card-back" />
    </div>
  );
});

/* === DROP ZONE === */
const DropZoneComponent: React.FC<DropZoneProps> = ({
  position,
  placedCards,
  onDropCard,
  openCardModal,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: Card) => onDropCard(item, position),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Conecta o React DnD ao ref manual
  drop(ref);

  return (
    <div ref={ref} className={`drop-zone ${isOver ? "drag-over" : ""}`} aria-label={`Zona ${position}`}>
      <div className="position-label">{position}</div>
      {placedCards.length ? (
        placedCards.map((c, idx) => {
          const data = tarotCardsData.find((t) => t.id === c.id);
          if (!data) return null;
          const randomAngle = c.randomAngle ?? 0; // usar random pré-computado
          return (
            <div
              key={c.id}
              className={`placed-card ${c.isReversed ? "reversed" : ""}`}
              style={{
                transform: `translate(${idx * 2}px, ${-idx * 2}px) rotate(${randomAngle}deg)`,
                zIndex: idx + 1,
              }}
              onClick={() => openCardModal(c.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === "Enter") openCardModal(c.id); }}
              aria-label={`Carta ${data.name}`}
            >
              <img src={data.imageUrl} alt={data.name} className="card-face" loading="lazy" />
            </div>
          );
        })
      ) : (
        <div className="drop-placeholder">Solte a carta aqui</div>
      )}
    </div>
  );
};

const DropZone = React.memo(DropZoneComponent);

export default TarotSpreads;
