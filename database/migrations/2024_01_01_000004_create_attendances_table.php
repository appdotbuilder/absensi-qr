<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->date('attendance_date')->comment('Date of attendance');
            $table->enum('status', ['present', 'absent', 'late', 'excused'])->default('present')->comment('Attendance status');
            $table->enum('method', ['qr_scan', 'manual_check'])->comment('Method used to record attendance');
            $table->time('check_in_time')->nullable()->comment('Time when student checked in');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['student_id', 'attendance_date']);
            $table->index(['teacher_id', 'attendance_date']);
            $table->index('attendance_date');
            $table->index('status');
            $table->index('method');
            
            // Unique constraint to prevent duplicate attendance records
            $table->unique(['student_id', 'attendance_date', 'teacher_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};