<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_system_color_light',
        'theme_color',
        'font_size',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
