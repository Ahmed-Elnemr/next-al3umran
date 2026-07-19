export type PropertyStatus = "sale" | "rent";
export type PropertyType = "villa" | "house" | "apartment" | "land" | "chalet" | "office";

export interface PropertyItem {
  id: number;
  image: string;
  gallery?: string[];
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  countryAr?: string;
  countryEn?: string;
  cityAr?: string;
  cityEn?: string;
  price?: number;
  priceAr?: string;
  priceEn?: string;
  currencyAr?: string;
  currencyEn?: string;
  status: PropertyStatus;
  type?: PropertyType;
  companyId: string;
  companyAr: string;
  companyEn: string;
  companyLogo?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  beds: number;
  baths: number;
  area: number;
  createdAt?: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

  export const properties: any[] = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "فيلا فاخرة بحديقة خاصة",
      titleEn: "Luxury Villa With Private Garden",
      locationAr: "دبي",
      locationEn: "Dubai",
      countryAr: "الإمارات",
      countryEn: "UAE",
      priceAr: "12,500,000 درهم",
      priceEn: "EGP 12,500,000",
      status: "sale",
      companyId: "c1",
      companyId: "c1",
      companyId: "c1",
      companyAr: "العمران للتسويق العقاري",
      companyEn: "Al Omran Real Estate",
      companyLogo: "https://ui-avatars.com/api/?name=Al%20Omran%20Real%20Estate&background=0E6B58&color=fff&size=200&bold=true",
      whatsapp: "201000000000",
      phone: "+20 100 000 0000",
      email: "info@alomran.com",
      beds: 6,
      baths: 5,
      area: 520,
      descriptionAr:
        "فيلا فاخرة بتصميم عصري وحديقة خاصة، مناسبة للسكن العائلي والاستثمار في موقع مميز قريب من الخدمات الرئيسية.",
      descriptionEn:
        "A luxury villa with a modern design and private garden, suitable for family living and investment in a prime location close to key services.",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "منزل عائلي بتصميم حديث",
      titleEn: "Modern Family House",
      locationAr: "أبوظبي",
      locationEn: "Abu Dhabi",
      countryAr: "الإمارات",
      countryEn: "UAE",
      priceAr: "8,900,000 درهم",
      priceEn: "EGP 8,900,000",
      status: "sale",
      companyId: "c2",
      companyId: "c2",
      companyId: "c2",
      companyAr: "الصفوة العقارية",
      companyEn: "Elite Real Estate",
      companyLogo: "https://ui-avatars.com/api/?name=Elite%20Real%20Estate&background=0E6B58&color=fff&size=200&bold=true",
      whatsapp: "201011111111",
      phone: "+20 101 111 1111",
      email: "sales@elite-realestate.com",
      beds: 5,
      baths: 4,
      area: 430,
      descriptionAr:
        "منزل عائلي حديث بتشطيبات راقية ومساحات عملية، مناسب للعائلات الباحثة عن الراحة والخصوصية.",
      descriptionEn:
        "A modern family house with premium finishing and practical spaces, ideal for families seeking comfort and privacy.",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "فيلا مستقلة بتشطيب فاخر",
      titleEn: "Standalone Villa With Luxury Finish",
      locationAr: "الشارقة",
      locationEn: "Sharjah",
      countryAr: "الإمارات",
      countryEn: "UAE",
      priceAr: "65,000 درهم / شهر",
      priceEn: "EGP 65,000 / Month",
      status: "rent",
      companyId: "c3",
      companyId: "c3",
      companyId: "c3",
      companyAr: "رويال هومز",
      companyEn: "Royal Homes",
      companyLogo: "https://ui-avatars.com/api/?name=Royal%20Homes&background=0E6B58&color=fff&size=200&bold=true",
      whatsapp: "201022222222",
      phone: "+20 102 222 2222",
      email: "contact@royalhomes.com",
      beds: 7,
      baths: 6,
      area: 610,
      descriptionAr:
        "فيلا مستقلة للإيجار بتشطيب فاخر ومساحة كبيرة، مناسبة للسكن الراقي طويل المدى.",
      descriptionEn:
        "A standalone villa for rent with luxury finishing and spacious areas, suitable for premium long-term living.",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600607688960-e095ff83135c?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "شقة فاخرة كاملة التشطيب",
      titleEn: "Fully Finished Luxury Apartment",
      locationAr: "بغداد",
      locationEn: "Baghdad",
      countryAr: "العراق",
      countryEn: "Iraq",
      priceAr: "4,200,000 درهم",
      priceEn: "EGP 4,200,000",
      status: "sale",
      companyId: "c4",
      companyId: "c4",
      companyId: "c4",
      companyAr: "نيو كابيتال بروبرتي",
      companyEn: "New Capital Property",
      companyLogo: "https://ui-avatars.com/api/?name=New%20Capital%20Property&background=0E6B58&color=fff&size=200&bold=true",
      whatsapp: "201033333333",
      phone: "+20 103 333 3333",
      email: "info@newcapitalproperty.com",
      beds: 3,
      baths: 2,
      area: 185,
      descriptionAr:
        "شقة فاخرة كاملة التشطيب في موقع مميز داخل العاصمة الإدارية، مناسبة للسكن أو الاستثمار.",
      descriptionEn:
        "A fully finished luxury apartment in a prime location inside the New Capital, suitable for living or investment.",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "تاون هاوس داخل كمبوند راقي",
      titleEn: "Townhouse In Premium Compound",
      locationAr: "أربيل",
      locationEn: "Erbil",
      countryAr: "العراق",
      countryEn: "Iraq",
      priceAr: "38,000 درهم / شهر",
      priceEn: "EGP 38,000 / Month",
      status: "rent",
      companyId: "c5",
      companyId: "c5",
      companyId: "c5",
      companyAr: "سي فيو العقارية",
      companyEn: "Sea View Realty",
      companyLogo: "https://ui-avatars.com/api/?name=Sea%20View%20Realty&background=0E6B58&color=fff&size=200&bold=true",
      whatsapp: "201044444444",
      phone: "+20 104 444 4444",
      email: "sales@seaviewrealty.com",
      beds: 4,
      baths: 3,
      area: 295,
      descriptionAr:
        "تاون هاوس للإيجار داخل كمبوند راقٍ، مناسب لقضاء فترات طويلة في موقع هادئ ومميز.",
      descriptionEn:
        "A townhouse for rent inside a premium compound, ideal for long stays in a calm and distinguished location.",
    },
  ];
