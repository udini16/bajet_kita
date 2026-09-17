<?php

namespace App\Http\Controllers;

use App\Models\SavingPlan;
use App\Models\SavingContribution;
use Illuminate\Http\Request;

class SavingPlanController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->savingPlans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:0'
        ]);

        $plan = $request->user()->savingPlans()->create($validated);

        return response()->json($plan->load('contributions'), 201);
    }

    public function destroy(Request $request, $id)
    {
        $plan = $request->user()->savingPlans()->findOrFail($id);
        $plan->delete();

        return response()->json(null, 204);
    }

    // Handle adding funds (contributions) to a plan
    public function addFunds(Request $request, $id)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'description' => 'nullable|string|max:255'
        ]);

        $plan = $request->user()->savingPlans()->findOrFail($id);

        $contribution = $plan->contributions()->create([
            'user_id' => $request->user()->id,
            'amount' => $validated['amount'],
            'date' => $validated['date'],
            'description' => $validated['description'] ?? 'Added funds'
        ]);

        return response()->json($plan->refresh(), 201); // Return the refreshed plan with new contributions
    }
}
