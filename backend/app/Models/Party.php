<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Party extends Model
{
    use HasFactory;

    protected $fillable = [
        "full_name",
        "id_number",
        "address",
        "phone",
        "email",
        "gender",
        "birth_date",
        "nationality",
    ];

    protected $casts = [
        "birth_date" => "date",
    ];

    public function documents()
    {
        return $this->belongsToMany(Document::class, "document_parties", "party_id", "document_id")
                    ->withPivot("role");
    }
}
