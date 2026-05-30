# Strategi Konten

## Opening statement (di index.html)

JANGAN:
> "Saya developer yang passionate building things"

GANTI DENGAN:
> "Engineering is choosing which problems to solve and which constraints to accept. I document the tradeoffs so the next person (or future me) understands why."

## Struktur Case Study (wajib)

Setiap case study HARUS punya section ini:

1. **Problem** (100-150 kata)
2. **Constraints** (bullet points, maksimal 5)
3. **Architecture** (ASCII diagram atau SVG sederhana)
4. **Decision Log** (tabel: keputusan vs alternatif vs alasan)
5. **What broke** (ceritakan kegagalan, ini yang bikin beda)
6. **Results** (data/angka, jangan angan-angan)
7. **Lessons** (maksimal 3 poin)

## Contoh Decision Log:

| Keputusan | Alternatif | Kenapa pilih ini | Konsekuensi |
|-----------|------------|------------------|-------------|
| Token bucket algorithm | Fixed window | Handle burst lebih baik | State management lebih kompleks |
| In-memory cache | Redis | Low latency untuk solo project | Gak scalable horizontal |

## Notes (tulisan pendek)

Topik yang bisa ditulis:
- Debugging session dengan log asli
- Kenapa gak pake X technology
- "How I'd rebuild this differently"

Panjang: 300-800 kata

JANGAN buat tutorial "Getting started with X"