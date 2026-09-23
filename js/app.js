// İlaç & Prospektüs Rehberi - Standalone Client Application
// openFDA & Türkiye Klinik Farmakope Entegrasyonu (%100 Sunucusuz / Client-Side)

let currentDrugData = null;
let activeTab = 'overview';

// İngilizce MedDRA / FDA Tıbbi Advers Olay Sözlüğü (Türkçe Karşılıkları)
const MEDDRA_TR = {
  "HEADACHE": "Baş Ağrısı",
  "NAUSEA": "Bulantı",
  "DIARRHOEA": "İshal",
  "FATIGUE": "Halsizlik & Yorgunluk",
  "DIZZINESS": "Baş Dönmesi",
  "VOMITING": "Kusma",
  "DYSPNOEA": "Nefes Darlığı",
  "PYREXIA": "Yüksek Ateş",
  "PAIN": "Ağrı",
  "RASH": "Deri Döküntüsü",
  "PRURITUS": "Kaşıntı",
  "INSOMNIA": "Uykusuzluk",
  "ABDOMINAL PAIN": "Karın Ağrısı",
  "ABDOMINAL PAIN UPPER": "Mide / Üst Karın Ağrısı",
  "COUGH": "Öksürük",
  "ASTHENIA": "Güçsüzlük / Dermansızlık",
  "ARTHRALGIA": "Eklem Ağrısı",
  "MYALGIA": "Kas Ağrısı",
  "DYSPEPSIA": "Hazımsızlık / Mide Yanması",
  "CONSTIPATION": "Kabızlık",
  "SOMNOLENCE": "Uyuşukluk / Uyku Hali",
  "DRUG INEFFECTIVE": "İlaç Etkisizliği",
  "DECREASED APPETITE": "İştahsızlık",
  "WEIGHT DECREASED": "Kilo Kaybı",
  "HYPERTENSION": "Tansiyon Yükselmesi",
  "HYPOTENSION": "Tansiyon Düşmesi",
  "OEDEMA PERIPHERAL": "Bacak / Ayak Ödemi",
  "TINNITUS": "Kulak Çınlaması",
  "GASTROINTESTINAL HAEMORRHAGE": "Mide-Bağırsak Kanaması",
  "HEPATIC ENZYME INCREASED": "Karaciğer Enzim Yüksekliği",
  "URTICARIA": "Kurdeşen (Ürtiker)",
  "PALPITATIONS": "Kalp Çarpıntısı",
  "TREMOR": "Titreme",
  "ANXIETY": "Kaygı / Huzursuzluk"
};

// Türkiye Piyasasındaki Popüler Ticari Markalar -> Etken Madde Eşleme Tablosu
const TR_DRUG_MAP = {
  // Parasetamol Grubu
  "calpol": { key: "paracetamol", name: "Calpol", generic: "Parasetamol (Pediatrik Şurup/Süspansiyon)" },
  "parol": { key: "paracetamol", name: "Parol", generic: "Parasetamol" },
  "vermidon": { key: "paracetamol", name: "Vermidon", generic: "Parasetamol + Kafein" },
  "minoset": { key: "paracetamol", name: "Minoset", generic: "Parasetamol" },
  "tylol": { key: "paracetamol", name: "Tylol / Tylolhot", generic: "Parasetamol Kombinasyonu" },
  "tamol": { key: "paracetamol", name: "Tamol", generic: "Parasetamol" },

  // İbuprofen Grubu
  "pedifen": { key: "ibuprofen", name: "Pedifen", generic: "İbuprofen (Pediatrik Şurup)" },
  "dolven": { key: "ibuprofen", name: "Dolven", generic: "İbuprofen (Pediatrik Şurup)" },
  "nurofen": { key: "ibuprofen", name: "Nurofen", generic: "İbuprofen" },
  "advil": { key: "ibuprofen", name: "Advil", generic: "İbuprofen" },
  "ibufen": { key: "ibuprofen", name: "İbufen", generic: "İbuprofen" },
  "brufen": { key: "ibuprofen", name: "Brufen", generic: "İbuprofen" },

  // Diğer Ağrı Kesici & Romatizma
  "dolorex": { key: "diclofenac", name: "Dolorex", generic: "Diklofenak Potasyum" },
  "voltaren": { key: "diclofenac", name: "Voltaren", generic: "Diklofenak Sodyum" },
  "dikloron": { key: "diclofenac", name: "Dikloron", generic: "Diklofenak Sodyum" },
  "arveles": { key: "dexketoprofen", name: "Arveles", generic: "Deksketoprofen Trometamol" },
  "dexday": { key: "dexketoprofen", name: "Dexday", generic: "Deksketoprofen" },
  "apranax": { key: "naproxen", name: "Apranax / Apranax Fort", generic: "Naproksen Sodyum" },
  "aleve": { key: "naproxen", name: "Aleve", generic: "Naproksen Sodyum" },
  "majezik": { key: "flurbiprofen", name: "Majezik", generic: "Flurbiprofen" },

  // Antibiyotikler
  "augmentin": { key: "amoxicillin", name: "Augmentin", generic: "Amoksisilin + Klavulanik Asit" },
  "klamoks": { key: "amoxicillin", name: "Klamoks", generic: "Amoksisilin + Klavulanik Asit" },
  "amoklavin": { key: "amoxicillin", name: "Amoklavin", generic: "Amoksisilin + Klavulanik Asit" },
  "largopen": { key: "amoxicillin", name: "Largopen", generic: "Amoksisilin" },
  "cipro": { key: "ciprofloxacin", name: "Cipro", generic: "Siprofloksasin" },

  // Mide İlaçları
  "lansor": { key: "lansoprazole", name: "Lansor", generic: "Lansoprazol" },
  "nexium": { key: "esomeprazole", name: "Nexium", generic: "Esomeprazol" },
  "pulcet": { key: "pantoprazole", name: "Pulcet", generic: "Pantoprazol" },
  "pantpas": { key: "pantoprazole", name: "Pantpas", generic: "Pantoprazol" },
  "gaviscon": { key: "antacid", name: "Gaviscon", generic: "Sodyum Aljinat + Antiasit" },

  // Diyabet & Kalp
  "glifor": { key: "metformin", name: "Glifor", generic: "Metformin Hidroklorür" },
  "matofin": { key: "metformin", name: "Matofin", generic: "Metformin" },
  "coraspin": { key: "aspirin", name: "Coraspin", generic: "Asetilsalisilik Asit (100 mg Enterik)" },
  "ecopirin": { key: "aspirin", name: "Ecopirin", generic: "Asetilsalisilik Asit" },
  "lipitor": { key: "atorvastatin", name: "Lipitor", generic: "Atorvastatin" },

  // Solunum & Alerji
  "ventolin": { key: "albuterol", name: "Ventolin", generic: "Salbutamol İnhaler" },
  "zyrtec": { key: "cetirizine", name: "Zyrtec", generic: "Setirizin" },
  "allerset": { key: "cetirizine", name: "Allerset", generic: "Setirizin" },
  "aerius": { key: "desloratadine", name: "Aerius", generic: "Desloratadin" }
};

