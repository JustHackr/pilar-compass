import type { TkaTrack } from "@/lib/tka/grade";

export type TkaSkill = {
  id: string;
  subjectId: string;
  track?: TkaTrack;
  titleEn: string;
  titleId: string;
  materialEn: string;
  materialId: string;
};

export const GRADE12_MATH_SKILLS: TkaSkill[] = [
  {
    id: "spl",
    subjectId: "matematika",
    titleEn: "Systems of linear equations",
    titleId: "Sistem persamaan linear",
    materialEn:
      "Two or three unknowns: write equations from a story, then substitute or eliminate. Check the solution in both originals.",
    materialId:
      "Dua atau tiga peubah: ubah cerita jadi persamaan, lalu substitusi atau eliminasi. Cek hasil ke kedua persamaan semula.",
  },
  {
    id: "pertidaksamaan",
    subjectId: "matematika",
    titleEn: "Linear inequalities",
    titleId: "Pertidaksamaan linear",
    materialEn:
      "Flip the inequality when multiplying or dividing by a negative. Graph the feasible region as a half-plane.",
    materialId:
      "Balik tanda ketaksamaan jika mengalikan atau membagi dengan bilangan negatif. Grafik daerah himpunan penyelesaian adalah setengah bidang.",
  },
  {
    id: "invers",
    subjectId: "matematika",
    titleEn: "Inverse functions",
    titleId: "Invers fungsi",
    materialEn:
      "Swap x and y, then solve for y. Check that (f ∘ f⁻¹)(x) = x on the domain.",
    materialId:
      "Tukar x dan y, lalu selesaikan untuk y. Periksa (f ∘ f⁻¹)(x) = x pada domainnya.",
  },
  {
    id: "komposisi",
    subjectId: "matematika",
    titleEn: "Function composition",
    titleId: "Komposisi fungsi",
    materialEn:
      "(f ∘ g)(x) = f(g(x)). Work inside-out. To recover f from (f ∘ g), substitute u = g(x).",
    materialId:
      "(f ∘ g)(x) = f(g(x)). Kerjakan dari dalam. Untuk memperoleh f dari (f ∘ g), substitusi u = g(x).",
  },
  {
    id: "barisan_deret",
    subjectId: "matematika",
    titleEn: "Sequences and series",
    titleId: "Barisan dan deret",
    materialEn:
      "Arithmetic: Un = a + (n−1)d. Geometric: Un = a · r^(n−1). Sum formulas follow from those.",
    materialId:
      "Aritmetika: Un = a + (n−1)d. Geometri: Un = a · r^(n−1). Rumus jumlah mengikuti dari situ.",
  },
  {
    id: "bangun_ruang",
    subjectId: "matematika",
    titleEn: "Volume and surface area",
    titleId: "Volume dan luas permukaan",
    materialEn:
      "Prism/cylinder V = base area × height. Pyramid/cone V = (1/3) base × height. Sphere V = 4/3 π r³.",
    materialId:
      "Prisma/tabung V = luas alas × tinggi. Limas/kerucut V = (1/3) alas × tinggi. Bola V = 4/3 π r³.",
  },
  {
    id: "trigonometri",
    subjectId: "matematika",
    titleEn: "Trigonometric ratios",
    titleId: "Perbandingan trigonometri",
    materialEn:
      "sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent. In quadrant II, sine is positive and cosine is negative.",
    materialId:
      "sin = depan/miring, cos = samping/miring, tan = depan/samping. Di kuadran II, sinus positif dan kosinus negatif.",
  },
  {
    id: "penyajian_data",
    subjectId: "matematika",
    titleEn: "Data displays",
    titleId: "Penyajian data",
    materialEn:
      "Read bar, line, and pie charts carefully: the biggest jump is the largest difference between consecutive categories, not the tallest bar.",
    materialId:
      "Baca diagram batang, garis, dan lingkaran dengan teliti: kenaikan tertinggi adalah selisih berurutan terbesar, bukan batang tertinggi.",
  },
  {
    id: "statistika",
    subjectId: "matematika",
    titleEn: "Center and spread",
    titleId: "Ukuran pemusatan dan penyebaran",
    materialEn:
      "Mean = sum / n. Median is the middle after sorting. Mode is the most frequent. Range = max − min.",
    materialId:
      "Rata-rata = jumlah / n. Median adalah nilai tengah setelah diurutkan. Modus paling sering muncul. Jangkauan = maks − min.",
  },
  {
    id: "peluang",
    subjectId: "matematika",
    titleEn: "Compound probability",
    titleId: "Peluang majemuk",
    materialEn:
      "Without replacement, the denominator drops. Sequential events: multiply along the path.",
    materialId:
      "Tanpa pengembalian, penyebut berkurang. Kejadian berurutan: kalikan sepanjang jalur.",
  },
  {
    id: "program_linear",
    subjectId: "matematika",
    titleEn: "Linear programming",
    titleId: "Program linear",
    materialEn:
      "Graph constraints, find corner points of the feasible region, evaluate the objective at each corner.",
    materialId:
      "Gambar kendala, cari titik pojok daerah fisibel, evaluasi fungsi objektif di setiap pojok.",
  },
  {
    id: "geometri",
    subjectId: "matematika",
    titleEn: "Lines, angles, and planes",
    titleId: "Garis, sudut, dan bidang",
    materialEn:
      "Parallel lines make equal corresponding angles. A trapezoid has exactly one pair of parallel sides.",
    materialId:
      "Garis sejajar membuat sudut sehadap sama. Trapesium punya tepat satu pasang sisi sejajar.",
  },
  {
    id: "keliling_luas",
    subjectId: "matematika",
    titleEn: "Perimeter and area",
    titleId: "Keliling dan luas bangun datar",
    materialEn:
      "Trapezoid area = (a+b)/2 × h. Triangle = (1/2)bh. Circle = πr², circumference 2πr.",
    materialId:
      "Luas trapesium = (a+b)/2 × t. Segitiga = (1/2)a t. Lingkaran = πr², keliling 2πr.",
  },
  {
    id: "fungsi_grafik",
    subjectId: "matematika",
    titleEn: "Graphs of functions",
    titleId: "Grafik fungsi",
    materialEn:
      "Quadratic ax²+bx+c opens up if a>0. Vertex at x = −b/(2a). Domain of 1/(x−k) excludes x = k.",
    materialId:
      "Kuadrat ax²+bx+c terbuka ke atas jika a>0. Puncak di x = −b/(2a). Domain 1/(x−k) tidak memuat x = k.",
  },
  {
    id: "transformasi",
    subjectId: "matematika",
    titleEn: "Geometric transformations",
    titleId: "Transformasi geometri",
    materialEn:
      "Dilation by k from the origin: (x,y) → (kx, ky). Lengths scale by |k|; areas by k².",
    materialId:
      "Dilatasi k dari origin: (x,y) → (kx, ky). Panjang dikali |k|; luas dikali k².",
  },
  {
    id: "pencacahan",
    subjectId: "matematika",
    titleEn: "Counting principles",
    titleId: "Aturan pencacahan",
    materialEn:
      "Multiply independent choices. Permutation P(n,r) = n!/(n−r)! when order matters. Combination C(n,r) when it does not.",
    materialId:
      "Kalikan pilihan independen. Permutasi P(n,r) = n!/(n−r)! jika urutan penting. Kombinasi C(n,r) jika tidak.",
  },
];

