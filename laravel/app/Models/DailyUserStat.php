<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyUserStat extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'daily_user_stats';

    protected $fillable = [
        'study_seconds',
        'total_cards_studied',
        'total_cards_correct',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