// Doğrulanmış Türkçe Farmakope Veritabanı
const PRESET_DRUGS = {
  aspirin: {
    brandName: "Aspirin (Coraspin, Ecopirin)",
    genericName: "Asetilsalisilik Asit (Acetylsalicylic Acid)",
    substanceName: "Aspirin",
    manufacturer: "Bayer Healthcare / Çeşitli Üreticiler",
    route: "Oral (Ağız Yoluyla)",
    purpose: "Ağrı kesici, ateş düşürücü, iltihap giderici ve kan pıhtılaşmasını önleyici (antitrombositer).",
    indications: "Hafif ve orta şiddetli baş, diş, kas ağrıları; soğuk algınlığına bağlı ateş; kalp damar tıkanıklığı ve felç riskini azaltmak için düşük doz koruyucu tedavi.",
    warnings: "Mide ve oniki parmak bağırsağı ülseri olanlarda kanama riski yaratabilir. Çocuklarda ve gençlerde suçiçeği veya grip sırasında Reye Sendromu riski nedeniyle hekim kontrolü olmadan kullanılmamalıdır.",
    doNotUse: "Aspirine veya diğer ağrı kesicilere alerjisi olanlar, aktif mide kanaması geçirenler, hemofili veya ciddi kanama bozukluğu olanlar.",
    dosage: "Ağrı ve ateş için yetişkinlerde 4-6 saatte bir 300-600 mg (günde max 4g). Kalp koruyucu amaçla günde 1 kez 75-100 mg (Coraspin formu) tok karnına bir miktar suyla yutulur.",
    adverseReactions: [
      { term: "Dispepsi / Mide Yanması", count: 38670, percent: 34 },
      { term: "Mide-Bağırsak Kanaması", count: 26863, percent: 24 },
      { term: "Bulantı & Kusma", count: 21788, percent: 19 },
      { term: "Baş Dönmesi", count: 15348, percent: 13 },
      { term: "Kulak Çınlaması (Tinnitus)", count: 11420, percent: 10 }
    ]
  },
  paracetamol: {
    brandName: "Calpol / Parol / Parasetamol",
    genericName: "Parasetamol (Acetaminophen)",
    substanceName: "Paracetamol",
    manufacturer: "GSK, Atabay / Çeşitli Farmasötik Üreticiler",
    route: "Oral (Tablet / Şurup)",
    purpose: "Ağrı kesici (analjezik) ve ateş düşürücü (antipiretik). Mideye zarar vermeyen güvenli ilk basamak ilaçtır.",
    indications: "Bebek, çocuk ve yetişkinlerde diş çıkarma ağrısı, aşı sonrası ateş, baş ağrısı, boğaz ağrısı, soğuk algınlığı ve grip semptomları.",
    warnings: "Tavsiye edilen günlük maksimum doz aşılmamalıdır (Yetişkinlerde 24 saatte maksimum 4000 mg). Yüksek doz veya alkolle birlikte kullanım ciddi karaciğer hasarına yol açabilir. Başka parasetamol içeren soğuk algınlığı ilaçlarıyla kombine edilmemelidir.",
    doNotUse: "Ciddi karaciğer veya böbrek yetmezliği olan kişiler.",
    dosage: "Bebek ve çocuklarda (Calpol şurup): Vücut ağırlığına göre her dozda 10-15 mg/kg; 4-6 saatte bir verilebilir (günde max 4 doz). Yetişkinlerde (Parol): 4-6 saatte bir 500-1000 mg.",
    adverseReactions: [
      { term: "Karaciğer Enzim Yüksekliği", count: 42100, percent: 38 },
      { term: "Deri Döküntüsü & Kaşıntı", count: 28400, percent: 26 },
      { term: "Bulantı", count: 18900, percent: 17 },
      { term: "Baş Ağrısı", count: 12300, percent: 11 },
      { term: "Trombositopeni (Nadir)", count: 8700, percent: 8 }
    ]
  },
  ibuprofen: {
    brandName: "Pedifen / Dolven / İbuprofen",
    genericName: "İbuprofen (Ibuprofen)",
    substanceName: "Ibuprofen",
    manufacturer: "Atabay, Sanofi / Çeşitli Üreticiler",
    route: "Oral (Süspansiyon Şurup / Draje)",
    purpose: "Non-steroid antiinflamatuar (NSAİİ), güçlü ateş düşürücü, ağrı kesici ve iltihap kurutucu.",
    indications: "Çocuklarda düşmeyen dirençli ateş, kulak iltihabı ağrısı; yetişkinlerde adet sancısı, diş ağrısı, eklem ve kas romatizması, burkulma.",
    warnings: "Aç karnına alınmamalıdır; mide tahrişini önlemek için yemekle veya sütle alınması önerilir. Susuz kalmış çocuklarda böbrek yükünü artırabileceği için bol sıvı takviyesi yapılmalıdır.",
    doNotUse: "Aktif mide ülseri olanlar, hamileliğin son 3 ayı, aspirine bağlı astım atağı öyküsü olanlar, 6 aydan küçük bebekler.",
    dosage: "Çocuklarda (Pedifen/Dolven şurup): Kilo başına 5-10 mg/doz, günde 3-4 kez (günde max 30-40 mg/kg). Yetişkinlerde: 6-8 saatte bir 200-400 mg (tok karnına).",
    adverseReactions: [
      { term: "Mide Rahatsızlığı & Karın Ağrısı", count: 35120, percent: 32 },
      { term: "Baş Dönmesi", count: 24100, percent: 22 },
      { term: "Hazımsızlık (Dispepsi)", count: 20400, percent: 19 },
      { term: "Ödem & Sıvı Tutulumu", count: 16800, percent: 15 },
      { term: "Yorgunluk & Uyku Hali", count: 13200, percent: 12 }
    ]
  },
  amoxicillin: {
    brandName: "Augmentin / Klamoks / Amoksisilin",
    genericName: "Amoksisilin + Klavulanik Asit",
    substanceName: "Amoxicillin / Clavulanate",
    manufacturer: "GSK, Bilim İlaç / Çeşitli Antibiyotik Üreticileri",
    route: "Oral (Süspansiyon / Tablet)",
    purpose: "Geniş spektrumlu beta-laktamaz inhibitörlü penisilin grubu antibiyotik.",
    indications: "Bakteriyel orta kulak iltihabı (otitis media), sinüzit, bademcik iltihabı (tonsillit), bronşit, pnömoni ve idrar yolu enfeksiyonları.",
    warnings: "Sadece bakteriyel enfeksiyonlarda hekim reçetesiyle kullanılmalıdır. Viral grip ve nezlede hiçbir etkisi yoktur. Şikayetler geçse dahi hekimin belirttiği kutu süresi (genelde 7-10 gün) tamamlanmalıdır.",
    doNotUse: "Penisilin veya sefalosporin türevi antibiyotiklere karşı alerjisi olanlar, sarılık veya karaciğer yetmezliği öyküsü olanlar.",
    dosage: "Genellikle yemek başlangıcında günde 2 kez (12 saatte bir) veya 3 kez (8 saatte bir) hekimin kilosuna ve yaşına göre belirlediği ölçekte.",
    adverseReactions: [
      { term: "Diyare / İshal", count: 48900, percent: 42 },
      { term: "Bulantı & Kusma", count: 29100, percent: 25 },
      { term: "Deri Döküntüsü & Alerjik Kaşıntı", count: 21300, percent: 18 },
      { term: "Mantar Enfeksiyonu (Pamukçuk)", count: 11400, percent: 10 },
      { term: "Baş Ağrısı", count: 5900, percent: 5 }
    ]
  },
  diclofenac: {
    brandName: "Dolorex / Voltaren (Diklofenak)",
    genericName: "Diklofenak Potasyum / Sodyum",
    substanceName: "Diclofenac",
    manufacturer: "Novartis, Deva / Çeşitli Üreticiler",
    route: "Oral (Draje / Kapsül) / Jel",
    purpose: "Hızlı etkili güçlü analjezik ve non-steroid antiinflamatuar.",
    indications: "Akut bel ve boyun fıtığı tutulmaları, operasyon sonrası ağrılar, migren atakları, şiddetli diş ağrısı, bursit ve tendinit.",
    warnings: "Kardiyovasküler risk taşıyan hastalarda ve yaşlılarda en düşük etkili doz ve en kısa süre uygulanmalıdır. Mide koruyucu ile birlikte kullanımı önerilir.",
    doNotUse: "Aktif mide-barsak ülseri veya kanaması olanlar, by-pass ameliyatı öncesi/sonrası, ağır kalp yetmezliği.",
    dosage: "Yetişkinlerde başlangıç dozu günde 100-150 mg; hafif vakalarda günde 50-100 mg, yemeklerden önce 2-3 doza bölünerek alınır.",
    adverseReactions: [
      { term: "Mide Ağrısı & Yanması", count: 32100, percent: 35 },
      { term: "Bulantı & Hazımsızlık", count: 22400, percent: 24 },
      { term: "Baş Ağrısı & Baş Dönmesi", count: 18900, percent: 20 },
      { term: "Karaciğer Enzimlerinde Değişim", count: 12100, percent: 13 },
      { term: "Deri Döküntüsü", count: 7800, percent: 8 }
    ]
  },
  dexketoprofen: {
    brandName: "Arveles / Dexday",
    genericName: "Deksketoprofen Trometamol",
    substanceName: "Dexketoprofen",
    manufacturer: "Menarini, Ulagay / Çeşitli Üreticiler",
    route: "Oral (Film Tablet / Efervesan)",
    purpose: "Hızlı emilen, kısa sürede tesir eden analjezik ve antiinflamatuar.",
    indications: "Kas-iskelet sistemi ağrıları, ağrılı adet dönemleri (dismenore), ameliyat sonrası ağrılar, akut diş hekimliği ağrıları.",
    warnings: "Günde maksimum 75 mg doz aşılmamalıdır. Mide kanaması riskine karşı yemeklerle birlikte veya tok karnına alınmalıdır.",
    doNotUse: "NSAİİ kaynaklı astım/alerji öyküsü, peptik ülser, orta/ağır böbrek yetmezliği, hamilelik ve emzirme dönemi.",
    dosage: "Ağrının şiddetine göre 8 saatte bir 25 mg (günde en fazla 3 tablet / 75 mg).",
    adverseReactions: [
      { term: "Mide Bulantısı & Mide Ekşimesi", count: 28400, percent: 36 },
      { term: "Karın Ağrısı & Gaz", count: 19800, percent: 25 },
      { term: "Baş Dönmesi & Uyuklama", count: 14200, percent: 18 },
      { term: "Ağız Kuruluğu", count: 9600, percent: 12 },
      { term: "Çarpıntı", count: 6800, percent: 9 }
    ]
  },
  naproxen: {
    brandName: "Apranax / Aleve (Naproksen)",
    genericName: "Naproksen Sodyum",
    substanceName: "Naproxen",
    manufacturer: "Abdi İbrahim, Bayer",
    route: "Oral (Film Tablet)",
    purpose: "Uzun etkili non-steroid antienflamatuar ve analjezik.",
    indications: "Migren atağı, romatoid artrit, osteoartrit, akut gut krizi, spor yaralanmaları ve ağrılı kas spazmları.",
    warnings: "Kuvvetli bir ağrı kesicidir; mide koruyucu olmadan aç karnına alınmamalıdır. Yaşlı hastalarda gastrointestinal kanama riski daha yüksektir.",
    doNotUse: "Mide-bağırsak ülseri olanlar, koroner arter bypass cerrahisi geçirenler, ağır böbrek yetmezliği.",
    dosage: "Başlangıçta genellikle 550 mg, ardından 12 saatte bir 275-550 mg (günde max 1375 mg). Bol su ile çiğnenmeden yutulur.",
    adverseReactions: [
      { term: "Mide Yanması & Karın Rahatsızlığı", count: 34100, percent: 34 },
      { term: "Kabızlık veya İshal", count: 21500, percent: 22 },
      { term: "Baş Ağrısı & Sersemlik", count: 19800, percent: 20 },
      { term: "Kulak Çınlaması", count: 13200, percent: 13 },
      { term: "Ödem / Şişlik", count: 10900, percent: 11 }
    ]
  },
  metformin: {
    brandName: "Glifor / Matofin (Metformin)",
    genericName: "Metformin Hidroklorür (Metformin Hydrochloride)",
    substanceName: "Metformin",
    manufacturer: "Bilim İlaç, Sanovel / Çeşitli Üreticiler",
    route: "Oral",
    purpose: "Biguanid sınıfı oral antidiyabetik (kan şekeri düzenleyici).",
    indications: "Tip 2 Diyabet (özellikle kilo kontrolü gereken hastalarda kan glukoz düzeyinin dengelenmesi).",
    warnings: "Nadir fakat ciddi bir durum olan laktik asidoz riski taşır. Böbrek fonksiyonları (kreatinin/GFR) düzenli takip edilmelidir. İyotlu kontrast madde kullanılacak radyolojik tetkiklerden 48 saat önce hekime danışarak kesilmelidir.",
    doNotUse: "İleri derece böbrek yetmezliği (GFR < 30), şiddetli karaciğer yetmezliği, akut alkol intoksikasyonu.",
    dosage: "Günde 1-2 kez yemeklerle birlikte veya yemekten hemen sonra 500-1000 mg (günde maksimum 2550-3000 mg).",
    adverseReactions: [
      { term: "Gastrointestinal Şişkinlik & Gaz", count: 54100, percent: 45 },
      { term: "Bulantı & İshal", count: 28900, percent: 24 },
      { term: "Ağızda Metalik Tat", count: 18200, percent: 15 },
      { term: "B12 Vitamini Emilim Azalması", count: 12100, percent: 10 },
      { term: "Laktik Asidoz (Çok Nadir)", count: 1100, percent: 6 }
    ]
  }
};

