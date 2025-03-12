import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusIcon, DotsVerticalIcon } from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';

export default function DeckList() {
    const [decks, setDecks] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newDeck, setNewDeck] = useState({ name: '', description: '', category: '' });

    useEffect(() => {
        fetchDecks();
    }, []);

    const fetchDecks = async () => {
        try {
            const response = await axios.get('/api/decks');
            setDecks(response.data);
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    };

    const handleCreateDeck = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/decks', newDeck);
            setNewDeck({ name: '', description: '', category: '' });
            setShowCreateModal(false);
            fetchDecks();
        } catch (error) {
            console.error('Error creating deck:', error);
        }
    };

    const handleDeleteDeck = async (id) => {
        if (window.confirm('このデッキを削除してもよろしいですか？')) {
            try {
                await axios.delete(`/api/decks/${id}`);
                fetchDecks();
            } catch (error) {
                console.error('Error deleting deck:', error);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">すべての単語帳</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-1" />
                    新規作成
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map(deck => (
                    <div key={deck.id} className="bg-white rounded-lg shadow">
                        <div className="p-4">
                            <div className="flex justify-between">
                                <h3 className="font-semibold">{deck.name}</h3>
                                <Menu as="div" className="relative">
                                    <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
                                        <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
                                    </Menu.Button>
                                    <Transition
                                        enter="transition duration-100 ease-out"
                                        enterFrom="transform scale-95 opacity-0"
                                        enterTo="transform scale-100 opacity-100"
                                        leave="transition duration-75 ease-out"
                                        leaveFrom="transform scale-100 opacity-100"
                                        leaveTo="transform scale-95 opacity-0"
                                    >
                                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to={`/decks/${deck.id}`}
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } block px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        編集
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleDeleteDeck(deck.id)}
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } block w-full text-left px-4 py-2 text-sm text-red-600`}
                                                    >
                                                        削除
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                            <p className="text-sm text-gray-500">{deck.description || '説明なし'}</p>
                            <div className="mt-3 text-sm">
                                <p>進捗</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded-full"
                                        style={{ width: `${deck.progress}%` }}>
                                    </div>
                                </div>
                                <p className="mt-1 text-right">{deck.progress}%</p>
                            </div>
                            <p className="text-sm mt-2">カード: {deck.total_cards}枚</p>
                            {deck.category && (
                                <p className="text-xs mt-2 text-gray-500">{deck.category}</p>
                            )}
                        </div>
                        <div className="bg-gray-50 p-4 flex justify-between rounded-b-lg">
                            <Link
                                to={`/decks/${deck.id}`}
                                className="text-blue-500 px-4 py-2 text-sm hover:underline"
                            >
                                詳細
                            </Link>
                            <Link
                                to={`/study/${deck.id}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                            >
                                学習する
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Deck Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">新しい単語帳を作成</h2>
                        <form onSubmit={handleCreateDeck}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    名前
                                </label>
                                <input
                                    type="text"
                                    value={newDeck.name}
                                    onChange={(e) => setNewDeck({...newDeck, name: e.target.value})}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    説明
                                </label>
                                <textarea
                                    value={newDeck.description}
                                    onChange={(e) => setNewDeck({...newDeck, description: e.target.value})}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    カテゴリ
                                </label>
                                <input
                                    type="text"
                                    value={newDeck.category}
                                    onChange={(e) => setNewDeck({...newDeck, category: e.target.value})}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    作成
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
