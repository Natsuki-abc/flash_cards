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
        Schema::create('shared_decks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('shared_with_user_id')->nullable()->constrained('users');
            $table->foreignId('deck_id')->constrained('decks');

            $table->string('share_code')->unique();
            $table->timestamp('expired_at')->nullable();
            $table->boolean('can_edit')->default(false);

            $table->softDeletes();
            $table->index('deleted_at');
            $table->timestamps();

            $table->index('share_code');
            $table->index('expired_at');

            // 特定ユーザーへの直接シェアの場合のユニーク制約
            $table->unique(['user_id', 'shared_with_user_id', 'deck_id'], 'unique_direct_share');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_decks');
    }
};
