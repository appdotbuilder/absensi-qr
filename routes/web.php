<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Welcome page - showcases the attendance system
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Student management routes
    Route::resource('students', StudentController::class);

    // Teacher management routes
    Route::resource('teachers', TeacherController::class);

    // Attendance management routes
    Route::resource('attendances', AttendanceController::class);
    
    // QR Scanner route (using create with scan parameter)
    Route::get('scan', function () {
        return redirect()->route('attendances.create', ['method' => 'scan']);
    })->name('attendances.scan');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';