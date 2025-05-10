<?php

namespace App\Models;

use Askedio\SoftCascade\Traits\SoftCascadeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    use SoftDeletes;
    use SoftCascadeTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_image_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $softCascade = [
        'folders',
        'tags',
        'decks',
        'cards',
        'deck_study_sessions',
        'user_overall_stats',
    ];

    /**
     * このユーザーが所有するフォルダを取得
     */
    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    /**
     * このユーザーが所有するタグを取得
     */
    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    public function decks()
    {
        return $this->hasMany(Deck::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }

    public function deckStudySessions()
    {
        return $this->hasMany(DeckStudySession::class);
    }

    public function userSetting()
    {
        return $this->hasOne(UserSetting::class);
    }

    public function userOverallStat()
    {
        return $this->hasOne(UserOverallStat::class);
    }
}
