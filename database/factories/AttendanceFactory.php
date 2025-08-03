<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Attendance>
     */
    protected $model = Attendance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => User::factory()->state(['role' => 'student']),
            'teacher_id' => User::factory()->state(['role' => 'teacher']),
            'attendance_date' => $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'status' => $this->faker->randomElement(['present', 'absent', 'late', 'excused']),
            'method' => $this->faker->randomElement(['qr_scan', 'manual_check']),
            'check_in_time' => $this->faker->dateTimeBetween('07:00', '10:00'),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the attendance is present.
     */
    public function present(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'present',
        ]);
    }

    /**
     * Indicate that the attendance is absent.
     */
    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'absent',
            'check_in_time' => null,
        ]);
    }

    /**
     * Indicate that the attendance is late.
     */
    public function late(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'late',
            'check_in_time' => $this->faker->dateTimeBetween('08:00', '10:00'),
        ]);
    }

    /**
     * Indicate that the attendance was via QR scan.
     */
    public function qrScan(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => 'qr_scan',
        ]);
    }

    /**
     * Indicate that the attendance was manual.
     */
    public function manual(): static
    {
        return $this->state(fn (array $attributes) => [
            'method' => 'manual_check',
        ]);
    }
}