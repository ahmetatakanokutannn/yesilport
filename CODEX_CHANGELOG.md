# CODEX_CHANGELOG

## 2026-06-01 23:17:02 +03:00 - 1. Backend bağımlılığını kaldır

**Ne yapıldı:** Uygulama statik public site akışına indirildi; kullanıcı kontrolü backend çağrısı olmadan `null`/`true` kabul edildi, auth/panel/admin route ve bileşenleri kaldırıldı, header CTA tek `Demo Al` bağlantısına çevrildi, `api.ts` ve `axios` kaldırıldı.

**Oluşturulan/değiştirilen/silinen dosyalar:**
- Değiştirildi: `frontend/src/App.tsx`
- Değiştirildi: `frontend/package.json`
- Değiştirildi: `frontend/package-lock.json`
- Silindi: `frontend/src/lib/api.ts`
- Oluşturuldu: `CODEX_CHANGELOG.md`

**Sorun + çözüm:** PowerShell execution policy `npm.ps1` çalıştırmayı engelledi; `npm.cmd uninstall axios` kullanılarak bağımlılık package ve lock dosyalarından kaldırıldı.

## 2026-06-01 23:17:32 +03:00 - 2. Formlar (sadece teşekkür mesajı)

**Ne yapıldı:** `MiniForm` ve `Newsletter` submitleri API çağrısız hale getirildi; her ikisi de `preventDefault` sonrası aynı teşekkür mesajını gösteriyor.

**Oluşturulan/değiştirilen/silinen dosyalar:**
- Değiştirildi: `frontend/src/App.tsx`
- Değiştirildi: `CODEX_CHANGELOG.md`

**Sorun + çözüm:** API form çağrısı kalmadığı doğrulandı; ek sorun yaşanmadı.

## 2026-06-01 23:17:59 +03:00 - 3. Dersleri statik veri dosyasına taşı

**Ne yapıldı:** Kurs ve ders tipleriyle birlikte statik `courses` verisi ayrı data dosyasına taşındı; `App.tsx` içindeki eski sabit kurs dizisi kaldırıldı.

**Oluşturulan/değiştirilen/silinen dosyalar:**
- Oluşturuldu: `frontend/src/data/courses.ts`
- Değiştirildi: `frontend/src/App.tsx`
- Değiştirildi: `CODEX_CHANGELOG.md`

**Sorun + çözüm:** Doğrulama aramasında PowerShell çift tırnak kaçışı hata verdi; arama tek tırnakla tekrar çalıştırılarak eski `const courses` dizisinin kaldırıldığı doğrulandı.

## 2026-06-01 23:18:51 +03:00 - 4. Kursları public route'a bağla

**Ne yapıldı:** `/egitimler` ve `/egitimler/:courseId` public route'ları eklendi; eğitimler navigasyona bağlandı, kurs kartları statik `courses` verisinden üretildi ve kurs detayında seçili ders Google Drive `preview` iframe'i ile gösterildi.

**Oluşturulan/değiştirilen/silinen dosyalar:**
- Değiştirildi: `frontend/src/App.tsx`
- Değiştirildi: `CODEX_CHANGELOG.md`

**Sorun + çözüm:** Ek sorun yaşanmadı; route, nav ve iframe referansları `rg` ile doğrulandı.

## 2026-06-01 23:19:23 +03:00 - 5. GitHub Pages için yapılandır

**Ne yapıldı:** React Router `HashRouter` kullanımına geçirildi, Vite `base` değeri `/yesilport/` olarak ayarlandı, `gh-pages` devDependency olarak eklendi ve `deploy` scripti tanımlandı.

**Oluşturulan/değiştirilen/silinen dosyalar:**
- Değiştirildi: `frontend/src/App.tsx`
- Değiştirildi: `frontend/vite.config.ts`
- Değiştirildi: `frontend/package.json`
- Değiştirildi: `frontend/package-lock.json`
- Değiştirildi: `CODEX_CHANGELOG.md`

**Sorun + çözüm:** Ek sorun yaşanmadı; HashRouter, base, deploy script ve `gh-pages` referansları `rg` ile doğrulandı.

## 2026-06-01 23:22:19 +03:00 - 6. Build doğrula

**Ne yapıldı:** `frontend` içinde `npm install` ve `npm run build` çalıştırıldı; production build `frontend/dist/` altına başarıyla üretildi. `vite preview` çıktısı yerelde `/yesilport/` base path üzerinden HTTP 200 OK döndü.