export const GRADE12_KIMIA_SKILLS: TkaSkill[] = [
  {
    id: "ikatan",
    subjectId: "kimia",
    titleEn: "Bonding and molecular shape",
    titleId: "Ikatan dan bentuk molekul",
    materialEn:
      "Ionic: high melting point, conducts when molten/aqueous. Covalent: low melting point. Expanded octet (PCl5) is allowed for period 3. VSEPR: AX4 tetrahedral, AX4E2 square planar, AX2E3 linear — all can be nonpolar if ligands match.",
    materialId:
      "Ion: titik leleh tinggi, menghantar saat leleh/larutan. Kovalen: titik leleh rendah. Oktet berkembang (PCl5) boleh untuk periode 3. VSEPR: AX4 tetrahedral, AX4E2 segiempat datar, AX2E3 linier — bisa nonpolar jika ligan sama.",
  },
  {
    id: "stoikiometri",
    subjectId: "kimia",
    titleEn: "Stoichiometry",
    titleId: "Stoikiometri",
    materialEn:
      "Mass % of an element = n×Ar / Mr. At the same T,P, gas volume ∝ moles. Limiting reagent: convert both to moles, use the ratio. n = PV/RT; molecules = n × NA.",
    materialId:
      "% massa unsur = n×Ar / Mr. Pada T,P sama, volume gas sebanding mol. Pereaksi pembatas: ubah ke mol, pakai koefisien. n = PV/RT; jumlah molekul = n × NA.",
  },
  {
    id: "hidrokarbon",
    subjectId: "kimia",
    titleEn: "Hydrocarbons",
    titleId: "Hidrokarbon",
    materialEn:
      "CxHy + (x+y/4)O2 → x CO2 + (y/2) H2O. More negative ΔHc means more energy per mole; the isomer that releases less is usually more stable. Greener fuel often means more energy per CO2 produced.",
    materialId:
      "CxHy + (x+y/4)O2 → x CO2 + (y/2) H2O. ΔHc lebih negatif = energi per mol lebih besar; isomer yang melepas lebih sedikit biasanya lebih stabil. Bahan bakar lebih ramah: energi lebih besar per mol CO2.",
  },
  {
    id: "asam_basa",
    subjectId: "kimia",
    titleEn: "Acids, bases, and titration",
    titleId: "Asam basa dan titrasi",
    materialEn:
      "Brønsted pair: differ by one H+. Phenolphthalein is colorless below pH 8 and pink above. Titration: n_acid × valence = n_base × valence. Acid buffer: HA + A−, pH ≈ pKa.",
    materialId:
      "Pasangan Brønsted: beda satu H+. Fenolftalein tak berwarna di bawah pH 8, merah muda di atasnya. Titrasi: n asam × valensi = n basa × valensi. Penyangga asam: HA + A−, pH ≈ pKa.",
  },
  {
    id: "larutan_elektrolit",
    subjectId: "kimia",
    titleEn: "Solutions and electrolytes",
    titleId: "Larutan dan elektrolit",
    materialEn:
      "Strong ionic salts conduct when molten and in water. Weak acids glow dimly only in solution. Conductivity rises with ion count × concentration. Ethanol does not conduct.",
    materialId:
      "Garam ion kuat menghantar saat leleh dan dalam air. Asam lemah nyala redup hanya dalam larutan. Konduktivitas naik dengan jumlah ion × konsentrasi. Etanol tidak menghantar.",
  },
  {
    id: "ksp",
    subjectId: "kimia",
    titleEn: "Solubility product",
    titleId: "Hasil kali kelarutan (Ksp)",
    materialEn:
      "After mixing, dilute concentrations. Q = [cation]^a [anion]^b. If Q > Ksp a precipitate forms; Q < Ksp stays dissolved; Q = Ksp is saturated.",
    materialId:
      "Setelah dicampur, encerkan konsentrasi. Q = [kation]^a [anion]^b. Q > Ksp endapan terbentuk; Q < Ksp larut; Q = Ksp tepat jenuh.",
  },
  {
    id: "koligatif",
    subjectId: "kimia",
    titleEn: "Colligative properties",
    titleId: "Sifat koligatif",
    materialEn:
      "π = iMRT. ΔTf = Kf × m × i. Salt lowers freezing point (roads, antifreeze). More particles (van’t Hoff i) lower vapor pressure more.",
    materialId:
      "π = iMRT. ΔTf = Kf × m × i. Garam menurunkan titik beku (jalan, antibeku). Makin banyak partikel (faktor i), tekanan uap makin turun.",
  },
  {
    id: "termokimia",
    subjectId: "kimia",
    titleEn: "Thermochemistry",
    titleId: "Termokimia",
    materialEn:
      "Q = m c ΔT. For a combustion, ΔH is negative if heat is released. Bond energy: ΔH = Σ broken − Σ formed. Scale by moles actually used.",
    materialId:
      "Q = m c ΔT. Pembakaran: ΔH negatif jika kalor dilepas. Energi ikatan: ΔH = Σ putus − Σ terbentuk. Kalikan dengan mol yang benar-benar dipakai.",
  },
  {
    id: "kesetimbangan",
    subjectId: "kimia",
    titleEn: "Chemical equilibrium",
    titleId: "Kesetimbangan kimia",
    materialEn:
      "Endothermic (ΔH > 0): heat shifts right. Exothermic: cool shifts right. Catalyst does not shift K. Equal gas moles: pressure does not shift. Contact process: catalyst V2O5, remove SO3; raising T and expanding volume is not optimum.",
    materialId:
      "Endoterm (ΔH > 0): panas menggeser ke kanan. Eksoterm: dingin ke kanan. Katalis tidak menggeser K. Mol gas sama: tekanan tidak menggeser. Proses kontak: katalis V2O5, pisahkan SO3; menaikkan T dan memperbesar volume bukan kondisi optimum.",
  },
  {
    id: "elektrokimia",
    subjectId: "kimia",
    titleEn: "Electrochemistry",
    titleId: "Elektrokimia",
    materialEn:
      "Oxidizing agent is reduced (gains electrons). In alkaline batteries MnO2 is reduced. Anode: oxidation, mass may fall; cathode: reduction.",
    materialId:
      "Oksidator mengalami reduksi (menerima elektron). Pada baterai alkalin MnO2 direduksi. Anoda: oksidasi, massa bisa berkurang; katoda: reduksi.",
  },
];

