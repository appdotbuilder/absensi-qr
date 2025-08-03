<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'teacher_id' => 'required|string|unique:users,teacher_id|max:20',
            'position' => 'required|in:Wali Kelas,Mata Pelajaran,Pembina Halaqoh,Pembina Eskul',
            'subject' => 'nullable|string|max:100',
            'password' => 'nullable|string|min:8',
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
            'name.required' => 'Teacher name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email is already registered.',
            'teacher_id.required' => 'Teacher ID is required.',
            'teacher_id.unique' => 'This Teacher ID is already registered.',
            'position.required' => 'Position is required.',
            'position.in' => 'Invalid position selected.',
            'password.min' => 'Password must be at least 8 characters.',
        ];
    }
}