<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\NotaryHead;
use App\Models\GeographicalArea;
use App\Models\Notary;
use Illuminate\Support\Facades\Hash;

class NotaryHeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء مستخدم رئيس قلم التوثيق
        $user = User::create([
            'username' => 'head_sanaa',
            'password' => Hash::make('password'),
        ]);

        // ربط المستخدم بدور رئيس قلم التوثيق
        $notaryHeadRole = Role::where('name', 'notary_head')->first();
        $user->roles()->attach($notaryHeadRole->id);

        // إنشاء بيانات رئيس قلم التوثيق
        $notaryHead = NotaryHead::create([
            'user_id' => $user->id,
            'full_name' => 'أحمد محمد الشامي',
            'id_number' => '01234567890',
            'phone' => '777123456',
            'email' => 'head.sanaa@moj.gov.ye',
            'appointment_date' => '2020-01-15',
            'status' => 'active'
        ]);

        // إنشاء مناطق جغرافية
        $governorate = GeographicalArea::create([
            'name' => 'محافظة صنعاء',
            'type' => 'محافظة',
            'parent_id' => null
        ]);

        $district1 = GeographicalArea::create([
            'name' => 'مديرية الثورة',
            'type' => 'مديرية',
            'parent_id' => $governorate->id
        ]);

        $district2 = GeographicalArea::create([
            'name' => 'مديرية الصافية',
            'type' => 'مديرية',
            'parent_id' => $governorate->id
        ]);

        $village1 = GeographicalArea::create([
            'name' => 'قرية الحصبة',
            'type' => 'قرية',
            'parent_id' => $district1->id
        ]);

        $village2 = GeographicalArea::create([
            'name' => 'قرية الروضة',
            'type' => 'قرية',
            'parent_id' => $district2->id
        ]);

        // ربط رئيس القلم بالمناطق
        $notaryHead->areas()->attach([$district1->id, $district2->id]);

        // إنشاء أمناء تجريبيين
        $notaries = [
            [
                'full_name' => 'محمد علي الحداد',
                'id_number' => '01111111111',
                'phone' => '777111111',
                'email' => 'notary1@example.com',
                'geographical_area_id' => $village1->id,
                'appointment_date' => '2021-03-01',
                'status' => 'active'
            ],
            [
                'full_name' => 'فاطمة أحمد السالمي',
                'id_number' => '01222222222',
                'phone' => '777222222',
                'email' => 'notary2@example.com',
                'geographical_area_id' => $village2->id,
                'appointment_date' => '2021-06-15',
                'status' => 'active'
            ],
            [
                'full_name' => 'عبدالله سالم المطري',
                'id_number' => '01333333333',
                'phone' => '777333333',
                'email' => 'notary3@example.com',
                'geographical_area_id' => $village1->id,
                'appointment_date' => '2022-01-10',
                'status' => 'inactive'
            ]
        ];

        foreach ($notaries as $notaryData) {
            Notary::create($notaryData);
        }
    }
}