export const GRADE12_BI_SKILLS: TkaSkill[] = [
  {
    id: "bi-kosakata",
    subjectId: "bahasa_indonesia",
    titleEn: "Vocabulary in context",
    titleId: "Makna kata dalam konteks",
    materialEn: "Use the surrounding sentence, not a dictionary first. Hajatan is a ceremonial gathering; sesepuh is an elder people look to.",
    materialId: "Gunakan kalimat di sekitar kata, bukan kamus dulu. Hajatan = acara penting; sesepuh = orang yang dituakan.",
  },
  {
    id: "bi-gagasan",
    subjectId: "bahasa_indonesia",
    titleEn: "Main idea and supporting details",
    titleId: "Gagasan pokok dan penjelas",
    materialEn: "The main idea is the claim. A supporting detail must actually back that claim, not a counter-example.",
    materialId: "Gagasan pokok adalah klaim. Gagasan penjelas harus mendukung klaim itu, bukan contoh tandingan.",
  },
  {
    id: "bi-paragraf",
    subjectId: "bahasa_indonesia",
    titleEn: "Paragraph relationships",
    titleId: "Hubungan antargaragraf",
    materialEn: "Ask: does paragraph 2 give cause, effect, contrast, example, or solution for paragraph 1?",
    materialId: "Tanya: apakah paragraf 2 memberi sebab, akibat, kontras, contoh, atau solusi bagi paragraf 1?",
  },
  {
    id: "bi-sastra",
    subjectId: "bahasa_indonesia",
    titleEn: "Literary reading",
    titleId: "Membaca sastra",
    materialEn: "Track character, setting, conflict, and the closing action. Relief after waiting often needs an apology or a reunion.",
    materialId: "Lacak tokoh, latar, konflik, dan tindakan penutup. Rasa lega setelah menunggu biasanya butuh permintaan maaf atau pertemuan kembali.",
  },
  {
    id: "bi-opini",
    subjectId: "bahasa_indonesia",
    titleEn: "Opinion and data",
    titleId: "Opini dan data",
    materialEn: "Match each claim to a number or fact in the text. A true environmental fact that is about a different cause does not support the claim.",
    materialId: "Pasangkan klaim dengan angka atau fakta di teks. Fakta lingkungan yang sebabnya berbeda tidak mendukung klaim.",
  },
];

