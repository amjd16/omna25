<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'اسم المستخدم أو كلمة المرور غير صحيحة'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'حسابك غير مفعل، يرجى التواصل مع الإدارة'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        
        // تحديث آخر تسجيل دخول
        $user->update(['last_login_at' => now()]);

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'roles' => $user->roles->pluck('name'),
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'roles' => $user->roles->pluck('name'),
                'is_active' => $user->is_active,
                'last_login_at' => $user->last_login_at,
            ]
        ]);
    }
}
