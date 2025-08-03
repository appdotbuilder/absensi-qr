<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     */
    public function index(Request $request)
    {
        $query = User::students()->with('classInfo');

        // Search by name or NISN
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nisn', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by class
        if ($request->class) {
            $query->where('class', $request->class);
        }

        $students = $query->orderBy('name')->paginate(20);
        $classes = User::students()->distinct()->pluck('class')->filter()->sort()->values();

        return Inertia::render('students/index', [
            'students' => $students,
            'classes' => $classes,
            'filters' => $request->only(['search', 'class']),
        ]);
    }

    /**
     * Show the form for creating a new student.
     */
    public function create()
    {
        $classes = User::students()->distinct()->pluck('class')->filter()->sort()->values();

        return Inertia::render('students/create', [
            'classes' => $classes,
        ]);
    }

    /**
     * Store a newly created student.
     */
    public function store(StoreStudentRequest $request)
    {
        $student = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password ?? 'password123'),
            'role' => 'student',
            'nisn' => $request->nisn,
            'class' => $request->class,
            'qr_code' => 'STD-' . strtoupper(Str::random(8)),
        ]);

        return redirect()->route('students.show', $student)
            ->with('success', 'Student created successfully.');
    }

    /**
     * Display the specified student.
     */
    public function show(User $student)
    {
        $student->load(['attendances' => function ($query) {
            $query->with('teacher')->orderBy('attendance_date', 'desc')->limit(10);
        }]);

        return Inertia::render('students/show', [
            'student' => $student,
        ]);
    }

    /**
     * Show the form for editing the specified student.
     */
    public function edit(User $student)
    {
        $classes = User::students()->distinct()->pluck('class')->filter()->sort()->values();

        return Inertia::render('students/edit', [
            'student' => $student,
            'classes' => $classes,
        ]);
    }



    /**
     * Remove the specified student.
     */
    public function destroy(User $student)
    {
        $student->delete();

        return redirect()->route('students.index')
            ->with('success', 'Student deleted successfully.');
    }

    /**
     * Generate new QR code for student.
     */
    public function update(UpdateStudentRequest $request, User $student)
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'nisn' => $request->nisn,
            'class' => $request->class,
        ];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        // Handle QR code regeneration
        if ($request->regenerate_qr) {
            $data['qr_code'] = 'STD-' . strtoupper(Str::random(8));
        }

        $student->update($data);

        return redirect()->route('students.show', $student)
            ->with('success', 'Student updated successfully.');
    }
}