import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/solid';

export default function DeckDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [showCardModal, setShowCardModal] = useState(false);
    const [currentCard, setCurrentCard] = useState({ front: '', back: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingCard, setEditingCard] = useState(null);

    useEffect(() => {
        fetchDeck();
    }, [id]);

    const fetchDeck = async () => {
        try {
            const response = await axios.get(`/api/decks/${id}`);
            setDeck(response.data);
            setCards(response.data.cards || []);
        } catch (error) {
            console.error('Error fetching deck:', error);
        }
    };

    const handleCreateCard = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && editingCard) {
                await axios.put(`/api/decks/${id}/cards/${editingCard.id}`, currentCard);
            } else {
                await axios.post(`/api/decks/${id}/cards`, currentCard);
            }
            setCurrentCard({ front: '', back: '' });
            setShowCardModal(false);
            setIsEditing(false);
            setEditingCard(null);
            fetchDeck();
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const handleEditCard = (card) => {
        setCurrentCard({ front: card.front, back: card.back });
        setIsEditing(true);
        setEditingCard(card);
        setShowCardModal(true);
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm('このカードを削除してもよろしいですか？')) {
            try {
                await axios.delete(`/api/decks/${id}/cards/${cardId}`);
                fetchDeck();
            } catch (error) {
                console.error('Error deleting card:', error);
            }
        }
    };

    const handleStudy = () => {
        navigate(`/study/${id}`);
    };

    if (!deck) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{deck.name}</h1>
                    <p className="text-gray-500">{deck.description}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setCurrentCard({ front: '', back: '' });
                            setIsEditing(false);
                            setEditingCard(null);
                            setShowCardModal(true);
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-1" />
                        カード追加
                    </button>
                    <button
                        onClick={handleStudy}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        学習する
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center mb-4">
                        <h2 className="text-lg font-semibold">進捗</h2>
                        <div className="ml-4 flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-500 h-2.5 rounded-full"
                                    style={{ width: `${deck.progress}%` }}>
                                </div>
                            </div>
                        </div>
                        <span className="ml-2">{deck.progress}%</span>
                    </div>
                    <p>カード数: {cards.length}枚</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">カード一覧</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    表面
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    裏面
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    状態
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    アクション
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cards.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        カードがありません。「カード追加」ボタンから新しいカードを作成してください。
                                    </td>
                                </tr>
                            ) : (
                                cards.map(card => (
                                    <tr key={card.id}>
                                        <td className="px-6 py-4 whitespace-normal">
                                            {card.front}
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal">
                                            {card.back}
                                        </td>
                                        <td className="px-6 py-4">
                                            {card.mastered ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    完了
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    学習中
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditCard(card)}
                                                className="text-blue-600 hover:text-blue-900 mr-2"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCard(card.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Card Modal */}
            {showCardModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditing ? 'カードを編集' : '新しいカードを追加'}
                        </h2>
                        <form onSubmit={handleCreateCard}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    表面
                                </label>
                                <textarea
                                    value={currentCard.front}
                                    onChange={(e) => setCurrentCard({...currentCard, front: e.target.value})}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    裏面
                                </label>
                                <textarea
                                    value={currentCard.back}
                                    onChange={(e) => setCurrentCard({...currentCard, back: e.target.value})}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCardModal(false);
                                        setIsEditing(false);
                                        setEditingCard(null);
                                    }}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {isEditing ? '更新' : '追加'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
