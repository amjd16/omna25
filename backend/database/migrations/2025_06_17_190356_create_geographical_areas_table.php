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
        Schema::create('geographical_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['محافظة', 'مديرية', 'عزلة', 'قرية']);
            $table->foreignId('parent_id')->nullable()->constrained('geographical_areas')->onDelete('cascade');
            $table->timestamps();
            
            $table->index(['type', 'parent_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geographical_areas');
    }
};
