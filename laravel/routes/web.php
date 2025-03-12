<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\FlashcardController;
use App\Http\Controllers\StudyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('top');
});

Route::middleware(['auth'])->group(function () {
    // フォルダ関連
    Route::resource('folders', FolderController::class);

    // フラッシュカード関連
    Route::resource('flashcards', FlashcardController::class);

    // 学習モード
    Route::get('/study/{folder}', [StudyController::class, 'show']);
    Route::post('/study/progress', [StudyController::class, 'saveProgress']);

    // プロフィール
    Route::get('/profile', [ProfileController::class, 'edit']);
    Route::patch('/profile', [ProfileController::class, 'update']);
});

// ゲストログイン
Route::get('/guest-login', [AuthController::class, 'guestLogin']);

