export type Locale = "en" | "id";

export const LOCALE_STORAGE_KEY = "pilar-locale";

type Dict = Record<string, string>;

const en: Dict = {
  "tour.kicker": "Quick intro",
  "tour.welcome.title": "Welcome to Pilar Compass",
  "tour.welcome.body":
    "A student tool for Sekolah Pilar Indonesia. Judges and guests can enter with the demo email — this short tour shows what you can do here.",
  "tour.comps.title": "Find open competitions",
  "tour.comps.body":
    "Browse Indonesian and international contests that are still open to register. Each card links to the announcement and registration — sorted by nearest deadline.",
  "tour.calc.title": "Check your university match",
  "tour.calc.body":
    "Enter Kurikulum Merdeka scores (or upload a report photo), pick a target university, and get a transparent match % with a short roadmap. Switch EN / ID anytime in the top bar.",
  "tour.next": "Next",
  "tour.back": "Back",
  "tour.skip": "Skip",
  "tour.done": "Start exploring",
  "tour.replay": "Show intro",

  "nav.home": "Home",
  "nav.competitions": "Competitions",
  "nav.calculator": "Calculator",
  "nav.tka": "TKA",
  "topbar.forStudents": "For SPI students",
  "topbar.signOut": "Sign out",
  "footer.tagline": "Preserving Own Culture, Embracing International Mindedness",
  "footer.compass":
    "Tools for Sekolah Pilar Indonesia students · Not an official admissions predictor",
  "footer.info": "Information",
  "logo.product": "Student tools",

  "gate.eyebrow": "Sekolah Pilar Indonesia",
  "gate.lede":
    "For SPI Junior & Senior High. Unlock to find open competitions and plan your university path.",
  "gate.email": "Email",
  "gate.unlock": "Unlock",
  "gate.demo": "Continue with demo email",
  "gate.fine":
    "Enter your email to continue. Later builds can restrict unlock to SPI school email format.",
  "gate.error": "Enter a valid email.",

  "home.lede":
    "Open competitions near their deadlines — and a clear path from your Kurikulum Merdeka scores to a university goal.",
  "home.cta.comps": "Find competitions",
  "home.cta.calc": "Check university match",
  "home.cta.tka": "Practice TKA",
  "home.meta.grades": "Grades 7–12",
  "home.meta.scope": "Indo + International",
  "home.meta.spi": "SPI students",

  "tka.verify.title": "Confirm your email for TKA",
  "tka.verify.body":
    "Streaks and leaderboards follow this email on any device. We’ll show a 6-digit code here until school email sending is switched on.",
  "tka.verify.send": "Send code",
  "tka.verify.code": "6-digit code",
  "tka.verify.submit": "Verify",
  "tka.verify.sent": "Code: {code}",
  "tka.verify.error": "That code did not match. Request a new one.",

  "tka.hub.eyebrow": "Tes Kemampuan Akademik",
  "tka.hub.title": "Daily TKA practice",
  "tka.hub.lede":
    "Short Duolingo-style lessons, then keep going if you want. Full tryouts when you are ready.",
  "tka.streak": "Streak",
  "tka.xpMonth": "XP this month",
  "tka.continue": "Continue a lesson",
  "tka.leaderboard": "Leaderboards",
  "tka.comingSoon": "Coming soon",
  "tka.grade": "Grade {n}",
  "tka.open": "Open",
  "tka.wajib": "Compulsory",
  "tka.pilihan": "Your electives",
  "tka.lesson": "Lesson",
  "tka.tryout": "Tryout",
  "tka.material": "Quick review",
  "tka.mastered": "Mastered",
  "tka.learning": "In progress",
  "tka.unseen": "Not started",
  "tka.check": "Check",
  "tka.correct": "Nice!",
  "tka.wrong": "Not yet — hint unlocked. This item will return.",
  "tka.hint": "Hint",
  "tka.revealed": "Explanation",
  "tka.next": "Next",
  "tka.true": "True",
  "tka.false": "False",
  "tka.lessonDone": "Lesson done — streak saved. Keep practicing?",
  "tka.another": "Another lesson",
  "tka.backSkills": "Back to skills",
  "tka.progress": "{n} left",
  "tka.onboard.title": "Set up your TKA path",
  "tka.onboard.age": "Age",
  "tka.onboard.suggested": "Suggested track: Grade {n}",
  "tka.onboard.track": "Confirm your grade",
  "tka.onboard.name": "Display name (leaderboard)",
  "tka.onboard.kelas": "Class / rombel (e.g. 12-A)",
  "tka.onboard.pilihan": "Pick exactly two electives",
  "tka.onboard.save": "Save and start",
  "tka.onboard.error": "Please complete every field. Grade 12 needs two electives.",
  "tka.lockedGrade": "Practice for this grade is not open yet.",
  "tka.lockedSubject": "This subject is not open yet.",
  "tka.official": "Official-style",
  "tka.latihan": "Practice set",
  "tka.prediction": "Prediction",
  "tka.startTryout": "Start tryout",
  "tka.untimed": "Untimed (friendly)",
  "tka.timed": "Exam timer (45 min)",
  "tka.submitTryout": "Submit paper",
  "tka.flag": "Flag",
  "tka.tryoutScore": "Score {score}% · {correct}/{total}",
  "tka.review": "Review",
  "tka.board.school": "School · Pilar Active",
  "tka.board.class": "My class",
  "tka.board.top10": "Prize zone · top 10 this month",
  "tka.board.empty": "No one on this board yet. Finish a lesson to appear.",
  "tka.days": "{n} days",
  "tka.source.official": "From the sample official paper",
  "tka.source.latihan": "Practice item",


  "comps.eyebrow": "SPI · Grades 7–12",
  "comps.title": "Competition finder",
  "comps.lede":
    "Indonesian and international contests still open to register, sorted by nearest deadline.",
  "comps.openNow": "open now",
  "comps.due7": "due in 7 days",
  "comps.search": "Search name, topic, tags…",
  "comps.field": "Field of study",
  "comps.scope": "Scope",
  "comps.openOnly": "Open only",
  "comps.refresh": "Refresh",
  "comps.showing": "Showing {count} · checked {when}",
  "comps.empty.title": "No matches",
  "comps.empty.body": "Try clearing filters or searching a broader field.",
  "comps.reset": "Reset filters",
  "comps.deadline": "Deadline {date}",
  "comps.closed": "Closed",
  "comps.closesToday": "Closes today",
  "comps.oneDay": "1 day left",
  "comps.daysLeft": "{days} days left",
  "comps.daysShort": "{days}d left",
  "comps.level.both": "JH + SH",
  "comps.level.junior": "Junior High",
  "comps.level.senior": "Senior High",
  "field.all": "All fields",
  "field.stem": "STEM",
  "field.humanities": "Humanities",
  "field.business": "Business",
  "field.arts": "Arts",
  "field.language": "Language",
  "field.multidisciplinary": "Multidisciplinary",
  "scope.all": "All scopes",
  "scope.indonesia": "Indonesia",
  "scope.international": "International",

  "calc.eyebrow": "SPI · Senior High focus",
  "calc.title": "University match calculator",
  "calc.lede":
    "Kurikulum Merdeka scores (0–100), target university, and context → a transparent match % plus a short roadmap.",
  "calc.demo": "Load demo profile",
  "calc.subjects": "Subject scores",
  "calc.avg": "Avg {avg}",
  "calc.subject": "Subject",
  "calc.remove": "Remove",
  "calc.addSubject": "Add subject",
  "calc.upload": "Upload report photo",
  "calc.ocr.reading": "Reading report…",
  "calc.ocr.ok": "Scores filled from photo — please check before calculating.",
  "calc.ocr.fail":
    "Couldn’t read the report clearly. Enter scores manually, or try a sharper photo.",
  "calc.ocr.hint": "JPG, PNG, or WEBP. Photo stays on your device.",
  "calc.target": "Target university",
  "calc.university": "University",
  "calc.country": "Country",
  "calc.region": "Region",
  "calc.region.id": "Inside Indonesia",
  "calc.region.abroad": "Abroad",
  "calc.major": "Intended major (optional)",
  "calc.optional": "Optional tests & context",
  "calc.affordability": "Affordability",
  "calc.age": "Age",
  "calc.awards": "Competition awards",
  "calc.submit": "Calculate match",
  "calc.afford.can_afford": "Can afford tuition",
  "calc.afford.middle_class": "Middle class / careful budget",
  "calc.afford.need_scholarship": "Need a scholarship",
  "calc.afford.low_budget": "Low budget",
  "calc.error.subjects": "Add at least one subject score (0–100).",
  "calc.error.range": "Scores must be between 0 and 100.",
  "calc.error.uni": "University and country are required.",
  "calc.error.age": "Enter a realistic student age.",
  "calc.result.eyebrow": "Illustrative match",
  "calc.result.avg": "Subject average {avg} · {uni}",
  "calc.breakdown": "How we scored this",
  "calc.weight": "weight {pct}%",
  "calc.roadmap": "Roadmap",
  "calc.disclaimer":
    "Disclaimer: this percentage is a transparent planning heuristic for SPI students — not an official university admissions prediction.",
  "factor.academics": "Academics",
  "factor.tests": "Standardized tests",
  "factor.financeFit": "Finance fit",
  "factor.timeline": "Timeline / age",
  "factor.extras": "Extras (awards + major)",

  "road.low":
    "Raise Kurikulum Merdeka marks in {subjects} — aim for a 80+ average before applications.",
  "road.mid":
    "Push your subject average toward 90+ with weekly past-paper drills and teacher feedback loops.",
  "road.high":
    "Keep your academic average strong; document standout projects for your SPI portfolio / personal project.",
  "road.missingTests":
    "Book IELTS or TOEFL within 8–12 weeks — most abroad pathways need an English score on file.",
  "road.ielts":
    "Retake IELTS with a 6.5–7.0 target; pair daily listening with timed Writing Task 2 practice.",
  "road.toefl":
    "Lift TOEFL toward 90–100+ with focused reading + speaking mock tests each week.",
  "road.sat":
    "Plan an SAT retake — target 1350+ with spaced math + evidence-based reading blocks.",
  "road.scholarship.abroad":
    "Map scholarship deadlines (LPDP if eligible, uni merit aid, and SPI counselor list) and align competition medals to strengthen applications.",
  "road.scholarship.id":
    "Track Beasiswa Unggulan / uni merit scholarships and use competition results as evidence of excellence.",
  "road.young":
    "Build a 2–3 year competition ladder (local → national → international) via Pilar Compass open deadlines.",
  "road.old":
    "Lock a near-term checklist for {university}: essays, transcripts, recommendation letters, and counselor timeline.",
  "road.midAge":
    "Use this year for one flagship competition + one sustained project tied to your intended major.",
  "road.major":
    "Choose competitions and reading in {major} so your SPI story matches {university}.",
  "road.noMajor":
    "Name an intended major soon — it sharpens which competitions and unis belong on your shortlist.",
  "road.parallel":
    "Add a realistic parallel university option in Indonesia while you close score and finance gaps.",

  "comp.math-challenge-2026":
    "Open national math contest by HIMATIKA REAL FMIPA Universitas Lambung Mangkurat. Gelombang 3 registration open for SMA se-Indonesia (SMP track is Kalimantan-only). First-entry — no prior olympiad stage required.",
  "comp.msi-tn-2026":
    "Open school competition (math, science, English) hosted by SMA Taruna Nusantara. Registration open from 1 August 2026 — first round is online; no national olympiad prerequisite.",
  "comp.lkip-ilmiah-2026":
    "Open research / scientific-work competition for SMP–SMA by SMA Taruna Nusantara. First submission window — no OSP/OSN medal required.",
  "comp.lkip-poster-2026":
    "Open poster track under LKIP. Registration from 1 August 2026 — suitable for JH/SH creative STEM communication.",
  "comp.apotema-lkti-2026":
    "Open national scientific writing contest for SMA/MA/SMK by HMPS Tadris Matematika UIN SATU. Abstract registration closes 4 August 2026 — enter directly (pay only if abstract passes).",
  "comp.orbit-literasi-2026":
    "Free national writing contest (short story or opinion article) for SMP & SMA with Badan Bahasa / ORBIT Edutech. Open submission until 9 August 2026 — no prior competition required.",
  "comp.nrc-essay-2026":
    "Open national essay track for SMA/SMK & university students by UKM SMART Politeknik Negeri Lampung. Gelombang 1 closes 20 August 2026 — first-entry (no olympiad medal required).",
  "comp.nrc-poster-2026":
    "Open poster design track (pelajar / mahasiswa / general). Gelombang 2 runs 21 August–21 September 2026.",
  "comp.iymc-2026":
    "Open global online math challenge. Qualification round is free/direct entry (download problems + submit by 27 September 2026). Later rounds need a qualifying score — this listing is for the open first round only.",
  "comp.nasa-space-apps-2026":
    "Open global hackathon (software, data, storytelling). Registration opens 26 August 2026 — anyone can join a local or virtual event; no olympiad prerequisite.",
};

