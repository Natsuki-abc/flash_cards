<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeckController extends Controller
{
    public function index()
    {
        $decks = Auth::user()->decks()->with('tags')->get();
        return response()->json($decks);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        $deck = Auth::user()->decks()->create([
            'name' => $validatedData['name'],
            'description' => $validatedData['description'] ?? null,
            'category' => $validatedData['category'] ?? null,
        ]);

        if (isset($validatedData['tags'])) {
            $deck->tags()->sync($validatedData['tags']);
        }

        return response()->json($deck->load('tags'), 201);
    }

    public function show(Deck $deck)
    {
        $this->authorize('view', $deck);
        return response()->json($deck->load(['cards', 'tags']));
    }

    public function update(Request $request, Deck $deck)
    {
        $this->authorize('update', $deck);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'is_favorite' => 'sometimes|boolean',
            'tags' => 'nullable|array',
        ]);

        $deck->update($validatedData);

        if (isset($validatedData['tags'])) {
            $deck->tags()->sync($validatedData['tags']);
        }

        return response()->json($deck->load('tags'));
    }

    public function destroy(Deck $deck)
    {
        $this->authorize('delete', $deck);
        $deck->delete();
        return response()->json(null, 204);
    }
}
