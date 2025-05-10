<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    /**
     * タグ一覧を表示
     */
    public function index()
    {
        $tags = Tag::where('user_id', Auth::id())->get();
        return view('tags.index', compact('tags'));
    }

    /**
     * 新規タグ作成フォームを表示
     */
    public function create()
    {
        return view('tags.create');
    }

    /**
     * 新規タグを保存
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Tag::create([
            'name' => $request->name,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('tags.index')
            ->with('success', 'タグが作成されました');
    }

    /**
     * タグ編集フォームを表示
     */
    public function edit(Tag $tag)
    {
        $this->authorize('update', $tag);

        return view('tags.edit', compact('tag'));
    }

    /**
     * タグを更新
     */
    public function update(Request $request, Tag $tag)
    {
        $this->authorize('update', $tag);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $tag->update([
            'name' => $request->name,
        ]);

        return redirect()->route('tags.index')
            ->with('success', 'タグが更新されました');
    }

    /**
     * タグを削除
     */
    public function destroy(Tag $tag)
    {
        $this->authorize('delete', $tag);

        $tag->delete();

        return redirect()->route('tags.index')
            ->with('success', 'タグが削除されました');
    }
}