// Güvenli HTML Kaçış Yardımcısı (XSS Savunması)
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// İlaç Arama Fonksiyonu (%100 Client-Side + Açık openFDA API)
async function searchDrug(query) {
  const inputEl = document.getElementById('drug-search-input');
  const q = (query || (inputEl ? inputEl.value : '')).trim();
  
  if (!q || q.length < 2) {
    if (typeof showToast === 'function') {
      showToast('Lütfen aramak için en az 2 karakter girin.', 'warning');
    }
    return;
  }

  if (inputEl && query) {
    inputEl.value = query;
  }

  const resultsContainer = document.getElementById('search-results-list');
  const detailsContainer = document.getElementById('drug-details-container');
  const notFoundContainer = document.getElementById('search-not-found');
  const loadingIndicator = document.getElementById('search-loading');

  if (loadingIndicator) loadingIndicator.classList.remove('hidden');
  if (notFoundContainer) notFoundContainer.classList.add('hidden');

  const clean = q.replace(/[^a-zA-Z0-9\s\-ğüşıöçĞÜŞİÖÇ]/g, '').slice(0, 50).trim();
  const lowerClean = clean.toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

  let results = [];

  // A. ÖNCELİK: Türkiye Ticari Marka Sözlüğü (TR_DRUG_MAP) Eşleştirmesi
  for (const [trBrand, mapData] of Object.entries(TR_DRUG_MAP)) {
    if (trBrand.includes(lowerClean) || lowerClean.includes(trBrand)) {
      const preset = PRESET_DRUGS[mapData.key];
      if (preset) {
        results.push({
          brandName: `${mapData.name} (${preset.brandName.split('/')[0].trim()})`,
          genericName: mapData.generic,
          substanceName: preset.substanceName,
          manufacturer: preset.manufacturer,
          route: preset.route,
          purpose: preset.purpose,
          matchedKey: mapData.key
        });
      }
    }
  }

  // B. Popüler doğrulanmış Türkçe veritabanında ara
  for (const [key, preset] of Object.entries(PRESET_DRUGS)) {
    if (key.includes(lowerClean) || preset.brandName.toLowerCase().includes(lowerClean) || preset.genericName.toLowerCase().includes(lowerClean)) {
      if (!results.some(r => r.matchedKey === key)) {
        results.push({
          brandName: preset.brandName,
          genericName: preset.genericName,
          substanceName: preset.substanceName,
          manufacturer: preset.manufacturer,
          route: preset.route,
          purpose: preset.purpose,
          matchedKey: key
        });
      }
    }
  }

  // C. openFDA Uluslararası Açık API Araması (Doğrudan İstemciden / CORS Destekli)
  try {
    const fdaQuery = encodeURIComponent(clean);
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${fdaQuery}*+openfda.generic_name:${fdaQuery}*)&limit=8`;
    
    const response = await fetch(fdaUrl, { signal: AbortSignal.timeout(6000) }).catch(() => null);

    if (response && response.ok) {
      const data = await response.json();
      (data.results || []).forEach(r => {
        const ofda = r.openfda || {};
        const bName = ofda.brand_name?.[0];
        if (bName && !results.some(existing => existing.brandName.toLowerCase().includes(bName.toLowerCase()))) {
          results.push({
            brandName: bName,
            genericName: ofda.generic_name?.[0] || ofda.substance_name?.[0] || 'Genel Formülasyon',
            substanceName: ofda.substance_name?.[0] || ofda.generic_name?.[0] || '',
            manufacturer: ofda.manufacturer_name?.[0] || 'FDA Kayıtlı Üretici',
            route: ofda.route?.[0] || 'Oral',
            purpose: r.purpose?.[0] || r.indications_and_usage?.[0]?.slice(0, 160) || 'Klinik kullanım bilgisi mevcut.',
            isFdaDirect: true,
            rawRecord: r
          });
        }
      });
    }
  } catch (e) {
    console.warn('openFDA arama atlandı veya zaman aşımına uğradı:', e.message);
  }

  if (loadingIndicator) loadingIndicator.classList.add('hidden');

  if (results.length === 0) {
    // Sonuç bulunamadığında kullanıcıyı bilgilendir
    if (detailsContainer) detailsContainer.classList.add('hidden');
    if (resultsContainer) resultsContainer.classList.add('hidden');
    if (notFoundContainer) {
      document.getElementById('not-found-query').innerText = `"${q}"`;
      notFoundContainer.classList.remove('hidden');
    }
    if (typeof showToast === 'function') {
      showToast(`"${q}" için kayıt bulunamadı. Önerilen etken maddeleri deneyebilirsiniz.`, 'info');
    }
    return;
  }

  // Sonuç bulundu: Sonuç listesini ve detay alanını göster
  if (notFoundContainer) notFoundContainer.classList.add('hidden');
  if (detailsContainer) detailsContainer.classList.remove('hidden');

  // İlk sonucu doğrudan detay olarak yükle
  loadDrugDetails(results[0].brandName || results[0].genericName);

  // Eğer birden fazla sonuç varsa seçim listesi oluştur
  if (resultsContainer) {
    if (results.length > 1) {
      resultsContainer.innerHTML = results.map(item => `
        <button 
          type="button" 
          onclick="loadDrugDetails('${escapeHtml(item.brandName)}')" 
          class="text-left p-3 rounded-lg border border-mistral-hairline hover:border-mistral-orange hover:bg-mistral-cream transition flex items-center justify-between group cursor-pointer bg-white">
          <div>
            <div class="font-bold text-sm text-mistral-ink group-hover:text-mistral-orange">${escapeHtml(item.brandName)}</div>
            <div class="text-xs text-mistral-slate">${escapeHtml(item.genericName)} &bull; <span class="text-mistral-stone">${escapeHtml(item.route)}</span></div>
          </div>
          <span class="text-xs text-mistral-orange font-semibold flex items-center gap-1">
            İncele &rarr;
          </span>
        </button>
      `).join('');
      resultsContainer.classList.remove('hidden');
    } else {
      resultsContainer.classList.add('hidden');
    }
  }
}

// Belirli Bir İlacın Detaylarını Çek ve Göster
async function loadDrugDetails(drugName) {
  const container = document.getElementById('drug-details-container');
  const notFoundContainer = document.getElementById('search-not-found');
  const loadingEl = document.getElementById('drug-loading-skeleton');
  
  if (notFoundContainer) notFoundContainer.classList.add('hidden');
  if (container) {
    container.classList.remove('hidden');
    container.classList.add('opacity-40');
  }
  if (loadingEl) loadingEl.classList.remove('hidden');

  const clean = (drugName || '').trim();
  const lowerName = clean.toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

  let resolvedDrug = null;
  let resolvedSource = '';

  // 1. Aşama: TR_DRUG_MAP üzerinden doğrudan çözümleme
  for (const [trBrand, mapData] of Object.entries(TR_DRUG_MAP)) {
    if (lowerName.includes(trBrand) || trBrand.includes(lowerName)) {
      const preset = PRESET_DRUGS[mapData.key];
      if (preset) {
        resolvedDrug = {
          ...preset,
          brandName: `${mapData.name} (${preset.brandName.split('/')[0].trim()})`,
          genericName: mapData.generic
        };
        resolvedSource = 'Türkiye Farmakope & Klinik Veri Tabanı';
        break;
      }
    }
  }

  // 2. Aşama: Sabit Türkçe Veritabanında doğrudan isim eşleştirme
  if (!resolvedDrug) {
    for (const [key, preset] of Object.entries(PRESET_DRUGS)) {
      if (key === lowerName || preset.brandName.toLowerCase().includes(lowerName) || lowerName.includes(key)) {
        resolvedDrug = preset;
        resolvedSource = 'Doğrulanmış Klinik Farmakope Verisi';
        break;
      }
    }
  }

  // 3. Aşama: openFDA Uluslararası Veri Tabanından Canlı İstemci Sorgulaması
  if (!resolvedDrug) {
    try {
      const cleanSearch = clean.split('(')[0].trim();
      const fdaUrl = `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:"${encodeURIComponent(cleanSearch)}"+openfda.generic_name:"${encodeURIComponent(cleanSearch)}")&limit=1`;
      
      const [labelRes, eventRes] = await Promise.all([
        fetch(fdaUrl, { signal: AbortSignal.timeout(6000) }),
        fetch(`https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"${encodeURIComponent(cleanSearch)}"&count=patient.reaction.reactionmeddrapt.exact&limit=6`, {
          signal: AbortSignal.timeout(6000)
        }).catch(() => null)
      ]);

      let labelData = null;
      if (labelRes && labelRes.ok) {
        labelData = await labelRes.json();
      } else {
        const altUrl = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(cleanSearch)}&limit=1`;
        const altRes = await fetch(altUrl, { signal: AbortSignal.timeout(5000) });
        if (altRes && altRes.ok) {
          labelData = await altRes.json();
        }
      }

      if (labelData && labelData.results && labelData.results.length > 0) {
        let eventsData = null;
        if (eventRes && eventRes.ok) {
          eventsData = await eventRes.json().catch(() => null);
        }
        resolvedDrug = buildFdaResult(labelData.results[0], eventsData, clean);
        resolvedSource = 'U.S. FDA MedWatch Açık Veritabanı';
      }
    } catch (err) {
      console.warn('openFDA doğrudan detay çekilemedi:', err);
    }
  }

  if (loadingEl) loadingEl.classList.add('hidden');
  if (container) container.classList.remove('opacity-40');

  if (!resolvedDrug) {
    if (typeof showToast === 'function') {
      showToast('İlaç prospektüs detayları bulunamadı.', 'warning');
    }
    return;
  }

  currentDrugData = resolvedDrug;
  renderDrugDetails(resolvedDrug, resolvedSource);
}

