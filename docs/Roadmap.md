# Roadmap (Urutan Ngerjain)

## Hari 1: Setup
- [ ] `npm create astro@latest`
- [ ] Install dependencies (lihat tech-astro.md)
- [ ] Hapus file contoh default
- [ ] Buat folder structure (src/content, src/components, dll)

## Hari 2: Layout + Styling
- [ ] Import font (Google Fonts atau self-host)
- [ ] Buat `src/styles/global.css`
- [ ] Implementasi grid asimetris
- [ ] Buat `BaseLayout.astro`

## Hari 3: Components
- [ ] Buat `Nav.astro`
- [ ] Buat `MarginNote.astro` (ini prioritas, bedain dari template lain)
- [ ] Buat `DecisionTable.astro`

## Hari 4: Content Collections
- [ ] Setup `src/content/config.ts`
- [ ] Schema untuk case studies
- [ ] Schema untuk notes
- [ ] Buat `[slug].astro` untuk dynamic routing

## Hari 5: Halaman
- [ ] `index.astro` (opening statement + featured case study)
- [ ] `about.astro` (engineering philosophy)
- [ ] `case-studies/index.astro`
- [ ] `notes/index.astro`

## Hari 6-7: Isi Konten (yang paling penting)
- [ ] Tulis 2 case studies dari project nyata kamu
- [ ] Tulis 3 notes
- [ ] Buat ASCII diagrams

## Hari 8: Polish
- [ ] Responsive testing (HP, tablet, desktop)
- [ ] Performance testing (Lighthouse)
- [ ] Aksesibilitas (keyboard navigation)

## Hari 9: Deploy
- [ ] `npm run build`
- [ ] Deploy ke Netlify / Vercel
- [ ] Test production

## Quality Gate (sebelum lanjut ke task berikutnya):
- [ ] Gak ada console error
- [ ] Gak ada "lorem ipsum"
- [ ] Mobile layout gak broken