**Oluşturulan/değiştirilen/silinen dosyalar:**
- Değiştirildi: `frontend/src/App.tsx`
- Değiştirildi: `frontend/dist/index.html`
- Değiştirildi: `frontend/dist/assets/*`
- Değiştirildi: `CODEX_CHANGELOG.md`

**Sorun + çözüm:** İlk build denemesinde panel kaldırıldıktan sonra boşa düşen `MetricCard` için TypeScript `TS6133` hatası alındı; kullanılmayan bileşen kaldırıldı ve build tekrar çalıştırılarak temiz geçti. Preview testinde port çakışması ve eski Vite süreçleri görüldü; süreçler kapatıldı, farklı portta HTTP 200 OK doğrulandı ve geçici loglar temizlendi.

## 2026-06-01 23:23:20 +03:00 - 7. README güncelle

**Ne yapıldı:** Frontend README'si statik YeşilPORT kullanımına göre yeniden yazıldı; build, preview, Google Drive video ID ekleme, GitHub Pages deploy ve `vite.config.ts` base ayarı açıklandı.

**Oluşturulan/değiştirilen/silinen dosyalar:**
- Değiştirildi: `frontend/README.md`
- Değiştirildi: `CODEX_CHANGELOG.md`

**Sorun + çözüm:** Ek sorun yaşanmadı; README içeriği `rg` ile doğrulandı.

## npm run build çıktısı özeti

**Komut:** `cd frontend && npm run build`

**Sonuç:** Başarılı. TypeScript `tsc -b` ve Vite production build hatasız tamamlandı.

**Özet:**
- Vite: `v8.0.14`
- Dönüştürülen modül: `1775`
- Çıktı: `frontend/dist/`
- `dist/index.html`: `0.48 kB`, gzip `0.30 kB`
- `dist/assets/index-CBM3OjHT.css`: `27.27 kB`, gzip `6.26 kB`
- `dist/assets/index-ztwvcMpu.js`: `272.89 kB`, gzip `88.31 kB`
- Süre: `245ms`

## 2026-06-02 00:24:23 +03:00 - idecttDb eğitim verilerini courses.ts'e aktar

**Ne yapıldı:** `frontend/src/data/courses.ts` dosyası 14 gerçek kursla tamamen yeniden yazıldı. Kurs tipi `instructor` alanını içerecek ve yalnız `FREE` seviye kullanacak şekilde güncellendi. Her kurs için tek ders eklendi; ders ve kurs `id` alanları Türkçe karakterleri sadeleştirilmiş benzersiz kebab-case slug olarak yazıldı. Google Drive dosya kimlikleri iframe uyumlu `https://drive.google.com/file/d/FILE_ID/preview` formatına dönüştürüldü. Eğitim kartları kırık backend görseli kullanmayacak şekilde mevcut tasarıma uygun `GraduationCap` ikon placeholder'ı ile güncellendi.

**Oluşturulan/değiştirilen/silinen dosyalar:**
- Değiştirildi: `frontend/src/data/courses.ts`
- Değiştirildi: `frontend/src/App.tsx`
- Değiştirildi: `frontend/dist/index.html`
- Değiştirildi: `frontend/dist/assets/*`
- Değiştirildi: `CODEX_CHANGELOG.md`

**Veri özeti:**
- Eklenen kurs: `14`
- Eklenen ders/video: `14`
- URL dönüşümü: DB'deki `/view?usp=sharing` formatı yerine tüm `videoUrl` alanları `/preview` formatında yazıldı.
- DB dump dosyası `idecttDb_2026-06-01_033144.sql.gz` silinmedi ve değiştirilmedi.

**Doğrulama:**
- Node veri kontrolü: `courses=14`, `uniqueCourseIds=14`, `uniqueLessonIds=14`, `badPreviewUrls=0`
- `cd frontend && npm run build`: başarılı.

**Build çıktısı özeti:**
- Vite: `v8.0.14`
- Dönüştürülen modül: `1775`
- Çıktı: `frontend/dist/`
- `dist/index.html`: `0.48 kB`, gzip `0.30 kB`
- `dist/assets/index-BvLR5xnO.css`: `27.34 kB`, gzip `6.27 kB`
- `dist/assets/index-CYc0Cw_I.js`: `277.72 kB`, gzip `89.61 kB`
- Süre: `332ms`

**Sorun + çözüm:** Kurs veri taramasında yalnız genel placeholder metinleri (`input placeholder`, Google Maps placeholder) eşleşti; eski Drive placeholder, `/view?usp`, API, axios, `/uploads` veya YouTube kurs placeholder kalmadığı doğrulandı.
