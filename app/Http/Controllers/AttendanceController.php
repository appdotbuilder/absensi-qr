<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendances.
     */
    public function index(Request $request)
    {
        $query = Attendance::with(['student', 'teacher']);

        // Filter by date range
        if ($request->start_date && $request->end_date) {
            $query->byDateRange($request->start_date, $request->end_date);
        } elseif ($request->date) {
            $query->byDate($request->date);
        } else {
            // Default to today
            $query->byDate(Carbon::today());
        }

        // Filter by student
        if ($request->student_id) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by class
        if ($request->class) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('class', $request->class);
            });
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $attendances = $query->orderBy('attendance_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $students = User::students()->orderBy('name')->get(['id', 'name', 'class']);
        $classes = User::students()->distinct()->pluck('class')->filter()->sort()->values();

        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
            'students' => $students,
            'classes' => $classes,
            'filters' => $request->only(['start_date', 'end_date', 'date', 'student_id', 'class', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new attendance record.
     */
    public function create()
    {
        // Check if this is a scan request
        if (request()->get('method') === 'scan') {
            return Inertia::render('attendances/scan');
        }
        
        $students = User::students()->orderBy('name')->get(['id', 'name', 'nisn', 'class']);

        return Inertia::render('attendances/create', [
            'students' => $students,
        ]);
    }

    /**
     * Store a newly created attendance record (including QR scan processing).
     */
    public function store(StoreAttendanceRequest $request)
    {
        // Handle QR code scan
        if ($request->qr_code) {
            $student = User::where('qr_code', $request->qr_code)->first();

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found with this QR code.',
                ], 404);
            }

            // Check if attendance already exists for today
            $existingAttendance = Attendance::where('student_id', $student->id)
                ->where('teacher_id', $request->user()->id)
                ->byDate(Carbon::today())
                ->first();

            if ($existingAttendance) {
                return response()->json([
                    'success' => false,
                    'message' => 'Attendance already recorded for this student today.',
                    'student' => $student,
                    'existing_attendance' => $existingAttendance,
                ], 409);
            }

            $attendance = Attendance::create([
                'student_id' => $student->id,
                'teacher_id' => $request->user()->id,
                'attendance_date' => Carbon::today(),
                'status' => $request->status,
                'method' => 'qr_scan',
                'check_in_time' => now(),
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Attendance recorded successfully.',
                'student' => $student,
                'attendance' => $attendance,
            ]);
        }

        // Handle manual attendance
        $attendance = Attendance::create([
            'student_id' => $request->student_id,
            'teacher_id' => $request->user()->id,
            'attendance_date' => $request->attendance_date ?? Carbon::today(),
            'status' => $request->status,
            'method' => $request->method ?? 'manual_check',
            'check_in_time' => $request->check_in_time ?? now(),
            'notes' => $request->notes,
        ]);

        return redirect()->route('attendances.index')
            ->with('success', 'Attendance record created successfully.');
    }

    /**
     * Display the specified attendance record.
     */
    public function show(Attendance $attendance)
    {
        $attendance->load(['student', 'teacher']);

        return Inertia::render('attendances/show', [
            'attendance' => $attendance,
        ]);
    }

    /**
     * Show the form for editing the specified attendance record.
     */
    public function edit(Attendance $attendance)
    {
        $attendance->load('student');
        $students = User::students()->orderBy('name')->get(['id', 'name', 'nisn', 'class']);

        return Inertia::render('attendances/edit', [
            'attendance' => $attendance,
            'students' => $students,
        ]);
    }

    /**
     * Update the specified attendance record.
     */
    public function update(StoreAttendanceRequest $request, Attendance $attendance)
    {
        $attendance->update([
            'student_id' => $request->student_id,
            'attendance_date' => $request->attendance_date,
            'status' => $request->status,
            'method' => $request->method,
            'check_in_time' => $request->check_in_time,
            'notes' => $request->notes,
        ]);

        return redirect()->route('attendances.show', $attendance)
            ->with('success', 'Attendance record updated successfully.');
    }

    /**
     * Remove the specified attendance record.
     */
    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return redirect()->route('attendances.index')
            ->with('success', 'Attendance record deleted successfully.');
    }
}