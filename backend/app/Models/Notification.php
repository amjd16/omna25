<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "title",
        "message",
        "type",
        "is_read",
        "data",
        "read_at",
    ];

    protected $casts = [
        "is_read" => "boolean",
        "data" => "array",
        "read_at" => "datetime",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
