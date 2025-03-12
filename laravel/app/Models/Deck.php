<?php

namespace App\Models;

use Askedio\SoftCascade\Traits\SoftCascadeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deck extends Model
{
    use HasFactory;
    use SoftDeletes;
    use SoftCascadeTrait;

    protected $fillable = [
        'name',
        'is_public',
        'description',
        'total_cards',
    ];

    protected $softCascade = [
        'deck_study_sessions',
        'cards',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    public function deckStudySession()
    {
        return $this->hasOne(DeckStudySession::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }
}
