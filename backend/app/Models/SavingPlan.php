<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavingPlan extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'target_amount'
    ];

    protected $with = ['contributions'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contributions()
    {
        return $this->hasMany(SavingContribution::class);
    }
}
