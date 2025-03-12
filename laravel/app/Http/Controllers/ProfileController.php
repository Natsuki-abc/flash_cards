<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * プロフィール編集画面を表示
     */
    public function edit()
    {
        $user = Auth::user();
        return view('profile.edit', compact('user'));
    }

    /**
     * プロフィールを更新
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'profile_photo' => 'nullable|image|max:1024', // 最大1MB
            'study_mode' => 'nullable|in:random,mistake_priority',
            'theme' => 'nullable|in:light,dark',
            'font_size' => 'nullable|in:small,medium,large',
        ]);

        $user->name = $request->name;

        if ($request->hasFile('profile_photo')) {
            // 古い画像を削除
            if ($user->profile_photo_path) {
                Storage::delete($user->profile_photo_path);
            }

            // 新しい画像を保存
            $path = $request->file('profile_photo')->store('profile-photos');
            $user->profile_photo_path = $path;
        }

        // 学習モードの設定を保存
        if ($request->has('study_mode')) {
            $user->study_mode = $request->study_mode;
        }

        // テーマの設定を保存
        if ($request->has('theme')) {
            $user->theme = $request->theme;
        }

        // フォントサイズの設定を保存
        if ($request->has('font_size')) {
            $user->font_size = $request->font_size;
        }

        $user->save();

        return redirect()->route('profile.edit')
            ->with('success', 'プロフィールが更新されました');
    }
}
