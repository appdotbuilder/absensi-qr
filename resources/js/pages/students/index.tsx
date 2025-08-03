import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

interface Student {
    id: number;
    name: string;
    email: string;
    nisn: string;
    class: string;
    qr_code: string;
    created_at: string;
}

interface Props {
    students: {
        data: Student[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            total: number;
        };
    };
    classes: string[];
    filters: {
        search?: string;
        class?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Siswa', href: '/students' },
];

export default function StudentsIndex({ students, classes, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">👨‍🎓 Data Siswa</h1>
                        <p className="text-muted-foreground">
                            Kelola data siswa dan QR code kehadiran
                        </p>
                    </div>
                    <Link href="/students/create">
                        <Button>➕ Tambah Siswa</Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                            <span className="text-2xl">👥</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{students.meta?.total || 0}</div>
                            <p className="text-xs text-muted-foreground">Siswa terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                            <span className="text-2xl">🏫</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{classes.length}</div>
                            <p className="text-xs text-muted-foreground">Kelas aktif</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">QR Code</CardTitle>
                            <span className="text-2xl">📱</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{students.data.length}</div>
                            <p className="text-xs text-muted-foreground">QR Code aktif</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>🔍 Filter Siswa</CardTitle>
                        <CardDescription>Cari siswa berdasarkan nama, NISN, atau kelas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 flex-wrap">
                            <input
                                type="text"
                                placeholder="Cari nama atau NISN..."
                                className="flex-1 min-w-[200px] px-3 py-2 border rounded-md"
                                defaultValue={filters.search || ''}
                            />
                            <select 
                                className="px-3 py-2 border rounded-md"
                                defaultValue={filters.class || ''}
                            >
                                <option value="">Semua Kelas</option>
                                {classes.map((className) => (
                                    <option key={className} value={className}>
                                        {className}
                                    </option>
                                ))}
                            </select>
                            <Button variant="outline">🔍 Cari</Button>
                            <Button variant="outline">🔄 Reset</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Students List */}
                <Card>
                    <CardHeader>
                        <CardTitle>📋 Daftar Siswa</CardTitle>
                        <CardDescription>
                            Menampilkan {students.data.length} dari {students.meta?.total || 0} siswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {students.data.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold">
                                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{student.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                NISN: {student.nisn} • {student.email}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <Badge variant="outline">{student.class}</Badge>
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {student.qr_code}
                                        </Badge>
                                        <div className="flex space-x-2">
                                            <Link href={`/students/${student.id}`}>
                                                <Button variant="outline" size="sm">
                                                    👁️ Lihat
                                                </Button>
                                            </Link>
                                            <Link href={`/students/${student.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    ✏️ Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {students.data.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">Tidak ada siswa ditemukan</p>
                                    <Link href="/students/create" className="mt-4 inline-block">
                                        <Button>➕ Tambah Siswa Pertama</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination would go here */}
                        {students.links && students.links.length > 3 && (
                            <div className="flex justify-center mt-6 space-x-2">
                                {students.links.map((link, index: number) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        disabled={!link.url}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}