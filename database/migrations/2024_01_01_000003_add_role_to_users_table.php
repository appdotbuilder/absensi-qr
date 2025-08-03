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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'teacher', 'student'])->default('student')->after('email');
            $table->string('nisn')->nullable()->unique()->after('role')->comment('Student identification number');
            $table->string('teacher_id')->nullable()->unique()->after('nisn')->comment('Teacher identification number');
            $table->string('position')->nullable()->after('teacher_id')->comment('Teacher position/role');
            $table->string('subject')->nullable()->after('position')->comment('Teacher subject');
            $table->string('class')->nullable()->after('subject')->comment('Student class');
            $table->string('profile_photo')->nullable()->after('class')->comment('Profile photo path');
            $table->string('qr_code')->nullable()->unique()->after('profile_photo')->comment('Unique QR code for student');
            
            // Indexes for better performance
            $table->index('role');
            $table->index('nisn');
            $table->index('teacher_id');
            $table->index('class');
            $table->index('qr_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['nisn']);
            $table->dropIndex(['teacher_id']);
            $table->dropIndex(['class']);
            $table->dropIndex(['qr_code']);
            
            $table->dropColumn([
                'role', 'nisn', 'teacher_id', 'position', 'subject', 
                'class', 'profile_photo', 'qr_code'
            ]);
        });
    }
};