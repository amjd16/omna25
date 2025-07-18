<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        "document_id",
        "file_name",
        "file_path",
        "file_type",
        "file_size",
        "mime_type",
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }
}
