import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        todayStudyTime: 0,
        consecutiveDays: 0,
        totalProgress: 0
    });
    const [recentFolders, setRecentFolders] = useState([]);
    const [activities, setActivities] = useState([]);
    const [weeklyProgress, setWeeklyProgress] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [statsRes, foldersRes, activitiesRes, progressRes] = await Promise.all([
                    axios.get('/api/stats'),
                    axios.get('/api/folders/recent'),
                    axios.get('/api/activities'),
                    axios.get('/api/progress/weekly')
                ]);

                setStats(statsRes.data);
                setRecentFolders(foldersRes.data);
                setActivities(activitiesRes.data);
                setWeeklyProgress(progressRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">フラッシュカード</h1>

            {/* 統計情報 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">今日の学習時間</p>
                            <p className="text-xl font-semibold">{stats.todayStudyTime}分</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">継続日数</p>
                            <p className="text-xl font-semibold">{stats.consecutiveDays}日</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">総合進捗</p>
                            <p className="text-xl font-semibold">{stats.totalProgress}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 学習進捗グラフ */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">学習進捗</h2>
                <p className="text-sm text-gray-500 mb-4">過去7日間の学習状況</p>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 最近の単語帳 */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">最近の単語帳</h2>
                    <Link to="/folders" className="text-blue-500 hover:underline text-sm">すべて表示</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentFolders.map(folder => (
                        <div key={folder.id} className="bg-white rounded-lg shadow">
                            <div className="p-4">
                                <h3 className="font-semibold">{folder.name}</h3>
                                <div className="mt-2 text-sm">
                                    <p>進捗</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-500 h-2.5 rounded-full"
                                            style={{ width: `${folder.progress_percentage}%` }}>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-right">{folder.progress_percentage}%</p>
                                </div>
                                <p className="text-sm mt-2">カード: {folder.flashcards_count}枚</p>
                            </div>
                            <div className="bg-gray-50 p-4 flex justify-end rounded-b-lg">
                                <Link
                                    to={`/study/${folder.id}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                                >
                                    学習する
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 共有アクティビティ */}
            <div>
                <h2 className="text-lg font-semibold mb-4">共有アクティビティ</h2>
                <div className="bg-white rounded-lg shadow">
                    {activities.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {activities.map(activity => (
                                <li key={activity.id} className="p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 mr-3">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={activity.user.profile_photo_url || '/images/default-avatar.png'}
                                                alt={activity.user.name}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm">
                                                <span className="font-medium">{activity.user.name}</span>
                                                <span className="text-gray-500"> {activity.description}</span>
                                            </p>
                                            <p className="text-xs text-gray-500">{activity.created_at_formatted}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            アクティビティはまだありません
                        </div>
                    )}
                </div>
            </div>

            {/* クイックフィルター */}
            <div className="fixed bottom-6 right-6">
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <h3 className="font-semibold mb-2">クイックフィルター</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/flashcards?filter=unmastered" className="flex items-center text-sm text-gray-700 hover:text-blue-500">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                未習得のカード
                            </Link>
                        </li>
                        <li>
                            <Link to="/flashcards?filter=marked" className="flex items-center text-sm text-gray-700 hover:text-blue-500">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                </svg>
                                マークしたカード
                            </Link>
                        </li>
                        <li>
                            <Link to="/flashcards?filter=recent" className="flex items-center text-sm text-gray-700 hover:text-blue-500">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                最近追加したカード
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
