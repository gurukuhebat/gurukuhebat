// Type definitions for Guruku Hebat

export interface Identitas {
  sekolah: string;
  kelas: string;
  tahun: string;
  mapel: string;
  dinasAtauYayasan: string;
  skHukum: string;
  alamat: string;
  teksKopKustom: string;
}

export interface JurnalEntry {
  id: string;
  minggu: number;
  hari: string;
  tanggal: string; // YYYY-MM-DD
  jamMulai: string; // HH:MM
  jamSelesai: string; // HH:MM
  tujuan: string;
  materi: string;
  penilaian: string;
}

export interface Siswa {
  id: string;
  nama: string;
  nisn: string;
}

export interface Komponen {
  id: string;
  nama: string;
  bobot: number;
}

// nilai[siswaId][komponenId] = number[]
export type NilaiMap = Record<string, Record<string, number[]>>;

// absensi[tanggalISO][siswaId] = status
// H = Hadir, S = Sakit, I = Izin, A = Alpa, B = Bolos
export type AbsensiStatus = "H" | "S" | "I" | "A" | "B";
export type AbsensiMap = Record<string, Record<string, AbsensiStatus>>;

export interface CatatanSiswa {
  id: string;
  siswaId: string;
  tanggal: string; // YYYY-MM-DD
  kategori: "positif" | "perlu_perhatian" | "pencapaian" | "lainnya";
  judul: string;
  isi: string;
  createdAt: string; // ISO datetime
}

export interface Aset {
  logo: string;
  logoSize: number;
  ttdKepsek: string;
  ttdGuru: string;
  stempel: string;
}

export interface PengesahanPerson {
  nama: string;
  nip: string;
}

export interface Pengesahan {
  kota: string;
  tanggal: string;
  kepsek: PengesahanPerson;
  guru: PengesahanPerson;
}

export interface Kategori {
  min: number;
  max: number;
  label: string;
  warna: string;
}

export interface TemaConfig {
  tipe: "default" | "solid" | "gradient" | "wallpaper";
  warnaSolid: string; // e.g. "#1e293b"
  warnaGradient: string; // e.g. "linear-gradient(to right, #ff7e5f, #feb47b)"
  wallpaperUrl: string; // base64
  glassOpacity: number; // 0.1 - 0.9 for cards when wallpaper is active
}

export interface Pengaturan {
  presetAktif: string;
  kategori: Kategori[];
  tema?: TemaConfig;
}

export interface AppMeta {
  schema: number;
  created: string;
  migratedFromLegacy?: boolean;
}

export interface AppData {
  identitas: Identitas;
  jurnal: JurnalEntry[];
  siswa: Siswa[];
  komponen: Komponen[];
  nilai: NilaiMap;
  absensi: AbsensiMap;
  catatan: CatatanSiswa[];
  aset: Aset;
  pengesahan: Pengesahan;
  pengaturan: Pengaturan;
  meta: AppMeta;
}

export type ViewKey =
  | "beranda"
  | "jurnal"
  | "absensi"
  | "nilai"
  | "pengaturan";
