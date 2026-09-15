<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('type')->default('expense')->after('name');
        });

        // Insert default income categories
        DB::table('categories')->insert([
            ['name' => 'Salary', 'type' => 'income', 'color' => '#a3e635'],
            ['name' => 'Gift', 'type' => 'income', 'color' => '#fcd34d'],
            ['name' => 'Investment', 'type' => 'income', 'color' => '#60a5fa'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('categories')->where('type', 'income')->delete();
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
