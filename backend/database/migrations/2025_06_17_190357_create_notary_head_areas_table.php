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
        Schema::create('notary_head_areas', function (Blueprint $table) {
            $table->foreignId('notary_head_id')->constrained()->onDelete('cascade');
            $table->foreignId('area_id')->constrained('geographical_areas')->onDelete('cascade');
            $table->timestamps();
            
            $table->primary(['notary_head_id', 'area_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notary_head_areas');
    }
};
