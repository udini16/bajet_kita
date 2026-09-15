<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Income;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        $incomes = $request->user()->incomes()->with('category')->orderBy('date', 'desc')->get();
        return response()->json($incomes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $income = $request->user()->incomes()->create($validated);
        
        $income->load('category');

        return response()->json($income, 201);
    }

    public function update(Request $request, Income $income)
    {
        if ($income->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'amount' => 'sometimes|numeric|min:0.01',
            'description' => 'sometimes|string|max:255',
            'date' => 'sometimes|date',
        ]);

        $income->update($validated);
        $income->load('category');

        return response()->json($income);
    }

    public function destroy(Request $request, Income $income)
    {
        if ($income->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $income->delete();

        return response()->json(['message' => 'Income deleted']);
    }
}
