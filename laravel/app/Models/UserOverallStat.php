<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserOverallStat extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'user_overall_stats';

    protected $fillable = [
        'streak_days',
        'last_study_date',
        'longest_streak',
        'total_study_days',
        'total_study_seconds',
        'total_cards_studied',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
