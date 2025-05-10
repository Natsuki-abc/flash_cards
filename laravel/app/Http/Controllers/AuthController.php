<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * ゲストログイン処理
     */
    public function guestLogin()
    {
        // ゲストユーザーを作成
        $user = User::create([
            'name' => 'ゲスト' . Str::random(6),
            'email' => 'guest_' . Str::random(10) . '@example.com',
            'password' => bcrypt(Str::random(16)),
            'is_guest' => true,
        ]);

        // 自動ログイン
        Auth::login($user);

        return redirect()->route('folders.index')
            ->with('success', 'ゲストとしてログインしました');
    }
}
