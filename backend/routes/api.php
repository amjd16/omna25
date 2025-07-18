<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotaryHeadController;
use App\Http\Controllers\NotaryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// مسارات المصادقة (غير محمية)
Route::post('/login', [AuthController::class, 'login']);

// مسارات محمية بالمصادقة
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // مسارات مدير النظام فقط
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'مرحباً بك في لوحة تحكم مدير النظام']);
        });
    });
    
    // مسارات رئيس قلم التوثيق
    Route::middleware('role:notary_head,admin')->prefix('notary-head')->group(function () {
        Route::get('/dashboard', [NotaryHeadController::class, 'dashboard']);
        Route::get('/notaries', [NotaryHeadController::class, 'getNotaries']);
        Route::post('/notaries', [NotaryHeadController::class, 'storeNotary']);
        Route::put('/notaries/{id}', [NotaryHeadController::class, 'updateNotary']);
        Route::get('/performance-report', [NotaryHeadController::class, 'getPerformanceReport']);
    });
    
    // مسارات الأمين الشرعي
    Route::middleware('role:notary,admin')->prefix('notary')->group(function () {
        Route::get('/dashboard', [NotaryController::class, 'dashboard']);
        Route::get('/documents', [NotaryController::class, 'documents']);
        Route::post('/documents', [NotaryController::class, 'createDocument']);
        Route::get('/documents/{id}', [NotaryController::class, 'showDocument']);
        Route::put('/documents/{id}', [NotaryController::class, 'updateDocument']);
        Route::delete('/documents/{id}', [NotaryController::class, 'deleteDocument']);
        Route::post('/documents/{id}/submit', [NotaryController::class, 'submitDocument']);
        Route::get('/document-types', [NotaryController::class, 'documentTypes']);
        Route::get('/profile', [NotaryController::class, 'profile']);
        Route::put('/profile', [NotaryController::class, 'updateProfile']);
    });
});
