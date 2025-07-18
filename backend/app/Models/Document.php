<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        "notary_id",
        "document_type_id",
        "document_template_id",
        "title",
        "content",
        "transaction_date",
        "status",
        "fees",
        "reference_number",
        "metadata",
    ];

    protected $casts = [
        "transaction_date" => "date",
        "metadata" => "array",
    ];

    public function notary()
    {
        return $this->belongsTo(Notary::class);
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function documentTemplate()
    {
        return $this->belongsTo(DocumentTemplate::class);
    }

    public function parties()
    {
        return $this->belongsToMany(Party::class, "document_parties", "document_id", "party_id")
                    ->withPivot("role");
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }
}
