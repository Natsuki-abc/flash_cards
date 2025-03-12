import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import DeckList from './DeckList';
import DeckDetail from './DeckDetail';
import StudyMode from './StudyMode';
import Sidebar from './Sidebar';

export default function App() {
    return (
        <Router>
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/decks" element={<DeckList />} />
                        <Route path="/decks/:id" element={<DeckDetail />} />
                        <Route path="/study/:id" element={<StudyMode />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
