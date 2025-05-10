import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudyMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [folder, setFolder] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [studyStats, setStudyStats] = useState({
        startTime: new Date(),
        cardsReviewed: 0,
        correctAnswers: 0
    });

    useEffect(() => {
        fetchFolderAndCards();
    }, [id]);

    const fetchFolderAndCards = async () => {
        try {
            setIsLoading(true);
            const [folderRes, cardsRes] = await Promise.all([
                axios.get(`/api/folders/${id}`),
                axios.get(`/api/study/${id}`)
            ]);
            setFolder(folderRes.data);
            setFlashcards(cardsRes.data);
        } catch (error) {
            console.error('Error fetching study data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleNextCard = async (isCorrect) => {
        // 現在のカードの学習進捗を保存
        try {
            await axios.post('/api/study/progress', {
                flashcard_id: flashcards[currentCardIndex].id,
                is_correct: isCorrect
            });

            // 学習統計を更新
            setStudyStats({
                ...studyStats,
                cardsReviewed: studyStats.cardsReviewed + 1,
                correctAnswers: isCorrect ? studyStats.correctAnswers + 1 : studyStats.correctAnswers
            });

            // 次のカードへ進む
            if (currentCardIndex < flashcards.length - 1) {
                setCurrentCardIndex(currentCardIndex + 1);
                setShowAnswer(false);
            } else {
                // 全てのカードを学習し終えた場合
                await saveStudySession();
                navigate(`/folders/${id}`);
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const saveStudySession = async () => {
        const duration = Math.floor((new Date() - studyStats.startTime) / 60000); // 分単位
        try {
            await axios.post('/api/study-sessions', {
                folder_id: id,
                duration: Math.max(1, duration), // 最低1分
                cards_reviewed: studyStats.cardsReviewed,
                correct_answers: studyStats.correctAnswers
            });
        } catch (error) {
            console.error('Error saving study session:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === ' ' && !showAnswer) {
            e.preventDefault();
            handleShowAnswer();
        } else if (e.key === 'ArrowRight' && showAnswer) {
            handleNextCard(true);
        } else if (e.key === 'ArrowLeft' && showAnswer) {
            handleNextCard(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showAnswer, currentCardIndex]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
    }

    if (!folder || flashcards.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">学習するカードがありません</h1>
                <button
                    onClick={() => navigate(`/folders/${id}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    フォルダに戻る
                </button>
            </div>
        );
    }

    const currentCard = flashcards[currentCardIndex];
    const progress = Math.round(((currentCardIndex + 1) / flashcards.length) * 100);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <button
                    onClick={() => navigate(`/folders/${id}`)}
                    className="text-blue-500 hover:underline flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    フォルダに戻る
                </button>
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold">{folder.name} - 学習モード</h1>
                <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-500">{currentCardIndex + 1} / {flashcards.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">表面</h2>
                        <div className="p-4 bg-gray-50 rounded min-h-[200px] flex items-center justify-center">
                            <p className="text-xl">{currentCard.front_content}</p>
                        </div>
                    </div>

                    {showAnswer ? (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">裏面</h2>
                            <div className="p-4 bg-gray-50 rounded min-h-[200px] flex items-center justify-center">
                                <p className="text-xl">{currentCard.back_content}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-6">
                            <button
                                onClick={handleShowAnswer}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
                            >
                                答えを表示
                            </button>
                        </div>
                    )}

                    {showAnswer && (
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => handleNextCard(false)}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                不正解
                            </button>
                            <button
                                onClick={() => handleNextCard(true)}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                正解
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4">
                    <div className="flex justify-between text-sm text-gray-500">
                        <div>
                            <p>学習時間: {Math.floor((new Date() - studyStats.startTime) / 60000)}分</p>
                            <p>学習済み: {studyStats.cardsReviewed}枚</p>
                        </div>
                        <div>
                            <p>正解率: {studyStats.cardsReviewed > 0 ? Math.round((studyStats.correctAnswers / studyStats.cardsReviewed) * 100) : 0}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-2">ショートカットキー</h3>
                <ul className="text-sm text-gray-600">
                <li>
                        <span className="font-medium">スペースキー</span>: 答えを表示
                    </li>
                    <li>
                        <span className="font-medium">右矢印キー</span>: 正解として次のカードへ
                    </li>
                    <li>
                        <span className="font-medium">左矢印キー</span>: 不正解として次のカードへ
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default StudyMode;