export const GRADE12_EN_SKILLS: TkaSkill[] = [
  {
    id: "en-narrative",
    subjectId: "bahasa_inggris",
    titleEn: "Story summary and order",
    titleId: "Ringkasan dan urutan cerita",
    materialEn: "Beginning → problem → solution → lesson. Drop any option that invents a fight, a new king, or a lost mouse.",
    materialId: "Awal → masalah → solusi → pesan. Buang opsi yang menambah perkelahian, raja baru, atau tikus yang tersesat.",
  },
  {
    id: "en-message",
    subjectId: "bahasa_inggris",
    titleEn: "Author’s purpose and message",
    titleId: "Tujuan dan pesan penulis",
    materialEn: "Tick every option the text actually teaches. Skip jokes about never waking animals unless that is the moral.",
    materialId: "Centang setiap opsi yang memang diajarkan teks. Lewati candaan 'jangan bangunkan hewan' jika itu bukan amanat.",
  },
  {
    id: "en-detail",
    subjectId: "bahasa_inggris",
    titleEn: "Details and inference",
    titleId: "Rincian dan inferensi",
    materialEn: "A detail is 'mentioned clearly' only if the sentence is in the text. Inference still has to fit the words.",
    materialId: "Rincian 'disebutkan jelas' hanya jika kalimatnya ada di teks. Inferensi tetap harus cocok dengan kata-kata itu.",
  },
  {
    id: "en-info",
    subjectId: "bahasa_inggris",
    titleEn: "Informational texts",
    titleId: "Teks informasi",
    materialEn: "Tables give numbers; paragraphs give advice. Audience is who the writer talks to, not every possible reader.",
    materialId: "Tabel memberi angka; paragraf memberi saran. Audiens adalah siapa yang diajak bicara penulis, bukan semua orang.",
  },
];

export const GRADE6_BI_SKILLS: TkaSkill[] = [
  {
    id: "bi6-tersurat",
    subjectId: "bahasa_indonesia",
    track: "6",
    titleEn: "Explicit information",
    titleId: "Informasi tersurat",
    materialEn: "Explicit means the sentence is written in the text. Do not add what is only implied.",
    materialId: "Tersurat = tertulis langsung. Jangan menambah apa yang hanya tersirat.",
  },
  {
    id: "bi6-simpulan",
    subjectId: "bahasa_indonesia",
    track: "6",
    titleEn: "Simple inference",
    titleId: "Simpulan sederhana",
    materialEn: "Join the clues in the sentences. Rajin belajar + membantu teman → disenangi.",
    materialId: "Gabungkan petunjuk di kalimat. Rajin belajar + membantu teman → disenangi.",
  },
  {
    id: "bi6-opini",
    subjectId: "bahasa_indonesia",
    track: "6",
    titleEn: "Fact vs opinion",
    titleId: "Fakta dan opini",
    materialEn: "Facts can be checked (east, 100°C). Opinions use words like indah or paling.",
    materialId: "Fakta bisa dicek (timur, 100°C). Opini memakai kata seperti indah atau paling.",
  },
];

