<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudySession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class StudySessionController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'deck_id' => 'nullable|exists:decks,id',
            'duration' => 'required|integer|min:1',
            'cards_reviewed' => 'required|integer|min:0',
            'cards_mastered' => 'required|integer|min:0',
        ]);

        $session = Auth::user()->studySessions()->create([
            'deck_id' => $validatedData['deck_id'] ?? null,
            'duration' => $validatedData['duration'],
            'cards_reviewed' => $validatedData['cards_reviewed'],
            'cards_mastered' => $validatedData['cards_mastered'],
            'session_date' => Carbon::today(),
        ]);

        return response()->json($session, 201);
    }

    public function getStats()
    {
        $user = Auth::user();

        // Get today's study time
        $todayTime = $user->studySessions()
            ->whereDate('session_date', Carbon::today())
            ->sum('duration');

        // Get consecutive days streak
        $dates = $user->studySessions()
            ->orderBy('session_date', 'desc')
            ->pluck('session_date')
            ->map(function ($date) {
                return Carbon::parse($date)->format('Y-m-d');
            })
            ->unique()
            ->values();

        $streak = 0;
        $today = Carbon::today();

        for ($i = 0; $i < $dates->count(); $i++) {
            $expectedDate = $today->copy()->subDays($i)->format('Y-m-d');
            if ($dates->contains($expectedDate)) {
                $streak++;
            } else {
                break;
            }
        }

        // Get overall progress (average of all decks)
        $decks = $user->decks;
        $overallProgress = $decks->count() > 0 ? $decks->avg('progress') : 0;

        // Get daily study data for chart (past 7 days)
        $past7Days = collect(range(0, 6))->map(function ($day) {
            return Carbon::today()->subDays($day);
        });

        $dailyData = $past7Days->map(function ($date) use ($user) {
            $session = $user->studySessions()
                ->whereDate('session_date', $date)
                ->sum('duration');
            return [
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('D'),
                'minutes' => $session,
            ];
        })->reverse()->values();

        return response()->json([
            'today_minutes' => $todayTime,
            'streak_days' => $streak,
            'overall_progress' => round($overallProgress),
            'daily_data' => $dailyData,
        ]);
    }
}
