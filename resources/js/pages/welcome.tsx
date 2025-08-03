import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Sistem Kehadiran Siswa" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-600 to-cyan-500">
                {/* Header */}
                <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-lg">📱</span>
                                </div>
                                <span className="text-white font-bold text-xl">AttendanceQR</span>
                            </div>
                            
                            <nav className="flex items-center space-x-4">
                                {auth?.user ? (
                                    <div className="flex items-center space-x-4">
                                        <Badge variant="secondary" className="bg-white/20 text-white">
                                            {auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)}
                                        </Badge>
                                        <Link
                                            href="/dashboard"
                                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href="/login"
                                            className="text-white hover:text-white/80 font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            📱 Sistem Kehadiran
                            <br />
                            <span className="bg-gradient-to-r from-cyan-300 to-white bg-clip-text text-transparent">
                                Berbasis QR Code
                            </span>
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                            Solusi modern untuk pencatatan kehadiran siswa menggunakan teknologi QR code. 
                            Cepat, akurat, dan mudah digunakan untuk semua kalangan pendidikan.
                        </p>
                        
                        {!auth?.user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 px-8 py-3 text-lg">
                                        🚀 Mulai Sekarang
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                                        📊 Login Dashboard
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <CardTitle className="text-xl">QR Code Scanner</CardTitle>
                                <CardDescription className="text-white/70">
                                    Scan QR code siswa untuk pencatatan kehadiran instant
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>✓ QR code unik setiap siswa</li>
                                    <li>✓ Scan menggunakan kamera</li>
                                    <li>✓ Deteksi otomatis ID & nama</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <CardTitle className="text-xl">Multi-Role Access</CardTitle>
                                <CardDescription className="text-white/70">
                                    Dashboard khusus untuk Admin, Guru, dan Siswa
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>🛡️ Admin: Kelola semua data</li>
                                    <li>👨‍🏫 Guru: Absensi & laporan</li>
                                    <li>👨‍🎓 Siswa: QR code & riwayat</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <CardTitle className="text-xl">Laporan Lengkap</CardTitle>
                                <CardDescription className="text-white/70">
                                    Rekap kehadiran dengan berbagai filter dan format
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>📈 Rekap harian/bulanan</li>
                                    <li>📄 Export PDF/Excel/CSV</li>
                                    <li>🔍 Filter kelas & siswa</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <CardTitle className="text-xl">Dual Method</CardTitle>
                                <CardDescription className="text-white/70">
                                    QR Scan untuk Wali Kelas, Manual untuk Guru MP
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>📱 QR Scan: Wali Kelas</li>
                                    <li>✅ Manual: Mata Pelajaran</li>
                                    <li>🎯 Sesuai jabatan guru</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <CardTitle className="text-xl">Responsive Design</CardTitle>
                                <CardDescription className="text-white/70">
                                    Akses dari desktop maupun smartphone
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>💻 Desktop friendly</li>
                                    <li>📱 Mobile optimized</li>
                                    <li>🎨 Elegant & minimalis</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">🔒</span>
                                </div>
                                <CardTitle className="text-xl">Data Management</CardTitle>
                                <CardDescription className="text-white/70">
                                    Backup, restore, dan bulk operations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>💾 Backup otomatis</li>
                                    <li>🔄 Restore data</li>
                                    <li>📦 Bulk import/export</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            🎯 Siap Modernisasi Sistem Absensi?
                        </h2>
                        <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
                            Bergabunglah dengan sekolah-sekolah yang telah menggunakan sistem kehadiran 
                            digital. Tingkatkan efisiensi dan akurasi pencatatan kehadiran siswa.
                        </p>
                        
                        {!auth?.user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register">
                                    <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 px-8 py-3 text-lg shadow-lg">
                                        🚀 Daftar Gratis
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                                    📞 Hubungi Demo
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white/5 backdrop-blur-md border-t border-white/20 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center text-white/60">
                            <p>© 2024 AttendanceQR System. Sistem Kehadiran Siswa Berbasis QR Code.</p>
                            <p className="mt-2">Dibuat dengan ❤️ untuk kemajuan pendidikan Indonesia</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}