export const GRADE6_MATH_SKILLS: TkaSkill[] = [
  {
    id: "m6-hitung",
    subjectId: "matematika",
    track: "6",
    titleEn: "Whole-number operations",
    titleId: "Operasi hitung",
    materialEn: "Division is the inverse of multiplication. 125 ÷ 25 = 5 because 25 × 5 = 125.",
    materialId: "Pembagian kebalikan perkalian. 125 ÷ 25 = 5 karena 25 × 5 = 125.",
  },
  {
    id: "m6-geometri",
    subjectId: "matematika",
    track: "6",
    titleEn: "Rectangle area",
    titleId: "Luas persegi panjang",
    materialEn: "Area = length × width. Units stay cm².",
    materialId: "Luas = panjang × lebar. Satuan tetap cm².",
  },
  {
    id: "m6-data",
    subjectId: "matematika",
    track: "6",
    titleEn: "Mean",
    titleId: "Rata-rata",
    materialEn: "Mean × count = total. Missing value = total − known numbers.",
    materialId: "Rata-rata × banyak data = jumlah. Nilai yang hilang = jumlah − yang diketahui.",
  },
];

export const GRADE9_BI_SKILLS: TkaSkill[] = [
  {
    id: "bi9-idepokok",
    subjectId: "bahasa_indonesia",
    track: "9",
    titleEn: "Main idea",
    titleId: "Ide pokok",
    materialEn: "The main idea covers the whole paragraph, not one example only.",
    materialId: "Ide pokok mencakup seluruh paragraf, bukan satu contoh saja.",
  },
  {
    id: "bi9-opini",
    subjectId: "bahasa_indonesia",
    track: "9",
    titleEn: "Opinion vs fact",
    titleId: "Opini versus fakta",
    materialEn: "Paling indah is opinion. Ibu kota and 0°C are facts.",
    materialId: "Paling indah adalah opini. Ibu kota dan 0°C adalah fakta.",
  },
  {
    id: "bi9-simpulan",
    subjectId: "bahasa_indonesia",
    track: "9",
    titleEn: "Conclusions from a text",
    titleId: "Menyimpulkan teks",
    materialEn: "A valid conclusion must be supported by the sentences, not by outside knowledge only.",
    materialId: "Simpulan sah harus ditopang kalimat teks, bukan hanya pengetahuan luar.",
  },
];

export const GRADE9_MATH_SKILLS: TkaSkill[] = [
  {
    id: "m9-pangkat",
    subjectId: "matematika",
    track: "9",
    titleEn: "Exponents",
    titleId: "Bilangan berpangkat",
    materialEn: "a^m × a^n = a^(m+n). a^m / a^n = a^(m−n). (a^m)^n = a^(mn).",
    materialId: "a^m × a^n = a^(m+n). a^m / a^n = a^(m−n). (a^m)^n = a^(mn).",
  },
  {
    id: "m9-urutan",
    subjectId: "matematika",
    track: "9",
    titleEn: "Ordering numbers",
    titleId: "Mengurutkan bilangan",
    materialEn: "Compare decimals place by place. 130.7 > 130.55. More water is a separate column.",
    materialId: "Bandingkan desimal per tempat. 130,7 > 130,55. Kandungan air adalah kolom terpisah.",
  },
  {
    id: "m9-aljabar",
    subjectId: "matematika",
    track: "9",
    titleEn: "Algebraic forms",
    titleId: "Bentuk aljabar",
    materialEn: "Variables are letters. The constant is the term without a letter, including its sign. Coefficients sit in front of variable terms.",
    materialId: "Variabel adalah huruf. Konstanta adalah suku tanpa huruf, termasuk tandanya. Koefisien menempel pada suku berhuruf.",
  },
  {
    id: "m9-model",
    subjectId: "matematika",
    track: "9",
    titleEn: "Algebra models",
    titleId: "Pemodelan aljabar",
    materialEn: "Double means 2×. Triple means 3×. Add all three shoppers before simplifying.",
    materialId: "Dua kali lipat = 2×. Tiga kali lipat = 3×. Jumlahkan ketiga pembeli sebelum disederhanakan.",
  },
  {
    id: "m9-peluang",
    subjectId: "matematika",
    track: "9",
    titleEn: "Probability",
    titleId: "Peluang",
    materialEn: "Favourable ÷ total. After items are taken, the total shrinks. Read the time window carefully (e.g. hatch within 10 days).",
    materialId: "Menguntungkan ÷ total. Setelah diambil, total menyusut. Baca jendela waktu (misalnya menetas dalam 10 hari).",
  },
  {
    id: "m9-geometri",
    subjectId: "matematika",
    track: "9",
    titleEn: "Triangle area",
    titleId: "Luas segitiga",
    materialEn: "Area = ½ × base × height.",
    materialId: "Luas = ½ × alas × tinggi.",
  },
  {
    id: "m9-data",
    subjectId: "matematika",
    track: "9",
    titleEn: "Median",
    titleId: "Median",
    materialEn: "Sort first. Median is the middle value. For an even count, average the two middles.",
    materialId: "Urutkan dulu. Median = nilai tengah. Jika genap, rata-rata dua nilai tengah.",
  },
];

