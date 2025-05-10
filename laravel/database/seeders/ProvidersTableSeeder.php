<?php

namespace Database\Seeders;

use App\Models\Provider;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProvidersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Provider::create([
            'name' => 'Google',
            'is_active' => true,
        ]);

        Provider::create([
            'name' => 'Apple',
            'is_active' => true,
        ]);

        Provider::create([
            'name' => 'X',
            'is_active' => true,
        ]);

        Provider::create([
            'name' => 'LINE',
            'is_active' => true,
        ]);

        Provider::create([
            'name' => 'Facebook',
            'is_active' => true,
        ]);
    }
}
