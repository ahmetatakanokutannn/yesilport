import { useEffect, useMemo, useState } from "react";
import type { FormEvent, InputHTMLAttributes } from "react";
import { Link, NavLink, Outlet, Route, Routes, useParams } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  Anchor, ArrowDown, BarChart2, Briefcase, Calculator, CheckCircle2, ChevronRight,
  Download, FileText, GraduationCap, Languages, Leaf, Mail, Menu, MessageCircle, Phone,
  Search, ShieldCheck, Sparkles, Upload, Users, X, Zap
} from "lucide-react";
import { courses } from "./data/courses";

type Icon = typeof Leaf;
type Post = { title: string; slug: string; category: string; date: string; excerpt: string };

const publicNav = [
  ["/", "Anasayfa"], ["/platform", "Platform"], ["/mevzuat", "Mevzuat"], ["/hizmetler", "Hizmetler"],
  ["/sektor", "Sektör"], ["/egitimler", "Eğitimler"], ["/blog", "Blog"], ["/hakkimizda", "Hakkımızda"], ["/iletisim", "İletişim"]
];

const posts: Post[] = [
  { title: "CBAM 2026 Tam Uygulamaya Geçiyor: Lojistik Firmaları Ne Yapmalı?", slug: "cbam-2026-lojistik-firmalari", category: "Mevzuat", date: "2026-01-15", excerpt: "AB ihracatı yapan lojistik firmaları için veri toplama, raporlama ve maliyet hazırlığı." },
  { title: "Yeşil Lojistik Belgesi Başvurusu: Adım Adım Kılavuz", slug: "yesil-lojistik-belgesi-basvurusu", category: "Kılavuz", date: "2026-02-01", excerpt: "Ocak başvuru penceresi, KEP, e-imza ve belge kontrol listesi." },
  { title: "Pilot Firma Deneyimi: 3 Ayda CBAM Uyumu", slug: "pilot-firma-3-ayda-cbam-uyumu", category: "Başarı Hikayesi", date: "2026-02-20", excerpt: "Pilot Firma B'nin hesaplama, uyum skoru ve beyan hazırlığı süreci." },
  { title: "CSRD vs CBAM: Türk İhracatçısının Bilmesi Gerekenler", slug: "csrd-vs-cbam", category: "Analiz", date: "2026-03-05", excerpt: "İki düzenlemenin veri kapsamı, raporlama ritmi ve tedarikçi etkisi." },
  { title: "Alman Tedarik Zinciri Yasası ve Türk Lojistik Şirketlerine Etkisi", slug: "alman-tedarik-zinciri-yasasi", category: "Mevzuat", date: "2026-03-15", excerpt: "LkSG kapsamında tedarikçi durum tespiti ve izlenebilirlik gereklilikleri." },
  { title: "YeşilPORT Webinar: Karbon Hesaplama Temelleri - Kayıt Özeti", slug: "yesilport-webinar-karbon-hesaplama", category: "Webinar", date: "2026-04-10", excerpt: "GLEC temelli taşıma emisyon hesabı ve demo platform notları." }
];

const reports = [
  "Türkiye Lojistik Sektörü Karbon Profili 2024",
  "CBAM'ın Türk Lojistik Firmalarına Etkisi",
  "Yeşil Lojistik Belge Başvuru Kılavuzu",
  "Senaryo Analizi: Karayolundan Demiryoluna Geçiş",
  "KOBİ'ler için CSRD Hazırlık Rehberi"
];

