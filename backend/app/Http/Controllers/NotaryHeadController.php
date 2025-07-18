<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notary;
use App\Models\Document;
use App\Models\GeographicalArea;
use App\Models\NotaryHead;
use Illuminate\Support\Facades\Auth;

class NotaryHeadController extends Controller
{
    /**
     * لوحة تحكم رئيس قلم التوثيق
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        // الحصول على بيانات رئيس القلم
        $notaryHead = NotaryHead::where('user_id', $user->id)->first();
        
        if (!$notaryHead) {
            return response()->json(['error' => 'لم يتم العثور على بيانات رئيس القلم'], 404);
        }
        
        // الحصول على المناطق التابعة لرئيس القلم
        $areas = $notaryHead->areas;
        $areaIds = $areas->pluck('id');
        
        // إحصائيات الأمناء
        $totalNotaries = Notary::whereIn('geographical_area_id', $areaIds)->count();
        $activeNotaries = Notary::whereIn('geographical_area_id', $areaIds)
                                ->where('status', 'active')->count();
        
        // إحصائيات الوثائق
        $totalDocuments = Document::whereHas('notary', function($query) use ($areaIds) {
            $query->whereIn('geographical_area_id', $areaIds);
        })->count();
        
        $todayDocuments = Document::whereHas('notary', function($query) use ($areaIds) {
            $query->whereIn('geographical_area_id', $areaIds);
        })->whereDate('created_at', today())->count();
        
        return response()->json([
            'message' => 'مرحباً بك في لوحة تحكم رئيس قلم التوثيق',
            'notary_head' => $notaryHead,
            'areas' => $areas,
            'stats' => [
                'total_notaries' => $totalNotaries,
                'active_notaries' => $activeNotaries,
                'total_documents' => $totalDocuments,
                'today_documents' => $todayDocuments,
                'areas_count' => $areas->count()
            ]
        ]);
    }
    
    /**
     * قائمة الأمناء التابعين
     */
    public function getNotaries(Request $request)
    {
        $user = Auth::user();
        $notaryHead = NotaryHead::where('user_id', $user->id)->first();
        
        if (!$notaryHead) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }
        
        $areaIds = $notaryHead->areas->pluck('id');
        
        $notaries = Notary::whereIn('geographical_area_id', $areaIds)
                          ->with(['user', 'geographicalArea'])
                          ->paginate(10);
        
        return response()->json($notaries);
    }
    
    /**
     * إضافة أمين جديد
     */
    public function storeNotary(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'id_number' => 'required|string|unique:notaries',
            'phone' => 'required|string',
            'geographical_area_id' => 'required|exists:geographical_areas,id',
            'appointment_date' => 'required|date',
        ]);
        
        $user = Auth::user();
        $notaryHead = NotaryHead::where('user_id', $user->id)->first();
        
        // التحقق من أن المنطقة تابعة لرئيس القلم
        if (!$notaryHead->areas->contains($request->geographical_area_id)) {
            return response()->json(['error' => 'غير مصرح بإضافة أمين في هذه المنطقة'], 403);
        }
        
        $notary = Notary::create($request->all());
        
        return response()->json([
            'message' => 'تم إضافة الأمين بنجاح',
            'notary' => $notary->load(['geographicalArea'])
        ], 201);
    }
    
    /**
     * تحديث بيانات أمين
     */
    public function updateNotary(Request $request, $id)
    {
        $user = Auth::user();
        $notaryHead = NotaryHead::where('user_id', $user->id)->first();
        
        $notary = Notary::findOrFail($id);
        
        // التحقق من أن الأمين تابع لرئيس القلم
        if (!$notaryHead->areas->contains($notary->geographical_area_id)) {
            return response()->json(['error' => 'غير مصرح'], 403);
        }
        
        $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string',
            'status' => 'sometimes|in:active,inactive,suspended',
        ]);
        
        $notary->update($request->all());
        
        return response()->json([
            'message' => 'تم تحديث بيانات الأمين بنجاح',
            'notary' => $notary->load(['geographicalArea'])
        ]);
    }
    
    /**
     * الحصول على تقارير الأداء
     */
    public function getPerformanceReport(Request $request)
    {
        $user = Auth::user();
        $notaryHead = NotaryHead::where('user_id', $user->id)->first();
        
        $areaIds = $notaryHead->areas->pluck('id');
        
        // تقرير أداء الأمناء
        $notariesPerformance = Notary::whereIn('geographical_area_id', $areaIds)
            ->withCount(['documents as documents_count' => function($query) use ($request) {
                if ($request->has('from_date')) {
                    $query->whereDate('created_at', '>=', $request->from_date);
                }
                if ($request->has('to_date')) {
                    $query->whereDate('created_at', '<=', $request->to_date);
                }
            }])
            ->with('geographicalArea')
            ->get();
        
        return response()->json([
            'notaries_performance' => $notariesPerformance,
            'summary' => [
                'total_notaries' => $notariesPerformance->count(),
                'total_documents' => $notariesPerformance->sum('documents_count'),
                'average_per_notary' => $notariesPerformance->avg('documents_count')
            ]
        ]);
    }
}
