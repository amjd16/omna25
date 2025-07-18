<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'license_number',
        'license_expiry_date',
        'geographical_area_id',
        'address',
        'phone',
        'email',
        'notary_head_id',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function geographicalArea()
    {
        return $this->belongsTo(GeographicalArea::class);
    }

    public function notaryHead()
    {
        return $this->belongsTo(NotaryHead::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
