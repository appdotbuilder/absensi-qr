<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Display a listing of teachers.
     */
    public function index(Request $request)
    {
        $query = User::teachers();

        // Search by name or teacher ID
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('teacher_id', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by position
        if ($request->position) {
            $query->where('position', $request->position);
        }

        $teachers = $query->orderBy('name')->paginate(20);
        $positions = User::teachers()->distinct()->pluck('position')->filter()->sort()->values();

        return Inertia::render('teachers/index', [
            'teachers' => $teachers,
            'positions' => $positions,
            'filters' => $request->only(['search', 'position']),
        ]);
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create()
    {
        $positions = ['Wali Kelas', 'Mata Pelajaran', 'Pembina Halaqoh', 'Pembina Eskul'];

        return Inertia::render('teachers/create', [
            'positions' => $positions,
        ]);
    }

    /**
     * Store a newly created teacher.
     */
    public function store(StoreTeacherRequest $request)
    {
        $teacher = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password ?? 'password123'),
            'role' => 'teacher',
            'teacher_id' => $request->teacher_id,
            'position' => $request->position,
            'subject' => $request->subject,
        ]);

        return redirect()->route('teachers.show', $teacher)
            ->with('success', 'Teacher created successfully.');
    }

    /**
     * Display the specified teacher.
     */
    public function show(User $teacher)
    {
        $teacher->load(['recordedAttendances' => function ($query) {
            $query->with('student')->orderBy('created_at', 'desc')->limit(10);
        }]);

        return Inertia::render('teachers/show', [
            'teacher' => $teacher,
        ]);
    }

    /**
     * Show the form for editing the specified teacher.
     */
    public function edit(User $teacher)
    {
        $positions = ['Wali Kelas', 'Mata Pelajaran', 'Pembina Halaqoh', 'Pembina Eskul'];

        return Inertia::render('teachers/edit', [
            'teacher' => $teacher,
            'positions' => $positions,
        ]);
    }

    /**
     * Update the specified teacher.
     */
    public function update(UpdateTeacherRequest $request, User $teacher)
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'teacher_id' => $request->teacher_id,
            'position' => $request->position,
            'subject' => $request->subject,
        ];

        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $teacher->update($data);

        return redirect()->route('teachers.show', $teacher)
            ->with('success', 'Teacher updated successfully.');
    }

    /**
     * Remove the specified teacher.
     */
    public function destroy(User $teacher)
    {
        $teacher->delete();

        return redirect()->route('teachers.index')
            ->with('success', 'Teacher deleted successfully.');
    }
}