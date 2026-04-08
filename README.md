# INDA BPS Provinsi Sumatera Utara

**Intelligent Data Assistant**

Aplikasi chatbot berbasis AI Agent yang membantu pengguna dalam mengakses dan menganalisis data statistik BPS Provinsi Sumatera Utara.
Proyek ini dikhususkan untuk mencari dan menampilkan data secara efisien dan efektif untuk keperluan kebutuhan data.

# Fokus saat ini

Pada saat ini proyek menampilkan data secara tertulis maupun dalam bentuk file berupa excel.

# Fitur yang ada

Adapun fitur yang tersedia pada produk saat ini adalah:

- Menyediakan data tabel statistik selama 5 tahun terakhir dari BPS Provinsi Sumatera Utara
- Menyediakan data untuk diunduh dalam bentuk file excel
- Sinkronisasi data dari API BPS khusus BPS Provinsi Sumatera Utara
- Mengambil data statistik secara umum (data tidak spesifik dari tabel statistik) dari Google Search API
- Monitoring penggunaan layanan, termasuk total pengguna, distribusi input dan output token, penggunaan token per pengguna beserta biayanya, serta aktivitas pengguna dalam waktu 24 jam terakhir

# Teknologi yang digunakan

- Next.js 16.0.7
- React 19.2.1
- Prisma 6.0.1
- NextAuth 4.24.10
- Lucide-react 0.555.0
- Tailwind CSS 4
- TypeScript
- PostgreSQL

# Struktur Proyek Saat Ini

Proyek ini terdiri atas dua bagian/fokus utama pada direktori root, yaitu:

1. **`frontend/`**
   - Web App utama berbasis Next.js (App Router)
   - Mengurus UI/UX dan interaksi pengguna terhadap chatbot (AI Agent)
   - Mengatur *Authentication* menggunakan `NextAuth` dengan metode login Google
   - Mengelola serta membaca basis data menggunakan `Prisma ORM` ke PostgreSQL

2. **`backend/`**
   - Digunakan untuk pipeline pemrosesan *backend* berbasis Python
   - Sinkronisasi data ke API BPS dan Google Search API

# Cara Menjalankan Proyek Secara Lokal

### Prasyarat
- **Node.js** (versi 18+)
- **PostgreSQL** (Disarankan menggunakan layanan seperti Supabase)
- **Akun Google Cloud Console** (untuk setelan `Google Provider` / OAuth 2.0)
- **Redis (Upstash)** (Digunakan untuk pembatasan kuota dan caching)

### Langkah Pemasangan (Frontend)

1. **Memasuki direktori Frontend**
   Pastikan Anda berada di direktori `frontend`.
   ```bash
   cd frontend
   ```

2. **Instalasi Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan (`.env`)**
   Buat file `.env` di dalam folder `frontend`, dan sesuaikan konfigurasi sesuai file `.env.example` terdekat yang ada jika tersedia, atau sesuaikan bagian ini:
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   NEXTAUTH_SECRET="rahasia_anda_disini"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="google_client_id_anda"
   GOOGLE_CLIENT_SECRET="google_client_secret_anda"
   REDIS_URL="redis_url_anda"
   ```

4. **Sinkronisasi Database dengan Prisma**
   Sinkronkan skema lokal dengan database Supabase PostgreSQL:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Jalankan *Development Server***
   ```bash
   npm run dev
   ```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk mengakses dan mengembangkan aplikasi INDA.

# Kontribusi
Setiap bentuk kontribusi dan ide dari komunitas *open-source* sangat dihargai dalam rangka membangun asisten pengolahan data BPS yang semakin baik. Silakan buat *pull request* atau buka *issue* jika Anda menemukan bug.