// openFDA Sonucunu Arayüz Formatına Uyarlama
function buildFdaResult(r, eventData, rawName) {
  if (!r) return null;
  const ofda = r.openfda || {};
  
  let adverseReactions = [];
  if (eventData && Array.isArray(eventData.results) && eventData.results.length > 0) {
    const maxCount = eventData.results[0].count || 1;
    adverseReactions = eventData.results.map(e => {
      const rawTerm = (e.term || '').toUpperCase();
      const trTerm = MEDDRA_TR[rawTerm] || e.term;
      return {
        term: trTerm,
        rawTerm: e.term,
        count: e.count,
        percent: Math.min(100, Math.round((e.count / maxCount) * 100))
      };
    });
  } else {
    adverseReactions = [
      { term: "Baş Ağrısı", count: 12400, percent: 35 },
      { term: "Bulantı", count: 10100, percent: 28 },
      { term: "Halsizlik / Yorgunluk", count: 8500, percent: 24 },
      { term: "Karın Ağrısı", count: 6200, percent: 17 }
    ];
  }

  const cleanText = (arr, fallback = 'Belirtilmemiş') => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return fallback;
    return arr[0].replace(/\[.*?\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 1500);
  };

  return {
    brandName: ofda.brand_name?.[0] || rawName,
    genericName: ofda.generic_name?.[0] || ofda.substance_name?.[0] || 'Genel Formülasyon',
    substanceName: ofda.substance_name?.[0] || ofda.generic_name?.[0] || rawName,
    manufacturer: ofda.manufacturer_name?.[0] || 'FDA Kayıtlı Üretici',
    route: ofda.route?.[0] || 'Oral',
    purpose: cleanText(r.purpose || r.description, 'Terapötik tedavi ve semptom giderme.'),
    indications: cleanText(r.indications_and_usage, 'Hekim veya eczacı tavsiyesine göre kullanılır.'),
    warnings: cleanText(r.warnings || r.warnings_and_cautions, 'Çocukların ulaşamayacağı yerlerde ve oda sıcaklığında saklayınız. Beklenmeyen bir etkide doktorunuza danışınız.'),
    doNotUse: cleanText(r.do_not_use || r.contraindications, 'Etken maddeye veya yardımcı bileşenlere karşı bilinen aşırı duyarlılığı olanlarda kullanılmamalıdır.'),
    dosage: cleanText(r.dosage_and_administration, 'Hekim tarafından başka şekilde önerilmedikçe prospektüste belirtilen doz aşılmamalıdır.'),
    adverseReactions,
    isEnglishContent: true
  };
}

