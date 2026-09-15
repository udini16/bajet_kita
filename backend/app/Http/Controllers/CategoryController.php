<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();
        if ($request->has('type')) {
            $query->where('type', $request->query('type'));
        }
        return response()->json($query->get());
    }
}
