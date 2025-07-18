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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // e.g., 'login', 'create_document', 'update_user'
            $table->text('description')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->json('old_values')->nullable(); // القيم القديمة
            $table->json('new_values')->nullable(); // القيم الجديدة
            $table->string('model_type')->nullable(); // نوع النموذج المتأثر
            $table->unsignedBigInteger('model_id')->nullable(); // معرف النموذج المتأثر
            $table->timestamp('timestamp');
            $table->timestamps();
            
            $table->index(['user_id', 'timestamp']);
            $table->index(['action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
