<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Food', 'color' => '#10b981'], // emerald-500
            ['name' => 'Transport', 'color' => '#3b82f6'], // blue-500
            ['name' => 'Utilities', 'color' => '#f59e0b'], // amber-500
            ['name' => 'Entertainment', 'color' => '#8b5cf6'], // violet-500
            ['name' => 'Health', 'color' => '#ef4444'], // red-500
            ['name' => 'Other', 'color' => '#6b7280'], // gray-500
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}
