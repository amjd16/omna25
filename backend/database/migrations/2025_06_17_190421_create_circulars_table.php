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
        Schema::create('circulars', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('circular_number')->unique(); // رقم التعميم
            $table->longText('content');
            $table->date('issue_date'); // تاريخ الإصدار
            $table->foreignId('published_by_user_id')->constrained('users')->onDelete('restrict');
            $table->boolean('is_active')->default(true);
            $table->string('attachment_path')->nullable(); // مسار ملف مرفق
            $table->timestamps();
            
            $table->index(['issue_date', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('circulars');
    }
};