export const GRADE12_FISIKA_SKILLS: TkaSkill[] = [
  {
    id: "fis-gerak",
    subjectId: "fisika",
    titleEn: "Kinematics",
    titleId: "Kinematika",
    materialEn: "v = v0 + at, s = v0 t + ½at². Average speed is total distance over total time.",
    materialId: "v = v0 + at, s = v0 t + ½at². Kelajuan rata-rata = jarak total / waktu total.",
  },
  {
    id: "fis-newton",
    subjectId: "fisika",
    titleEn: "Newton’s laws",
    titleId: "Hukum Newton",
    materialEn: "ΣF = ma. Weight W = mg. Friction f = μN. Action and reaction act on different bodies.",
    materialId: "ΣF = ma. Berat W = mg. Gesekan f = μN. Aksi-reaksi bekerja pada benda berbeda.",
  },
  {
    id: "fis-energi",
    subjectId: "fisika",
    titleEn: "Work and energy",
    titleId: "Usaha dan energi",
    materialEn: "W = F s cosθ. EK = ½mv². EP = mgh. Mechanical energy is conserved if friction is ignored.",
    materialId: "W = F s cosθ. EK = ½mv². EP = mgh. Energi mekanik kekal jika gesekan diabaikan.",
  },
  {
    id: "fis-listrik",
    subjectId: "fisika",
    titleEn: "Electricity",
    titleId: "Listrik",
    materialEn: "V = IR. Series: I same, R adds. Parallel: V same, 1/R adds. P = VI.",
    materialId: "V = IR. Seri: I sama, R dijumlah. Paralel: V sama, 1/R dijumlah. P = VI.",
  },
];

export const GRADE12_BIO_SKILLS: TkaSkill[] = [
  {
    id: "bio-sel",
    subjectId: "biologi",
    titleEn: "Cells",
    titleId: "Sel",
    materialEn: "Mitochondria make ATP. Chloroplasts photosynthesize. Ribosomes make protein. Nucleus stores DNA.",
    materialId: "Mitokondria menghasilkan ATP. Kloroplas fotosintesis. Ribosom membuat protein. Inti menyimpan DNA.",
  },
  {
    id: "bio-genetika",
    subjectId: "biologi",
    titleEn: "Genetics",
    titleId: "Genetika",
    materialEn: "Punnett square: Aa × Aa → 1 AA : 2 Aa : 1 aa. Recessive traits show only in aa.",
    materialId: "Punnett: Aa × Aa → 1 AA : 2 Aa : 1 aa. Sifat resesif muncul hanya pada aa.",
  },
  {
    id: "bio-ekologi",
    subjectId: "biologi",
    titleEn: "Ecology",
    titleId: "Ekologi",
    materialEn: "Producers → consumers → decomposers. Energy drops ~90% each trophic level.",
    materialId: "Produsen → konsumen → pengurai. Energi turun sekitar 90% tiap tingkat tropik.",
  },
  {
    id: "bio-fisiologi",
    subjectId: "biologi",
    titleEn: "Human physiology",
    titleId: "Fisiologi manusia",
    materialEn: "Arteries leave the heart. Veins return. Alveoli exchange gases. Nephrons filter blood.",
    materialId: "Arteri meninggalkan jantung. Vena kembali. Alveolus pertukaran gas. Nefron menyaring darah.",
  },
];

export const GRADE12_LANJUT_SKILLS: TkaSkill[] = [
  {
    id: "lan-limit",
    subjectId: "matematika_lanjut",
    titleEn: "Limits",
    titleId: "Limit",
    materialEn: "Factor or rationalize 0/0 forms. lim x→0 sin x / x = 1.",
    materialId: "Faktorkan atau rasionalkan bentuk 0/0. lim x→0 sin x / x = 1.",
  },
  {
    id: "lan-turunan",
    subjectId: "matematika_lanjut",
    titleEn: "Derivatives",
    titleId: "Turunan",
    materialEn: "d/dx x^n = n x^(n−1). Product and chain rules. f'(x)=0 at stationary points.",
    materialId: "d/dx x^n = n x^(n−1). Aturan hasil kali dan rantai. f'(x)=0 di titik stasioner.",
  },
  {
    id: "lan-integral",
    subjectId: "matematika_lanjut",
    titleEn: "Integrals",
    titleId: "Integral",
    materialEn: "∫ x^n dx = x^(n+1)/(n+1) + C. Definite integral is net area.",
    materialId: "∫ x^n dx = x^(n+1)/(n+1) + C. Integral tentu adalah luas bersih.",
  },
  {
    id: "lan-matriks",
    subjectId: "matematika_lanjut",
    titleEn: "Matrices",
    titleId: "Matriks",
    materialEn: "det [[a,b],[c,d]] = ad−bc. Inverse exists if det ≠ 0.",
    materialId: "det [[a,b],[c,d]] = ad−bc. Invers ada jika det ≠ 0.",
  },
];

