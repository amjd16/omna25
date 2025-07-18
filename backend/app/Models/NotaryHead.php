<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotaryHead extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'license_number',
        'license_expiry_date',
        'address',
        'phone',
        'email',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function areas()
    {
        return $this->belongsToMany(GeographicalArea::class, 'notary_head_areas', 'notary_head_id', 'area_id');
    }

    public function notaries()
    {
        return $this->hasMany(Notary::class, 'notary_head_id');
    }
}
