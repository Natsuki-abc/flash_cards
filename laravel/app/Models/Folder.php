<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Folder extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    public function decks()
    {
        return $this->hasMany(Deck::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * フォルダの進捗率を計算
     */
    public function progressPercentage()
    {
        $total = $this->flashcards()->count();
        if ($total === 0) {
            return 0;
        }

        $reviewed = $this->flashcards()->whereNotNull('last_reviewed_at')->count();
        return round(($reviewed / $total) * 100);
    }
}
