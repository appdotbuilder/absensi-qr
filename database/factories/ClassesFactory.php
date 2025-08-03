<?php

namespace Database\Factories;

use App\Models\Classes;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Classes>
 */
class ClassesFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Classes>
     */
    protected $model = Classes::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gradeLevel = $this->faker->randomElement(['X', 'XI', 'XII']);
        $program = $this->faker->randomElement(['IPA', 'IPS', 'Bahasa']);
        $classNumber = $this->faker->numberBetween(1, 3);
        
        return [
            'name' => "{$gradeLevel}-{$program}-{$classNumber}",
            'grade_level' => $gradeLevel,
            'program' => $program,
            'homeroom_teacher_id' => User::factory()->state(['role' => 'teacher']),
            'capacity' => $this->faker->numberBetween(25, 35),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}