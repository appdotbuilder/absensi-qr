<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => 'nullable|exists:users,id',
            'qr_code' => 'nullable|string',
            'attendance_date' => 'nullable|date',
            'status' => 'required|in:present,absent,late,excused',
            'method' => 'required|in:qr_scan,manual_check',
            'check_in_time' => 'nullable|date',
            'notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'qr_code.string' => 'QR code must be a valid string.',
            'student_id.exists' => 'The selected student does not exist.',
            'status.required' => 'Please select attendance status.',
            'status.in' => 'Invalid attendance status selected.',
            'method.required' => 'Please select attendance method.',
            'method.in' => 'Invalid attendance method selected.',
        ];
    }
}