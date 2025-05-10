import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon, BookOpenIcon, AcademicCapIcon,
    ChartBarIcon, StarIcon, FolderIcon
} from '@heroicons/react/outline';

export default function Sidebar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-gray-200' : '';
    };

    return (
        <div className="w-64 bg-white shadow-md h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-700">ユーザー名</span>
                </div>
                <div className="mt-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="検索..."
                            className="w-full pl-8 pr-4 py-2 border rounded-md"
                        />
                        <div className="absolute left-2 top-2.5 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto">
                <ul className="p-2">
                    <li>
                        <Link to="/" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/')}`}>
                            <HomeIcon className="w-5 h-5" />
                            <span>ホーム</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/decks" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/decks')}`}>
                            <BookOpenIcon className="w-5 h-5" />
                            <span>単語帳一覧</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/study" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/study')}`}>
                            <AcademicCapIcon className="w-5 h-5" />
                            <span>学習モード</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/stats" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/stats')}`}>
                            <ChartBarIcon className="w-5 h-5" />
                            <span>統計・進捗</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/favorites" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/favorites')}`}>
                            <StarIcon className="w-5 h-5" />
                            <span>お気に入り</span>
                        </Link>
                    </li>
                </ul>

                <div className="p-2 font-medium text-sm">フォルダ</div>
                <ul className="p-2">
                    <li>
                        <Link to="/folder/recent" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/folder/recent')}`}>
                            <FolderIcon className="w-5 h-5" />
                            <span>最近</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/folder/english" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/folder/english')}`}>
                            <FolderIcon className="w-5 h-5" />
                            <span>英語単語帳</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/folder/toeic" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/folder/toeic')}`}>
                            <FolderIcon className="w-5 h-5" />
                            <span>TOEIC対策</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/folder/programming" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/folder/programming')}`}>
                            <FolderIcon className="w-5 h-5" />
                            <span>プログラミング用語</span>
                        </Link>
                    </li>
                </ul>

                <div className="p-2 font-medium text-sm">タグ</div>
                <ul className="p-2">
                    {['英語', 'TOEIC', 'プログラミング', '数学', '科学', '歴史', '語彙', '文法'].map((tag) => (
                        <li key={tag}>
                            <Link to={`/tag/${tag}`} className={`flex items-center space-x-2 p-2 rounded-md ${isActive(`/tag/${tag}`)}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5a1.99 1.99 0 0 1 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7c0-1.103.897-2 2-2z"></path>
                                </svg>
                                <span>{tag}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
