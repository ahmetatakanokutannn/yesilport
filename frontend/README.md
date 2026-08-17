# YeşilPORT Frontend

React 18, TypeScript, Vite, Tailwind v4 ve React Router v6 ile hazırlanmış tamamen statik YeşilPORT sitesidir. Backend gerektirmez; GitHub Pages üzerinde yayınlanabilir.

## Geliştirme

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build çıktısı `dist/` klasörüne üretilir. Yerelde production çıktısını test etmek için:

```bash
npm run preview
```

## Google Drive Eğitim Videoları

Eğitim içerikleri `src/data/courses.ts` dosyasından beslenir. Yeni ders eklerken Google Drive video bağlantısı şu formatta olmalıdır:

```ts
{
  id: "2",
  title: "Ders başlığı",
  videoUrl: "https://drive.google.com/file/d/FILE_ID/preview",
  duration: "15 dk"
}
```

`FILE_ID`, Google Drive dosya linkindeki `/d/` ile sonraki `/` arasında yer alan kimliktir. Videonun izlenebilmesi için Drive paylaşım ayarlarının hedef kullanıcılar tarafından erişilebilir olması gerekir.

## GitHub Pages Deploy

Site `yesilport.com` özel alan adının kökünden yayınlandığı için
`vite.config.ts` içindeki `base` değeri `/` olmalıdır:

```ts
base: "/"
```

`public/CNAME` dosyası build sırasında `dist/CNAME` olarak kopyalanır ve GitHub
Pages yayınının `yesilport.com` alan adına bağlı kalmasını sağlar.

Yayınlamak için:

```bash
npm run deploy
```

Bu komut önce build alır, ardından `dist/` klasörünü `gh-pages` paketiyle GitHub Pages'e gönderir.
