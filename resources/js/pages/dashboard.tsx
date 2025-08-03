import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

interface Props {
    user_role: 'admin' | 'teacher' | 'student';
    stats: {
        [key: string]: number;
    };
    recent_attendances?: Array<{
        id: number;
        student: {
            name: string;
            nisn?: string;
            class?: string;
        };
        teacher?: {
            name: string;
        };
        attendance_date: string;
        status: string;
        method: string;
        created_at: string;
    }>;
    managed_students?: Array<{
        id: number;
        name: string;
        nisn: string;
        class: string;
    }>;
    attendances?: Array<{
        id: number;
        attendance_date: string;
        status: string;
        teacher: {
            name: string;
        };
    }>;
    qr_code?: string;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ 
    user_role, 
    stats, 
    recent_attendances = [], 
    managed_students = [],
    attendances = [],
    qr_code 
}: Props) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            present: "default",
            late: "secondary", 
            absent: "destructive",
            excused: "outline"
        };
        
        const labels: Record<string, string> = {
            present: "Hadir",
            late: "Terlambat",
            absent: "Tidak Hadir", 
            excused: "Izin"
        };

        return (
            <Badge variant={variants[status] || "default"}>
                {labels[status] || status}
            </Badge>
        );
    };

    const renderAdminDashboard = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                        <span className="text-2xl">👨‍🎓</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_students || 0}</div>
                        <p className="text-xs text-muted-foreground">Siswa terdaftar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
                        <span className="text-2xl">👨‍🏫</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_teachers || 0}</div>
                        <p className="text-xs text-muted-foreground">Guru aktif</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kehadiran Hari Ini</CardTitle>
                        <span className="text-2xl">📊</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.today_attendance || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Hadir: {stats.present_today || 0} | Tidak: {stats.absent_today || 0}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                        <span className="text-2xl">🏫</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_classes || 0}</div>
                        <p className="text-xs text-muted-foreground">Kelas aktif</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>🚀 Aksi Cepat</CardTitle>
                    <CardDescription>Kelola sistem kehadiran dengan mudah</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Link href="/students">
                            <Button className="w-full" variant="outline">
                                👨‍🎓 Kelola Siswa
                            </Button>  
                        </Link>
                        <Link href="/teachers">
                            <Button className="w-full" variant="outline">
                                👨‍🏫 Kelola Guru
                            </Button>
                        </Link>
                        <Link href="/attendances">
                            <Button className="w-full" variant="outline">
                                📊 Lihat Absensi
                            </Button>
                        </Link>
                        <Link href="/scan">
                            <Button className="w-full">
                                📱 Scan QR Code
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Attendances */}
            <Card>
                <CardHeader>
                    <CardTitle>📋 Kehadiran Terbaru</CardTitle>
                    <CardDescription>10 record kehadiran terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recent_attendances.map((attendance) => (
                            <div key={attendance.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">{attendance.student.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {attendance.student.class} • {attendance.student.nisn}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(attendance.status)}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(attendance.attendance_date).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recent_attendances.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                                Belum ada data kehadiran
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderTeacherDashboard = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Siswa Dikelola</CardTitle>
                        <span className="text-2xl">👥</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.managed_students || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Siswa dalam kelas ({managed_students.length} total)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absen Hari Ini</CardTitle>
                        <span className="text-2xl">📊</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.today_attendance || 0}</div>
                        <p className="text-xs text-muted-foreground">Yang sudah diabsen</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hadir</CardTitle>
                        <span className="text-2xl">✅</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.present_today || 0}</div>
                        <p className="text-xs text-muted-foreground">Siswa hadir</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
                        <span className="text-2xl">❌</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.absent_today || 0}</div>
                        <p className="text-xs text-muted-foreground">Siswa absen</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>⚡ Aksi Cepat</CardTitle>
                    <CardDescription>Tools untuk guru</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Link href="/scan">
                            <Button className="w-full">
                                📱 Scan QR Siswa
                            </Button>
                        </Link>
                        <Link href="/attendances/create">
                            <Button className="w-full" variant="outline">
                                ✅ Absen Manual
                            </Button>
                        </Link>
                        <Link href="/attendances">
                            <Button className="w-full" variant="outline">
                                📊 Lihat Rekap
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>📋 Aktivitas Terbaru</CardTitle>
                    <CardDescription>Kehadiran yang Anda catat</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recent_attendances.map((attendance) => (
                            <div key={attendance.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">{attendance.student.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {attendance.student.class}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(attendance.status)}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(attendance.attendance_date).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recent_attendances.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                                Belum ada aktivitas absensi
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderStudentDashboard = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hadir</CardTitle>
                        <span className="text-2xl">✅</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.total_present || 0}</div>
                        <p className="text-xs text-muted-foreground">Hari ini bulan</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
                        <span className="text-2xl">⏰</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.total_late || 0}</div>
                        <p className="text-xs text-muted-foreground">Kali terlambat</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
                        <span className="text-2xl">❌</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.total_absent || 0}</div>
                        <p className="text-xs text-muted-foreground">Hari tidak hadir</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Izin</CardTitle>
                        <span className="text-2xl">📋</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.total_excused || 0}</div>
                        <p className="text-xs text-muted-foreground">Hari izin</p>
                    </CardContent>
                </Card>
            </div>

            {/* QR Code */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>📱 QR Code Saya</CardTitle>
                        <CardDescription>Tunjukkan kepada guru untuk absensi</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <div className="bg-gray-100 p-8 rounded-lg mb-4">
                            <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                                <span className="text-6xl">📱</span>
                            </div>
                        </div>
                        <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                            {qr_code || 'QR-CODE-HERE'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            ID QR unik untuk kehadiran
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>📊 Statistik Bulan Ini</CardTitle>
                        <CardDescription>Ringkasan kehadiran Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Tingkat Kehadiran</span>
                                <span className="font-bold text-green-600">
                                    {stats.total_present && (stats.total_present + stats.total_absent + stats.total_late + stats.total_excused) > 0
                                        ? Math.round((stats.total_present / (stats.total_present + stats.total_absent + stats.total_late + stats.total_excused)) * 100)
                                        : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{
                                        width: `${stats.total_present && (stats.total_present + stats.total_absent + stats.total_late + stats.total_excused) > 0
                                            ? Math.round((stats.total_present / (stats.total_present + stats.total_absent + stats.total_late + stats.total_excused)) * 100)
                                            : 0}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Attendance */}
            <Card>
                <CardHeader>
                    <CardTitle>📋 Riwayat Kehadiran</CardTitle>
                    <CardDescription>20 kehadiran terakhir</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {attendances.map((attendance) => (
                            <div key={attendance.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">
                                        {new Date(attendance.attendance_date).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Dicatat oleh: {attendance.teacher.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(attendance.status)}
                                </div>
                            </div>
                        ))}
                        {attendances.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                                Belum ada data kehadiran
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderDashboardContent = () => {
        switch (user_role) {
            case 'admin':
                return renderAdminDashboard();
            case 'teacher':
                return renderTeacherDashboard();
            case 'student':
                return renderStudentDashboard();
            default:
                return <div>Role tidak dikenali</div>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">
                        {user_role === 'admin' && '🛡️ Dashboard Admin'}
                        {user_role === 'teacher' && '👨‍🏫 Dashboard Guru'}
                        {user_role === 'student' && '👨‍🎓 Dashboard Siswa'}
                    </h1>
                    <p className="text-muted-foreground">
                        {user_role === 'admin' && 'Kelola sistem kehadiran sekolah'}
                        {user_role === 'teacher' && 'Pantau dan catat kehadiran siswa'}
                        {user_role === 'student' && 'Lihat riwayat kehadiran dan QR code Anda'}
                    </p>
                </div>

                {renderDashboardContent()}
            </div>
        </AppLayout>
    );
}