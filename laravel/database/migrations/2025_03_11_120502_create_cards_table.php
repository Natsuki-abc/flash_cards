<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('deck_id')->constrained('decks');
            $table->index(['user_id', 'deck_id']);

            $table->text('front_content');
            $table->text('back_content');
            $table->boolean('check_1')->default(false);
            $table->boolean('check_2')->default(false);
            $table->boolean('check_3')->default(false);
            $table->text('note')->nullable();
            $table->integer('position');

            $table->softDeletes();
            $table->index('deleted_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
