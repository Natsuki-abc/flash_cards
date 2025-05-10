<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Card;
use App\Models\Deck;
use App\Models\Folder;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserSetting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seeder
        $this->call(ProvidersTableSeeder::class);

        // Factory
        User::factory()->count(10)
            ->has(UserSetting::factory())
            ->has(
                Folder::factory()->count(2)
                ->afterCreating(function ($folder) {
                    Deck::factory()->count(2)
                        ->state(['user_id' => $folder->user_id])
                        ->for($folder)
                        ->afterCreating(function ($deck) {
                            Card::factory()->count(5)
                                ->state(['user_id' => $deck->user_id])
                                ->for($deck)
                                ->create();
                        })
                        ->create();
                })
            )
            ->has(Tag::factory()->count(3))
            ->create();
    }
}
