# Technical Stack (Astro)

## Yang sudah kamu install:
- Astro (latest)

## Yang perlu diinstall:

```bash
# Untuk styling (pilih salah satu, saya rekomendasi A)
# Opsi A: Vanilla CSS (kontrol penuh)
npm install -D sass  # kalau mau SCSS

# Opsi B: Tailwind (lebih cepet develop)
npx astro add tailwind

# Untuk content collections (wajib)
npm install -D @astrojs/mdx

# Untuk code highlighting
npm install -D rehype-pretty-code