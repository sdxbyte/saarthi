import { UsefulLinkItem } from '../types/sajiloTypes';

export const CURATED_USEFUL_LINKS: UsefulLinkItem[] = [
  // 1. Core Featured Portals (User Requested)
  {
    id: 'link-sajilo-github',
    title: 'Sajilo - Nepali Daily Essentials & Hub',
    titleNp: 'सजिलो - नेपाली दैनिक आवश्यकता र खुला स्रोत हब',
    url: 'https://github.com/adarshaacharya/sajilo',
    category: 'featured',
    isFeatured: true,
    authorOrSource: 'Adarsha Acharya (@adarshaacharya)',
    badge: 'Open Source • GitHub',
    descriptionEn:
      'The open-source daily utility hub built for Nepali netizens. Features Kalimati wholesale prices, gold/silver bullion rates, fuel tariffs, live NEPSE market, Bikram Sambat calendar, online FM radio, and land converters.',
    descriptionNp:
      'नेपाली इन्टरनेट प्रयोगकर्ताका लागि बनाइएको खुला स्रोत दैनिक जीवन उपयोगिता हब। कालिमाटी तरकारी बजार, सुनचाँदी, पेट्रोलियम, नेप्से सेयर, नेपाली क्यालेन्डर र एफएम रेडियो सहित।',
    tags: ['Sajilo', 'GitHub', 'Open Source', 'Nepal', 'Productivity', 'Kalimati', 'NEPSE', 'Patro'],
    subLinks: [
      { label: 'GitHub Repository', url: 'https://github.com/adarshaacharya/sajilo' },
      { label: 'Issues & Feedback', url: 'https://github.com/adarshaacharya/sajilo/issues' },
      { label: 'Releases & Changelog', url: 'https://github.com/adarshaacharya/sajilo/releases' },
    ],
  },
  {
    id: 'link-fmhy-main',
    title: 'FMHY - FreeMediaHeckYeah (The Free Internet Mega-Index)',
    titleNp: 'FMHY - फ्रि-मिडिया-हेक-ये (विश्वकै ठूलो खुला इन्टरनेट स्रोत)',
    url: 'https://fmhy.net',
    category: 'featured',
    isFeatured: true,
    authorOrSource: 'FMHY Community (r/FREEMEDIAHECKYEAH)',
    badge: 'Global Mega Index • Free Resources',
    descriptionEn:
      'The largest, community-vetted, non-commercial directory of free internet media, open-source software, streaming platforms, educational courses, reading materials, privacy guides, and system utilities.',
    descriptionNp:
      'निःशुल्क सफ्टवेयर, अनलाइन स्ट्रिमिङ, डिजिटल पुस्तक, अध्ययन सामग्री, एआई टुल्स, गोपनियता र उपयोगी वेब स्रोतहरूको विश्वकै विशाल र विज्ञापनरहित डाइरेक्टरी।',
    tags: ['FMHY', 'Free Media', 'Software', 'Tools', 'AI Tools', 'Streaming', 'Privacy', 'Learning'],
    subLinks: [
      { label: 'System Tools & Software', url: 'https://fmhy.net/system-tools' },
      { label: 'Free AI & Machine Learning Tools', url: 'https://fmhy.net/ai' },
      { label: 'Developer & Coding Tools', url: 'https://fmhy.net/devtools' },
      { label: 'Books & Academic Reading', url: 'https://fmhy.net/readingpiracyguide' },
      { label: 'Video & Streaming Guide', url: 'https://fmhy.net/videopiracyguide' },
      { label: 'Audio & Music Guide', url: 'https://fmhy.net/audiopiracyguide' },
      { label: 'Privacy & Adblocking Guide', url: 'https://fmhy.net/privacy' },
    ],
  },

  // 2. FMHY Specialized Portals
  {
    id: 'link-fmhy-system-tools',
    title: 'FMHY: System Tools, Utilities & Open Software',
    titleNp: 'FMHY: सिस्टम सफ्टवेयर र कम्प्युटर युटिलिटिज',
    url: 'https://fmhy.net/system-tools',
    category: 'fmhy',
    authorOrSource: 'FMHY Index',
    badge: 'System Utilities',
    descriptionEn:
      'Vetted collection of lightweight system cleaners, uninstallation utilities, archive managers, file converters, bench-marking software, and performance enhancers.',
    descriptionNp:
      'भाइरसमुक्त हल्का सिस्टम क्लिनर, फाइल कन्भर्टर, जिप एक्स्ट्र्याक्टर, अनइन्स्टलर र विन्डोज/लिनक्स/म्याकका उपयोगी सफ्टवेयरहरूको सूची।',
    tags: ['FMHY', 'System Tools', 'Utilities', 'Open Source', 'Windows', 'Linux', 'macOS'],
  },
  {
    id: 'link-fmhy-ai-tools',
    title: 'FMHY: Free AI, LLM & Machine Learning Hub',
    titleNp: 'FMHY: निःशुल्क एआई तथा मेसिन लर्निङ हब',
    url: 'https://fmhy.net/ai',
    category: 'fmhy',
    authorOrSource: 'FMHY AI Directory',
    badge: 'AI & Tools',
    descriptionEn:
      'Massive directory of free AI text generators, local offline LLMs, image synthesis platforms, speech-to-text, prompt engineering tools, and coding assistants.',
    descriptionNp:
      'निःशुल्क प्रयोग गर्न सकिने आर्टिफिसियल इन्टेलिजेन्स (AI) टूल्स, स्थानीय एलएलएम (LLM), इमेज जेनेरेटर र कोडिङ सहायकहरूको बृहत् संकलन।',
    tags: ['AI', 'LLM', 'Machine Learning', 'Prompts', 'FMHY', 'Generative AI'],
  },
  {
    id: 'link-fmhy-devtools',
    title: 'FMHY: Developer Tools, Free APIs & Hosting',
    titleNp: 'FMHY: विकासकर्ता औजार, खुला एपीआई र निःशुल्क होस्टिङ',
    url: 'https://fmhy.net/devtools',
    category: 'dev_tech',
    authorOrSource: 'FMHY Devs',
    badge: 'Dev Stack',
    descriptionEn:
      'Curated resources for coders: free web hosting, CDN services, public APIs, database tiers, SVG icons, frontend UI libraries, and cheat sheets.',
    descriptionNp:
      'प्रोग्रामर र वेब डेभलपरका लागि निःशुल्क होस्टिङ, डाटाबेस, एपीआई, आइकन्स, कोड स्निपेट्स तथा आवश्यक स्रोतहरू।',
    tags: ['Developer', 'APIs', 'Hosting', 'Frontend', 'Backend', 'Open Source'],
  },
  {
    id: 'link-fmhy-privacy',
    title: 'FMHY: Privacy, Adblocking & Digital Hygiene',
    titleNp: 'FMHY: गोपनीयता, विज्ञापन-अवरोधक र डिजिटल सुरक्षा',
    url: 'https://fmhy.net/privacy',
    category: 'fmhy',
    authorOrSource: 'FMHY Security',
    badge: 'Privacy & Security',
    descriptionEn:
      'Guides and software for blocking intrusive tracking, encrypted DNS configuration, browser fingerprint mitigation, open-source password managers, and zero-knowledge tools.',
    descriptionNp:
      'अनलाइन विज्ञापन रोक्ने उपाय, सुरक्षित डीएनएस, ब्राउजर सुरक्षा, पासवर्ड म्यानेजर र डिजिटल गोपनीयता सुरक्षित राख्ने उपायहरू।',
    tags: ['Privacy', 'Adblock', 'uBlock Origin', 'DNS', 'Security', 'Tor', 'VPN'],
  },
  {
    id: 'link-fmhy-reading',
    title: 'FMHY: Free Books, Academic Papers & Digital Libraries',
    titleNp: 'FMHY: निःशुल्क ई-किताब, अनुसन्धान पत्र र डिजिटल पुस्तकालय',
    url: 'https://fmhy.net/readingpiracyguide',
    category: 'media_learning',
    authorOrSource: 'FMHY Books',
    badge: 'Knowledge & Books',
    descriptionEn:
      'Access scientific research papers, academic textbooks, public domain classics, technical documentation, comic archives, and audiobook platforms.',
    descriptionNp:
      'अनुसन्धान प्रतिवेदन, शैक्षिक पाठ्यपुस्तक, विश्व प्रसिद्ध साहित्य तथा ई-पुस्तकहरूको खुला डिजिटल स्रोत।',
    tags: ['Books', 'Academic', 'Research', 'E-books', 'Libraries', 'Education'],
  },

  // 3. Nepali Civic, Government & Regulatory Portals
  {
    id: 'link-nagarik-app',
    title: 'Nagarik App (नागरिक एप)',
    titleNp: 'नागरिक एप - नेपाल सरकारको एकीकृत सार्वजनिक सेवा',
    url: 'https://nagarikapp.gov.np',
    category: 'civic_gov',
    authorOrSource: 'Government of Nepal',
    badge: 'Official Civic Super-App',
    descriptionEn:
      'Official unified government mobile and web platform. Access Citizenship verification, PAN registration, Voter Card, Vehicle Bluebook, Police Clearance, and Educational Certificates.',
    descriptionNp:
      'नेपाल सरकारको राष्ट्रिय एप: नागरिकता, प्यान, मतदाता परिचयपत्र, सवारी दर्ता, शैक्षिक प्रमाणपत्र र सामाजिक सुरक्षा कोष एकै ठाउँमा।',
    tags: ['Nagarik App', 'Gov of Nepal', 'Civic', 'PAN', 'Citizenship', 'Bluebook'],
  },
  {
    id: 'link-nrb-official',
    title: 'Nepal Rastra Bank (NRB) Central Forex & Portal',
    titleNp: 'नेपाल राष्ट्र बैंक - आधिकारिक विदेशी विनिमय दर र सर्कुलर',
    url: 'https://www.nrb.org.np',
    category: 'civic_gov',
    authorOrSource: 'Nepal Rastra Bank',
    badge: 'Central Bank',
    descriptionEn:
      'The central monetary authority of Nepal. Official daily exchange rates for all major currencies, banking directives, inflation statistics, and financial guidelines.',
    descriptionNp:
      'नेपालको केन्द्रीय बैंक: आधिकारिक दैनिक विदेशी मुद्रा विनिमय दर, मौद्रिक नीति, बैंकिङ निर्देशन र आर्थिक परिसूचकहरू।',
    tags: ['NRB', 'Forex', 'Currency', 'Banking', 'Monetary Policy', 'Nepal'],
  },
  {
    id: 'link-nepse-official',
    title: 'Nepal Stock Exchange (NEPSE)',
    titleNp: 'नेपाल स्टक एक्सचेन्ज (नेप्से) - सेयर बजार',
    url: 'https://nepalstock.com.np',
    category: 'civic_gov',
    authorOrSource: 'NEPSE Ltd.',
    badge: 'Stock Exchange',
    descriptionEn:
      'Official trading marketplace for listed equities, corporate bonds, mutual funds, market indices, real-time live tickers, and corporate disclosures.',
    descriptionNp:
      'नेपालको एकमात्र धितोपत्र बजार: प्रत्यक्ष सेयर मूल्य, बजार परिसूचक, कम्पनी विवरण, वित्तीय विवरण र ब्रोकर सूची।',
    tags: ['NEPSE', 'Stocks', 'Market', 'Shares', 'Trading', 'Finance'],
  },
  {
    id: 'link-ird-official',
    title: 'Inland Revenue Department (IRD Nepal)',
    titleNp: 'आन्तरिक राजस्व विभाग - इ-प्यान र कर भुक्तानी',
    url: 'https://ird.gov.np',
    category: 'civic_gov',
    authorOrSource: 'Ministry of Finance, Nepal',
    badge: 'Tax Administration',
    descriptionEn:
      'National tax administration portal for registering individual & business e-PAN, filing income tax returns (D-01/D-02/D-03), VAT returns, and obtaining tax clearance.',
    descriptionNp:
      'व्यक्तिगत तथा व्यावसायिक प्यान (PAN) दर्ता, कर चुक्ता प्रमाणपत्र, भ्याट विवरण दाखिला र अन्तशुल्क व्यवस्थापन प्रणाली।',
    tags: ['IRD', 'PAN', 'Income Tax', 'VAT', 'Tax Clearance', 'Gov of Nepal'],
  },
  {
    id: 'link-dotm-official',
    title: 'Department of Transport Management (DoTM)',
    titleNp: 'यातायात व्यवस्था विभाग - सवारी चालक अनुमतिपत्र र दर्ता',
    url: 'https://dotm.gov.np',
    category: 'civic_gov',
    authorOrSource: 'Ministry of Physical Infrastructure',
    badge: 'Transport & License',
    descriptionEn:
      'Official authority for electronic driving license applications (EDLRS), smart card printing status, vehicle ownership transfer, and national road route permits.',
    descriptionNp:
      'सवारी चालक अनुमतिपत्र (Driving License) अनलाइन फारम, स्मार्ट कार्ड प्रिन्ट स्थिति, सवारी दर्ता र बाटो इजाजतपत्र।',
    tags: ['DoTM', 'Driving License', 'Bluebook', 'Yatayat', 'Smart Card'],
  },
  {
    id: 'link-psc-official',
    title: 'Public Service Commission (Lok Sewa Aayog)',
    titleNp: 'लोक सेवा आयोग - पदपूर्ति, परीक्षा तालिका र नतिजा',
    url: 'https://psc.gov.np',
    category: 'civic_gov',
    authorOrSource: 'Constitutional Body, Nepal',
    badge: 'Civil Service',
    descriptionEn:
      'Constitutional body conducting civil service recruitment examinations. Official vacancy advertisements, exam schedules, syllabi, and merit lists.',
    descriptionNp:
      'नेपाल सरकारका निजामती तथा सार्वजनिक संस्थानहरूको पदपूर्ति विज्ञापन, परीक्षा तालिका, पाठ्यक्रम र अन्तिम नतिजा।',
    tags: ['Lok Sewa', 'PSC', 'Jobs', 'Civil Service', 'Vacancies', 'Nepal'],
  },
  {
    id: 'link-lawcommission',
    title: 'Nepal Law Commission (नेपाल कानून आयोग)',
    titleNp: 'नेपाल कानून आयोग - संविधान, ऐन, नियम तथा कानुन संग्रह',
    url: 'https://lawcommission.gov.np',
    category: 'civic_gov',
    authorOrSource: 'Nepal Law Commission',
    badge: 'Legal Archive',
    descriptionEn:
      'Authoritative repository of the Constitution of Nepal, all enacted federal statutes, Supreme Court gazettes, civil and criminal codes, and official amendments.',
    descriptionNp:
      'नेपालको संविधान, सम्पूर्ण ऐन, कानुन, नियम, अध्यादेश र राजपत्रहरूको आधिकारिक तथा प्रामाणिक डिजिटल संग्रह।',
    tags: ['Constitution', 'Nepal Laws', 'Acts', 'Legal', 'Gazette', 'Civil Code'],
  },

  // 4. Nepali Open Source & Tech Community
  {
    id: 'link-bikram-sambat-npm',
    title: 'Bikram Sambat BS Calendar Ecosystem (NPM)',
    titleNp: 'विक्रम संवत् क्यालेन्डर खुला स्रोत लाइब्रेरीहरू',
    url: 'https://www.npmjs.com/search?q=bikram-sambat',
    category: 'nepali_tools',
    authorOrSource: 'Nepali Open Source Community',
    badge: 'Open Source NPM',
    descriptionEn:
      'Open-source TypeScript/JavaScript algorithms and libraries for converting Gregorian dates (AD) to Bikram Sambat (BS) with accurate Tithi, Panchanga, and festival algorithms.',
    descriptionNp:
      'एडी (AD) र बीएस (BS) बीचको सही मिति रूपान्तरण, तिथि, चाडपर्व र पञ्चाङ्ग गणना गर्ने खुला स्रोत लाइब्रेरीहरू।',
    tags: ['Bikram Sambat', 'NPM', 'Calendar', 'Open Source', 'TypeScript', 'Nepal'],
  },
  {
    id: 'link-unicode-nepali',
    title: 'Madan Puraskar Pustakalaya Nepali Unicode',
    titleNp: 'मदन पुरस्कार पुस्तकालय - नेपाली युनिकोड र भाषा प्रविधि',
    url: 'http://madanpuraskar.org',
    category: 'nepali_tools',
    authorOrSource: 'Madan Puraskar Pustakalaya',
    badge: 'Language & Tech',
    descriptionEn:
      'Pioneering institution for Nepali computing: official Romanized and Traditional Nepali Unicode keyboard layouts, digitizers, and national language archives.',
    descriptionNp:
      'नेपाली भाषा कम्प्युटिङको अग्रणी संस्था: रोमानाइज्ड तथा ट्रेडिसनल युनिकोड किबोर्ड, फन्ट र भाषा अनुसन्धान।',
    tags: ['Unicode', 'Nepali', 'Keyboard', 'Archive', 'Fonts', 'Language'],
  },

  // 5. Global Open Internet & Digital Preservation
  {
    id: 'link-internet-archive',
    title: 'Internet Archive & Wayback Machine',
    titleNp: 'इन्टरनेट आर्काइभ - वे-ब्याक मेसिन र डिजिटल पुस्तकालय',
    url: 'https://archive.org',
    category: 'media_learning',
    authorOrSource: 'Internet Archive Non-Profit',
    badge: 'Global Preservation',
    descriptionEn:
      'Non-profit digital library of millions of free historical web pages, books, films, software, and audio recordings. The essential memory of the World Wide Web.',
    descriptionNp:
      'इन्टरनेटको इतिहास र लाखौं निःशुल्क पुस्तक, अडियो, पुराना वेबसाइटका स्न्यापसट र सफ्टवेयरको विश्वव्यापी डिजिटल अभिलेख।',
    tags: ['Wayback Machine', 'Archive', 'History', 'Library', 'Books', 'Software'],
  },
  {
    id: 'link-privacy-guides',
    title: 'Privacy Guides (Security & Open Source)',
    titleNp: 'प्राइभेसी गाइड्स - खुला स्रोत सुरक्षा सिफारिस',
    url: 'https://www.privacyguides.org',
    category: 'media_learning',
    authorOrSource: 'Privacy Guides Community',
    badge: 'Security Standards',
    descriptionEn:
      'Socially motivated, non-profit community platform providing independent recommendations for privacy-respecting browsers, password managers, and operating systems.',
    descriptionNp:
      'सुरक्षित र गोपनीयतामैत्री ब्राउजर, अपरेटिङ सिस्टम, इन्क्रिप्टेड म्यासेजिङ र अनलाइन सुरक्षाको प्रामाणिक मार्गदर्शक।',
    tags: ['Privacy', 'Open Source', 'Security', 'Encryption', 'Passkeys'],
  },
];
