<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id",
        "action",
        "description",
        "ip_address",
        "user_agent",
        "old_values",
        "new_values",
        "model_type",
        "model_id",
        "timestamp",
    ];

    protected $casts = [
        "old_values" => "array",
        "new_values" => "array",
        "timestamp" => "datetime",
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
