<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeographicalArea extends Model
{
    use HasFactory;

    protected $fillable = ["name", "type", "parent_id"];

    public function parent()
    {
        return $this->belongsTo(GeographicalArea::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(GeographicalArea::class, 'parent_id');
    }

    public function notaries()
    {
        return $this->hasMany(Notary::class, 'geographical_area_id');
    }

    public function notaryHeads()
    {
        return $this->belongsToMany(NotaryHead::class, 'notary_head_areas', 'area_id', 'notary_head_id');
    }
}
