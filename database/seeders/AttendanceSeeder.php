<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = User::students()->get();
        $teachers = User::teachers()->get();

        if ($students->isEmpty() || $teachers->isEmpty()) {
            return;
        }

        // Create attendance records for the last 30 days
        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::now()->subDays($i);
            
            // Skip weekends
            if ($date->isWeekend()) {
                continue;
            }

            foreach ($students->take(20) as $student) {
                // 80% chance of having attendance record
                if (random_int(1, 100) <= 80) {
                    Attendance::create([
                        'student_id' => $student->id,
                        'teacher_id' => $teachers->random()->id,
                        'attendance_date' => $date->format('Y-m-d'),
                        'status' => $this->getRandomStatus(),
                        'method' => random_int(1, 100) <= 60 ? 'qr_scan' : 'manual_check',
                        'check_in_time' => $date->copy()->setTime(
                            random_int(7, 9),
                            random_int(0, 59)
                        ),
                        'notes' => random_int(1, 100) <= 20 ? 'Catatan tambahan' : null,
                    ]);
                }
            }
        }
    }

    /**
     * Get random attendance status with realistic distribution.
     */
    protected function getRandomStatus(): string
    {
        $rand = random_int(1, 100);
        
        if ($rand <= 70) {
            return 'present';
        } elseif ($rand <= 85) {
            return 'late';
        } elseif ($rand <= 95) {
            return 'absent';
        } else {
            return 'excused';
        }
    }
}