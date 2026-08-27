import type { TkaQuestion } from "@/lib/tka/scoring";

export type TkaPassage = {
  id: string;
  title: string;
  body: string;
  note?: string;
};

const TKA_PASSAGES: TkaPassage[] = [
  {
    id: "buwuhan",
    title: "Tradisi Buwuhan: Antara Gotong Royong dan Utang Piutang",
    body: `Tradisi buwuhan merupakan bagian dari budaya masyarakat Jawa, khususnya di kota-kota besar seperti Surabaya. Tradisi ini dilakukan ketika ada acara penting seperti pernikahan atau khitanan yang diadakan di daerah tersebut. Buwuhan merujuk pada kegiatan memberi bantuan, baik berupa barang, uang, maupun tenaga kepada seseorang yang sedang mengadakan hajatan, atau bisa juga disebut sebagai kegiatan menyumbang. Tradisi ini mencerminkan nilai gotong royong dan solidaritas sosial karena keluarga dan tetangga saling bahu-membahu dalam membantu sesama.

Namun, praktik buwuhan tidak lepas dari unsur pertukaran atau dipandang sebagai utang. Masyarakat meyakini bahwa segala bentuk bantuan yang diberikan akan kembali dalam bentuk yang setara ketika si pemberi mengadakan hajatan serupa. Hal ini menyebabkan buwuhan tidak lagi dipandang murni sebagai hibah atau sedekah, tetapi sebagai bentuk "utang tidak tertulis" yang menimbulkan kewajiban moral untuk membalas.

Dalam praktiknya, buwuhan memang meringankan beban tuan rumah, tetapi dapat menimbulkan tekanan psikologis bagi penerima bantuan. Rasa malu dan kekhawatiran kehilangan harga diri mendorong sebagian orang untuk berutang demi mengembalikan buwuhan. Hal ini menyebabkan terbaginya cara pandang terhadap buwuhan. Ada yang melihatnya sebagai bentuk tolong-menolong, tetapi ada juga yang justru menganggapnya menjadi sistem utang piutang berbasis sosial. Sebagian pihak berpendapat bahwa buwuhan adalah hibah karena tujuannya adalah untuk membantu. Namun, apabila ada keharusan pengembalian, maka secara hukum dan etika, buwuhan telah bergeser dari semangat gotong royong menjadi sebuah kewajiban ekonomi yang membebani. Oleh karena itu, pemahaman masyarakat terhadap tradisi buwuhan perlu diluruskan agar nilai luhur tolong-menolong tetap terjaga tanpa menimbulkan beban yang tidak perlu.`,
    note: "Sumber: Rachmawati, S. A., dan Anwar, M. K. (2021). Budaya dan Tradisi Buwuhan sebagai Utang Piutang dalam Adat Pernikahan di Kota Surabaya. Jurnal Ekonomika dan Bisnis Islam, 4(3).",
  },
  {
    id: "layur",
    title: "Layur, Teruslah Berlayar",
    body: `"Bapak, pulanglah," lirih Layur berharap. Ini hari keenam. Tiga hari adalah waktu terlama nelayan berada di laut. Dengan susah payah, Layur berpindah duduk ke dalam sebuah perahu tua. Penyangga kedua kaki Layur yang tak utuh ia letakkan di sampingnya. "Jangan-jangan..." "Tidak ... Aku tidak boleh berpikiran buruk. Bapak pasti pulang dengan selamat. Aku akan tetap menunggunya di sini sambil berdoa."

Layur masih ingat masa-masa dulu, ketika Bapak berlayar pada malam hari dan keesokan harinya sudah merapat kembali di pantai dengan membawa ikan berlimpah.

"Ayo! Siapa mau udang?" panggil Bapak. Layur berlari kencang bersama teman-temannya. Namun, itu adalah kenangan sepuluh tahun silam. Kini, udang dan ikan kecil adalah anugerah besar. Itu pun harus dijaring di tengah laut.

Layur ingat betul, Bapak adalah pembuat bondet paling disegani, juga berpengaruh di dusun. Setiap hari, nelayan silih berganti datang ke rumah memesan bondet. Hasil panen ikan berlimpah. Tinggal melemparkan bondet ke dalam laut dan ... bum! Berkuintal-kuintal ikan terapung tinggal diserok menggunakan jaring.

Sampai suatu ketika... DUAAAR! Separuh rumah Layur luluh lantak karena simpanan bondet di gudang meledak. Ledakan bondet di gudang tak hanya merusak rumah tetapi juga mencelakai anak semata wayang. Ia berteriak minta tolong, menepuk-nepuk dadanya, dan menangis. Itulah titik balik yang amat disesali Bapak. Sejak itu, Bapak meninggalkan usaha pembuatan bondet. Demikian pula dengan warga Dusun Prau tempat mereka berdiam berangsur-angsur meninggalkan cara menangkap ikan dengan bondet.

Lamat-lamat terlihat kibaran layar bercorak biru. Layur beringsut menuruni perahu tempatnya duduk. Lambaian tangan bapaknya semakin jelas dan semakin dekat.

"Bapak dari mana? Bapak sudah tiga hari telat pulang!" Seru Layur kesal. Matanya berkaca-kaca, menahan rindu, dan cemas.

Daftar istilah: Bondet — istilah lokal yang merujuk pada bahan peledak rakitan, sering disebut juga bom ikan.`,
    note: "Karya Anang YB. Sumber: buku.kemdikbud.go.id (dengan pengubahan).",
  },
  {
    id: "pantai-bersih",
    title: "Pantai Bersih Tanpa Sampah",
    body: `Di sebuah daerah wisata yang terkenal dengan pantainya yang indah, pemerintah setempat gencar mengampanyekan "Pantai Bersih Tanpa Sampah." Spanduk dan papan peringatan terpampang di berbagai sudut. Namun, kenyataannya seringkali berbeda.

Suatu sore, Pak Wayan, seorang nelayan tua yang sudah puluhan tahun melaut, sedang membersihkan jaringnya di tepi pantai. Di sampingnya, sekelompok turis muda asyik berpose untuk berfoto. Mereka mengenakan topi pantai yang modis, kacamata hitam, dan membawa botol minum berwarna-warni.

"Wah, pantainya bersih banget ya, guys!" seru salah satu turis sambil memegang ponselnya. "Pas banget buat konten 'liburan ramah lingkungan'!"

Temannya menimpali, "Iya! Nanti caption-nya 'Menikmati keindahan alam tanpa jejak, menjaga bumi kita tercinta!'"

Setelah puas berfoto dari berbagai sudut dengan beragam filter, mereka beranjak pergi. Namun mereka meninggalkan botol minuman plastik kosong, bungkus keripik, dan beberapa puntung rokok yang disembunyikan di balik semak-semak. Mereka bahkan tidak berusaha mencari tempat sampah yang hanya berjarak beberapa meter.

Pak Wayan hanya bisa menggelengkan kepala. Ia berjalan mendekat dan memungut sampah-sampah itu satu per satu. Ia sudah terbiasa dengan pemandangan ini. Para turis datang untuk menikmati keindahan, berfoto, membuat konten, lalu pergi meninggalkan "kenangan" dalam bentuk sampah.

Tak lama kemudian, seorang petugas kebersihan berseragam oranye datang dengan sapu dan karung. "Pak Wayan, sudah banyak lagi ya sampahnya?" tanyanya sambil menghela napas.

"Sudah biasa, Nak," jawab Pak Wayan. "Ini namanya 'sampah estetik'. Cuma bagus di foto, tapi busuk di mata dan bau di hidung."

Petugas itu tersenyum masam. "Iya, Pak. Kata mereka peduli lingkungan, tapi pedulinya cuma di caption media sosial."

Malam harinya, di akun media sosial Pak Wayan—yang diajari cucunya—ia melihat foto-foto pantai yang diunggah para turis tadi. Pantai tampak bersih sempurna, dihiasi filter matahari terbenam yang memukau. Ia membaca caption-nya: "Surgaku, jangan kau kotori!"

Pak Wayan hanya bisa tersenyum getir. Sepertinya, slogan "Pantai Bersih Tanpa Sampah" itu hanya berlaku untuk kamera dan media sosial. Sementara di balik layar, jejak yang ditinggalkan justru lebih nyata dan memprihatinkan daripada gambar yang dipamerkan.`,
  },
  {
    id: "sampah-ekosistem",
    title: "Pulihkan Ekosistem, Menjaga Planet Kita dari Generasi ke Generasi",
    body: `Berdasarkan hasil riset LIPI (Lembaga Ilmu Pengetahuan Indonesia) terjadi peningkatan sampah plastik selama pandemik. Hal ini disebabkan oleh penggunaan layanan delivery makanan lewat jasa transportasi online, 96% paket dibungkus dengan plastik yang tebal dan ditambah dengan bubble wrap. Selain itu selotip, bungkus plastik, dan bubble wrap merupakan pembungkus berbahan plastik yang paling sering ditemukan. Sampah medis juga melonjak. Kementerian Lingkungan Hidup dan Kehutanan (KLHK) menyatakan bahwa selama pandemi, terjadi peningkatan timbunan sampah medis sebesar 30% hingga 50%. Dari data tersebut, Indonesia merupakan negara ke-2 penyumbang polusi sampah di lautan (3,22 metrik ton per tahun).

Salah satu faktor penyebab dari permasalahan tersebut adalah dengan pertambahan jumlah penduduk akan terjadi peningkatan aktivitas manusia dan daya konsumsi yang melonjak. Hal itu menyebabkan meningkatnya jumlah dan jenis limbah sehingga menyebabkan lingkungan menjadi tercemar. Selain sampah, penebangan pohon secara liar sampai pada kebakaran hutan menjadi penyumbang terbesar dalam kerusakan ekosistem. Banyak aktivitas manusia yang mengancam pelestarian lingkungan sehingga menyebabkan ketidakseimbangan ekosistem. Manusia punya peran besar dalam menjaga keseimbangan ekosistem, bukan cuma untuk sekarang, tapi juga untuk generasi mendatang. Tanggung jawab dalam menjaga lingkungan, tentunya bukan hanya dibebankan oleh pemerintah saja, tetapi seluruh elemen masyarakat harus bahu-membahu dalam menjaga dan melestarikan lingkungan.

Bertepatan dengan peringatan Hari Lingkungan Hidup Sedunia, yang tidak hanya sebagai seremonial belaka, tentunya menjadi sebuah harapan dalam meningkatkan kesadaran menjaga dan melestarikan lingkungan. Selain itu, memberikan semangat baru bagi kita semua untuk komitmen menjaga lingkungan. Dengan memulai dari diri sendiri dan hal paling kecil, yaitu tidak membuang sampah sembarangan, terutama sampah plastik karena merusak ekosistem laut, tidak menebang pohon dengan liar hingga membuat gundul hutan. Mari bersama merobohkan jurang ekologi, memulihkan ekosistem bumi dengan pendekatan pengelolaan sumber daya alam yang adil dan berkelanjutan.`,
    note: "Sumber: uiad.ac.id (dengan pengubahan).",
  },
  {
    id: "ekonomi-global",
    title: "Prospek Ekonomi Global di Tengah Ketidakpastian",
    body: `Jakarta, Senin, 16 Juni 2025 – Perekonomian global terus menghadapi tantangan signifikan di tengah ketidakpastian geopolitik dan tekanan inflasi yang persisten. Analisis terbaru yang dirilis pada (Senin, 2/6/2025), oleh Dana Moneter Internasional (IMF) menunjukkan adanya divergensi dalam laju pemulihan ekonomi antarwilayah, di mana beberapa negara seperti Amerika Serikat dan India menunjukkan ketahanan yang lebih baik, sementara negara-negara di Eropa dan Tiongkok masih berjuang mengatasi dampak guncangan eksternal.

Kenaikan harga energi dan pangan tetap menjadi pendorong utama inflasi di banyak negara, dipicu oleh gangguan rantai pasok global dan konflik di Ukraina, memaksa bank sentral untuk mempertahankan kebijakan moneter yang ketat. Upaya ini, meskipun esensial untuk mengendalikan kenaikan harga, berpotensi mengerem pertumbuhan ekonomi. Para pengambil kebijakan dihadapkan pada dilema sulit: menyeimbangkan kebutuhan untuk meredam inflasi tanpa memicu resesi yang dalam.

"Kami melihat adanya perlambatan pertumbuhan global yang signifikan di tahun ini, dan risiko resesi menjadi lebih nyata jika bank sentral terlalu agresif dalam menaikkan suku bunga," ujar seorang ekonom senior dari Bank Dunia, dalam sebuah webinar yang diadakan, (Rabu, 11/6).

Di sisi lain, sektor manufaktur global menunjukkan tanda-tanda perlambatan, tercermin dari menurunnya indeks manajer pembelian (PMI) di beberapa ekonomi besar seperti Jerman dan Jepang. Penurunan permintaan ekspor dan gangguan rantai pasok masih menjadi perhatian utama bagi produsen. Namun, sektor jasa justru menunjukkan resiliensi yang lebih kuat, didukung oleh kembali normalnya aktivitas setelah pandemi, sebuah tren yang mulai terlihat sejak awal Desember 2024.

Pasar tenaga kerja di beberapa negara maju masih relatif ketat, dengan tingkat pengangguran yang rendah. Kondisi ini memberikan dukungan terhadap daya beli konsumen, meskipun tekanan biaya hidup yang tinggi dapat mengikis dampaknya. Sementara itu, investasi langsung asing (FDI) cenderung melambat, mencerminkan kehati-hatian investor di tengah prospek ekonomi yang tidak menentu.

Ke depan, koordinasi kebijakan ekonomi antarnegara akan menjadi kunci untuk menstabilkan kondisi global. Reformasi struktural yang bertujuan meningkatkan produktivitas dan daya saing juga dianggap krusial untuk memastikan pertumbuhan yang berkelanjutan dalam jangka panjang. Para ekonom memprediksi bahwa prospek ekonomi akan sangat bergantung pada evolusi inflasi, respons kebijakan moneter, dan perkembangan situasi geopolitik di seluruh dunia. Bagi Indonesia, kondisi ini menuntut kewaspadaan dan diversifikasi ekonomi agar tidak terlalu rentan terhadap gejolak global dalam kurun waktu tiga hingga enam bulan ke depan, terhitung sejak (16/6/2025).`,
    note: "Disadur dan diadaptasi dari rilis pers dan laporan Global Economic Prospects, Juni 2025 oleh World Bank (Bank Dunia).",
  },
  {
    id: "tari-hudoq",
    title: "Tari Hudoq: Warisan Budaya yang Harus Dilestarikan",
    body: `Tari Hudoq dari suku Dayak Modang di Kalimantan Timur bukan sekadar tontonan seni biasa. Lebih dari itu, tarian ini adalah warisan budaya yang sarat akan makna spiritual dan simbolis. Oleh karena itu, melestarikan Tari Hudoq menjadi sebuah keharusan, tidak hanya untuk menjaga keragaman budaya Indonesia, tetapi juga untuk mengingatkan kita akan pentingnya hubungan harmonis antara manusia dan alam.

Pertama, Tari Hudoq adalah cerminan dari kearifan lokal yang mengajarkan nilai-nilai fundamental. Tarian ini merupakan bagian integral dari ritual keagamaan untuk menjalin hubungan harmonis dengan roh penjaga pertanian, Halaeng Heboung, dan roh pelindung umat manusia, Selo Sen. Dalam era modern yang sering kali mengabaikan hubungan manusia dengan alam, tarian ini berfungsi sebagai pengingat kuat akan ketergantungan kita pada alam dan pentingnya menghormati kekuatan yang lebih besar dari diri kita.

Kedua, setiap elemen dalam Tari Hudoq mengandung simbolisme yang mendalam dan relevan. Penggunaan topeng kayu yang besar dan dedaunan yang menutupi tubuh penari bukan sekadar properti, melainkan representasi kekuatan dan perlindungan dari roh-roh tersebut. Gerakan tari yang menggambarkan keteguhan petani serta nyanyian tradisional yang mengiringinya adalah permohonan tulus kepada alam semesta untuk memberikan keseimbangan dan kesuksesan panen. Menghilangkan tarian ini berarti menghilangkan simbolisme penting yang telah diwariskan turun-temurun, yang merupakan esensi dari budaya Dayak Modang itu sendiri.

Ketiga, Tari Hudoq memiliki nilai edukatif yang tinggi bagi masyarakat luas, termasuk wisatawan. Pertunjukan ini tidak hanya memukau secara visual, tetapi juga memberikan pemahaman tentang pentingnya keseimbangan alam dan hubungan spiritual yang mendalam. Dengan melestarikan dan memperkenalkan tarian ini kepada publik yang lebih luas, kita tidak hanya menjaga keberadaan tarian itu sendiri, tetapi juga menyebarkan pesan tentang pentingnya menjaga lingkungan dan menghargai nilai-nilai tradisional.

Dengan demikian, jelaslah bahwa Tari Hudoq bukan sekadar pertunjukan, melainkan sebuah jembatan spiritual yang menghubungkan manusia dengan alam dan leluhur. Mengabaikan pelestariannya sama saja dengan mengabaikan kekayaan spiritual dan kearifan lokal yang menjadi fondasi budaya kita. Pelestarian Tari Hudoq adalah investasi untuk masa depan, memastikan bahwa nilai-nilai berharga ini tetap hidup dan relevan bagi generasi mendatang.`,
    note: "Sumber: kebudayaan.kemdikbud.go.id, pustakaborneo.id, 1001indonesia.net (dengan penyesuaian).",
  },
  {
    id: "belis",
    title: "Tradisi Belis: Simbol Budaya yang Menyimpan Beban Finansial di Era Modern",
    body: `Belis adalah tradisi di wilayah Indonesia bagian timur seperti Nusa Tenggara Timur, yang secara umum di Indonesia dikenal dengan mas kawin atau mahar. Tradisi ini melambangkan penghormatan kepada wanita dan penyatuan keluarga. Namun, di balik nilainya, belis sering menjadi beban finansial berat bagi pihak laki-laki, yang kadang memicu tekanan psikologis dan mengganggu hubungan kekeluargaan. Beberapa pihak, terutama para sesepuh desa atau orang-orang tua, kadang terlalu kukuh untuk mempertahankan tradisi dan membuat tekanan dengan nilai yang semakin naik.

Belis memiliki makna yang mendalam dan dianggap sebagai bentuk pengakuan atas peran penting seorang perempuan di dalam keluarga. Belis merupakan representasi keseriusan dan komitmen seorang pria untuk membangun keluarga. Proses penyerahan belis tidak hanya dimaknai sebagai pertukaran materi, tetapi juga sebagai simbol penyatuan dua komunitas besar, yakni keluarga kedua belah pihak. Pada masyarakat Lamaholot misalnya, belis diwujudkan dalam bentuk gading gajah atau bala, yang besarnya disesuaikan dengan status sosial seorang perempuan. Selain itu, disertakan juga pelengkap belis seperti sarung tenun sutra dan ternak. Uniknya, meskipun belis dari pihak laki-laki, pihak keluarga perempuan memberikan balasan simbolis kepada pihak laki-laki dalam bentuk barang berharga lainnya. Tradisi ini mengajarkan keseimbangan dan saling menghargai di antara kedua belah pihak.

Meskipun belis mengandung nilai-nilai yang positif, tantangannya saat ini adalah menjaga agar tradisi tersebut tidak menjadi beban finansial yang berat. Tuntutan belis yang tinggi sering kali menjadi sumber tekanan, terutama bagi keluarga laki-laki. Dalam beberapa kasus, perkara belis dapat berimbas pada kesehatan mental hingga memicu tindakan tragis, seperti yang pernah terjadi di Kupang. Selain menjadi tantangan finansial, besarnya tuntutan materi untuk belis juga sering kali menimbulkan ketegangan dan konflik di antara pasangan dan keluarganya. Ketika keluarga perempuan menetapkan nominal belis yang tinggi, tidak jarang hal ini membangkitkan sentimen negatif dari pihak laki-laki yang merasa tertekan dan kehilangan martabat jika tidak mampu memenuhinya. Alhasil, penundaan pernikahan diambil guna memenuhi permintaan belis. Konflik semacam ini bisa merusak hubungan dua keluarga yang harusnya harmonis.`,
    note: "Sumber: beritakini.co.id dan krajan.id.",
  },
  {
    id: "roh-meratus",
    title: "Roh Meratus",
    body: `Kami kembali berjalan pulang. Kondisiku sudah sepenuhnya normal. Tetua melangkah di depanku. Tak kusangka, dalam keadaan kritis ternyata kami telah sangat jauh memasuki belantara. Aku memperhatikan pohon-pohon besar yang kami lewati. Sinar matahari bahkan hampir tak bisa menembus ke bawah.

Aku merasa asing di tempat ini. Pohon-pohon yang berlumut itu, sulur-sulur yang bergantungkan, semak-semak yang rimbun itu. Oh... ternyata belantara ini adalah tempat menakjubkan. Bayangkan, di lumut batang pohon itu udang-udang kecil berloncatan lincah. Belum pernah aku melihat udang hidup di batang pohon!

"Kau tahu anak muda, tempat ini merasa terancam dengan keberadaan..." tetua menghentikan langkahnya dan mengambil sesuatu dalam butah. "Roh Meratus meniupkan wisa ke tubuh kalian, sayang kawan-kawanmu yang lain terlambat," sambungnya kemudian melemparkan gulungan kertas yang diambil dari butah. Sigap kutangkap gulungan itu.

"Itu peta yang kuambil dari ranselmu. Ternyata kalian memasang patok-patok dan memberi tanda pohon-pohon besar untuk ditebang. Dan perlu kau ketahui anak muda, tempat ini juga termasuk wilayah yang akan kalian pasangi patok-patok itu," katanya dingin.

Perlahan kubuka gulungan peta di tanganku. Dari peta terlihat jelas, pekerjaan kami tinggal sedikit lagi. Jika saja semuanya lancar, maka kami akan sampai di tempat ini dan selesailah kontrak kerja kami. Dalam waktu singkat, mungkin alat-alat berat akan didatangkan! Pohon-pohon ini, sulur-sulur ini, lumut-lumut ini, udang-udang ini...akan bagaimana?

"Tetua, izinkan aku tinggal di sini dan bersama kaummu menjaga tempat ini..." Akhirnya setelah lama hanya diam, aku menatap mata tetua mantap.

Glosarium: Butah — wadah atau tempat yang digunakan untuk membawa sesuatu, biasanya terbuat dari anyaman rotan atau bambu. Wisa — bisa atau racun.`,
    note: "Cerpen karya Zaidinoor.",
  },
  {
    id: "lion-mouse",
    title: "The Lion and the Mouse",
    body: `Once upon a time, in a thick jungle in Africa, there lived a strong and fierce lion. Every afternoon, the lion would rest under the cool shade of a big tree after walking through the forest.

One day, while he was sleeping, a playful little mouse passed by. The mouse saw the lion's thick mane and was curious. He climbed up and began to jump around on the lion's head, playing in his mane.

The lion woke up suddenly and was not happy at all. He quickly caught the mouse in his big paw and roared, "Who dares to wake me up?" He was very angry and almost killed the mouse.

Scared and shaking, the mouse begged the lion, "Please don't kill me! I didn't mean to bother you. If you let me go, I promise I'll help you one day."

The lion laughed loudly. "You? Help me? That's funny." But the lion was feeling kind, so he let the mouse go free.

A few days later, the lion was walking through the jungle again when he fell into a trap. A net set by hunters caught him, and he couldn't escape. He tried to bite and tear the ropes, but they were too strong. The lion roared loudly, hoping someone would come.

The mouse heard the roar and ran to help. He saw the lion trapped and quickly started to chew the ropes with his sharp teeth. After some time, the net broke, and the lion was free.

The lion looked at the mouse with surprise and said, "Thank you! You really saved my life."

The mouse smiled and said, "I told you I would help you one day."

From that moment on, the lion and the mouse became close friends. The lion learned that even small creatures can do great things, and we all need help sometimes.`,
    note: "Source: vedantu.com/stories/the-lion-and-the-mouse",
  },
  {
    id: "study-tips",
    title: "Effective Study Techniques",
    body: `The official paper presents this as an infographic. The techniques below are the ones the questions ask you to classify and apply.

Time management
Use the Pomodoro Technique to structure study and break time so your mind stays focused and fresh. Set a timetable and keep a consistent study schedule.

Self management
Know your learning style. Find a quiet area and create a quiet, comfortable study space. Use less gadgets during personal study time. Be patient and persistent. Practice and repeat study material regularly.

Suggested sequence
Know your learning style → Find a quiet area → Set a timetable → Use less gadgets → Be patient and persistent.`,
    note: "The original TKA SMA 2025 item used an infographic. This reconstruction follows the published question options.",
  },
  {
    id: "great-barrier-reef",
    title: "The Great Barrier Reef",
    body: `The Great Barrier Reef is one of the most beautiful places in the world. It is located in the Pacific Ocean, near the northeast coast of Australia. The reef is very big. It stretches over 2,000 kilometers and can even be seen from space. There are many small coral islands and clear, warm waters around the reef.

This reef is full of life. There are many kinds of colorful fish, sea turtles, dolphins, and even sharks. Coral of different shapes and colors grows under the water. Sea birds fly over the reef and nest on small islands. People can see this beauty by swimming, diving, or joining a boat tour.

The colors under the water are amazing. Coral comes in red, yellow, green, and blue. Some coral looks like trees, and some looks like big round stones. Small fish swim in and out of the coral like they are playing a game. In some places, soft coral moves with the water like grass in the wind. When the sun shines, the reef looks bright and full of light. It feels like a different world under the sea.

The reef is not only beautiful, but also very important. It helps protect the coast from big waves and storms. It is a home for sea animals and a place where plants can grow. Many people also get food and jobs from the sea near the reef. Without the reef, the ocean would not be the same.`,
    note: "Adapted from britannica.com/place/Great-Barrier-Reef",
  },
  {
    id: "teen-money",
    title: "Why Teenagers Should Learn to Manage Their Money",
    body: `Many young people today often spend money on things they like, such as snacks, clothes, or fun activities. But learning to handle money from a young age is very important. Good money habits can help students make a better future. Having a clear plan for the future can show teenagers how to use their money. Students should think about short-term goals, like getting a new phone, and long-term goals, like saving for college or starting a business. Writing these goals down can help students stay motivated and focused.

A budget helps students see where their money goes every month. It's important to list basic needs like food and travel, and also other costs like clothes or presents. A budget makes it easier to decide how much money to save, spend, or keep for unexpected problems.

Sometimes, students don't know how much they spend on small things. Keeping track of spending with notes or apps can help students understand their habits. This helps them stay within their budget and make changes if needed.

Teenagers should also learn the difference between saving money and investing money. Saving is safer but slower, while investing has more risk but can earn more money. Knowing both can help students choose the best way for their money goals.

To sum up, students who learn to plan, budget, track, and understand saving choices are more ready for the future. That is why learning about money should start early and be done often.`,
    note: "Table 1 is shown with the question. Adapted from onefamily.com money-management tips for teens.",
  },
  {
    id: "hera-shero",
    title: "Hera and Shero",
    body: `Once upon a time, in Africa, there lived two lion kings. One was named Hera and the other was Shero. Hera was very strong and handsome. All the animals loved and respected him. He was a great leader. Shero was not like Hera. He had a small mane and a funny, squeaky voice. Shero liked to pretend he was as powerful as Hera. He often copied Hera's roar, but it made the other animals laugh.

One day, the animals heard that some hyenas were causing trouble near the river. Hera quickly gathered his followers to stop the hyenas. Shero also wanted to come. He wanted to show everyone that he was strong too.

When they reached the river, Hera roared loudly. His roar was so powerful that the hyenas got scared. Shero also tried to roar, but his voice was high and silly. The hyenas laughed at him. Their leader, Hank the Hyena, made jokes about Shero.

Hera stayed calm and smiled. Shero did not give up. He said, "I am just as strong as Hera!" The hyenas laughed even louder. Shero tried to show his power by jumping on a small dirt hill. But he tripped and fell into the ground. The hyenas laughed so much they cried. Even Hera laughed a little.

At the end of the day, the hyenas left, still laughing about Shero. Hera told Shero, "You are not like me, but you make everyone happy with your jokes." Shero smiled and understood that he had his own special gift.

From that day, Shero became the kingdom's jester. He and Hera ruled together — one with strength, and one with laughter. The animals learned that both power and fun are important in life.`,
  },
];

