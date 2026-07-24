"use client";

import * as React from "react";
import {
  Save,
  Trash2,
  Upload,
  PenLine,
  Download,
  AlertTriangle,
  School,
  Image as ImageIcon,
  Stamp,
  FileSignature,
  CheckCircle2,
  Database,
  RotateCcw,
  Plus,
  X,
  Settings,
  Palette,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useStore } from "@/lib/store";
import { useConfirm } from "@/components/shared/confirm-dialog";
import { IdentityForm } from "@/components/shared/identity-form";
import { AssetUploadDialog } from "@/components/shared/asset-upload-dialog";
import { PRESET_BOBOT, DEFAULT_KATEGORI } from "@/lib/bobot";
import type { Aset, Kategori, Pengesahan, Pengaturan, TemaConfig } from "@/lib/types";
import { toast } from "sonner";
import { PanduanFitur } from "@/components/shared/panduan-fitur";
import { Switch } from "@/components/ui/switch";
import { removeWhiteBackground } from "@/lib/image";

export function PengaturanView() {
  return (
    <div className="space-y-6">
      <PanduanFitur title="Pengaturan & Tema">
        Di menu ini Bapak/Ibu bisa mengubah data utama aplikasi.
        <ul className="mt-2 list-disc pl-4 space-y-1">
          <li><strong>Data Sekolah:</strong> Isi logo, nama Kepsek, dsb agar muncul di semua PDF.</li>
          <li><strong>Kustomisasi Tema:</strong> Ubah warna, gradasi, atau pasang foto latar belakang (wallpaper).</li>
          <li><strong>Cadangkan Data:</strong> Simpan atau pulihkan data agar aman tidak hilang.</li>
        </ul>
      </PanduanFitur>

      <div className="space-y-1">
        <Badge variant="secondary" className="w-fit">Pengaturan</Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Pengaturan
        </h1>
        <p className="text-sm text-muted-foreground">
          Atur identitas sekolah, logo &amp; tanda tangan, pengesahan, bobot
          nilai, dan cadangan data.
        </p>
      </div>

      <Tabs defaultValue="identitas" className="w-full">
        <TabsList className="flex w-full flex-wrap h-auto gap-1">
          <TabsTrigger value="identitas" className="flex-1 min-w-[120px]">
            <School className="mr-1 size-4" />
            Identitas
          </TabsTrigger>
          <TabsTrigger value="aset" className="flex-1 min-w-[120px]">
            <ImageIcon className="mr-1 size-4" />
            Logo &amp; TTD
          </TabsTrigger>
          <TabsTrigger value="pengesahan" className="flex-1 min-w-[120px]">
            <FileSignature className="mr-1 size-4" />
            Pengesahan
          </TabsTrigger>
          <TabsTrigger value="bobot" className="flex-1 min-w-[120px]">
            <Settings className="mr-1 size-4" />
            Bobot &amp; Kategori
          </TabsTrigger>
          <TabsTrigger value="tema" className="flex-1 min-w-[120px]">
            <Palette className="mr-1 size-4" />
            Tema &amp; Tampilan
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex-1 min-w-[120px]">
            <Database className="mr-1 size-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identitas" className="mt-4">
          <Card className="card-fancy">
            <CardHeader>
              <CardTitle className="text-base">Data Sekolah</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-xs text-muted-foreground">
                Data ini dipakai di kop dokumen jurnal &amp; rekap nilai. Diisi
                sekali, otomatis tersimpan.
              </p>
              <IdentityForm submitLabel="Simpan Identitas" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aset" className="mt-4">
          <AsetPanel />
        </TabsContent>

        <TabsContent value="pengesahan" className="mt-4">
          <PengesahanPanel />
        </TabsContent>

        <TabsContent value="bobot" className="mt-4">
          <BobotPanel />
        </TabsContent>

        <TabsContent value="tema" className="mt-4">
          <TemaPanel />
        </TabsContent>

        <TabsContent value="backup" className="mt-4">
          <BackupPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============================== ASET PANEL ============================== */

const ASET_ITEMS: Array<{
  key: keyof Aset;
  title: string;
  desc: string;
  buttonLabel: string;
  icon: React.ElementType;
  w: number;
  h: number;
}> = [
  {
    key: "logo",
    title: "Logo Sekolah",
    desc: "Tampil di kop (header) dokumen jurnal & rekap nilai.",
    buttonLabel: "Atur Logo",
    icon: School,
    w: 90,
    h: 90,
  },
  {
    key: "ttdKepsek",
    title: "Tanda Tangan Kepala Sekolah",
    desc: "Bisa diunggah sebagai gambar atau dibuat langsung di layar.",
    buttonLabel: "Atur TTD Kepsek",
    icon: FileSignature,
    w: 120,
    h: 60,
  },
  {
    key: "ttdGuru",
    title: "Tanda Tangan Guru",
    desc: "Bisa diunggah sebagai gambar atau dibuat langsung di layar.",
    buttonLabel: "Atur TTD Guru",
    icon: PenLine,
    w: 120,
    h: 60,
  },
  {
    key: "stempel",
    title: "Stempel (opsional)",
    desc: "Cap/stempel sekolah, disisipkan dekat tanda tangan.",
    buttonLabel: "Atur Stempel",
    icon: Stamp,
    w: 90,
    h: 90,
  },
];

function AsetPanel() {
  const aset = useStore((s) => s.aset);
  const setAset = useStore((s) => s.setAset);
  const confirm = useConfirm();
  const [openKey, setOpenKey] = React.useState<keyof Aset | null>(null);

  const handleSave = (key: keyof Aset, dataUrl: string) => {
    setAset({ [key]: dataUrl } as Partial<Aset>);
    toast.success("Gambar tersimpan.");
    setOpenKey(null);
  };

  const handleDelete = async (key: keyof Aset) => {
    const ok = await confirm({
      message: "Hapus gambar ini?",
      okLabel: "Hapus",
      danger: true,
    });
    if (!ok) return;
    setAset({ [key]: "" } as Partial<Aset>);
    toast.info("Gambar dihapus.");
  };

  const handleMakeTransparent = async (key: keyof Aset) => {
    const dataUrl = aset[key] as string;
    if (!dataUrl) return;
    
    try {
      const transparentData = await removeWhiteBackground(dataUrl, 240);
      setAset({ [key]: transparentData } as Partial<Aset>);
      toast.success("Background putih berhasil dihapus!");
    } catch (error) {
      toast.error("Gagal menghapus background.");
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ASET_ITEMS.map((item) => {
        const data = aset[item.key];
        return (
          <Card key={item.key} className="card-fancy">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="size-4" />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                {data && (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border bg-white p-1">
                    <img
                      src={data as string}
                      alt={item.title}
                      style={{ maxWidth: item.w, maxHeight: item.h }}
                      className="max-h-14 max-w-full object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 min-w-[120px]"
                  onClick={() => setOpenKey(item.key)}
                >
                  <Upload className="mr-1.5 size-3.5" />
                  {data ? "Ganti" : item.buttonLabel}
                </Button>
                {data && item.key === "logo" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                    onClick={() => handleMakeTransparent(item.key)}
                    title="Buat background putih jadi transparan"
                  >
                    Hapus Background
                  </Button>
                )}
                {data && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(item.key)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
              {item.key === "logo" && (
                <div className="mt-3 space-y-2 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Ukuran Logo di Kop Surat</Label>
                    <span className="text-xs text-muted-foreground">{aset.logoSize || 80}px</span>
                  </div>
                  <Slider
                    value={[aset.logoSize || 80]}
                    min={40}
                    max={150}
                    step={5}
                    onValueChange={(val) => setAset({ logoSize: val[0] })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <AssetUploadDialog
        open={openKey !== null}
        onOpenChange={(v) => !v && setOpenKey(null)}
        title={ASET_ITEMS.find((i) => i.key === openKey)?.title ?? "Unggah Gambar"}
        label={ASET_ITEMS.find((i) => i.key === openKey)?.buttonLabel}
        currentData={openKey ? (aset[openKey] as string) : undefined}
        allowDelete={openKey ? !!aset[openKey] : false}
        onSave={(url) => openKey && handleSave(openKey, url)}
        onDelete={() => openKey && handleDelete(openKey)}
      />
    </div>
  );
}

/* ============================== PENGESAHAN PANEL ============================== */

function PengesahanPanel() {
  const p = useStore((s) => s.pengesahan);
  const setPengesahan = useStore((s) => s.setPengesahan);
  const [form, setForm] = React.useState<Pengesahan>(p);

  React.useEffect(() => setForm(p), [p]);

  const handleSave = () => {
    setPengesahan(form);
    toast.success("Data pengesahan tersimpan.");
  };

  return (
    <Card className="card-fancy">
      <CardHeader>
        <CardTitle className="text-base">Blok Pengesahan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs text-muted-foreground">
          Muncul di bagian bawah dokumen cetak: kota &amp; tanggal, lalu dua
          kolom (Kepala Sekolah &amp; Guru) berisi nama, NIP, dan area tanda
          tangan.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pg-kota">Kota</Label>
            <Input
              id="pg-kota"
              value={form.kota}
              onChange={(e) => setForm((f) => ({ ...f, kota: e.target.value }))}
              placeholder="mis. Yogyakarta"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pg-tanggal">Tanggal Pengesahan</Label>
            <Input
              id="pg-tanggal"
              type="date"
              value={form.tanggal}
              onChange={(e) =>
                setForm((f) => ({ ...f, tanggal: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <h4 className="mb-3 text-sm font-semibold">Kepala Sekolah</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pg-ks-nama">Nama</Label>
              <Input
                id="pg-ks-nama"
                value={form.kepsek.nama}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    kepsek: { ...f.kepsek, nama: e.target.value },
                  }))
                }
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pg-ks-nip">NIP</Label>
              <Input
                id="pg-ks-nip"
                value={form.kepsek.nip}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    kepsek: { ...f.kepsek, nip: e.target.value },
                  }))
                }
                placeholder="Nomor Induk Pegawai"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4">
          <h4 className="mb-3 text-sm font-semibold">Guru</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pg-g-nama">Nama</Label>
              <Input
                id="pg-g-nama"
                value={form.guru.nama}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    guru: { ...f.guru, nama: e.target.value },
                  }))
                }
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pg-g-nip">NIP</Label>
              <Input
                id="pg-g-nip"
                value={form.guru.nip}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    guru: { ...f.guru, nip: e.target.value },
                  }))
                }
                placeholder="Nomor Induk Pegawai"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 size-4" />
            Simpan Pengesahan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================== BOBOT PANEL ============================== */

function BobotPanel() {
  const pengaturan = useStore((s) => s.pengaturan);
  const setPengaturan = useStore((s) => s.setPengaturan);
  const confirm = useConfirm();

  const [preset, setPreset] = React.useState(pengaturan.presetAktif);
  const [kategori, setKategori] = React.useState<Kategori[]>(
    pengaturan.kategori
  );

  React.useEffect(() => {
    setPreset(pengaturan.presetAktif);
    setKategori(pengaturan.kategori);
  }, [pengaturan]);

  const toggleTutorial = (val: boolean) => {
    setPengaturan({ ...pengaturan, showTutorial: val });
  };

  const handleAddKategori = () => {
    setKategori((k) => [
      ...k,
      { min: 0, max: 0, label: "Baru", warna: "#94a3b8" },
    ]);
  };

  const handleRemoveKategori = (i: number) => {
    setKategori((k) => k.filter((_, idx) => idx !== i));
  };

  const handleUpdateKategori = (i: number, patch: Partial<Kategori>) => {
    setKategori((k) =>
      k.map((kat, idx) => (idx === i ? { ...kat, ...patch } : kat))
    );
  };

  const handleReset = async () => {
    const ok = await confirm({
      message: "Kembalikan kategori ke pengaturan default?",
      okLabel: "Ya, kembalikan",
    });
    if (!ok) return;
    setKategori(JSON.parse(JSON.stringify(DEFAULT_KATEGORI)));
    toast.info("Kategori dikembalikan ke default (belum disimpan).");
  };

  const handleSave = () => {
    const tidakValid = kategori.some(
      (k) =>
        isNaN(k.min) ||
        isNaN(k.max) ||
        k.min > k.max ||
        !k.label
    );
    if (tidakValid) {
      toast.warning("Periksa kembali rentang & label kategori.");
      return;
    }
    const next: Pengaturan = {
      ...pengaturan,
      presetAktif: preset,
      kategori,
    };
    setPengaturan(next);
    toast.success("Pengaturan bobot & kategori tersimpan.");
  };

  return (
    <div className="space-y-4">
      <Card className="card-fancy">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Tampilkan Panduan Pengguna</Label>
              <p className="text-sm text-muted-foreground">Munculkan kotak panduan di setiap halaman fitur.</p>
            </div>
            <Switch 
              checked={pengaturan.showTutorial !== false}
              onCheckedChange={toggleTutorial}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-fancy">
        <CardHeader>
          <CardTitle className="text-base">Preset Bobot Default</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-xs text-muted-foreground">
            Pilih preset yang otomatis dipakai saat membuka halaman Nilai Siswa.
            Anda masih bisa mengubah komponen &amp; bobot kapan saja di halaman
            Nilai.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(PRESET_BOBOT).map(([k, p]) => {
              const selected = preset === k;
              return (
                <button
                  key={k}
                  onClick={() => setPreset(k)}
                  className={
                    "flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all " +
                    (selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40")
                  }
                >
                  <div className="flex w-full items-center justify-between">
                    <strong className="text-sm">{p.label}</strong>
                    {selected && (
                      <CheckCircle2 className="size-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{p.desc}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="card-fancy">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Kategori Capaian</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="mr-1 size-3.5" />
              Default
            </Button>
            <Button size="sm" variant="ghost" onClick={handleAddKategori}>
              <Plus className="mr-1 size-3.5" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Rentang nilai → label &amp; warna. Pastikan rentang saling
            melengkapi (0–100).
          </p>
          <div className="space-y-2">
            {kategori.map((k, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-2 rounded-lg border bg-card p-3 sm:grid-cols-[80px_80px_1fr_70px_auto] sm:items-end"
              >
                <div className="space-y-1">
                  <Label className="text-[10px]">Min</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={k.min}
                    onChange={(e) =>
                      handleUpdateKategori(i, {
                        min: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="h-9 tabular-nums"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Maks</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={k.max}
                    onChange={(e) =>
                      handleUpdateKategori(i, {
                        max: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="h-9 tabular-nums"
                  />
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <Label className="text-[10px]">Label</Label>
                  <Input
                    value={k.label}
                    onChange={(e) =>
                      handleUpdateKategori(i, { label: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px]">Warna</Label>
                  <div className="relative">
                    <input
                      type="color"
                      value={k.warna}
                      onChange={(e) =>
                        handleUpdateKategori(i, { warna: e.target.value })
                      }
                      className="h-9 w-full cursor-pointer rounded-md border bg-background p-1"
                    />
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemoveKategori(i)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/20 p-3">
            {kategori.map((k, i) => (
              <span
                key={i}
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${k.warna}22`,
                  color: k.warna,
                }}
              >
                {k.label} ({k.min}–{k.max})
              </span>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="mr-2 size-4" />
              Simpan Kategori
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================== TEMA PANEL ============================== */

function TemaPanel() {
  const pengaturan = useStore((s) => s.pengaturan);
  const setPengaturan = useStore((s) => s.setPengaturan);
  const tema = pengaturan.tema || { tipe: "default", warnaSolid: "#0f172a", warnaGradient: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", wallpaperUrl: "", glassOpacity: 0.7 };

  const updateTema = (updates: Partial<TemaConfig>) => {
    setPengaturan({ ...pengaturan, tema: { ...tema, ...updates } });
  };

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleUploadWallpaper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
       toast.info("Mengompres ukuran gambar...");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Compress and resize (max width/height 1920)
        let w = img.width;
        let h = img.height;
        if (w > 1920 || h > 1080) {
          const ratio = Math.min(1920 / w, 1080 / h);
          w *= ratio;
          h *= ratio;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7); // 70% quality jpeg
          updateTema({ tipe: "wallpaper", wallpaperUrl: dataUrl });
          toast.success("Wallpaper berhasil disimpan!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const gradients = [
    "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
    "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
  ];

  return (
    <div className="space-y-4">
      <Card className="card-fancy">
        <CardHeader>
          <CardTitle className="text-base">Kustomisasi Tema &amp; Latar Belakang</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-3 border-b pb-4 border-border/50">
            <h4 className="text-sm font-semibold">Gaya Tema</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant={tema.tipe === "default" ? "default" : "outline"} onClick={() => updateTema({ tipe: "default" })}>
                Bawaan
              </Button>
              <Button variant={tema.tipe === "solid" ? "default" : "outline"} onClick={() => updateTema({ tipe: "solid" })}>
                Warna Solid
              </Button>
              <Button variant={tema.tipe === "gradient" ? "default" : "outline"} onClick={() => updateTema({ tipe: "gradient" })}>
                Gradasi Keren
              </Button>
              <Button variant={tema.tipe === "wallpaper" ? "default" : "outline"} onClick={() => updateTema({ tipe: "wallpaper" })}>
                Wallpaper
              </Button>
            </div>
          </div>

          {tema.tipe === "solid" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Label>Pilih Warna Solid</Label>
              <div className="flex gap-4 items-center">
                <input type="color" value={tema.warnaSolid} onChange={(e) => updateTema({ warnaSolid: e.target.value })} className="h-10 w-20 cursor-pointer rounded border border-border bg-background p-1" />
                <span className="text-sm text-muted-foreground uppercase">{tema.warnaSolid}</span>
              </div>
            </div>
          )}

          {tema.tipe === "gradient" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Label>Pilihan Gradasi</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gradients.map((g) => (
                  <button
                    key={g}
                    className={`h-20 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${tema.warnaGradient === g ? "border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : "border-transparent"}`}
                    style={{ background: g }}
                    onClick={() => updateTema({ warnaGradient: g })}
                  />
                ))}
              </div>
            </div>
          )}

          {tema.tipe === "wallpaper" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => fileRef.current?.click()} variant="secondary">
                  <Upload className="mr-2 size-4" />
                  Unggah Gambar Wallpaper
                </Button>
                {tema.wallpaperUrl && (
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => updateTema({ wallpaperUrl: "" })}>
                    <Trash2 className="mr-2 size-4" />
                    Hapus
                  </Button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUploadWallpaper} />
              </div>
              
              {tema.wallpaperUrl && (
                <div className="space-y-3 rounded-xl border bg-muted/10 p-4">
                  <Label>Efek Kaca (Glassmorphism)</Label>
                  <Slider
                    value={[tema.glassOpacity * 100]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={(val) => updateTema({ glassOpacity: val[0] / 100 })}
                    className="py-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    Atur agar teks tetap terbaca. Semakin kecil angkanya, kartu-kartu tabel akan semakin tembus pandang.
                  </div>
                  
                  <div className="mt-2 overflow-hidden rounded-xl border shadow-sm">
                    <img src={tema.wallpaperUrl} alt="Wallpaper Preview" className="h-40 w-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

/* ============================== BACKUP PANEL ============================== */

function BackupPanel() {
  const exportJSON = useStore((s) => s.exportJSON);
  const importJSON = useStore((s) => s.importJSON);
  const resetAll = useStore((s) => s.resetAll);
  const confirm = useConfirm();
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const data = exportJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guruku-hebat-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("Data diekspor.");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await confirm({
      message: "Import akan menimpa data saat ini. Lanjutkan?",
      okLabel: "Ya, impor",
      danger: true,
    });
    if (!ok) {
      e.target.value = "";
      return;
    }
    try {
      const text = await file.text();
      const obj = JSON.parse(text);
      const n = importJSON(obj);
      toast.success(`Import berhasil (${n} kategori data).`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal import: format tidak valid.");
    }
    e.target.value = "";
  };

  const handleReset = async () => {
    const ok = await confirm({
      message:
        "Yakin menghapus SEMUA data? Ini tidak bisa dibatalkan.",
      okLabel: "Ya, hapus semua",
      danger: true,
    });
    if (!ok) return;
    resetAll();
    toast.info("Semua data dihapus.");
  };

  return (
    <div className="space-y-4">
      <Card className="card-fancy">
        <CardHeader>
          <CardTitle className="text-base">Backup &amp; Pemulihan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Ekspor seluruh data (identitas, jurnal, siswa, nilai, aset,
            pengaturan) sebagai satu berkas JSON untuk cadangan atau pindah
            perangkat.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport}>
              <Download className="mr-2 size-4" />
              Export Semua Data (JSON)
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="mr-2 size-4" />
              Import Data (JSON)
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <AlertTriangle className="size-4" />
            Reset Total
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Menghapus <strong>semua</strong> data di perangkat ini. Tindakan ini
            tidak bisa dibatalkan.
          </p>
          <Button variant="destructive" onClick={handleReset}>
            <Trash2 className="mr-2 size-4" />
            Hapus Semua Data
          </Button>
        </CardContent>
      </Card>

      <Card className="border-info/30 bg-info/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Database className="mt-0.5 size-4 shrink-0 text-info" />
          <div className="text-xs">
            <strong>Catatan sinkronisasi:</strong> saat ini data hanya tersimpan
            di perangkat ini. Untuk akses dari beberapa perangkat, bisa
            ditambahkan backend gratis (mis. Supabase/Firebase) sebagai
            peningkatan opsional di masa depan.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
