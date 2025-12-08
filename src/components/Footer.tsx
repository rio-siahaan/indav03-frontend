"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#002B6A] text-white pt-16 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column: Address & Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-6">
               <Image 
                 src="/logo-bps.webp" 
                 alt="Logo BPS" 
                 width={48} 
                 height={48} 
                 className="object-contain"
               />
               <div className="font-bold text-2xl tracking-wider italic">BADAN PUSAT STATISTIK</div>
            </div>
            
            <div className="space-y-1 text-blue-100 text-sm leading-relaxed">
              <p>Badan Pusat Statistik Provinsi Sumatera Utara (BPS-Statistics Sumatera Utara Province)</p>
              <p>Jl. Asrama No. 179 Medan 20123 Indonesia</p>
              <p>Telp (62-61) 8452343</p>
              <p>Faks (62-61) 8452773</p>
              <p>Mailbox : pst1200@bps.go.id</p>
            </div>

            <div className="flex gap-6 text-sm mt-6 font-medium">
              <Link href="https://manual-website-bps.readthedocs.io/id/latest/" className="hover:text-blue-300 underline underline-offset-4">Manual</Link>
              <Link href="https://sumut.bps.go.id/id/term-of-use" className="hover:text-blue-300 underline underline-offset-4">S&K</Link>
              <Link href="https://sumut.bps.go.id/id/tautan" className="hover:text-blue-300 underline underline-offset-4">Daftar Tautan</Link>
            </div>
          </div>

          {/* Middle Column: Tentang Kami */}
          <div className="md:col-span-3 md:pl-12 pt-4">
            <h3 className="text-lg font-bold mb-6">Tentang Kami</h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              <li><a href="https://ppid.bps.go.id/app/konten/1200/Profil-BPS.html?_gl=1*r5hzky*_ga*NjAxODM4NTM4LjE3NjM4ODA3NTg.*_ga_XXTTVXWHDB*czE3NjQ1NzU3ODIkbzQkZzEkdDE3NjQ1Nzc3MTAkajkkbDAkaDA." className="hover:text-white hover:underline decoration-blue-400 underline-offset-4 transition-all">Profil BPS</a></li>
              <li><a href="https://ppid.bps.go.id/?mfd=1200&_gl=1*r5hzky*_ga*NjAxODM4NTM4LjE3NjM4ODA3NTg.*_ga_XXTTVXWHDB*czE3NjQ1NzU3ODIkbzQkZzEkdDE3NjQ1Nzc3MTAkajkkbDAkaDA." className="hover:text-white hover:underline decoration-blue-400 underline-offset-4 transition-all">PPID</a></li>
              <li><a href="https://ppid.bps.go.id/app/konten/0000/Layanan-BPS.html?_gl=1*r5hzky*_ga*NjAxODM4NTM4LjE3NjM4ODA3NTg.*_ga_XXTTVXWHDB*czE3NjQ1NzU3ODIkbzQkZzEkdDE3NjQ1Nzc3MTAkajkkbDAkaDA.#pills-3" className="hover:text-white hover:underline decoration-blue-400 underline-offset-4 transition-all">Kebijakan Diseminasi</a></li>
            </ul>
          </div>

          {/* Right Column: BerAKHLAK */}
          <div className="md:col-span-4 pt-4 flex items-start justify-start">
            <div className="bg-white rounded-xl py-4 px-6 w-full max-w-sm">
               <Image 
                 src="/BerAkhlak.webp" 
                 alt="BerAKHLAK" 
                 width={400} 
                 height={100} 
                 className="object-contain w-full h-auto" 
               />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
