export type Lesson = { id: string; title: string; videoUrl: string; duration?: string };

export type Course = {
  id: string;
  title: string;
  level: "FREE" | "PREMIUM";
  summary: string;
  lessons: Lesson[];
};

export const courses: Course[] = [
  {
    id: "cbam-temelleri",
    title: "CBAM'ı Anlamak",
    level: "FREE",
    summary: "CBAM mekanizmasının lojistik firmalarına etkisi.",
    lessons: [
      {
        id: "1",
        title: "Giriş",
        videoUrl: "https://drive.google.com/file/d/DRIVE_FILE_ID/preview",
        duration: "12 dk",
      },
    ],
  },
];
