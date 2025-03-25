<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\StudyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardController;

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

Route::get('/flashcards', [CardController::class, 'index'])->name('flashcards.index');

// Route::middleware(['auth'])->group(function () {
//     // フォルダ関連
//     Route::resource('folders', FolderController::class);

//     // フラッシュカード関連
//     Route::resource('flashcards', FlashcardController::class);

//     // 学習モード
//     Route::get('/study/{folder}', [StudyController::class, 'show']);
//     Route::post('/study/progress', [StudyController::class, 'saveProgress']);

//     // プロフィール
//     Route::get('/profile', [ProfileController::class, 'edit']);
//     Route::patch('/profile', [ProfileController::class, 'update']);
// });

// // ゲストログイン
// Route::get('/guest-login', [AuthController::class, 'guestLogin']);

// // 認証関連
// Route::middleware('guest')->group(function () {
//     Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
//     Route::post('/login', [AuthController::class, 'login']);
//     Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
//     Route::post('/register', [AuthController::class, 'register']);
// });

// // ソーシャルログイン
// Route::get('/auth/{provider}', [AuthController::class, 'redirectToProvider'])
//     ->middleware('guest')
//     ->name('social.login');
// Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback'])
//     ->middleware('guest')
//     ->name('social.callback');

// Route::post('/logout', [AuthController::class, 'logout'])
//     ->middleware('auth')
//     ->name('logout');
