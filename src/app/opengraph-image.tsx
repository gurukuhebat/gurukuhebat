import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Guruku Hebat — Jurnal & Nilai Siswa';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0f172a, #020617)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '80px 100px',
            borderRadius: '40px',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: '100px', marginBottom: '30px' }}>🎓</div>
          <div
            style={{
              fontSize: '80px',
              fontWeight: 800,
              color: '#10b981',
              letterSpacing: '-0.05em',
              marginBottom: '20px',
            }}
          >
            Guruku Hebat
          </div>
          <div
            style={{
              fontSize: '40px',
              color: '#cbd5e1',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Jurnal Pembelajaran & Rekap Nilai Siswa
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
