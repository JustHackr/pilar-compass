export type TkaSkill = {
  id: string;
  subjectId: string;
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

export const ALL_TKA_SKILLS: TkaSkill[] = [
  ...GRADE12_MATH_SKILLS,
  ...GRADE12_KIMIA_SKILLS,
];
