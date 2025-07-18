<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'غير مصرح لك بالوصول'], 401);
        }

        $userRoles = $request->user()->roles->pluck('name')->toArray();
        
        if (!array_intersect($roles, $userRoles)) {
            return response()->json(['message' => 'ليس لديك صلاحية للوصول لهذا المورد'], 403);
        }

        return $next($request);
    }
}
