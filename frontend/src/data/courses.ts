export type Lesson = { id: string; title: string; videoUrl: string; duration?: string };

export type Course = {
  id: string;
  title: string;
  instructor: string;
  level: "FREE";
  lessons: Lesson[];
};

const drivePreviewUrl = (fileId: string) => `https://drive.google.com/file/d/${fileId}/preview`;

export const courses: Course[] = [
  {
    id: "kuresel-iklim-degisikligi-ve-uluslararasi-cevre-politikalari",
    title: "Küresel İklim Değişikliği ve Uluslararası Çevre Politikaları",
    instructor: "Dr. Öğr. Üyesi Z. Cansu Canbek Özdil",
    level: "FREE",
    lessons: [
      {
        id: "kuresel-iklim-degisikligi-ve-uluslararasi-cevre-politikalari",
        title: "Küresel İklim Değişikliği ve Uluslararası Çevre Politikaları",
        videoUrl: drivePreviewUrl("1rL8IKQkKRQ9NWSR6cOvCqPoozyzKG1yJ"),
        duration: "13 dk",
      },
    ],
  },
  {
    id: "uretim-sureclerinde-dongusellik",
    title: "Üretim Süreçlerinde Döngüsellik",
    instructor: "Dr. Öğr. Üyesi Hatice Kübra Akben",
    level: "FREE",
    lessons: [
      {
        id: "uretim-sureclerinde-dongusellik",
        title: "Üretim Süreçlerinde Döngüsellik",
        videoUrl: drivePreviewUrl("1Cipmlv4CjB-cz0PYSRci6-Yl7pi1CetF"),
        duration: "14 dk",
      },
    ],
  },
  {
    id: "emisyon-azaltim-hedefleri",
    title: "Emisyon Azaltım Hedefleri",
    instructor: "Dr. Öğr. Üyesi Z. Cansu Canbek Özdil",
    level: "FREE",
    lessons: [
      {
        id: "emisyon-azaltim-hedefleri",
        title: "Emisyon Azaltım Hedefleri",
        videoUrl: drivePreviewUrl("1DZrTzGyyrzJ6QKJb-4zAYv6umb0UMYxI"),
        duration: "12 dk",
      },
    ],
  },
  {
    id: "paris-anlasmasinin-turkiyeye-katilimi-ve-yukumlulukleri",
    title: "Paris Anlaşması'nın Türkiye'ye Katılımı ve Yükümlülükleri",
    instructor: "Dr. Öğr. Üyesi Hatice Kübra Akben",
    level: "FREE",
    lessons: [
      {
        id: "paris-anlasmasinin-turkiyeye-katilimi-ve-yukumlulukleri",
        title: "Paris Anlaşması'nın Türkiye'ye Katılımı ve Yükümlülükleri",
        videoUrl: drivePreviewUrl("1yE0kM1RZQyMnMRMTb_7u15pyMIWZDFZZ"),
        duration: "11 dk",
      },
    ],
  },
  {
    id: "surdurulebilirlik-raporlama-standartlari-tsrs",
    title: "Sürdürülebilirlik Raporlama Standartları, TSRS",
    instructor: "Dr. Öğr. Üyesi Hatice Kübra Akben",
    level: "FREE",
    lessons: [
      {
        id: "surdurulebilirlik-raporlama-standartlari-tsrs",
        title: "Sürdürülebilirlik Raporlama Standartları, TSRS",
        videoUrl: drivePreviewUrl("1RskVcIWSq6bLGsfVkFWcVqcNFuFfZ5Fd"),
        duration: "16 dk",
      },
    ],
  },
  {
    id: "iklim-degisikligi-ile-mucadelede-paris-anlasmasinin-rolu",
    title: "İklim Değişikliği ile Mücadelede Paris Anlaşması'nın Rolü",
    instructor: "Dr. Öğr. Üyesi Z. Cansu Canbek Özdil",
    level: "FREE",
    lessons: [
      {
        id: "iklim-degisikligi-ile-mucadelede-paris-anlasmasinin-rolu",
        title: "İklim Değişikliği ile Mücadelede Paris Anlaşması'nın Rolü",
        videoUrl: drivePreviewUrl("1YCSrKmJ2ssKONzb5swyhgNnaHK6MFgvn"),
        duration: "13 dk",
      },
    ],
  },
  {
    id: "ts-en-iso-14064-1-standartlarinda-kurumsal-karbon-ayakizi-hesaplama",
    title: "TS EN ISO 14064-1 Standartlarında Kurumsal Karbon Ayakizi Hesaplama",
    instructor: "Doç. Dr. Ahmet Turan",
    level: "FREE",
    lessons: [
      {
        id: "ts-en-iso-14064-1-standartlarinda-kurumsal-karbon-ayakizi-hesaplama",
        title: "TS EN ISO 14064-1 Standartlarında Kurumsal Karbon Ayakizi Hesaplama",
        videoUrl: drivePreviewUrl("14naNb759cO1qOnzDCcq13Ay_tT9M62cV"),
        duration: "5 dk",
      },
    ],
  },
  {
    id: "surdurulebilir-urun-tasarimi",
    title: "Sürdürülebilir Ürün Tasarımı",
    instructor: "Doç. Dr. Ahmet Turan",
    level: "FREE",
    lessons: [
      {
        id: "surdurulebilir-urun-tasarimi",
        title: "Sürdürülebilir Ürün Tasarımı",
        videoUrl: drivePreviewUrl("1m4W9qT_e_bPgUX3OMiwBNM4rgmyaU6oe"),
        duration: "8 dk",
      },
    ],
  },
  {
    id: "4r-prensibi",
    title: "4R Prensibi",
    instructor: "Doç. Dr. Ahmet Turan",
    level: "FREE",
    lessons: [
      {
        id: "4r-prensibi",
        title: "4R Prensibi",
        videoUrl: drivePreviewUrl("10ks_0jeIrsifF7c456mUjX7t7OKuTKxU"),
        duration: "6 dk",
      },
    ],
  },
  {
    id: "ab-dongusel-ekonomi-aksiyon-plani",
    title: "AB Döngüsel Ekonomi Aksiyon Planı",
    instructor: "Prof. Dr. Şule Aydeniz",
    level: "FREE",
    lessons: [
      {
        id: "ab-dongusel-ekonomi-aksiyon-plani",
        title: "AB Döngüsel Ekonomi Aksiyon Planı",
        videoUrl: drivePreviewUrl("1j-KoTy-JQkhah5eaygjBt7ybraGgY2E7"),
        duration: "34 dk",
      },
    ],
  },
  {
    id: "avrupa-yesil-mutabakati",
    title: "Avrupa Yeşil Mutabakatı",
    instructor: "Prof. Dr. Şule Aydeniz",
    level: "FREE",
    lessons: [
      {
        id: "avrupa-yesil-mutabakati",
        title: "Avrupa Yeşil Mutabakatı",
        videoUrl: drivePreviewUrl("1qVHXaAQftnXU3BsH-mzGySSlxfhx5G3i"),
        duration: "31 dk",
      },
    ],
  },
  {
    id: "kurumsal-surdurulebilirlik-ozen-yukumlulugu-direktifi-csddd",
    title: "Kurumsal Sürdürülebilirlik Özen Yükümlülüğü Direktifi (CSDDD)",
    instructor: "Prof. Dr. Şule Aydeniz",
    level: "FREE",
    lessons: [
      {
        id: "kurumsal-surdurulebilirlik-ozen-yukumlulugu-direktifi-csddd",
        title: "Kurumsal Sürdürülebilirlik Özen Yükümlülüğü Direktifi (CSDDD)",
        videoUrl: drivePreviewUrl("1sgOTyF_7nBEduDno2WMpllSMMBV8mvOQ"),
        duration: "27 dk",
      },
    ],
  },
  {
    id: "anahtar-urun-deger-zincirleri",
    title: "Anahtar Ürün Değer Zincirleri",
    instructor: "Prof. Dr. Şule Aydeniz",
    level: "FREE",
    lessons: [
      {
        id: "anahtar-urun-deger-zincirleri",
        title: "Anahtar Ürün Değer Zincirleri",
        videoUrl: drivePreviewUrl("1FMFemWAlrnDlf7VnyGof6Vts-rmNrZKr"),
        duration: "26 dk",
      },
    ],
  },
  {
    id: "turkiye-icin-yesil-finansman-ve-yenilenebilir-enerji-yatirimlari",
    title: "Türkiye İçin Yeşil Finansman ve Yenilenebilir Enerji Yatırımları",
    instructor: "Prof. Dr. Şule Aydeniz",
    level: "FREE",
    lessons: [
      {
        id: "turkiye-icin-yesil-finansman-ve-yenilenebilir-enerji-yatirimlari",
        title: "Türkiye İçin Yeşil Finansman ve Yenilenebilir Enerji Yatırımları",
        videoUrl: drivePreviewUrl("1Gk8ZAmjAgPWk8TSlaBB4Zr9jZrV8BomP"),
        duration: "32 dk",
      },
    ],
  },
];
