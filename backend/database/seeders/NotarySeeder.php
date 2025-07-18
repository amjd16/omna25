<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Notary;
use App\Models\GeographicalArea;
use App\Models\DocumentType;
use App\Models\Document;
use App\Models\Party;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class NotarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء أنواع الوثائق إذا لم تكن موجودة
        $documentTypes = [
            ['name' => 'عقد بيع', 'description' => 'عقد بيع العقارات والممتلكات', 'is_active' => true],
            ['name' => 'وكالة عامة', 'description' => 'وكالة عامة في جميع الأمور', 'is_active' => true],
            ['name' => 'وكالة خاصة', 'description' => 'وكالة خاصة في أمر محدد', 'is_active' => true],
            ['name' => 'إقرار', 'description' => 'إقرار شخصي', 'is_active' => true],
            ['name' => 'عقد زواج', 'description' => 'عقد زواج شرعي', 'is_active' => true],
            ['name' => 'صك طلاق', 'description' => 'صك طلاق شرعي', 'is_active' => true],
            ['name' => 'قسمة مواريث', 'description' => 'قسمة المواريث الشرعية', 'is_active' => true],
        ];

        foreach ($documentTypes as $type) {
            DocumentType::firstOrCreate(['name' => $type['name']], $type);
        }

        // الحصول على المناطق الجغرافية
        $areas = GeographicalArea::all();
        
        if ($areas->isEmpty()) {
            // إنشاء مناطق تجريبية إذا لم تكن موجودة
            $testArea = GeographicalArea::create([
                'name' => 'مديرية التحرير',
                'type' => 'district',
                'parent_id' => null,
            ]);
            $areas = collect([$testArea]);
        }

        // إنشاء مستخدمين وأمناء تجريبيين
        $notariesData = [
            [
                'user' => [
                    'username' => 'notary_ahmed',
                    'password' => Hash::make('password'),
                ],
                'notary' => [
                    'full_name' => 'أحمد محمد الشامي',
                    'id_number' => '123456789',
                    'phone' => '777123456',
                    'email' => 'ahmed@example.com',
                    'appointment_date' => '2024-01-15',
                    'status' => 'active',
                    'notes' => 'بكالوريوس شريعة وقانون - جامعة صنعاء. التخصص: الأحوال الشخصية، العقود التجارية',
                ]
            ],
            [
                'user' => [
                    'username' => 'notary_fatima',
                    'password' => Hash::make('password'),
                ],
                'notary' => [
                    'full_name' => 'فاطمة علي الحداد',
                    'id_number' => '987654321',
                    'phone' => '777987654',
                    'email' => 'fatima@example.com',
                    'appointment_date' => '2024-02-20',
                    'status' => 'active',
                    'notes' => 'ماجستير فقه وأصول - جامعة الإيمان. التخصص: المواريث، الوقف والوصايا',
                ]
            ],
            [
                'user' => [
                    'username' => 'notary_mohammed',
                    'password' => Hash::make('password'),
                ],
                'notary' => [
                    'full_name' => 'محمد سالم الأهدل',
                    'id_number' => '456789123',
                    'phone' => '777456789',
                    'email' => 'mohammed@example.com',
                    'appointment_date' => '2024-03-10',
                    'status' => 'active',
                    'notes' => 'بكالوريوس شريعة - جامعة الأزهر. التخصص: العقود العقارية، التحكيم',
                ]
            ]
        ];

        foreach ($notariesData as $data) {
            // التحقق من وجود المستخدم أولاً
            $existingUser = User::where('username', $data['user']['username'])->first();
            
            if ($existingUser) {
                // إذا كان المستخدم موجود، تخطي هذا السجل
                continue;
            }
            
            // إنشاء المستخدم
            $user = User::create($data['user']);
            
            // ربط المستخدم بدور الأمين
            $notaryRole = DB::table('roles')->where('name', 'notary')->first();
            if ($notaryRole) {
                DB::table('user_roles')->insert([
                    'user_id' => $user->id,
                    'role_id' => $notaryRole->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // إنشاء بيانات الأمين
            $notaryData = $data['notary'];
            $notaryData['user_id'] = $user->id;
            $notaryData['geographical_area_id'] = $areas->random()->id;
            
            $notary = Notary::create($notaryData);

            // إنشاء وثائق تجريبية للأمين
            $this->createSampleDocuments($notary, $user);
        }
    }

    private function createSampleDocuments($notary, $user)
    {
        $documentTypes = DocumentType::all();
        
        if ($documentTypes->isEmpty()) {
            return;
        }

        // إنشاء وثائق تجريبية
        $documentsData = [
            [
                'title' => 'عقد بيع منزل في شارع الزبيري',
                'content' => 'عقد بيع منزل سكني مساحته 200 متر مربع واقع في شارع الزبيري بصنعاء',
                'fees' => 1000,
                'status' => 'completed',
                'parties' => [
                    ['name' => 'علي أحمد محمد', 'id_number' => '111222333', 'role' => 'البائع', 'phone' => '777111222'],
                    ['name' => 'سعد محمد علي', 'id_number' => '444555666', 'role' => 'المشتري', 'phone' => '777444555'],
                ]
            ],
            [
                'title' => 'وكالة عامة لإدارة الأعمال',
                'content' => 'وكالة عامة في إدارة جميع الأعمال التجارية والمالية',
                'fees' => 500,
                'status' => 'draft',
                'parties' => [
                    ['name' => 'خالد سالم أحمد', 'id_number' => '777888999', 'role' => 'الموكل', 'phone' => '777777888'],
                    ['name' => 'نبيل محمد سالم', 'id_number' => '111333555', 'role' => 'الوكيل', 'phone' => '777111333'],
                ]
            ],
            [
                'title' => 'إقرار استلام مبلغ مالي',
                'content' => 'إقرار باستلام مبلغ 50,000 ريال يمني كدفعة أولى لشراء سيارة',
                'fees' => 200,
                'status' => 'draft',
                'parties' => [
                    ['name' => 'أمين عبدالله محمد', 'id_number' => '222444666', 'role' => 'المقر', 'phone' => '777222444'],
                ]
            ]
        ];

        foreach ($documentsData as $docData) {
            // اختيار نوع وثيقة مناسب
            $documentType = $documentTypes->where('name', 'like', '%' . explode(' ', $docData['title'])[0] . '%')->first();
            if (!$documentType) {
                $documentType = $documentTypes->random();
            }

            // إنشاء رقم الوثيقة
            $reference_number = 'DOC-' . date('Y') . '-' . str_pad(
                Document::whereYear('created_at', date('Y'))->count() + 1, 
                6, 
                '0', 
                STR_PAD_LEFT
            );

            // إنشاء الوثيقة
            $document = Document::create([
                'document_type_id' => $documentType->id,
                'notary_id' => $notary->id,
                'title' => $docData['title'],
                'content' => $docData['content'],
                'reference_number' => $reference_number,
                'fees' => $docData['fees'],
                'status' => $docData['status'],
                'transaction_date' => now()->subDays(rand(1, 30))->format('Y-m-d'),
                'created_at' => now()->subDays(rand(1, 30)),
            ]);

            // إضافة الأطراف
            foreach ($docData['parties'] as $partyData) {
                $party = Party::create([
                    'full_name' => $partyData['name'],
                    'id_number' => $partyData['id_number'],
                    'phone' => $partyData['phone'],
                    'address' => 'صنعاء - اليمن',
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
        }
    }
}