function App() {
  const user = null;
  const checked = true;
  void user;

  if (!checked) return <div className="min-h-screen grid place-items-center text-emerald-700 font-bold">YeşilPORT yükleniyor...</div>;

  return (
    <HashRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/platform" element={<PlatformPage />} />
          <Route path="/mevzuat" element={<RegulationsPage />} />
          <Route path="/hizmetler" element={<ServicesPage />} />
          <Route path="/sektor" element={<SectorPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/egitimler" element={<CoursesPage />} />
          <Route path="/egitimler/:courseId" element={<CourseDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/gizlilik" element={<LegalPage title="Gizlilik Politikası" />} />
          <Route path="/kvkk" element={<LegalPage title="KVKK Aydınlatma Metni" />} />
          <Route path="/cerezler" element={<LegalPage title="Çerez Politikası" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const nav = (
    <>
      {publicNav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `text-sm font-bold ${isActive ? "text-emerald-700" : "text-slate-700 hover:text-emerald-700"}`}>{label}</NavLink>)}
    </>
  );
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/86 backdrop-blur border-b border-slate-200">
        <div className="container h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 font-black text-xl" aria-label="YeşilPORT anasayfa">
            <span className="relative grid place-items-center w-11 h-11 rounded-full bg-emerald-100 text-emerald-700"><Anchor size={24} /><Leaf size={17} className="absolute -right-1 -top-1" /></span>
            <span>Yeşil <b>PORT</b></span>
          </Link>
          <nav className="hide-mobile flex items-center gap-5">{nav}</nav>
          <div className="hide-mobile flex items-center gap-2">
            <button className="btn btn-outline px-3" aria-label="Dil değiştir" onClick={() => i18n.changeLanguage(i18n.language === "tr" ? "en" : "tr")}><Languages size={18} /> {i18n.language.toUpperCase()}</button>
            <Link className="btn btn-primary" to="/iletisim">Demo Al</Link>
          </div>
          <button className="md:hidden p-2" aria-label="Menü" onClick={() => setOpen(true)}><Menu /></button>
        </div>
      </header>
      {open && <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}><aside className="ml-auto h-full w-80 max-w-[86vw] bg-white p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}><button className="self-end" onClick={() => setOpen(false)} aria-label="Kapat"><X /></button>{nav}<Link className="btn btn-primary" to="/iletisim" onClick={() => setOpen(false)}>Demo Al</Link></aside></div>}
      <main><Outlet /></main>
    </>
  );
}

function HeaderBlock({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return <div className="max-w-3xl mb-10 fade-up">{eyebrow && <span className="pill bg-emerald-50 text-emerald-700">{eyebrow}</span>}<h1 className="text-4xl md:text-6xl font-black tracking-normal mt-4">{title}</h1>{subtitle && <p className="text-lg text-slate-600 mt-4 leading-8">{subtitle}</p>}</div>;
}

function Footer() {
  return <footer className="bg-slate-950 text-white pt-14 pb-8"><div className="container grid md:grid-cols-4 gap-8"><div><div className="flex items-center gap-3 font-black text-xl"><Leaf /> Yeşil <b>PORT</b></div><p className="text-slate-300 mt-4">Yeditepe Üniversitesi TTO A.Ş. tarafından geliştirilen yeşil lojistik portalı.</p></div>{["Hızlı Linkler", "Hizmetler", "İletişim"].map((h, i) => <div key={h}><h3 className="font-black mb-4">{h}</h3><div className="grid gap-2 text-slate-300">{(i === 0 ? publicNav.slice(1, 5).map((x) => x[1]) : i === 1 ? ["Karbon Hesaplama", "Uyum Skoru", "Mentörlük", "Eğitimler"] : ["info@yesilport.com", "0216 578 38 34", "Teknopark İstanbul"]).map((x) => <span key={x}>{x}</span>)}</div></div>)}</div><div className="container border-t border-white/10 mt-10 pt-6 flex flex-wrap gap-4 justify-between text-sm text-slate-400"><span>© 2026 YeşilPORT | Yeditepe TTO A.Ş. | Teknopark İstanbul</span><span>KVKK | Gizlilik | Çerezler</span></div></footer>;
}

function HomePage() {
  const { days, hours, minutes, past } = useCountdown("2026-01-01T00:00:00+03:00");
  const overview: [Icon, string, string][] = [[Calculator, "Karbon Hesaplama", "Araç türü, mesafe, yakıt bazlı emisyon hesabı"], [ShieldCheck, "Uyum Skoru", "CBAM/CSRD uyum durumunuzu anlık görün"], [BarChart2, "Senaryo Analizi", "Ne yaparsanız ne kadar azaltırsınız? Sayısal cevap"]];
  return <><section className="relative min-h-[92vh] overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white"><Particles /><div className="container min-h-[92vh] flex flex-col justify-center pt-10 pb-28"><div className={`pill ${past ? "bg-red-400/20 text-red-100" : "bg-amber-400/15 text-amber-100"} w-fit mb-6`}><Sparkles size={16} /> CBAM tam uygulama: {past ? "yürürlükte" : `${days} gün ${hours} saat ${minutes} dk`}</div><h1 className="text-4xl md:text-7xl max-w-4xl font-black leading-tight tracking-normal">AB'ye İhracat Yapıyorsanız Karbon Ayak İzini Takip Etmeniz Artık Zorunlu</h1><h2 className="text-2xl md:text-3xl mt-5 text-emerald-100 font-bold">Lojistik sektörünün yeşil dönüşümü için tek platform</h2><p className="max-w-2xl mt-5 text-emerald-50/90 leading-8">CBAM, CSRD ve Yeşil Lojistik Belgesi süreçlerinizi hesaplama, skor, eğitim ve uzman desteğiyle tek panelden yönetin.</p><div className="flex flex-wrap gap-3 mt-8"><Link className="btn btn-primary" to="/iletisim">Ücretsiz Demo Al</Link><Link className="btn btn-secondary" to="/platform">Platforma Göz At</Link></div><ArrowDown className="absolute bottom-10 left-1/2 animate-bounce" /></div></section><StatsStrip /><section className="section"><div className="container"><HeaderBlock eyebrow="Platform" title="Yeşil dönüşüm için ölç, kıyasla, uygula" /> <div className="grid-auto">{overview.map(([IconCmp, title, desc]) => <Link to="/platform" className="card p-7 hover:shadow-xl hover:-translate-y-1 transition" key={title}><IconCmp className="text-emerald-600 mb-5" size={34} /><h3 className="text-xl font-black">{title}</h3><p className="text-slate-600 mt-3">{desc}</p><span className="inline-flex items-center gap-1 text-emerald-700 font-black mt-5">Detaylı İncele <ChevronRight size={18} /></span></Link>)}</div></div></section><LogoMarquee /><NewsSection /><DemoCta /><Footer /></>;
}

function Particles() {
  return <>{Array.from({ length: 22 }, (_, i) => <span key={i} className="leaf-particle" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 19) % 90}%`, animationDelay: `${i * .23}s` }} />)}</>;
}

function StatsStrip() {
  return <div className="container -mt-16 relative z-10"><div className="card grid grid-cols-2 md:grid-cols-4 gap-4 p-6 text-center">{[["500+", "Lojistik Firma"], ["10.000+", "Taşıma Analizi"], ["3", "Mevzuat Kapsamı"], ["36", "Aylık Proje"]].map(([n, l]) => <div key={l}><div className="text-3xl font-black text-emerald-700">{n}</div><div className="text-sm text-slate-600 font-bold">{l}</div></div>)}</div></div>;
}

function LogoMarquee() {
  const logos = ["Yeditepe Üniversitesi", "Teknopark İstanbul", "TÜBİTAK", "Ekin Lojistik", "İAYOSB", "TALSAD", "ENOSAD", "NAVLUNGO"];
  return <section className="section section-muted overflow-hidden"><div className="container"><h2 className="text-3xl font-black mb-8">Destekçi ve Ortaklarımız</h2></div><div className="marquee">{[...logos, ...logos].map((l, i) => <div key={`${l}${i}`} className="min-w-52 card p-5 grayscale hover:grayscale-0 transition text-center font-black text-slate-500">{l}</div>)}</div></section>;
}

function NewsSection() {
  return <section className="section"><div className="container"><HeaderBlock title="Son Mevzuat Haberleri" subtitle="CBAM, CSRD, ETS ve Yeşil Lojistik Belgesi için güncel uyarılar." /><div className="grid-auto">{posts.slice(0, 3).map((p) => <ArticleCard key={p.slug} post={p} />)}</div><Link className="btn btn-outline mt-8" to="/blog">Tüm Haberleri Gör <ChevronRight size={18} /></Link></div></section>;
}

function DemoCta() {
  return <section className="section bg-emerald-700 text-white"><div className="container grid lg:grid-cols-2 gap-10 items-center"><div><h2 className="text-4xl font-black">Platformu Ücretsiz Deneyin - 14 Gün Limitsiz Erişim</h2><p className="text-emerald-50 mt-4 leading-8">Demo talebinizi bırakın, YeşilPORT ekibi firmanız için hesaplama senaryosu hazırlasın.</p><MiniForm compact /></div><DashboardMock /></div></section>;
}

function PlatformPage() {
  return <><section className="section section-muted"><div className="container grid lg:grid-cols-2 gap-10 items-center"><HeaderBlock eyebrow="Dijital Çözüm" title="YeşilPORT Platformu" subtitle="Lojistik operasyonlarınızı yeşil dönüşüm hedefleriyle uyumlu hale getiren kapsamlı dijital çözüm." /><DashboardMock /></div></section><CalculatorDemo /><ComplianceDemo /><ScenariosSection /><CertificateGuide /><TechStack /><Footer /></>;
}

function CalculatorDemo({ panel = false }: { panel?: boolean }) {
  const [result, setResult] = useState<{ co2e: number; cost: number } | null>(null);
  const [blocked, setBlocked] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const count = Number(localStorage.getItem("demoCalcCount") ?? 0);
    if (!panel && count >= 3) { setBlocked(true); return; }
    const factor = Number(data.get("factor"));
    const co2e = Number(data.get("distance")) * Number(data.get("weight")) * (Number(data.get("fill")) / 100) * factor * Number(data.get("frequency") ?? 1);
    localStorage.setItem("demoCalcCount", String(count + 1));
    setResult({ co2e, cost: (co2e / 1000) * 50 });
  };
  return <section className={panel ? "" : "section"}><div className={panel ? "" : "container"}><HeaderBlock eyebrow="GLEC Demo" title={panel ? "Yeni Karbon Hesaplama" : "Karbon Hesaplama Motoru"} subtitle="Demo hesaplama - tam platform için üye olun." /><form onSubmit={submit} className="card p-6 grid md:grid-cols-3 gap-4"><Select name="factor" label="Taşıma Türü" options={[["0.089", "Karayolu - TIR"], ["0.016", "Denizyolu - Konteyner gemisi"], ["0.602", "Havayolu - Kargo uçağı"], ["0.028", "Demiryolu - Elektrik"]]} /><Select name="fuel" label="Yakıt Türü" options={[["DIESEL", "Dizel"], ["LNG", "LNG"], ["ELECTRIC", "Elektrik"], ["HVO", "HVO"]]} /><Input name="distance" label="Mesafe (km)" defaultValue="1250" type="number" /><Input name="weight" label="Yük miktarı (ton)" defaultValue="18" type="number" /><Input name="fill" label="Doluluk oranı (%)" defaultValue="82" type="number" /><Input name="frequency" label="Aylık sefer" defaultValue="12" type="number" /><button className="btn btn-primary md:col-span-3" type="submit"><Calculator size={18} /> Hesapla</button></form>{result && <div className="card p-6 mt-6 grid md:grid-cols-3 gap-4"><Metric label="CO2e" value={`${result.co2e.toFixed(1)} kg`} /><Metric label="Sektör ortalaması" value={`${(result.co2e * 1.12).toFixed(1)} kg`} /><Metric label="CBAM maliyeti" value={`${result.cost.toFixed(2)} EUR`} /></div>}{blocked && <div className="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4"><div className="card p-8 max-w-md"><h3 className="text-2xl font-black">Devamı için demo alın</h3><p className="text-slate-600 mt-3">Ücretsiz demo hesaplama limiti doldu. Ekibimiz firmanız için uygun senaryoyu hazırlasın.</p><Link className="btn btn-primary mt-5" to="/iletisim">Demo Al</Link></div></div>}</div></section>;
}

function ComplianceDemo() {
  return <section className="section section-muted"><div className="container grid lg:grid-cols-2 gap-10 items-center"><div><HeaderBlock eyebrow="Uyum Skoru" title="Regülasyon hazırlığınızı sayısallaştırın" subtitle="Örnek şirket skoru: CBAM 72%, CSRD 61%, YLB 68%." /><Link className="btn btn-primary" to="/iletisim">Firmanızın Skorunu Öğrenin</Link></div><Gauge score={67} /></div></section>;
}

function ScenariosSection() {
  const items = [["Euro 6 araç geçişi", 23, "14.200 EUR CBAM tasarrufu"], ["Taşıma konsolidasyonu", 18, "rota optimizasyonu"], ["HVO yakıt geçişi", 85, "azaltım potansiyeli"]];
  return <section className="section"><div className="container"><HeaderBlock title="Ne Yaparsam Ne Kadar Azaltırım?" /><div className="grid-auto">{items.map(([name, pct, desc]) => <div className="card p-6" key={name}><h3 className="font-black text-xl">{name}</h3><div className="mt-5 grid gap-3"><Bar label="Önce" value={100} color="bg-slate-300" /><Bar label="Sonra" value={100 - Number(pct)} color="bg-emerald-500" /></div><p className="mt-4 font-bold text-emerald-700">%{pct} emisyon azaltımı, {desc}</p></div>)}</div></div></section>;
}

function CertificateGuide() {
  return <section className="section section-muted"><div className="container"><HeaderBlock title="Yeşil Lojistik Belgesi Başvuru Rehberi" subtitle="Kombine Taşımacılık Yönetmeliği 27.05.2022 kapsamında Ocak ayında KEP ve e-imza ile başvuru takibi." /><div className="grid md:grid-cols-5 gap-4">{["Ön değerlendirme", "Belge toplama", "Ocak başvurusu", "Bakanlık inceleme", "Belge ve teşvik takibi"].map((s, i) => <div className="card p-5" key={s}><span className="pill bg-emerald-100 text-emerald-700">{i + 1}</span><h3 className="font-black mt-4">{s}</h3></div>)}</div><div className="card p-6 mt-6 border-emerald-200 bg-emerald-50"><b>Platform size bu süreci otomatik takip eder.</b> PDF kontrol listesi ve hatırlatmalar panelde hazırdır.</div></div></section>;
}

function TechStack() {
  return <section className="section"><div className="container"><HeaderBlock title="Güvenli Bulut Altyapısı" subtitle="JWT auth, SSL, KVKK uyumlu veri işleme, ERP/TMS API entegrasyonlarına hazır mimari." /><div className="grid md:grid-cols-4 gap-4 text-center">{["React Portal", "Express API", "PostgreSQL", "ERP/TMS"].map((x) => <div className="card p-6 font-black" key={x}>{x}</div>)}</div></div></section>;
}

function RegulationsPage() {
  const regs = [
    ["CBAM / SKDM", "EU Regulation", "Türkiye'nin AB ihracatının %45'i etkileniyor. 2023 pilot döneminden 2026 tam uygulamaya geçiş; çimento, çelik, gübre, alüminyum, elektrik ve hidrojen sektörleri."],
    ["CSRD", "EU Reporting", "ESRS standartlarıyla tedarikçi verisi, emisyon ve sürdürülebilirlik KPI raporlaması zorunlulukları."],
    ["Alman Tedarik Zinciri Yasası", "LkSG", "Türk tedarikçiler için durum tespiti, insan hakları ve çevresel risk izleme süreçleri."],
    ["Yeşil Lojistik Belgesi", "YLB", "Ocak ayında KEP ve e-imza ile başvuru; vergi istisnaları, destekler ve rekabet avantajı."],
    ["Emisyon Ticaret Sistemi Türkiye", "ETS", "Türkiye karbon piyasası gelişimi ve lojistik firmalarının maliyet hazırlığı."]
  ];
  return <><section className="section section-muted"><div className="container"><HeaderBlock title="Mevzuat Merkezi" subtitle="Aranabilir düzenleme veritabanı ve değişiklik uyarıları." /><label className="relative block max-w-2xl"><Search className="absolute left-4 top-3.5 text-slate-400" /><input className="input pl-12" placeholder="CBAM, CSRD, YLB ara..." /></label></div></section><section className="section"><div className="container grid gap-5">{regs.map(([t, b, d]) => <details className="card p-6 group" key={t} open={t.startsWith("CBAM")}><summary className="cursor-pointer flex items-center justify-between font-black text-xl"><span>{t}</span><span className="pill bg-emerald-50 text-emerald-700">{b}</span></summary><p className="text-slate-600 leading-8 mt-4">{d}</p><div className="mt-4 grid md:grid-cols-2 gap-3"><Bar label="2023 pilot" value={45} color="bg-amber-400" /><Bar label="2026 tam uygulama" value={100} color="bg-emerald-500" /></div></details>)}<Newsletter /></div></section><Footer /></>;
}

function ServicesPage() {
  const services: [Icon, string, string, string][] = [[GraduationCap, "Çevrimiçi Eğitim Modülleri", "CBAM, CSRD ve Yeşil Lojistik konularında sertifikalı online eğitimler", "text-emerald-600"], [MessageCircle, "Soru-Cevap Paketi", "Yetkili uzmanlardan 24 saat içinde cevap", "text-blue-600"], [Users, "Mentörlük Randevu Sistemi", "Akademik danışmanlarla birebir online görüşme", "text-purple-600"], [FileText, "Özel Raporlama Hizmeti", "Karbon raporu, CBAM beyan hazırlığı, CSRD raporu", "text-orange-600"], [Briefcase, "Kurumsal Danışmanlık", "Şirketinize özel dönüşüm planı", "text-teal-600"], [Zap, "Platform API Entegrasyonu", "ERP ve TMS sistemleriyle veri entegrasyonu", "text-yellow-600"]];
  return <><section className="section section-muted"><div className="container"><HeaderBlock title="Hizmetler" subtitle="Platform, eğitim, mentörlük ve kurumsal danışmanlık tek ekosistemde." /><div className="grid md:grid-cols-3 gap-5">{services.map(([IconCmp, title, desc, color]) => <div className="card p-6" key={title}><IconCmp className={color} size={34} /><h3 className="font-black text-xl mt-4">{title}</h3><p className="text-slate-600 mt-3">{desc}</p></div>)}</div></div></section><Pricing /><section className="section"><div className="container grid lg:grid-cols-2 gap-8"><HeaderBlock title="Kurumsal Danışmanlık Talebi" subtitle="Operasyon hacminizi, mevcut raporlarınızı ve öncelikli ihtiyacınızı paylaşın." /><MiniForm upload /></div></section><Footer /></>;
}

function Pricing() {
  const tiers = [["Ücretsiz", "₺0", ["Temel karbon hesaplama (5/ay)", "Mevzuat bilgileri", "Haftalık bülten"]], ["Profesyonel", "₺2.990/ay", ["Sınırsız karbon hesaplama", "Uyum skoru raporu", "10 soru-cevap kredisi/ay", "2 mentörlük seansı/yıl", "Excel/PDF raporları"]], ["Kurumsal", "Fiyat alın", ["Tüm Pro özellikler", "Özel raporlama", "API entegrasyonu", "Dedicated danışman", "YLB destek"]]];
  return <section className="section"><div className="container grid md:grid-cols-3 gap-5">{tiers.map(([name, price, features]) => <div className={`card p-7 ${name === "Profesyonel" ? "border-emerald-500 scale-[1.02]" : ""}`} key={name as string}><h3 className="text-2xl font-black">{name}</h3><p className="text-3xl font-black text-emerald-700 mt-3">{price}</p><ul className="grid gap-3 mt-6">{(features as string[]).map((f) => <li className="flex gap-2" key={f}><CheckCircle2 className="text-emerald-600 shrink-0" size={20} /> {f}</li>)}</ul><Link className="btn btn-primary mt-7 w-full" to="/iletisim">Seç</Link></div>)}</div></section>;
}

function SectorPage() {
  return <><section className="section section-muted"><div className="container"><HeaderBlock title="Sektör Verileri" subtitle="Türkiye lojistik emisyon yoğunluğu, taşıma türü karşılaştırmaları ve akademik çıktılar." /><TurkeyMap /></div></section><section className="section"><div className="container grid gap-8"><TransportTable /><RiskBars /><Downloads /><CaseStudies /><Research /></div></section><Footer /></>;
}

function TurkeyMap() {
  const cities = [["İstanbul", 78, 35, "2.8 Mt"], ["İzmir", 32, 62, "1.1 Mt"], ["Mersin", 55, 72, "1.4 Mt"], ["Ankara", 49, 45, ".9 Mt"], ["Gaziantep", 69, 61, ".8 Mt"]];
  return <div className="card p-6"><h2 className="font-black text-2xl mb-5">Türkiye Lojistik Karbon Haritası</h2><svg viewBox="0 0 100 55" className="w-full h-auto bg-emerald-50 rounded-2xl" role="img" aria-label="Türkiye karbon haritası"><path d="M8 26 C20 10,45 12,58 18 C75 26,88 19,95 31 C82 44,58 48,38 43 C22 39,10 38,8 26Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.4" />{cities.map(([name, x, y, co2]) => <g key={name}><circle cx={x} cy={y} r="3.2" fill="#0f766e"><title>{name}: {co2} yıllık CO2e</title></circle></g>)}</svg></div>;
}

function TransportTable() {
  const rows = [["Karayolu", "0.089", "Yüksek", "100"], ["Denizyolu", "0.016", "Orta", "62"], ["Havayolu", "0.602", "Çok yüksek", "240"], ["Demiryolu", "0.028", "Düşük", "70"]];
  return <div className="card p-6 overflow-x-auto"><h2 className="text-2xl font-black mb-4">Taşıma Türü Karşılaştırması</h2><table className="w-full text-left"><thead><tr className="text-slate-500"><th>Taşıma Türü</th><th>CO2e/tkm</th><th>AB Düzenlemesi Riski</th><th>Maliyet Endeksi</th></tr></thead><tbody>{rows.map((r) => <tr className="border-t" key={r[0]}><td className="py-4 font-black">{r[0]}</td><td>{r[1]}</td><td><span className={`pill ${r[2] === "Yüksek" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{r[2]}</span></td><td>{r[3]}</td></tr>)}</tbody></table></div>;
}

function RiskBars() {
  return <div className="card p-6"><h2 className="font-black text-2xl mb-5">AB İhracat Risk Endeksi</h2>{[["Tekstil", 64], ["Makine", 72], ["Gıda", 48], ["Kimya", 86], ["Otomotiv", 78], ["Lojistik", 81]].map(([l, v]) => <Bar key={l as string} label={l as string} value={v as number} color="bg-amber-500" />)}</div>;
}

function Downloads() { return <div className="grid md:grid-cols-2 gap-4">{reports.map((r) => <a className="card p-5 flex items-center justify-between font-bold" href="#" key={r}><span>{r}</span><Download className="text-emerald-600" /></a>)}</div>; }
function CaseStudies() { return <div><h2 className="font-black text-2xl mb-5">Vaka Çalışmaları</h2><div className="grid-auto">{["Firma A: Euro 6 filo ile %23 azaltım", "Firma B: 3 ayda CBAM uyumu", "Firma C: Yeşil Lojistik Belgesi aldı"].map((x) => <div className="card p-6" key={x}><p className="font-black">{x}</p><p className="text-slate-600 mt-3">Pilot şirket verileri anonimleştirilmiştir. Operasyonel KPI ve tasarruf etkisi panelden izlenmiştir.</p></div>)}</div></div>; }
function Research() { return <div><h2 className="font-black text-2xl mb-5">Araştırma Makaleleri</h2><div className="grid-auto">{["Prof.Dr. E. Şule Aydeniz", "Doç.Dr. Ahmet Turan", "Prof.Dr. E. Şule Aydeniz", "Doç.Dr. Ahmet Turan"].map((a, i) => <div className="card p-6" key={`${a}${i}`}><span className="pill bg-emerald-50 text-emerald-700">DOI: 10.2026/yesilport.{i + 1}</span><h3 className="font-black mt-4">Yeşil lojistik dönüşümünde dijital ölçümleme</h3><p className="text-slate-600 mt-2">{a} - Yeditepe Üniversitesi, 2026</p></div>)}</div></div>; }

function AboutPage() {
  const team = [["Dr. Ozan Evren", "Proje Yöneticisi / AR-GE Direktörü", "YÜ TTO Genel Müdür Yardımcısı | AB HORIZON 2020, NATO DIANA projelerinde deneyimli"], ["Prof.Dr. E. Şule Aydeniz", "Akademik Danışman", "Lojistik ve tedarik zinciri yönetimi alanında uzman"], ["Doç.Dr. Ahmet Turan", "Akademik Danışman", "Yeşil lojistik ve sürdürülebilirlik alanında uzman"], ["Tuğba Öztürk", "Proje Koordinatörü", "tugbaozturk@yeditepe.edu.tr | Proje iletişim ve koordinasyon"]];
  return <><section className="section section-muted"><div className="container"><HeaderBlock title="Yeditepe Üniversitesi Teknoloji Transfer Ofisi A.Ş." subtitle="İnönü Mah. Kayışdağı Cad. Yeditepe Üniversitesi, Ataşehir/İstanbul | 0216 578 38 34 | info@yeditepetto.com | 2018" /><p className="card p-6 font-bold">Teknopark İstanbul yerleşkesinde AR-GE faaliyetleri yürütmekteyiz.</p></div></section><section className="section"><div className="container"><h2 className="text-3xl font-black mb-6">Proje Ekibi</h2><div className="grid-auto">{team.map(([n, r, b]) => <div className="card p-6" key={n}><img className="w-24 h-24 rounded-full object-cover mb-4" alt="" src={`https://images.unsplash.com/photo-${n.includes("Şule") ? "1494790108377-be9c29b29330" : "1500648767791-00dcc994a43e"}?auto=format&fit=crop&w=200&q=80`} /><h3 className="font-black text-xl">{n}</h3><p className="text-emerald-700 font-bold">{r}</p><p className="text-slate-600 mt-3">{b}</p></div>)}</div><LogoMarquee /><Milestones /><a className="btn btn-primary" href="#"><Download size={18} /> Basın ve Medya Kiti İndir</a></div></section><Footer /></>;
}

function Milestones() { return <div className="my-10 grid md:grid-cols-6 gap-3">{["2018 TTO kuruluş", "2021-2023 İSTKA IDec-TT", "Eylül 2025 TÜBİTAK 3005", "Aralık 2025 Teknopark başvuru", "2026 Q1 MVP lansmanı", "2027 100+ aktif firma"].map((m) => <div className="card p-4 font-bold" key={m}>{m}</div>)}</div>; }

function BlogPage() {
  return <><section className="section section-muted"><div className="container"><HeaderBlock title="Blog / Haberler" subtitle="Mevzuat, analiz, başarı hikayeleri ve webinar özetleri." /><ArticleCard post={posts[0]} large /></div></section><section className="section"><div className="container grid lg:grid-cols-[1fr_280px] gap-8"><div><div className="flex flex-wrap gap-2 mb-6">{["Haber", "Analiz", "Başarı Hikayeleri", "Webinar", "Mevzuat"].map((x) => <button className="pill bg-slate-100" key={x}>{x}</button>)}</div><div className="grid md:grid-cols-3 gap-5">{posts.map((p) => <ArticleCard key={p.slug} post={p} />)}</div></div><aside className="card p-6 h-fit"><h3 className="font-black mb-4">Etiketler</h3><div className="flex flex-wrap gap-2">{["CBAM", "CSRD", "ETS", "Karbon Ayak İzi", "Yeşil Lojistik", "YLB"].map((x) => <span className="pill bg-emerald-50 text-emerald-700" key={x}>{x}</span>)}</div><Newsletter /></aside></div></section><Footer /></>;
}

function BlogDetailPage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug) ?? posts[0];
  useEffect(() => { document.title = `${post.title} | YeşilPORT`; }, [post.title]);
  return <><section className="section"><article className="container max-w-3xl"><span className="pill bg-emerald-50 text-emerald-700">{post.category} | {post.date}</span><h1 className="text-4xl md:text-6xl font-black mt-5">{post.title}</h1><p className="text-xl text-slate-600 mt-5 leading-9">{post.excerpt}</p><img className="rounded-2xl my-8 w-full aspect-video object-cover" alt="" src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80" /><p className="leading-8 text-slate-700">YeşilPORT uzmanları bu analizde veri toplama, taşıma bazlı karbon hesabı, tedarikçi uyumu, raporlama ve yönetim kurulu seviyesinde karar destek adımlarını özetler. SEO anahtar kelimeleri: CBAM, CSRD, karbon ayak izi, yeşil lojistik.</p></article></section><Footer /></>;
}

