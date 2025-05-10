<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Flashcard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudyController extends Controller
{
    /**
     * 学習モードを表示
     */
    public function show(Folder $folder)
    {
        $this->authorize('view', $folder);

        // 学習モードの設定を取得（ユーザー設定から）
        $studyMode = Auth::user()->study_mode ?? 'random';

        if ($studyMode === 'mistake_priority') {
            // 間違えた回数が多い順にカードを取得
            $flashcards = $folder->flashcards()
                ->orderBy('mistake_count', 'desc')
                ->get();
        } else {
            // ランダムにカードを取得
            $flashcards = $folder->flashcards()->inRandomOrder()->get();
        }

        return view('study.show', compact('folder', 'flashcards'));
    }

    /**
     * 学習進捗を保存
     */
    public function saveProgress(Request $request)
    {
        $request->validate([
            'flashcard_id' => 'required|exists:flashcards,id',
            'is_correct' => 'required|boolean',
        ]);

        $flashcard = Flashcard::findOrFail($request->flashcard_id);
        $this->authorize('update', $flashcard);

        // 間違えた場合はmistake_countを増やす
        if (!$request->is_correct) {
            $flashcard->increment('mistake_count');
        }

        // 最後に学習した日時を更新
        $flashcard->update([
            'last_reviewed_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }
}