const PASSAGE_BY_ID = new Map(TKA_PASSAGES.map((p) => [p.id, p]));

const QUESTION_PASSAGE_IDS: Record<string, string> = {
  "bi-o-01": "buwuhan",
  "bi-o-02": "buwuhan",
  "bi-o-03": "buwuhan",
  "bi-o-05": "layur",
  "bi-o-06": "layur",
  "bi-o-09": "pantai-bersih",
  "bi-o-10": "pantai-bersih",
  "bi-o-11": "sampah-ekosistem",
  "bi-o-12": "sampah-ekosistem",
  "bi-o-13": "sampah-ekosistem",
  "bi-o-14": "ekonomi-global",
  "bi-o-17": "tari-hudoq",
  "bi-o-21": "roh-meratus",
  "bi-o-22": "roh-meratus",
  "bi-o-23": "roh-meratus",
  "bi-o-24": "roh-meratus",
  "bi-o-25": "belis",
  "bi-o-26": "belis",
  "bi-o-27": "belis",
  "bi-o-28": "belis",
  "en-o-01": "lion-mouse",
  "en-o-02": "lion-mouse",
  "en-o-03": "lion-mouse",
  "en-o-09": "study-tips",
  "en-o-10": "study-tips",
  "en-o-11": "great-barrier-reef",
  "en-o-12": "great-barrier-reef",
  "en-o-13": "great-barrier-reef",
  "en-o-14": "great-barrier-reef",
  "en-o-15": "great-barrier-reef",
  "en-o-16a": "teen-money",
  "en-o-16b": "teen-money",
  "en-o-17": "teen-money",
  "en-o-18": "teen-money",
  "en-o-19": "teen-money",
  "en-o-20": "teen-money",
  "en-o-21": "hera-shero",
  "en-o-22": "hera-shero",
  "en-o-23": "hera-shero",
  "en-o-24": "hera-shero",
  "en-o-25": "hera-shero",
};

const QUESTION_FIGURES: Record<string, string> = {
  "en-o-16a": "/tka/en-o-20.svg",
  "en-o-16b": "/tka/en-o-20.svg",
  "en-o-17": "/tka/en-o-20.svg",
  "en-o-18": "/tka/en-o-20.svg",
  "en-o-19": "/tka/en-o-20.svg",
};

export function passageById(id: string): TkaPassage | undefined {
  return PASSAGE_BY_ID.get(id);
}

export function passageForQuestion(question: TkaQuestion): TkaPassage | undefined {
  const id = QUESTION_PASSAGE_IDS[question.id];
  return id ? passageById(id) : undefined;
}

export function figureForQuestion(question: TkaQuestion): string | undefined {
  return question.image ?? QUESTION_FIGURES[question.id];
}
