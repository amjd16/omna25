<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Circular extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "circular_number",
        "content",
        "issue_date",
        "published_by_user_id",
        "is_active",
        "attachment_path",
    ];

    protected $casts = [
        "issue_date" => "date",
        "is_active" => "boolean",
    ];

    public function publishedByUser()
    {
        return $this->belongsTo(User::class, "published_by_user_id");
    }
}
