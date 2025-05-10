import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../css/parts/card.css';

const FlashcardApp = ({ initialCards }) => {
    const [cards, setCards] = useState(initialCards || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const goToNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') goToPrevious();
        else if (e.key === 'ArrowRight') goToNext();
        else if (e.key === ' ' || e.key === 'Enter') flipCard();
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex, isFlipped]);

    if (cards.length === 0) {
        return <div className="flashcard-container text-center">カードが見つかりません</div>;
    }

    return (
        <div className="flashcard-container">
            <h1 className="flashcard-title">フラッシュカード</h1>

            <div className="flashcard-progress">
                カード {currentIndex + 1} / {cards.length}
            </div>

            <div
                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={flipCard}
            >
                <div className="flashcard-inner">
                    <div className="flashcard-front">
                        <div className="flashcard-content">
                            {cards[currentIndex].question}
                        </div>
                    </div>
                    <div className="flashcard-back">
                        <div className="flashcard-content">
                            {cards[currentIndex].answer}
                        </div>
                    </div>
                </div>
                <div className="flip-indicator">クリックで裏返す</div>
            </div>

            <div className="flashcard-nav">
                <button
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    className="nav-button nav-prev"
                >
                    <span className="nav-icon">←</span> 前へ
                </button>

                <button
                    onClick={goToNext}
                    disabled={currentIndex === cards.length - 1}
                    className="nav-button nav-next"
                >
                    次へ <span className="nav-icon">→</span>
                </button>
            </div>
        </div>
    );
};

// Mount the component
if (document.getElementById('flashcard-app')) {
    const element = document.getElementById('flashcard-app');
    const initialCards = JSON.parse(element.dataset.cards || '[]');
    const root = ReactDOM.createRoot(element);
    root.render(<FlashcardApp initialCards={initialCards} />);
}

export default FlashcardApp;
