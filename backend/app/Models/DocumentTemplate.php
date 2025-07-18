<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentTemplate extends Model
{
    use HasFactory;

    protected $fillable = ["document_type_id", "name", "content", "variables", "is_active"];

    protected $casts = [
        "variables" => "array",
        "is_active" => "boolean",
    ];

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
