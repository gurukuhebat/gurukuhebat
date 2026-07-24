"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, School } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import type { Identitas } from "@/lib/types";

interface IdentityFormProps {
  submitLabel?: string;
  onSubmit?: (data: Identitas) => void;
  hideButton?: boolean;
}

export function IdentityForm({
  submitLabel = "Simpan Identitas",
  onSubmit,
  hideButton = false,
}: IdentityFormProps) {
  const identitas = useStore((s) => s.identitas);
  const setIdentitas = useStore((s) => s.setIdentitas);
  const [form, setForm] = React.useState<Identitas>(identitas);

  React.useEffect(() => {
    setForm(identitas);
  }, [identitas]);

  const handleSave = () => {
    if (!form.sekolah.trim()) {
      toast.warning("Nama sekolah wajib diisi.");
      return;
    }
    setIdentitas(form);
    toast.success("Identitas tersimpan.");
    onSubmit?.(form);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="idn-sekolah">
          Nama Institusi / Sekolah <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <School className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="idn-sekolah"
            value={form.sekolah}
            onChange={(e) => setForm((f) => ({ ...f, sekolah: e.target.value }))}
            placeholder="mis. MI Al-Hikmah"
            autoComplete="organization"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="idn-kelas">Kelas / Semester</Label>
          <Input
            id="idn-kelas"
            value={form.kelas}
            onChange={(e) => setForm((f) => ({ ...f, kelas: e.target.value }))}
            placeholder="mis. 4A / Ganjil"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="idn-tahun">Tahun Pelajaran</Label>
          <Input
            id="idn-tahun"
            value={form.tahun}
            onChange={(e) => setForm((f) => ({ ...f, tahun: e.target.value }))}
            placeholder="mis. 2025/2026"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="idn-dinas">Dinas Pendidikan / Yayasan</Label>
        <Input
          id="idn-dinas"
          value={form.dinasAtauYayasan || ""}
          onChange={(e) => setForm((f) => ({ ...f, dinasAtauYayasan: e.target.value }))}
          placeholder="mis. DINAS PENDIDIKAN KOTA SURABAYA"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="idn-sk">SK Hukum / Izin Operasional</Label>
        <Input
          id="idn-sk"
          value={form.skHukum || ""}
          onChange={(e) => setForm((f) => ({ ...f, skHukum: e.target.value }))}
          placeholder="mis. SK No: 123/456/2025"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="idn-alamat">Alamat Lengkap</Label>
        <Textarea
          id="idn-alamat"
          value={form.alamat || ""}
          onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
          placeholder="mis. Jl. Pendidikan No. 1, Surabaya 60123. Telp: (031) 123456"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="idn-mapel">Mata Pelajaran (opsional)</Label>
        <Input
          id="idn-mapel"
          value={form.mapel || ""}
          onChange={(e) => setForm((f) => ({ ...f, mapel: e.target.value }))}
          placeholder="mis. Akidah Akhlak"
        />
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="idn-custom-kop" className="font-semibold">
            Gunakan Kop Teks Bebas (Kustom)
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Jika diisi, teks ini akan <strong>menggantikan</strong> format Kop Surat otomatis (Dinas, Sekolah, SK, Alamat) pada file PDF cetak. Pisahkan baris dengan menekan Enter.
        </p>
        <Textarea
          id="idn-custom-kop"
          value={form.teksKopKustom || ""}
          onChange={(e) => setForm((f) => ({ ...f, teksKopKustom: e.target.value }))}
          placeholder="YAYASAN AL-HIKMAH&#10;SEKOLAH DASAR ISLAM AL-HIKMAH&#10;Jl. Kemerdekaan No.1"
          rows={4}
        />
      </div>

      {!hideButton && (
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="mr-2 size-4" />
          {submitLabel}
        </Button>
      )}
    </div>
  );
}


