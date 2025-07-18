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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notary_id')->constrained()->onDelete('restrict');
            $table->foreignId('document_type_id')->constrained()->onDelete('restrict');
            $table->foreignId('document_template_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->longText('content'); // المحتوى النهائي للوثيقة
            $table->date('transaction_date');
            $table->enum('status', ['draft', 'completed', 'archived'])->default('draft');
            $table->decimal('fees', 10, 2)->nullable();
            $table->string('reference_number')->unique();
            $table->json('metadata')->nullable(); // بيانات إضافية
            $table->timestamps();
            
            $table->index(['notary_id', 'status']);
            $table->index(['transaction_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
