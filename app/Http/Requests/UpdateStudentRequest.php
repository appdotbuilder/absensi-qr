<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
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
        $studentId = $this->route('student')->id;

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $studentId,
            'nisn' => 'required|string|unique:users,nisn,' . $studentId . '|max:20',
            'class' => 'required|string|max:50',
            'password' => 'nullable|string|min:8',
            'regenerate_qr' => 'nullable|boolean',
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
            'name.required' => 'Student name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered to another student.',
            'nisn.required' => 'NISN is required.',
            'nisn.unique' => 'This NISN is already registered to another student.',
            'class.required' => 'Class is required.',
            'password.min' => 'Password must be at least 8 characters.',
        ];
    }
}