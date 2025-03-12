<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use App\Models\Folder;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FlashcardController extends Controller
{
    /**
     * フラッシュカード一覧を表示
     */
    public function index(Request $request)
    {
        $query = Flashcard::whereHas('folder', function ($q) {
            $q->where('user_id', Auth::id());
        });

        // タグによるフィルタリング
        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('name', $request->tag);
            });
        }

        // チェックボックスによるフィルタリング
        if ($request->has('check_1')) {
            $query->where('check_1', true);
        }
        if ($request->has('check_2')) {
            $query->where('check_2', true);
        }
        if ($request->has('check_3')) {
            $query->where('check_3', true);
        }

        // 検索
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('front_content', 'like', "%{$search}%")
                  ->orWhere('back_content', 'like', "%{$search}%");
            });
        }

        $flashcards = $query->paginate(20);
        $folders = Folder::where('user_id', Auth::id())->get();
        $tags = Tag::where('user_id', Auth::id())->get();

        return view('flashcards.index', compact('flashcards', 'folders', 'tags'));
    }

    /**
     * 新規フラッシュカード作成フォームを表示
     */
    public function create()
    {
        $folders = Folder::where('user_id', Auth::id())->get();
        $tags = Tag::where('user_id', Auth::id())->get();
        return view('flashcards.create', compact('folders', 'tags'));
    }

    /**
     * 新規フラッシュカードを保存
     */
    public function store(Request $request)
    {
        $request->validate([
            'folder_id' => 'required|exists:folders,id',
            'front_content' => 'required|string',
            'back_content' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $folder = Folder::findOrFail($request->folder_id);
        $this->authorize('update', $folder);

        $flashcard = Flashcard::create([
            'folder_id' => $request->folder_id,
            'front_content' => $request->front_content,
            'back_content' => $request->back_content,
            'check_1' => $request->has('check_1'),
            'check_2' => $request->has('check_2'),
            'check_3' => $request->has('check_3'),
        ]);

        if ($request->has('tags')) {
            $flashcard->tags()->attach($request->tags);
        }

        return redirect()->route('folders.show', $folder)
            ->with('success', 'フラッシュカードが作成されました');
    }

    /**
     * 特定のフラッシュカードの詳細を表示
     */
    public function show(Flashcard $flashcard)
    {
        $this->authorize('view', $flashcard);

        return view('flashcards.show', compact('flashcard'));
    }

    /**
     * フラッシュカード編集フォームを表示
     */
    public function edit(Flashcard $flashcard)
    {
        $this->authorize('update', $flashcard);

        $folders = Folder::where('user_id', Auth::id())->get();
        $tags = Tag::where('user_id', Auth::id())->get();
        $selectedTags = $flashcard->tags->pluck('id')->toArray();

        return view('flashcards.edit', compact('flashcard', 'folders', 'tags', 'selectedTags'));
    }

    /**
     * フラッシュカードを更新
     */
    public function update(Request $request, Flashcard $flashcard)
    {
        $this->authorize('update', $flashcard);

        $request->validate([
            'folder_id' => 'required|exists:folders,id',
            'front_content' => 'required|string',
            'back_content' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $folder = Folder::findOrFail($request->folder_id);
        $this->authorize('update', $folder);

        $flashcard->update([
            'folder_id' => $request->folder_id,
            'front_content' => $request->front_content,
            'back_content' => $request->back_content,
            'check_1' => $request->has('check_1'),
            'check_2' => $request->has('check_2'),
            'check_3' => $request->has('check_3'),
        ]);

        // タグの更新
        if ($request->has('tags')) {
            $flashcard->tags()->sync($request->tags);
        } else {
            $flashcard->tags()->detach();
        }

        return redirect()->route('folders.show', $folder)
            ->with('success', 'フラッシュカードが更新されました');
    }

    /**
     * フラッシュカードを削除
     */
    public function destroy(Flashcard $flashcard)
    {
        $this->authorize('delete', $flashcard);

        $folder = $flashcard->folder;
        $flashcard->delete();

        return redirect()->route('folders.show', $folder)
            ->with('success', 'フラッシュカードが削除されました');
    }
}