function CoursesPage() {
  return <><section className="section section-muted"><div className="container"><HeaderBlock title="Eğitimler" subtitle="CBAM, CSRD ve yeşil lojistik süreçleri için Google Drive videolarıyla beslenen statik dersler." /><div className="grid-auto">{courses.map((course) => <Link to={`/egitimler/${course.id}`} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition" key={course.id}><div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center mb-5"><GraduationCap size={28} /></div><span className="pill bg-emerald-50 text-emerald-700">{course.level}</span><h3 className="font-black text-xl mt-4">{course.title}</h3><p className="text-slate-600 mt-3">{course.instructor}</p><p className="text-sm text-slate-500 font-bold mt-5">{course.lessons[0]?.duration ?? "Süre belirtilmedi"} | {course.lessons.length} ders</p><span className="inline-flex items-center gap-1 text-emerald-700 font-black mt-5">Derse Git <ChevronRight size={18} /></span></Link>)}</div></div></section><Footer /></>;
}

function CourseDetailPage() {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === courseId) ?? courses[0];
  const [activeLessonId, setActiveLessonId] = useState(course.lessons[0]?.id ?? "");
  const activeLesson = course.lessons.find((lesson) => lesson.id === activeLessonId) ?? course.lessons[0];

  useEffect(() => {
    setActiveLessonId(course.lessons[0]?.id ?? "");
  }, [course.id, course.lessons]);

  if (!activeLesson) {
    return <><section className="section"><div className="container"><HeaderBlock title="Ders bulunamadı" subtitle="Bu kurs için henüz ders eklenmemiş." /><Link className="btn btn-primary" to="/egitimler">Eğitimlere Dön</Link></div></section><Footer /></>;
  }

  return <><section className="section section-muted"><div className="container"><HeaderBlock eyebrow={course.level} title={course.title} subtitle={course.instructor} /><div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start"><div className="card p-5"><iframe src={activeLesson.videoUrl} className="w-full aspect-video rounded-2xl" allow="autoplay" allowFullScreen title={activeLesson.title} /><h2 className="font-black text-2xl mt-6">{activeLesson.title}</h2>{activeLesson.duration && <p className="text-slate-600 mt-2">{activeLesson.duration}</p>}</div><aside className="card p-5"><h3 className="font-black text-xl mb-4">Dersler</h3><div className="grid gap-2">{course.lessons.map((lesson) => <button key={lesson.id} type="button" onClick={() => setActiveLessonId(lesson.id)} className={`text-left rounded-xl border p-4 font-bold transition ${lesson.id === activeLesson.id ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 hover:border-emerald-300"}`}><span>{lesson.title}</span>{lesson.duration && <span className="block text-sm text-slate-500 mt-1">{lesson.duration}</span>}</button>)}</div></aside></div></div></section><Footer /></>;
}

function ContactPage() {
  const faqs = ["YeşilPORT'u kimler kullanabilir?", "Karbon hesaplama sonuçları ne kadar doğru?", "CBAM beyanı için YeşilPORT yeterli mi?", "Yeşil Lojistik Belgesi başvurusunda nasıl yardımcı oluyorsunuz?", "Üyelik ücretleri nelerdir?", "Demo süresi ne kadar sürer?", "Verilerim güvende mi?", "API entegrasyonu nasıl çalışır?", "Soru-cevap kredileri ne zaman yenilenir?", "İptal politikanız nedir?"];
  return <><section className="section section-muted"><div className="container grid lg:grid-cols-2 gap-8"><div><HeaderBlock title="İletişim" subtitle="Demo talebi, genel iletişim ve medya bağlantıları." /><MiniForm /></div><div className="card p-6"><h2 className="font-black text-2xl">Teknopark İstanbul</h2><p className="text-slate-600 mt-3">Pazartesi-Cuma 09:00-18:00</p><p className="mt-4 flex gap-2"><Mail /> iletisim@yesilport.com</p><p className="mt-2 flex gap-2"><Phone /> 0216 578 38 34</p><div className="mt-6 aspect-video bg-slate-200 rounded-2xl grid place-items-center text-slate-500">Google Maps iframe placeholder</div></div></div></section><section className="section"><div className="container"><h2 className="text-3xl font-black mb-6">Sık Sorulan Sorular</h2><div className="grid gap-3">{faqs.map((q, i) => <details className="card p-5" key={q}><summary className="font-black cursor-pointer">{q}</summary><p className="text-slate-600 mt-3">YeşilPORT ekibi bu konuda demo görüşmesinde firmanıza özel yanıt verir. Soru {i + 1} için standart süreç panelden takip edilir.</p></details>)}</div><p className="mt-8 font-bold">Basın ve medya iletişimi için: iletisim@yesilport.com</p><div className="flex gap-3 mt-4"><Link to="/kvkk">KVKK Aydınlatma Metni</Link><Link to="/gizlilik">Gizlilik Politikası</Link><Link to="/cerezler">Çerez Politikası</Link></div></div></section><Footer /></>;
}

function MiniForm({ compact, upload }: { compact?: boolean; upload?: boolean }) {
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); toast.success("Talebiniz alındı, ekibimiz sizinle iletişime geçecek."); };
  return <form onSubmit={submit} className={`grid gap-3 mt-6 ${compact ? "" : "card p-6"}`}><Input name="fullName" label="Ad Soyad" /><Input name="companyName" label="Firma Adı" /><Input name="email" label="E-posta" type="email" /><Input name="phone" label="Telefon" /><Select name="transportType" label="Firmanın Ana Taşıma Türü" options={[["ROAD", "Karayolu"], ["SEA", "Denizyolu"], ["AIR", "Havayolu"], ["RAIL", "Demiryolu"]]} /><textarea className="input" rows={4} placeholder="Kısa açıklama" />{upload && <label className="input flex gap-2"><Upload /> Mevcut rapor yükle <input type="file" hidden /></label>}<label className="flex gap-2 text-sm"><input required type="checkbox" /> KVKK onayını kabul ediyorum</label><button className="btn btn-primary">Gönder</button></form>;
}

function Newsletter() { return <form className="mt-6 flex gap-2" onSubmit={(e) => { e.preventDefault(); toast.success("Talebiniz alındı, ekibimiz sizinle iletişime geçecek."); }}><input className="input" type="email" placeholder="E-posta" /><button className="btn btn-primary">Abone Ol</button></form>; }
function DashboardMock() { return <div className="card p-5 bg-white/95 text-slate-900 animate-[pulseRing_2.8s_infinite]"><div className="flex gap-2 mb-5"><span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-amber-400" /><span className="w-3 h-3 rounded-full bg-emerald-400" /></div><div className="grid grid-cols-3 gap-3 mb-4">{["42.8t", "67/100", "€14.2k"].map((x) => <div className="bg-slate-100 rounded-xl p-4 font-black" key={x}>{x}</div>)}</div>{[82, 54, 72, 38].map((v) => <Bar key={v} label="Emisyon analizi" value={v} color="bg-emerald-500" />)}</div>; }
function Gauge({ score }: { score: number }) { const color = score < 50 ? "#dc2626" : score < 75 ? "#f59e0b" : "#16a34a"; return <div className="card p-8 grid place-items-center"><svg width="220" height="220" className="donut"><circle cx="110" cy="110" r="90" stroke="#e5e7eb" strokeWidth="18" fill="none" /><circle cx="110" cy="110" r="90" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round" strokeDasharray={565} strokeDashoffset={565 - (565 * score) / 100} /></svg><div className="-mt-36 text-center mb-16"><div className="text-5xl font-black">{score}</div><div className="text-slate-500 font-bold">/100</div></div></div>; }
function Bar({ label, value, color }: { label: string; value: number; color: string }) { return <div className="my-3"><div className="flex justify-between text-sm font-bold mb-1"><span>{label}</span><span>{value}%</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full bar ${color}`} style={{ width: `${Math.min(value, 100)}%` }} /></div></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div><div className="text-sm text-slate-500 font-bold">{label}</div><div className="text-2xl font-black text-emerald-700">{value}</div></div>; }
function ArticleCard({ post, large }: { post: Post; large?: boolean }) { return <Link to={`/blog/${post.slug}`} className={`card overflow-hidden block ${large ? "md:grid md:grid-cols-2" : ""}`}><img className="w-full aspect-video object-cover" alt="" src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80" /><div className="p-6"><span className="pill bg-emerald-50 text-emerald-700">{post.category} | {post.date}</span><h3 className="font-black text-xl mt-4">{post.title}</h3><p className="text-slate-600 mt-3">{post.excerpt}</p></div></Link>; }
function Input({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) { return <label className="grid gap-1 text-sm font-bold">{label}<input className="input" required {...props} /></label>; }
function Select({ label, options, name }: { label: string; options: string[][]; name: string }) { return <label className="grid gap-1 text-sm font-bold">{label}<select className="input" name={name}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>; }
function LegalPage({ title }: { title: string }) { return <><section className="section"><div className="container max-w-3xl"><HeaderBlock title={title} /><p className="leading-8 text-slate-700">YeşilPORT, KVKK kapsamında kişisel verileri açık rıza, meşru menfaat ve sözleşme gerekliliği çerçevesinde işler. Çerezler performans, güvenlik ve tercih yönetimi için kullanılır.</p></div></section><Footer /></>; }
function useCountdown(date: string) { const [now, setNow] = useState(Date.now()); useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(id); }, []); return useMemo(() => { const diff = new Date(date).getTime() - now; const safe = Math.max(0, diff); return { past: diff <= 0, days: Math.floor(safe / 86400000), hours: Math.floor((safe / 3600000) % 24), minutes: Math.floor((safe / 60000) % 60) }; }, [date, now]); }

export default App;