export const GRADE12_EKO_SKILLS: TkaSkill[] = [
  {
    id: "eko-pasar",
    subjectId: "ekonomi",
    titleEn: "Demand and supply",
    titleId: "Permintaan dan penawaran",
    materialEn: "Demand slopes down. Supply slopes up. Surplus if price is above equilibrium.",
    materialId: "Permintaan miring turun. Penawaran miring naik. Surplus jika harga di atas keseimbangan.",
  },
  {
    id: "eko-inflasi",
    subjectId: "ekonomi",
    titleEn: "Inflation and money",
    titleId: "Inflasi dan uang",
    materialEn: "Inflation is a sustained rise in the general price level. Tight money policy raises interest rates.",
    materialId: "Inflasi adalah kenaikan harga umum yang terus-menerus. Kebijakan uang ketat menaikkan suku bunga.",
  },
  {
    id: "eko-apbn",
    subjectId: "ekonomi",
    titleEn: "Government budget",
    titleId: "APBN",
    materialEn: "Deficit when spending > tax. Fiscal policy uses G and T to stabilize output.",
    materialId: "Defisit jika belanja > pajak. Kebijakan fiskal memakai G dan T untuk menstabilkan output.",
  },
  {
    id: "eko-akun",
    subjectId: "ekonomi",
    titleEn: "Basic accounting",
    titleId: "Akuntansi dasar",
    materialEn: "Assets = liabilities + equity. Revenue increases equity; expenses decrease it.",
    materialId: "Aset = liabilitas + ekuitas. Pendapatan menambah ekuitas; beban menguranginya.",
  },
];

export const GRADE12_SOS_SKILLS: TkaSkill[] = [
  {
    id: "sos-interaksi",
    subjectId: "sosiologi",
    titleEn: "Social interaction",
    titleId: "Interaksi sosial",
    materialEn: "Cooperation, competition, conflict, accommodation. Status is a position; role is the expected behaviour.",
    materialId: "Kerja sama, kompetisi, konflik, akomodasi. Status adalah posisi; peran adalah perilaku yang diharapkan.",
  },
  {
    id: "sos-struktur",
    subjectId: "sosiologi",
    titleEn: "Social structure",
    titleId: "Struktur sosial",
    materialEn: "Stratification can be closed (caste) or open (class). Mobility is movement between strata.",
    materialId: "Stratifikasi bisa tertutup (kasta) atau terbuka (kelas). Mobilitas adalah perpindahan antarlapisan.",
  },
  {
    id: "sos-lembaga",
    subjectId: "sosiologi",
    titleEn: "Social institutions",
    titleId: "Lembaga sosial",
    materialEn: "Family, education, religion, economy, politics each meet a basic need.",
    materialId: "Keluarga, pendidikan, agama, ekonomi, politik masing-masing memenuhi kebutuhan dasar.",
  },
  {
    id: "sos-penelitian",
    subjectId: "sosiologi",
    titleEn: "Social research",
    titleId: "Penelitian sosial",
    materialEn: "Qualitative seeks meaning; quantitative seeks measurable patterns. A sample must represent the population.",
    materialId: "Kualitatif mencari makna; kuantitatif mencari pola terukur. Sampel harus mewakili populasi.",
  },
];

export const GRADE12_GEO_SKILLS: TkaSkill[] = [
  {
    id: "geo-peta",
    subjectId: "geografi",
    titleEn: "Maps and location",
    titleId: "Peta dan lokasi",
    materialEn: "Scale 1:50.000 means 1 cm = 0.5 km. Latitude is north–south; longitude is east–west.",
    materialId: "Skala 1:50.000 artinya 1 cm = 0,5 km. Lintang utara–selatan; bujur timur–barat.",
  },
  {
    id: "geo-fisik",
    subjectId: "geografi",
    titleEn: "Physical geography",
    titleId: "Geografi fisik",
    materialEn: "Hadley cells, monsoon, watersheds, and plate boundaries shape climate and landforms.",
    materialId: "Sel Hadley, monsun, DAS, dan batas lempeng membentuk iklim dan bentuk lahan.",
  },
  {
    id: "geo-penduduk",
    subjectId: "geografi",
    titleEn: "Population",
    titleId: "Kependudukan",
    materialEn: "Density = people / area. Pyramid shape shows young, mature, or ageing populations.",
    materialId: "Kepadatan = jiwa / luas. Bentuk piramida menunjukkan penduduk muda, dewasa, atau menua.",
  },
  {
    id: "geo-wilayah",
    subjectId: "geografi",
    titleEn: "Regional Indonesia",
    titleId: "Wilayah Indonesia",
    materialEn: "Wallace line, monsoon Asia, and outer-island resources are classic TKA regional items.",
    materialId: "Garis Wallace, Asia monsun, dan sumber daya pulau luar adalah item regional TKA yang klasik.",
  },
];