const id: Dict = {
  "tour.kicker": "Pengenalan singkat",
  "tour.welcome.title": "Selamat datang di Pilar Compass",
  "tour.welcome.body":
    "Alat siswa untuk Sekolah Pilar Indonesia. Juri dan tamu bisa masuk dengan email demo — tur singkat ini menjelaskan apa yang bisa Anda lakukan di sini.",
  "tour.comps.title": "Temukan kompetisi yang masih buka",
  "tour.comps.body":
    "Jelajahi lomba nasional dan internasional yang masih dibuka pendaftarannya. Setiap kartu mengarah ke pengumuman dan pendaftaran — diurutkan dari deadline terdekat.",
  "tour.calc.title": "Cek kecocokan universitas",
  "tour.calc.body":
    "Masukkan nilai Kurikulum Merdeka (atau unggah foto rapor), pilih universitas tujuan, dan dapatkan persen kecocokan transparan plus roadmap singkat. Ganti EN / ID kapan saja di bilah atas.",
  "tour.next": "Lanjut",
  "tour.back": "Kembali",
  "tour.skip": "Lewati",
  "tour.done": "Mulai jelajahi",
  "tour.replay": "Tampilkan intro",

  "nav.home": "Beranda",
  "nav.competitions": "Kompetisi",
  "nav.calculator": "Kalkulator",
  "nav.tka": "TKA",
  "topbar.forStudents": "Untuk siswa SPI",
  "topbar.signOut": "Keluar",
  "footer.tagline": "Preserving Own Culture, Embracing International Mindedness",
  "footer.compass":
    "Alat untuk siswa Sekolah Pilar Indonesia · Bukan prediktor penerimaan resmi",
  "footer.info": "Informasi",
  "logo.product": "Alat siswa",

  "gate.eyebrow": "Sekolah Pilar Indonesia",
  "gate.lede":
    "Untuk siswa SMP & SMA SPI. Buka akses untuk menemukan kompetisi yang masih buka dan merencanakan jalur universitas.",
  "gate.email": "Email",
  "gate.unlock": "Buka akses",
  "gate.demo": "Lanjut dengan email demo",
  "gate.fine":
    "Masukkan email untuk melanjutkan. Versi berikutnya dapat membatasi ke email sekolah SPI.",
  "gate.error": "Masukkan email yang valid.",

  "home.lede":
    "Kompetisi yang deadline-nya masih dekat — dan jalur jelas dari nilai Kurikulum Merdeka ke tujuan universitas.",
  "home.cta.tka": "Latihan TKA",
  "home.cta.comps": "Cari kompetisi",
  "home.cta.calc": "Cek kecocokan universitas",
  "home.meta.grades": "Kelas 7–12",
  "home.meta.scope": "Nasional + Internasional",
  "home.meta.spi": "Siswa SPI",

  "tka.verify.title": "Konfirmasi email untuk TKA",
  "tka.verify.body":
    "Streak dan papan peringkat mengikuti email ini di perangkat mana pun. Kode 6 digit ditampilkan di sini sampai pengiriman email sekolah diaktifkan.",
  "tka.verify.send": "Kirim kode",
  "tka.verify.code": "Kode 6 digit",
  "tka.verify.submit": "Verifikasi",
  "tka.verify.sent": "Kode: {code}",
  "tka.verify.error": "Kode tidak cocok. Minta kode baru.",

  "tka.hub.eyebrow": "Tes Kemampuan Akademik",
  "tka.hub.title": "Latihan TKA harian",
  "tka.hub.lede":
    "Pelajaran singkat ala Duolingo, lalu lanjutkan kalau masih mau. Tryout lengkap kapan kamu siap.",
  "tka.streak": "Streak",
  "tka.xpMonth": "XP bulan ini",
  "tka.continue": "Lanjut pelajaran",
  "tka.leaderboard": "Papan peringkat",
  "tka.comingSoon": "Segera hadir",
  "tka.grade": "Kelas {n}",
  "tka.open": "Buka",
  "tka.wajib": "Wajib",
  "tka.pilihan": "Pilihanmu",
  "tka.lesson": "Pelajaran",
  "tka.tryout": "Tryout",
  "tka.material": "Ulasan singkat",
  "tka.mastered": "Dikuasai",
  "tka.learning": "Sedang jalan",
  "tka.unseen": "Belum mulai",
  "tka.check": "Periksa",
  "tka.correct": "Bagus!",
  "tka.wrong": "Belum tepat — petunjuk terbuka. Soal ini akan kembali.",
  "tka.hint": "Petunjuk",
  "tka.revealed": "Pembahasan",
  "tka.next": "Lanjut",
  "tka.true": "Benar",
  "tka.false": "Salah",
  "tka.lessonDone": "Pelajaran selesai — streak tersimpan. Lanjut latihan?",
  "tka.another": "Pelajaran lagi",
  "tka.backSkills": "Kembali ke keterampilan",
  "tka.progress": "{n} tersisa",
  "tka.onboard.title": "Atur jalur TKA",
  "tka.onboard.age": "Usia",
  "tka.onboard.suggested": "Saran jenjang: Kelas {n}",
  "tka.onboard.track": "Konfirmasi kelas",
  "tka.onboard.name": "Nama tampilan (papan peringkat)",
  "tka.onboard.kelas": "Kelas / rombel (contoh 12-A)",
  "tka.onboard.pilihan": "Pilih tepat dua mata pelajaran pilihan",
  "tka.onboard.save": "Simpan dan mulai",
  "tka.onboard.error": "Lengkapi semua isian. Kelas 12 wajib dua pilihan.",
  "tka.lockedGrade": "Latihan untuk jenjang ini belum dibuka.",
  "tka.lockedSubject": "Mapel ini belum dibuka.",
  "tka.official": "Gaya naskah resmi",
  "tka.latihan": "Set latihan",
  "tka.prediction": "Prediksi",
  "tka.startTryout": "Mulai tryout",
  "tka.untimed": "Tanpa timer (santai)",
  "tka.timed": "Timer ujian (45 menit)",
  "tka.submitTryout": "Kumpulkan",
  "tka.flag": "Tandai",
  "tka.tryoutScore": "Skor {score}% · {correct}/{total}",
  "tka.review": "Ulasan",
  "tka.board.school": "Sekolah · Pilar Active",
  "tka.board.class": "Kelasku",
  "tka.board.top10": "Zona hadiah · 10 besar bulan ini",
  "tka.board.empty": "Papan ini masih kosong. Selesaikan pelajaran agar namamu muncul.",
  "tka.days": "{n} hari",
  "tka.source.official": "Dari contoh naskah resmi",
  "tka.source.latihan": "Soal latihan",


  "comps.eyebrow": "SPI · Kelas 7–12",
  "comps.title": "Pencari kompetisi",
  "comps.lede":
    "Lomba nasional dan internasional yang masih dibuka pendaftarannya, diurutkan dari deadline terdekat.",
  "comps.openNow": "masih buka",
  "comps.due7": "deadline ≤ 7 hari",
  "comps.search": "Cari nama, topik, tag…",
  "comps.field": "Bidang",
  "comps.scope": "Cakupan",
  "comps.openOnly": "Hanya yang buka",
  "comps.refresh": "Segarkan",
  "comps.showing": "Menampilkan {count} · dicek {when}",
  "comps.empty.title": "Tidak ada hasil",
  "comps.empty.body": "Coba reset filter atau perluas pencarian.",
  "comps.reset": "Reset filter",
  "comps.deadline": "Deadline {date}",
  "comps.closed": "Ditutup",
  "comps.closesToday": "Tutup hari ini",
  "comps.oneDay": "1 hari lagi",
  "comps.daysLeft": "{days} hari lagi",
  "comps.daysShort": "{days}h lagi",
  "comps.level.both": "SMP + SMA",
  "comps.level.junior": "SMP",
  "comps.level.senior": "SMA",
  "field.all": "Semua bidang",
  "field.stem": "STEM",
  "field.humanities": "Humaniora",
  "field.business": "Bisnis",
  "field.arts": "Seni",
  "field.language": "Bahasa",
  "field.multidisciplinary": "Multidisiplin",
  "scope.all": "Semua cakupan",
  "scope.indonesia": "Indonesia",
  "scope.international": "Internasional",

  "calc.eyebrow": "SPI · Fokus SMA",
  "calc.title": "Kalkulator kecocokan universitas",
  "calc.lede":
    "Nilai Kurikulum Merdeka (0–100), universitas tujuan, dan konteks → persen kecocokan transparan plus roadmap singkat.",
  "calc.demo": "Muat profil demo",
  "calc.subjects": "Nilai mata pelajaran",
  "calc.avg": "Rata {avg}",
  "calc.subject": "Mata pelajaran",
  "calc.remove": "Hapus",
  "calc.addSubject": "Tambah mapel",
  "calc.upload": "Unggah foto rapor",
  "calc.ocr.reading": "Membaca rapor…",
  "calc.ocr.ok": "Nilai terisi dari foto — periksa dulu sebelum menghitung.",
  "calc.ocr.fail":
    "Rapor belum terbaca jelas. Isi nilai secara manual, atau coba foto yang lebih tajam.",
  "calc.ocr.hint": "JPG, PNG, atau WEBP. Foto tetap di perangkat Anda.",
  "calc.target": "Universitas tujuan",
  "calc.university": "Universitas",
  "calc.country": "Negara",
  "calc.region": "Wilayah",
  "calc.region.id": "Di Indonesia",
  "calc.region.abroad": "Luar negeri",
  "calc.major": "Jurusan tujuan (opsional)",
  "calc.optional": "Tes opsional & konteks",
  "calc.affordability": "Kemampuan biaya",
  "calc.age": "Usia",
  "calc.awards": "Penghargaan kompetisi",
  "calc.submit": "Hitung kecocokan",
  "calc.afford.can_afford": "Mampu biaya kuliah",
  "calc.afford.middle_class": "Menengah / anggaran hati-hati",
  "calc.afford.need_scholarship": "Butuh beasiswa",
  "calc.afford.low_budget": "Anggaran terbatas",
  "calc.error.subjects": "Tambahkan minimal satu nilai mapel (0–100).",
  "calc.error.range": "Nilai harus antara 0 dan 100.",
  "calc.error.uni": "Universitas dan negara wajib diisi.",
  "calc.error.age": "Masukkan usia siswa yang realistis.",
  "calc.result.eyebrow": "Kecocokan ilustratif",
  "calc.result.avg": "Rata-rata mapel {avg} · {uni}",
  "calc.breakdown": "Cara kami menghitung",
  "calc.weight": "bobot {pct}%",
  "calc.roadmap": "Roadmap",
  "calc.disclaimer":
    "Disclaimer: persentase ini adalah heuristik perencanaan transparan untuk siswa SPI — bukan prediksi penerimaan resmi universitas.",
  "factor.academics": "Akademik",
  "factor.tests": "Tes standar",
  "factor.financeFit": "Kesesuaian biaya",
  "factor.timeline": "Timeline / usia",
  "factor.extras": "Tambahan (penghargaan + jurusan)",

  "road.low":
    "Naikkan nilai Kurikulum Merdeka di {subjects} — target rata-rata 80+ sebelum pendaftaran.",
  "road.mid":
    "Dorong rata-rata mapel menuju 90+ dengan latihan soal mingguan dan umpan balik guru.",
  "road.high":
    "Jaga rata-rata akademik tetap kuat; dokumentasikan proyek unggulan untuk portofolio / personal project SPI.",
  "road.missingTests":
    "Jadwalkan IELTS atau TOEFL dalam 8–12 minggu — jalur luar negeri biasanya membutuhkan skor bahasa Inggris.",
  "road.ielts":
    "Ulangi IELTS dengan target 6.5–7.0; padukan listening harian dengan latihan Writing Task 2 berwaktu.",
  "road.toefl":
    "Naikkan TOEFL menuju 90–100+ dengan mock reading + speaking setiap minggu.",
  "road.sat":
    "Rencanakan ulang SAT — target 1350+ dengan blok matematika dan evidence-based reading.",
  "road.scholarship.abroad":
    "Petakan deadline beasiswa (LPDP jika memenuhi syarat, merit aid kampus, dan daftar konselor SPI) serta selaraskan medali kompetisi.",
  "road.scholarship.id":
    "Pantau Beasiswa Unggulan / beasiswa merit kampus dan gunakan hasil kompetisi sebagai bukti keunggulan.",
  "road.young":
    "Bangun tangga kompetisi 2–3 tahun (lokal → nasional → internasional) lewat deadline terbuka di Pilar Compass.",
  "road.old":
    "Kunci checklist jangka dekat untuk {university}: esai, transkrip, surat rekomendasi, dan timeline konselor.",
  "road.midAge":
    "Pakai tahun ini untuk satu kompetisi unggulan + satu proyek berkelanjutan terkait jurusan tujuan.",
  "road.major":
    "Pilih kompetisi dan bacaan di bidang {major} agar cerita SPI selaras dengan {university}.",
  "road.noMajor":
    "Tentukan jurusan tujuan segera — ini mempertajam kompetisi dan universitas di shortlist Anda.",
  "road.parallel":
    "Tambahkan opsi universitas paralel yang realistis di Indonesia sambil menutup gap nilai dan biaya.",

  "comp.math-challenge-2026":
    "Olimpiade matematika nasional terbuka oleh HIMATIKA REAL FMIPA ULM. Pendaftaran gelombang 3 untuk SMA se-Indonesia (jalur SMP khusus Kalimantan). Masuk langsung — tanpa tahap olimpiade sebelumnya.",
  "comp.msi-tn-2026":
    "Kompetisi sekolah terbuka (matematika, sains, bahasa Inggris) oleh SMA Taruna Nusantara. Pendaftaran dibuka 1 Agustus 2026 — babak pertama daring; tanpa syarat medali OSN.",
  "comp.lkip-ilmiah-2026":
    "Lomba karya ilmiah/inovasi terbuka untuk SMP–SMA oleh SMA Taruna Nusantara. Jendela pengumpulan pertama — tanpa medali OSP/OSN.",
  "comp.lkip-poster-2026":
    "Jalur poster LKIP. Pendaftaran dari 1 Agustus 2026 — cocok untuk komunikasi STEM kreatif SMP/SMA.",
  "comp.apotema-lkti-2026":
    "Lomba karya tulis ilmiah nasional untuk SMA/MA/SMK oleh HMPS Tadris Matematika UIN SATU. Pendaftaran abstrak ditutup 4 Agustus 2026 — masuk langsung (bayar jika abstrak lolos).",
  "comp.orbit-literasi-2026":
    "Lomba menulis nasional gratis (cerpen atau opini) untuk SMP & SMA bersama Badan Bahasa / ORBIT Edutech. Pengumpulan hingga 9 Agustus 2026 — tanpa syarat kompetisi sebelumnya.",
  "comp.nrc-essay-2026":
    "Jalur esai nasional untuk SMA/SMK & mahasiswa oleh UKM SMART Politeknik Negeri Lampung. Gelombang 1 ditutup 20 Agustus 2026 — masuk langsung.",
  "comp.nrc-poster-2026":
    "Jalur desain poster (pelajar / mahasiswa / umum). Gelombang 2: 21 Agustus–21 September 2026.",
  "comp.iymc-2026":
    "Tantangan matematika daring global. Babak kualifikasi gratis/langsung (unduh soal + kumpulkan sebelum 27 September 2026). Babak berikutnya butuh skor lolos — listing ini untuk babak pertama terbuka saja.",
  "comp.nasa-space-apps-2026":
    "Hackathon global terbuka (software, data, storytelling). Pendaftaran dibuka 26 Agustus 2026 — siapa pun bisa ikut event lokal atau virtual; tanpa syarat olimpiade.",
};

export const dictionaries: Record<Locale, Dict> = { en, id };

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const template = dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    String(vars[name] ?? `{${name}}`),
  );
}
