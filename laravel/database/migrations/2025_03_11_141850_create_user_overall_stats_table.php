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
        Schema::create('user_overall_stats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->unique();

            $table->integer('streak_days')->default(0);
            $table->date('last_study_date')->nullable();
            $table->integer('longest_streak')->default(0);
            $table->integer('total_study_days')->default(0);
            $table->bigInteger('total_study_seconds')->default(0);
            $table->integer('total_cards_studied')->default(0);

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
        Schema::dropIfExists('user_overall_stats');
    }
};
