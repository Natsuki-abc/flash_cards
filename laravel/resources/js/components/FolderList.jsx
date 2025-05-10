import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FolderList = () => {
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newFolder, setNewFolder] = useState({ name: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/folders');
            setFolders(response.data);
        } catch (error) {
            console.error('Error fetching folders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/folders', newFolder);
            setFolders([...folders, response.data]);
            setNewFolder({ name: '' });
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const handleDeleteFolder = async (folderId) => {
        if (window.confirm('このフォルダを削除してもよろしいですか？含まれるすべてのフラッシュカードも削除されます。')) {
            try {
                await axios.delete(`/api/folders/${folderId}`);
                setFolders(folders.filter(folder => folder.id !== folderId));
            } catch (error) {
                console.error('Error deleting folder:', error);
            }
        }
    };

    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">単語帳一覧</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    新規作成
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="単語帳を検索..."
                    className="w-full p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredFolders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFolders.map(folder => (
                        <div key={folder.id} className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-semibold">{folder.name}</h2>
                                    <div className="relative">
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                            </svg>
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                                            <Link to={`/folders/${folder.id}/edit`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">編集</Link>
                                            <button
                                                onClick={() => handleDeleteFolder(folder.id)}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>進捗</span>
                                        <span>{folder.progress_percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-500 h-2.5 rounded-full"
                                            style={{ width: `${folder.progress_percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-gray-600">
                                    カード数: {folder.flashcards_count}枚
                                </p>
                                <p className="text-sm text-gray-500">
                                    最終学習: {folder.last_studied_at || '未学習'}
                                </p>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-between rounded-b-lg">
                                <Link
                                    to={`/folders/${folder.id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    詳細
                                </Link>
                                <Link
                                    to={`/study/${folder.id}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    学習する
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">単語帳がありません</h3>
                    <p className="mt-1 text-sm text-gray-500">新しい単語帳を作成して学習を始めましょう</p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            単語帳を作成
                        </button>
                    </div>
                </div>
            )}

            {/* 新規フォルダ作成モーダル */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">新規単語帳作成</h2>
                        <form onSubmit={handleCreateFolder}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="folderName">
                                    単語帳名
                                </label>
                                <input
                                    id="folderName"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="単語帳名を入力"
                                    value={newFolder.name}
                                    onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                                    required
                                />
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

export default FolderList;
