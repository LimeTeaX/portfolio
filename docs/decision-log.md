# Decision Log (Catat keputusan penting)

## Kenapa Astro, bukan 11ty?

| Aspek | 11ty | Astro | Keputusan |
|-------|------|-------|-----------|
| Ekosistem | Matang tapi klasik | Modern, growing | Astro |
| Developer experience | Config berat | DX enak | Astro |
| Content collections | Perlu plugin | Bawaan | Astro |

**Kesimpulan:** Astro, karena kamu sudah install dan lebih enak dev-nya.

## Kenapa gak pake Tailwind?

| Alasan | Vanilla CSS | Tailwind |
|--------|-------------|----------|
| Kontrol design system | Penuh | Harus config |
| File size | Minimal | Bisa gede kalau gak purge |
| Learning curve | Udah tahu | Perlu belajar utility classes |

**Keputusan:** Vanilla CSS dulu. Pindah ke Tailwind kalau project sudah gede.

## Kenapa gak pake Card component?

Portfolio template biasanya pake card. Kita gak mau terlihat seperti template. Container tanpa background dan border lebih jujur secara visual.