export const GRADE12_SEJ_SKILLS: TkaSkill[] = [
  {
    id: "sej-sumber",
    subjectId: "sejarah",
    titleEn: "Historical sources",
    titleId: "Sumber sejarah",
    materialEn: "Primary: made in the period. Secondary: later writing. Heuristik → kritik → interpretasi → historiografi.",
    materialId: "Primer: dibuat pada zamannya. Sekunder: tulisan kemudian. Heuristik → kritik → interpretasi → historiografi.",
  },
  {
    id: "sej-kolonial",
    subjectId: "sejarah",
    titleEn: "Colonial period",
    titleId: "Masa kolonial",
    materialEn: "VOC, cultuurstelsel, Liberal Policy, Ethical Policy. Motive is profit plus control of labour and land.",
    materialId: "VOC, tanam paksa, Politik Liberal, Politik Etis. Motifnya laba plus kontrol tenaga dan tanah.",
  },
  {
    id: "sej-merdeka",
    subjectId: "sejarah",
    titleEn: "Independence",
    titleId: "Kemerdekaan",
    materialEn: "17 August 1945, BPUPKI/PPKI, Linggajati, Renville, Roem–Royen, Dutch recognition 1949.",
    materialId: "17 Agustus 1945, BPUPKI/PPKI, Linggarjati, Renville, Roem–Royen, pengakuan Belanda 1949.",
  },
  {
    id: "sej-reformasi",
    subjectId: "sejarah",
    titleEn: "Reformasi",
    titleId: "Reformasi",
    materialEn: "1998: Soeharto resigns. Reformasi opens parties, press, and regional autonomy.",
    materialId: "1998: Soeharto mundur. Reformasi membuka partai, pers, dan otonomi daerah.",
  },
];

export const GRADE12_PPKN_SKILLS: TkaSkill[] = [
  {
    id: "ppkn-pancasila",
    subjectId: "ppkn",
    titleEn: "Pancasila",
    titleId: "Pancasila",
    materialEn: "Sila 1–5 in order. Practice: gotong royong, musyawarah, justice. Not forcing one religion.",
    materialId: "Sila 1–5 berurutan. Praktik: gotong royong, musyawarah, keadilan. Bukan memaksakan satu agama.",
  },
  {
    id: "ppkn-uud",
    subjectId: "ppkn",
    titleEn: "Constitution",
    titleId: "UUD 1945",
    materialEn: "Amendments 1999–2002. MPR no longer highest state body in the old sense. MK tests laws.",
    materialId: "Amandemen 1999–2002. MPR bukan lagi lembaga tertinggi seperti dulu. MK menguji undang-undang.",
  },
  {
    id: "ppkn-ham",
    subjectId: "ppkn",
    titleEn: "Human rights",
    titleId: "HAM",
    materialEn: "Rights come with duties. Hate speech is not protected as 'freedom' without limit.",
    materialId: "Hak disertai kewajiban. Ujaran kebencian bukan kebebasan tanpa batas.",
  },
  {
    id: "ppkn-nkri",
    subjectId: "ppkn",
    titleEn: "NKRI and Bhinneka",
    titleId: "NKRI dan Bhinneka",
    materialEn: "Unity in diversity. Autonomy is not separatism. Wawasan nusantara binds land and sea.",
    materialId: "Bhinneka Tunggal Ika. Otonomi bukan separatisme. Wawasan nusantara mengikat darat dan laut.",
  },
];

export const ALL_TKA_SKILLS: TkaSkill[] = [
  ...GRADE12_MATH_SKILLS,
  ...GRADE12_KIMIA_SKILLS,
  ...GRADE12_BI_SKILLS,
  ...GRADE12_EN_SKILLS,
  ...GRADE6_BI_SKILLS,
  ...GRADE6_MATH_SKILLS,
  ...GRADE9_BI_SKILLS,
  ...GRADE9_MATH_SKILLS,
  ...GRADE12_FISIKA_SKILLS,
  ...GRADE12_BIO_SKILLS,
  ...GRADE12_LANJUT_SKILLS,
  ...GRADE12_EKO_SKILLS,
  ...GRADE12_SOS_SKILLS,
  ...GRADE12_GEO_SKILLS,
  ...GRADE12_SEJ_SKILLS,
  ...GRADE12_PPKN_SKILLS,
];
