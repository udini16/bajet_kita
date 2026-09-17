<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavingContribution extends Model
{
    protected $fillable = [
        'user_id',
        'saving_plan_id',
        'amount',
        'date',
        'description'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function savingPlan()
    {
        return $this->belongsTo(SavingPlan::class);
    }
}
