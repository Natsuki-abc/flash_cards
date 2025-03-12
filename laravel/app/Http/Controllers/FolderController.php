<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FolderController extends Controller
{
    /**
     * フォルダ一覧を表示
     */
    public function index()
    {
        $folders = Folder::where('user_id', Auth::id())->get();
        return view('folders.index', compact('folders'));
    }

    /**
     * 新規フォルダ作成フォームを表示
     */
    public function create()
    {
        return view('folders.create');
    }

    /**
     * 新規フォルダを保存
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Folder::create([
            'name' => $request->name,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('folders.index')
            ->with('success', 'フォルダが作成されました');
    }

    /**
     * 特定のフォルダの詳細を表示
     */
    public function show(Folder $folder)
    {
        $this->authorize('view', $folder);

        $flashcards = $folder->flashcards;
        return view('folders.show', compact('folder', 'flashcards'));
    }

    /**
     * フォルダ編集フォームを表示
     */
    public function edit(Folder $folder)
    {
        $this->authorize('update', $folder);

        return view('folders.edit', compact('folder'));
    }

    /**
     * フォルダを更新
     */
    public function update(Request $request, Folder $folder)
    {
        $this->authorize('update', $folder);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $folder->update([
            'name' => $request->name,
        ]);

        return redirect()->route('folders.index')
            ->with('success', 'フォルダが更新されました');
    }

    /**
     * フォルダを削除
     */
    public function destroy(Folder $folder)
    {
        $this->authorize('delete', $folder);

        $folder->delete();

        return redirect()->route('folders.index')
            ->with('success', 'フォルダが削除されました');
    }
}
