<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Classes;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isAdmin()) {
            return $this->adminDashboard();
        } elseif ($user->isTeacher()) {
            return $this->teacherDashboard($user);
        } else {
            return $this->studentDashboard($user);
        }
    }

    /**
     * Admin dashboard data.
     */
    protected function adminDashboard()
    {
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        $stats = [
            'total_students' => User::students()->count(),
            'total_teachers' => User::teachers()->count(),
            'total_classes' => Classes::count(),
            'today_attendance' => Attendance::byDate($today)->count(),
            'week_attendance' => Attendance::where('attendance_date', '>=', $thisWeek)->count(),
            'month_attendance' => Attendance::where('attendance_date', '>=', $thisMonth)->count(),
            'present_today' => Attendance::byDate($today)->present()->count(),
            'absent_today' => Attendance::byDate($today)->absent()->count(),
            'late_today' => Attendance::byDate($today)->late()->count(),
        ];

        $recentAttendances = Attendance::with(['student', 'teacher'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('dashboard', [
            'user_role' => 'admin',
            'stats' => $stats,
            'recent_attendances' => $recentAttendances,
        ]);
    }

    /**
     * Teacher dashboard data.
     */
    protected function teacherDashboard(User $teacher)
    {
        $today = Carbon::today();
        
        // Get students based on teacher's position
        $students = collect();
        if ($teacher->position === 'Wali Kelas') {
            $students = User::students()->where('class', $teacher->subject)->get();
        } else {
            // For subject teachers, get all students (simplified)
            $students = User::students()->get();
        }

        $stats = [
            'managed_students' => $students->count(),
            'today_attendance' => Attendance::where('teacher_id', $teacher->id)
                ->byDate($today)
                ->count(),
            'present_today' => Attendance::where('teacher_id', $teacher->id)
                ->byDate($today)
                ->present()
                ->count(),
            'absent_today' => Attendance::where('teacher_id', $teacher->id)
                ->byDate($today)
                ->absent()
                ->count(),
        ];

        $recentAttendances = Attendance::with('student')
            ->where('teacher_id', $teacher->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('dashboard', [
            'user_role' => 'teacher',
            'stats' => $stats,
            'recent_attendances' => $recentAttendances,
            'managed_students' => $students,
        ]);
    }

    /**
     * Student dashboard data.
     */
    protected function studentDashboard(User $student)
    {
        $thisMonth = Carbon::now()->startOfMonth();
        
        $attendances = Attendance::where('student_id', $student->id)
            ->where('attendance_date', '>=', $thisMonth)
            ->orderBy('attendance_date', 'desc')
            ->limit(20)
            ->get();

        $stats = [
            'total_present' => $attendances->where('status', 'present')->count(),
            'total_absent' => $attendances->where('status', 'absent')->count(),
            'total_late' => $attendances->where('status', 'late')->count(),
            'total_excused' => $attendances->where('status', 'excused')->count(),
        ];

        return Inertia::render('dashboard', [
            'user_role' => 'student',
            'stats' => $stats,
            'attendances' => $attendances,
            'qr_code' => $student->qr_code,
        ]);
    }
}