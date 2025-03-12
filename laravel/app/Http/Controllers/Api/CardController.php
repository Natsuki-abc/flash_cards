<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\Deck;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index(Deck $deck)
    {
        $this->authorize('view', $deck);
        return response()->json($deck->cards);
    }

    public function store(Request $request, Deck $deck)
    {
        $this->authorize('update', $deck);

        $validatedData = $request->validate([
            'front' => 'required|string',
            'back' => 'required|string',
        ]);

        $card = $deck->cards()->create($validatedData);

        // Update total cards count
        $deck->increment('total_cards');

        return response()->json($card, 201);
    }

    public function show(Deck $deck, Card $card)
    {
        $this->authorize('view', $deck);
        return response()->json($card);
    }

    public function update(Request $request, Deck $deck, Card $card)
    {
        $this->authorize('update', $deck);

        $validatedData = $request->validate([
            'front' => 'sometimes|required|string',
            'back' => 'sometimes|required|string',
            'mastered' => 'sometimes|boolean',
        ]);

        $card->update($validatedData);

        // If card is marked as mastered, update deck progress
        if (isset($validatedData['mastered']) && $validatedData['mastered']) {
            $masteredCount = $deck->cards()->where('mastered', true)->count();
            $totalCards = $deck->total_cards;
            $progress = $totalCards > 0 ? floor(($masteredCount / $totalCards) * 100) : 0;
            $deck->update(['progress' => $progress]);
        }

        return response()->json($card);
    }

    public function destroy(Deck $deck, Card $card)
    {
        $this->authorize('update', $deck);
        $card->delete();

        // Update total cards count
        $deck->decrement('total_cards');

        // Recalculate progress
        $masteredCount = $deck->cards()->where('mastered', true)->count();
        $totalCards = $deck->total_cards;
        $progress = $totalCards > 0 ? floor(($masteredCount / $totalCards) * 100) : 0;
        $deck->update(['progress' => $progress]);

        return response()->json(null, 204);
    }
}
