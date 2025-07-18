<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Notary;
use App\Models\Party;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotaryController extends Controller
{
    /**
     * عرض لوحة تحكم الأمين الشرعي
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        // البحث عن بيانات الأمين المرتبط بالمستخدم
        $notary = Notary::where('user_id', $user->id)->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        // إحصائيات الأمين
        $stats = [
            'total_documents' => Document::where('notary_id', $notary->id)->count(),
            'draft_documents' => Document::where('notary_id', $notary->id)
                                         ->where('status', 'draft')
                                         ->count(),
            'completed_documents' => Document::where('notary_id', $notary->id)
                                          ->where('status', 'completed')
                                          ->count(),
            'today_documents' => Document::where('notary_id', $notary->id)
                                       ->whereDate('created_at', today())
                                       ->count(),
            'this_month_documents' => Document::where('notary_id', $notary->id)
                                            ->whereMonth('created_at', now()->month)
                                            ->whereYear('created_at', now()->year)
                                            ->count(),
            'total_revenue' => Document::where('notary_id', $notary->id)
                                     ->where('status', 'completed')
                                     ->sum('fees'),
        ];

        // الوثائق الأخيرة
        $recent_documents = Document::where('notary_id', $notary->id)
                                  ->with(['documentType', 'parties'])
                                  ->orderBy('created_at', 'desc')
                                  ->limit(5)
                                  ->get();

        // أنواع الوثائق الأكثر استخداماً
        $popular_document_types = Document::where('notary_id', $notary->id)
                                        ->select('document_type_id', DB::raw('count(*) as count'))
                                        ->with('documentType')
                                        ->groupBy('document_type_id')
                                        ->orderBy('count', 'desc')
                                        ->limit(5)
                                        ->get();

        return response()->json([
            'notary' => $notary,
            'stats' => $stats,
            'recent_documents' => $recent_documents,
            'popular_document_types' => $popular_document_types
        ]);
    }

    /**
     * عرض قائمة الوثائق الخاصة بالأمين
     */
    public function documents(Request $request)
    {
        $user = Auth::user();
        $notary = Notary::where('user_id', $user->id)->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        $query = Document::where('notary_id', $notary->id)
                        ->with(['documentType', 'parties']);

        // فلترة حسب الحالة
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // فلترة حسب نوع الوثيقة
        if ($request->has('document_type_id') && $request->document_type_id !== '') {
            $query->where('document_type_id', $request->document_type_id);
        }

        // فلترة حسب التاريخ
        if ($request->has('date_from') && $request->date_from !== '') {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to !== '') {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // البحث في النص
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%");
            });
        }

        $documents = $query->orderBy('created_at', 'desc')
                          ->paginate(15);

        return response()->json($documents);
    }

    /**
     * إنشاء وثيقة جديدة
     */
    public function createDocument(Request $request)
    {
        $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'fees' => 'required|numeric|min:0',
            'parties' => 'required|array|min:1',
            'parties.*.name' => 'required|string|max:255',
            'parties.*.id_number' => 'required|string|max:50',
            'parties.*.phone' => 'nullable|string|max:20',
            'parties.*.address' => 'nullable|string|max:500',
            'parties.*.role' => 'required|string|max:100',
        ]);

        $user = Auth::user();
        $notary = Notary::where('user_id', $user->id)->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        DB::beginTransaction();
        
        try {
            // إنشاء رقم الوثيقة
            $document_number = 'DOC-' . date('Y') . '-' . str_pad(
                Document::whereYear('created_at', date('Y'))->count() + 1, 
                6, 
                '0', 
                STR_PAD_LEFT
            );

            // إنشاء الوثيقة
            $document = Document::create([
                'document_type_id' => $request->document_type_id,
                'notary_id' => $notary->id,
                'title' => $request->title,
                'content' => $request->content,
                'document_number' => $document_number,
                'fees' => $request->fees,
                'status' => 'draft',
                'created_by' => $user->id,
            ]);

            // إضافة الأطراف
            foreach ($request->parties as $partyData) {
                $party = Party::create([
                    'name' => $partyData['name'],
                    'id_number' => $partyData['id_number'],
                    'phone' => $partyData['phone'] ?? null,
                    'address' => $partyData['address'] ?? null,
                ]);

                // ربط الطرف بالوثيقة
                DB::table('document_parties')->insert([
                    'document_id' => $document->id,
                    'party_id' => $party->id,
                    'role' => $partyData['role'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'تم إنشاء الوثيقة بنجاح',
                'document' => $document->load(['documentType', 'parties'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'حدث خطأ أثناء إنشاء الوثيقة'], 500);
        }
    }

    /**
     * عرض تفاصيل وثيقة
     */
    public function showDocument($id)
    {
        $user = Auth::user();
        $notary = Notary::where('user_id', $user->id)->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        $document = Document::where('id', $id)
                          ->where('notary_id', $notary->id)
                          ->with(['documentType', 'parties', 'attachments'])
                          ->first();

        if (!$document) {
            return response()->json(['error' => 'لم يتم العثور على الوثيقة'], 404);
        }

        return response()->json($document);
    }

    /**
     * تحديث وثيقة
     */
    public function updateDocument(Request $request, $id)
    {
        $user = Auth::user();
        $notary = Notary::where('user_id', $user->id)->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        $document = Document::where('id', $id)
                          ->where('notary_id', $notary->id)
                          ->first();

        if (!$document) {
            return response()->json(['error' => 'لم يتم العثور على الوثيقة'], 404);
        }

        // لا يمكن تعديل الوثائق المعتمدة
        if ($document->status === 'approved') {
            return response()->json(['error' => 'لا يمكن تعديل الوثائق المعتمدة'], 403);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'fees' => 'sometimes|required|numeric|min:0',
        ]);

        $document->update($request->only(['title', 'content', 'fees']));

        return response()->json([
            'message' => 'تم تحديث الوثيقة بنجاح',
            'document' => $document->load(['documentType', 'parties'])
        ]);
    }

    /**
     * حذف وثيقة
     */
    public function deleteDocument($id)
    {
        $user = Auth::user();
        $notary = Notary::where('user_id', $user->id)->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        $document = Document::where('id', $id)
                          ->where('notary_id', $notary->id)
                          ->first();

        if (!$document) {
            return response()->json(['error' => 'لم يتم العثور على الوثيقة'], 404);
        }

        // لا يمكن حذف الوثائق المعتمدة
        if ($document->status === 'approved') {
            return response()->json(['error' => 'لا يمكن حذف الوثائق المعتمدة'], 403);
        }

        $document->delete();

        return response()->json(['message' => 'تم حذف الوثيقة بنجاح']);
    }

    /**
     * إرسال وثيقة للمراجعة
     */
    public function submitDocument($id)
    {
        $user = Auth::user();
        $notary = Notary::where('user_id', $user->id)->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        $document = Document::where('id', $id)
                          ->where('notary_id', $notary->id)
                          ->first();

        if (!$document) {
            return response()->json(['error' => 'لم يتم العثور على الوثيقة'], 404);
        }

        if ($document->status !== 'draft') {
            return response()->json(['error' => 'يمكن إرسال المسودات فقط للمراجعة'], 403);
        }

        $document->update(['status' => 'pending']);

        return response()->json([
            'message' => 'تم إرسال الوثيقة للمراجعة بنجاح',
            'document' => $document
        ]);
    }

    /**
     * عرض أنواع الوثائق المتاحة
     */
    public function documentTypes()
    {
        $documentTypes = DocumentType::where('is_active', true)
                                   ->orderBy('name')
                                   ->get();

        return response()->json($documentTypes);
    }

    /**
     * عرض الملف الشخصي للأمين
     */
    public function profile()
    {
        $user = Auth::user();
        $notary = Notary::where('user_id', $user->id)
                       ->with(['geographicalArea'])
                       ->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        return response()->json($notary);
    }

    /**
     * تحديث الملف الشخصي للأمين
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $notary = Notary::where('user_id', $user->id)->first();
        
        if (!$notary) {
            return response()->json(['error' => 'لم يتم العثور على بيانات الأمين'], 404);
        }

        $request->validate([
            'phone' => 'sometimes|nullable|string|max:20',
            'address' => 'sometimes|nullable|string|max:500',
            'email' => 'sometimes|nullable|email|max:255',
        ]);

        $notary->update($request->only(['phone', 'address', 'email']));

        return response()->json([
            'message' => 'تم تحديث الملف الشخصي بنجاح',
            'notary' => $notary
        ]);
    }
}

