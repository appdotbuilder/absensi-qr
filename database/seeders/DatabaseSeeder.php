<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        \App\Models\User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@school.com',
            'role' => 'admin',
        ]);

        // Create sample teachers
        \App\Models\User::factory()->count(10)->teacher()->create();

        // Create sample students
        \App\Models\User::factory()->count(50)->student()->create();

        // Create sample classes
        \App\Models\Classes::factory()->count(8)->create();

        // Call attendance seeder
        $this->call([
            AttendanceSeeder::class,
        ]);
    }
}
