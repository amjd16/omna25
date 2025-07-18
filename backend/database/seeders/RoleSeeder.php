<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Role::create(["name" => "admin", "description" => "مدير النظام"]);
        \App\Models\Role::create(["name" => "notary_head", "description" => "رئيس قلم التوثيق"]);
        \App\Models\Role::create(["name" => "notary", "description" => "أمين شرعي"]);
    }
}
