import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const FolderDetail = () => {
    const { id } = useParams();
    const [folder, setFolder] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCard, setNewCard] = useState({
        front_content: '',
        back_content: '',
        check_1: false,
        check_2: false,
        check_3: false,
        tags: []
    });
    const [availableTags, setAvailableTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTags, setFilterTags] = useState([]);
    const [filterChecks, setFilterChecks] = useState({
        check_1: false,
        check_2: false,
        check_3: false
    });

    useEffect(() => {
        fetchFolderAndCards();
        fetchTags();
    }, [id]);

    const fetchFolderAndCards = async () => {
        try {
            setIsLoading(true);
            const [folderRes, cardsRes] = await Promise.all([
                axios.get(`/api/folders/${id}`),
                axios.get(`/api/folders/${id}/flashcards`)
            ]);
            setFolder(folderRes.data);
            setFlashcards(cardsRes.data);
        } catch (error) {
            console.error('Error fetching folder data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await axios.get('/api/tags');
            setAvailableTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleCreateCard = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/folders/${id}/flashcards`, {
                ...newCard,
                folder_id: id
            });
            setFlashcards([...flashcards, response.data]);
            setNewCard({
                front_content: '',
                back_content: '',
                check_1: false,
                check_2: false,
                check_3: false,
                tags: []
            });
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating flashcard:', error);
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm('このカードを削除してもよろしいですか？')) {
            try {
                await axios.delete(`/api/flashcards/${cardId}`);
                setFlashcards(flashcards.filter(card => card.id !== cardId));
            } catch (error) {
                console.error('Error deleting flashcard:', error);
            }
        }
    };

    const handleTagChange = (tagId) => {
        const currentTags = [...newCard.tags];
        if (currentTags.includes(tagId)) {
            setNewCard({ ...newCard, tags: currentTags.filter(id => id !== tagId) });
        } else {
            setNewCard({ ...newCard, tags: [...currentTags, tagId] });
        }
    };

    const handleFilterTagChange = (tagId) => {
        if (filterTags.includes(tagId)) {
            setFilterTags(filterTags.filter(id => id !== tagId));
        } else {
            setFilterTags([...filterTags, tagId]);
        }
    };

    const filteredCards = flashcards.filter(card => {
        // 検索語でフィルタリング
        const matchesSearch = card.front_content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             card.back_content.toLowerCase().includes(searchTerm.toLowerCase());

        // タグでフィルタリング
        const matchesTags = filterTags.length === 0 ||
                           card.tags.some(tag => filterTags.includes(tag.id));

        // チェックボックスでフィルタリング
        const matchesChecks = (!filterChecks.check_1 || card.check_1) &&
                             (!filterChecks.check_2 || card.check_2) &&
                             (!filterChecks.check_3 || card.check_3);

        return matchesSearch && matchesTags && matchesChecks;
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
    }

    if (!folder) {
        return <div className="text-center py-12">フォルダが見つかりませんでした</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link to="/folders" className="text-blue-500 hover:underline flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    単語帳一覧に戻る
                </Link>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{folder.name}</h1>
                <div className="flex space-x-2">
                    <Link
                        to={`/study/${folder.id}`}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        学習する
                    </Link>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        カード追加
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">フォルダ情報</h2>
                        <p className="text-sm text-gray-500">カード数: {flashcards.length}枚</p>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-4">
                            <p className="text-sm text-gray-500">進捗</p>
                            <p className="text-xl font-semibold">{folder.progress_percentage}%</p>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-500 h-2.5 rounded-full"
                                style={{ width: `${folder.progress_percentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">フィルター</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="カードを検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タグ</label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        filterTags.includes(tag.id)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                    onClick={() => handleFilterTagChange(tag.id)}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">チェック</label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-500"
                                    checked={filterChecks.check_1}
                                    onChange={() => setFilterChecks({
                                        ...filterChecks,
                                        check_1: !filterChecks.check_1
                                    })}
                                />
                                <span className="ml-2 text-sm text-gray-700">チェック1</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-500"
                                    checked={filterChecks.check_2}
                                    onChange={() => setFilterChecks({
                                        ...filterChecks,
                                        check_2: !filterChecks.check_2
                                    })}
                                />
                                <span className="ml-2 text-sm text-gray-700">チェック2</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-500"
                                    checked={filterChecks.check_3}
                                    onChange={() => setFilterChecks({
                                        ...filterChecks,
                                        check_3: !filterChecks.check_3
                                    })}
                                />
                                <span className="ml-2 text-sm text-gray-700">チェック3</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCards.map(card => (
                        <div key={card.id} className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">表面</h3>
                                    <p className="p-3 bg-gray-50 rounded min-h-[60px]">{card.front_content}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">裏面</h3>
                                    <p className="p-3 bg-gray-50 rounded min-h-[60px]">{card.back_content}</p>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {card.tags.map(tag => (
                                        <span
                                            key={tag.id}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <div className={`w-4 h-4 rounded-full ${card.check_1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`w-4 h-4 rounded-full ${card.check_2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`w-4 h-4 rounded-full ${card.check_3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                                <Link
                                    to={`/flashcards/${card.id}/edit`}
                                    className="text-blue-500 hover:underline"
                                >
                                    編集
                                </Link>
                                <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">カードがありません</h3>
                    <p className="mt-1 text-sm text-gray-500">新しいカードを追加して学習を始めましょう</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            カードを追加
                        </button>
                    </div>
                </div>
            )}

            {/* 新規カード作成モーダル */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                        <h2 className="text-xl font-semibold mb-4">新規カード作成</h2>
                        <form onSubmit={handleCreateCard}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        表面
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows="4"
                                        placeholder="表面の内容を入力"
                                        value={newCard.front_content}
                                        onChange={(e) => setNewCard({ ...newCard, front_content: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        裏面
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows="4"
                                        placeholder="裏面の内容を入力"
                                        value={newCard.back_content}
                                        onChange={(e) => setNewCard({ ...newCard, back_content: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    タグ
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map(tag => (
                                        <button
                                            key={tag.id}
                                            type="button"
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                newCard.tags.includes(tag.id)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                            onClick={() => handleTagChange(tag.id)}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    チェック項目
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-blue-500"
                                            checked={newCard.check_1}
                                            onChange={() => setNewCard({ ...newCard, check_1: !newCard.check_1 })}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">チェック1</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-blue-500"
                                            checked={newCard.check_2}
                                            onChange={() => setNewCard({ ...newCard, check_2: !newCard.check_2 })}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">チェック2</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-blue-500"
                                            checked={newCard.check_3}
                                            onChange={() => setNewCard({ ...newCard, check_3: !newCard.check_3 })}
                                        />
                                        <span className="ml-2 text-sm text-gray-700">チェック3</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
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
};

export default FolderDetail;
