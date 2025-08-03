import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';



const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Scan QR Code', href: '/scan' },
];

export default function AttendanceScan() {
    const [qrCode, setQrCode] = useState('');
    const [status, setStatus] = useState('present');
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{
        student: {
            name: string;
            nisn: string;
            class: string;
            qr_code: string;
        };
        attendance: {
            status: string;
            notes?: string;
        };
    } | null>(null);
    const [error, setError] = useState('');

    const handleScan = async () => {
        if (!qrCode.trim()) {
            setError('Masukkan kode QR siswa');
            return;
        }

        setIsProcessing(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/attendances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    qr_code: qrCode,
                    status: status,
                    notes: notes,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setResult(data);
                setQrCode('');
                setNotes('');
            } else {
                setError(data.message || 'Gagal memproses QR code');
            }
        } catch {
            setError('Terjadi kesalahan saat memproses QR code');
        } finally {
            setIsProcessing(false);
        }
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan QR Code" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">📱 Scan QR Code</h1>
                    <p className="text-muted-foreground">
                        Scan QR code siswa untuk mencatat kehadiran
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Scanner Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📷 QR Code Scanner</CardTitle>
                            <CardDescription>
                                Masukkan atau scan QR code siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* QR Code Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Kode QR Siswa
                                </label>
                                <input
                                    type="text"
                                    value={qrCode}
                                    onChange={(e) => setQrCode(e.target.value)}
                                    placeholder="Contoh: STD-ABC12345"
                                    className="w-full px-3 py-2 border rounded-md font-mono"
                                    disabled={isProcessing}
                                />
                            </div>

                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Status Kehadiran
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    disabled={isProcessing}
                                >
                                    <option value="present">✅ Hadir</option>
                                    <option value="late">⏰ Terlambat</option>
                                    <option value="absent">❌ Tidak Hadir</option>
                                    <option value="excused">📋 Izin</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-md"
                                    disabled={isProcessing}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-600 text-sm">❌ {error}</p>
                                </div>
                            )}

                            {/* Scan Button */}
                            <Button 
                                onClick={handleScan}
                                disabled={isProcessing || !qrCode.trim()}
                                className="w-full"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>🔄 Memproses...</>
                                ) : (
                                    <>📱 Scan & Catat Kehadiran</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Camera Preview / Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📸 Kamera QR Scanner</CardTitle>
                            <CardDescription>
                                Gunakan kamera untuk scan QR code
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📷</div>
                                    <p className="text-gray-500 mb-4">
                                        Preview kamera akan muncul di sini
                                    </p>
                                    <Button variant="outline" disabled>
                                        🎥 Aktifkan Kamera
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                <p>💡 <strong>Tips:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Pastikan QR code siswa terlihat jelas</li>
                                    <li>Arahkan kamera ke QR code</li>
                                    <li>Tunggu hingga kode terbaca otomatis</li>
                                    <li>Atau masukkan kode secara manual</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Success Result */}
                {result && (
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-800">✅ Kehadiran Berhasil Dicatat</CardTitle>
                            <CardDescription>
                                Data kehadiran telah disimpan ke sistem
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h4 className="font-semibold mb-2">👨‍🎓 Data Siswa:</h4>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Nama:</strong> {result.student?.name}</p>
                                        <p><strong>NISN:</strong> {result.student?.nisn}</p>
                                        <p><strong>Kelas:</strong> {result.student?.class}</p>
                                        <p><strong>QR Code:</strong> <code>{result.student?.qr_code}</code></p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold mb-2">📊 Data Kehadiran:</h4>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Status:</strong> {getStatusBadge(result.attendance?.status)}</p>
                                        <p><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID')}</p>
                                        <p><strong>Waktu:</strong> {new Date().toLocaleTimeString('id-ID')}</p>
                                        <p><strong>Metode:</strong> QR Scan</p>
                                        {result.attendance?.notes && (
                                            <p><strong>Catatan:</strong> {result.attendance.notes}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>⚡ Aksi Cepat</CardTitle>
                        <CardDescription>Navigasi ke fitur lainnya</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => router.visit('/attendances')}
                            >
                                📊 Lihat Rekap
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => router.visit('/attendances/create')}
                            >
                                ✅ Absen Manual
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => router.visit('/students')}
                            >
                                👨‍🎓 Data Siswa
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => router.visit('/dashboard')}
                            >
                                🏠 Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}