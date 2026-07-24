"use client";

import { useStore } from "@/lib/store";
import { tglPendek } from "@/lib/format";

export function DocKop() {
  const idn = useStore((s) => s.identitas);
  const aset = useStore((s) => s.aset);
  const pengesahan = useStore((s) => s.pengesahan);

  const subBagian = [idn.kelas, idn.tahun, idn.mapel]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="doc-kop" style={{ display: "flex", gap: "1rem", borderBottom: "3px solid black", paddingBottom: "10px", marginBottom: "15px", alignItems: "center" }}>
      {aset.logo ? (
        <img 
          src={aset.logo} 
          alt="Logo" 
          style={{ width: aset.logoSize || 80, height: aset.logoSize || 80, objectFit: "contain" }} 
        />
      ) : (
        <div
          style={{
            width: aset.logoSize || 80,
            height: aset.logoSize || 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #999",
            color: "#999",
            fontSize: ".7rem",
          }}
        >
          LOGO
        </div>
      )}
      <div className="doc-kop__text" style={{ flex: 1, textAlign: "center" }}>
        {idn.teksKopKustom ? (
          <div style={{ whiteSpace: "pre-wrap", fontWeight: "bold", fontSize: "14px", lineHeight: "1.3" }}>
            {idn.teksKopKustom}
          </div>
        ) : (
          <>
            {idn.dinasAtauYayasan && <div style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase" }}>{idn.dinasAtauYayasan}</div>}
            <div style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase" }}>{idn.sekolah || "NAMA SEKOLAH"}</div>
            {idn.skHukum && <div style={{ fontSize: "12px", marginTop: "2px" }}>{idn.skHukum}</div>}
            {idn.alamat && <div style={{ fontSize: "12px", marginTop: "2px" }}>{idn.alamat}</div>}
          </>
        )}
        
        {subBagian && <div style={{ fontSize: "12px", marginTop: "6px" }}>{subBagian}</div>}
        {pengesahan.kota && (
          <div style={{ fontSize: "10px", marginTop: "2px" }}>
            {pengesahan.kota}
          </div>
        )}
      </div>
      {/* Spacer to keep text centered if logo is only on left */}
      <div style={{ width: aset.logoSize || 80, height: 1 }}></div>
    </div>
  );
}

interface SignerColumnProps {
  peran: string;
  atas: string;
  nama: string;
  nip: string;
  ttdUrl?: string;
}

function SignerColumn({ peran, atas, nama, nip, ttdUrl }: SignerColumnProps) {
  return (
    <div>
      <div>{atas}</div>
      <div>{peran}</div>
      <div className="doc-pengesahan__sign">
        {ttdUrl ? (
          <img src={ttdUrl} alt="ttd" />
        ) : (
          <span style={{ color: "#999" }}>Tanda tangan</span>
        )}
      </div>
      <div style={{ marginTop: ".4rem" }}>
        <strong>{nama || "............................"}</strong>
      </div>
      <div>NIP. {nip || "......................"}</div>
    </div>
  );
}

export function DocPengesahan() {
  const p = useStore((s) => s.pengesahan);
  const aset = useStore((s) => s.aset);
  const tanggalTtd = p.tanggal ? tglPendek(p.tanggal) : "_____________";
  const kota = p.kota || "_____________";

  return (
    <div className="doc-pengesahan">
      <SignerColumn
        peran="Kepala Sekolah"
        atas="Mengetahui,"
        nama={p.kepsek.nama}
        nip={p.kepsek.nip}
        ttdUrl={aset.ttdKepsek}
      />
      <SignerColumn
        peran="Guru Mata Pelajaran"
        atas={`${kota}, ${tanggalTtd}`}
        nama={p.guru.nama}
        nip={p.guru.nip}
        ttdUrl={aset.ttdGuru}
      />
    </div>
  );
}
