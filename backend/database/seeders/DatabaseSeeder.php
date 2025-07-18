<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        \App\Models\User::factory()->create([
            'username' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ])->roles()->attach(\App\Models\Role::where('name', 'admin')->first());

        $this->call(NotaryHeadSeeder::class);
        $this->call(NotarySeeder::class);
    }
}