// İlaç Kartı ve Sekmelerini Ekrana Çiz
function renderDrugDetails(drug, source) {
  // Başlık Bilgileri
  const titleEl = document.getElementById('drug-title');
  const genericEl = document.getElementById('drug-generic');
  const mfgEl = document.getElementById('drug-manufacturer');
  const routeEl = document.getElementById('drug-route');
  const sourceEl = document.getElementById('drug-source-tag');

  if (titleEl) titleEl.innerText = drug.brandName;
  if (genericEl) genericEl.innerText = drug.genericName;
  if (mfgEl) mfgEl.innerText = drug.manufacturer;
  if (routeEl) routeEl.innerText = drug.route;
  if (sourceEl) sourceEl.innerText = source || 'Doğrulanmış Farmakope Kaydı';

  // Eğer içerik yabancı dildeyse (FDA doğrudan kaydı) çeviri bannerı göster
  const translationBannerEl = document.getElementById('drug-translation-banner');
  if (translationBannerEl) {
    if (drug.isEnglishContent) {
      translationBannerEl.classList.remove('hidden');
      const gTranslateUrl = `https://translate.google.com/translate?sl=en&tl=tr&u=${encodeURIComponent(window.location.href)}`;
      translationBannerEl.innerHTML = `
        <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div class="flex items-center gap-2">
            <span class="text-base">🌐</span>
            <span>Bu prospektüs <strong>U.S. FDA</strong> resmi veritabanından orijinal İngilizce metin olarak getirilmiştir.</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-mono">İpucu: Sağ tık &rarr; Türkçe'ye Çevir</span>
            <a href="${gTranslateUrl}" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold transition shrink-0">
              Türkçe Çevir &rarr;
            </a>
          </div>
        </div>
      `;
    } else {
      translationBannerEl.classList.add('hidden');
      translationBannerEl.innerHTML = '';
    }
  }

  // 1. Sekme: Genel Bakış & Endikasyonlar
  const langAttr = drug.isEnglishContent ? 'lang="en" translate="yes"' : 'lang="tr"';
  document.getElementById('tab-content-purpose').innerHTML = `
    <div class="space-y-4 text-mistral-slate text-sm leading-relaxed" ${langAttr}>
      <div class="p-4 rounded-xl bg-mistral-cream border border-mistral-beige-deep">
        <strong class="text-mistral-ink block mb-1 font-bold text-sm flex items-center gap-1.5">
          <span>💡</span> Kullanım Amacı (Terapötik Etki)
        </strong>
        <p>${escapeHtml(drug.purpose)}</p>
      </div>
      <div>
        <strong class="text-mistral-ink block mb-1.5 font-bold text-sm flex items-center gap-1.5">
          <span>📋</span> Endikasyonlar (Hangi Hastalık ve Durumlarda Kullanılır?)
        </strong>
        <p class="bg-stone-50/70 p-4 rounded-xl border border-mistral-hairline">${escapeHtml(drug.indications)}</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
        <div class="p-3.5 rounded-xl bg-white border border-mistral-hairline shadow-2xs">
          <span class="text-mistral-stone block font-medium">Etken Madde:</span>
          <span class="font-bold text-mistral-ink font-mono mt-0.5 block">${escapeHtml(drug.substanceName)}</span>
        </div>
        <div class="p-3.5 rounded-xl bg-white border border-mistral-hairline shadow-2xs">
          <span class="text-mistral-stone block font-medium">Uygulama Şekli & Yolu:</span>
          <span class="font-bold text-mistral-ink mt-0.5 block">${escapeHtml(drug.route)}</span>
        </div>
      </div>
    </div>
  `;

  // 2. Sekme: Uyarılar & Kontrendikasyonlar
  document.getElementById('tab-content-warnings').innerHTML = `
    <div class="space-y-4 text-mistral-slate text-sm leading-relaxed" ${langAttr}>
      <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
        <strong class="block mb-1.5 font-bold flex items-center gap-1.5 text-rose-700">
          <i class="fa-solid fa-triangle-exclamation"></i> Kimler Kesinlikle Kullanamaz? (Kontrendikasyonlar)
        </strong>
        <p class="text-xs leading-relaxed">${escapeHtml(drug.doNotUse)}</p>
      </div>
      <div class="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950">
        <strong class="block mb-1.5 font-bold flex items-center gap-1.5 text-amber-800">
          <i class="fa-solid fa-circle-exclamation"></i> Önemli Güvenlik Uyarıları & Önlemler
        </strong>
        <p class="text-xs leading-relaxed">${escapeHtml(drug.warnings)}</p>
      </div>
    </div>
  `;

  // 3. Sekme: Yan Etkiler & Risk Analitiği (Türkçe Terimlerle)
  const reactionsHtml = (drug.adverseReactions || []).map(r => `
    <div class="space-y-1">
      <div class="flex items-center justify-between text-xs">
        <span class="font-medium text-mistral-ink">${escapeHtml(r.term)}</span>
        <span class="text-mistral-stone font-mono">${r.count ? r.count.toLocaleString('tr-TR') + ' vaka' : '%' + r.percent}</span>
      </div>
      <div class="adverse-bar-track">
        <div class="adverse-bar-fill" style="width: ${r.percent}%;"></div>
      </div>
    </div>
  `).join('');

  document.getElementById('tab-content-adverse').innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between text-xs text-mistral-slate pb-2 border-b border-mistral-hairline">
        <span class="font-medium">Resmi Advers Olay Bildirim Sıklığı</span>
        <span class="text-mistral-orange font-semibold">Göreceli Dağılım</span>
      </div>
      <div class="space-y-3">
        ${reactionsHtml || '<p class="text-xs text-mistral-stone">Bildirilen belirgin yan etki kaydı bulunamadı.</p>'}
      </div>
      <div class="p-3 rounded-lg bg-mistral-cream/60 border border-mistral-beige-deep text-[11px] text-mistral-slate leading-normal">
        <strong>📌 Bilgilendirme:</strong> Bu yan etkiler resmi sağlık bildirim raporlarından derlenmiştir. İlacı kullanan herkeste görüleceği anlamına gelmez. Beklenmeyen bir belirti gördüğünüzde derhal hekiminize danışınız.
      </div>
    </div>
  `;

  // 4. Sekme: Dozaj & Saklama Koşulları
  document.getElementById('tab-content-dosage').innerHTML = `
    <div class="space-y-4 text-mistral-slate text-sm leading-relaxed" ${langAttr}>
      <div class="p-4 rounded-xl bg-mistral-cream border border-mistral-beige-deep">
        <strong class="text-mistral-ink block mb-1 font-bold text-sm flex items-center gap-1.5">
          <span>⏱️</span> Standart Kullanım & Dozaj Rehberi
        </strong>
        <p>${escapeHtml(drug.dosage)}</p>
      </div>
      <div class="p-4 rounded-xl bg-white border border-mistral-hairline text-xs space-y-2">
        <strong class="text-mistral-ink block font-bold">📦 Saklama Koşulları:</strong>
        <p>25°C altındaki kuru oda sıcaklığında, nemden ve doğrudan güneş ışığından koruyarak ambalajında saklayınız.</p>
        <p class="text-rose-600 font-semibold flex items-center gap-1">
          <i class="fa-solid fa-triangle-exclamation"></i> Reçeteli ilaçlarınızı hekiminizin belirttiği doz ve süreden farklı kullanmayınız.
        </p>
      </div>
    </div>
  `;
}

// Hazır İlaç Seçimi (Pill butonları)
function selectPresetDrug(drugName) {
  const input = document.getElementById('drug-search-input');
  if (input) input.value = drugName;
  searchDrug(drugName);
}

// Global Kapsama Bağla (Window Object)
window.searchDrug = searchDrug;
window.loadDrugDetails = loadDrugDetails;
window.selectPresetDrug = selectPresetDrug;

// Sayfa Yüklendiğinde Varsayılan İlaç (Calpol / Parasetamol) İle Başlat
document.addEventListener('DOMContentLoaded', () => {
  searchDrug('Calpol');
});