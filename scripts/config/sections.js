// The six monitoring sections with metadata for the UI

export const SECTIONS = [
  {
    id: 'core-businesses',
    title: 'Core Businesses',
    slug: 'core-businesses',
    description: 'Semiconductor chips, wireless communication, mobile chips, PC chips & computing platforms, automotive chips & platforms, IoT & XR.',
    page: 'core-businesses.html'
  },
  {
    id: 'ip-legal',
    title: 'IP & Legal',
    slug: 'ip-legal',
    description: 'SEP, intellectual property, patent litigation, FRAND and licensing disputes, regulatory and antitrust.',
    page: 'ip-legal.html'
  },
  {
    id: 'growth-areas',
    title: 'Growth Areas',
    slug: 'growth-areas',
    description: 'On-device AI and edge AI, AI PC, embodied AI and robotics, in-vehicle infotainment and ADAS, XR and spatial computing.',
    page: 'growth-areas.html'
  },
  {
    id: 'macro-environment',
    title: 'Macro Environment',
    slug: 'macro-environment',
    description: 'Customers and partners, supply chain, geopolitics and export controls.',
    page: 'macro-environment.html'
  },
  {
    id: 'competitors',
    title: 'Competitors',
    slug: 'competitors',
    description: 'Apple, MediaTek, Intel, NVIDIA, AMD, Samsung, Broadcom, Huawei and other relevant competitors.',
    page: 'competitors.html'
  },
  {
    id: 'stakeholders',
    title: 'Key Stakeholders',
    slug: 'stakeholders',
    description: '3GPP, ETSI, IEEE, Wi-Fi Alliance, Bluetooth SIG, USB-IF, O-RAN Alliance, regulators, industry associations, OEMs, foundries, platform partners.',
    page: 'stakeholders.html'
  }
];

// Build a lookup map
export const SECTION_MAP = Object.fromEntries(SECTIONS.map(s => [s.id, s]));

// Sub-category display labels
export const SUB_LABELS = {
  semiconductors: 'Semiconductors',
  wireless: 'Wireless Communication',
  'mobile-chips': 'Mobile Chips',
  'pc-chips-computing': 'PC Chips & Computing',
  automotive: 'Automotive',
  'iot-xr': 'IoT & XR',
  sep: 'SEP / Standards Patents',
  ip: 'IP / Intellectual Property',
  'patent-litigation': 'Patent Litigation',
  'frand-licensing': 'FRAND & Licensing',
  'regulatory-antitrust': 'Regulatory & Antitrust',
  'on-device-ai': 'On-Device AI / Edge AI',
  'ai-pc': 'AI PC',
  'embodied-ai-robotics': 'Embodied AI & Robotics',
  'in-vehicle-infotainment-adas': 'Infotainment & ADAS',
  'xr-spatial-computing': 'XR / Spatial Computing',
  'data-center': 'Data Center',
  'customers-partners': 'Customers & Partners',
  'supply-chain': 'Supply Chain',
  'geopolitics-export-controls': 'Geopolitics & Export Controls',
  apple: 'Apple',
  mediatek: 'MediaTek',
  intel: 'Intel',
  nvidia: 'NVIDIA',
  amd: 'AMD',
  samsung: 'Samsung',
  broadcom: 'Broadcom',
  huawei: 'Huawei',
  other: 'Other Competitors',
  '3gpp': '3GPP',
  etsi: 'ETSI',
  ieee: 'IEEE',
  'wi-fi-alliance': 'Wi-Fi Alliance',
  'bluetooth-sig': 'Bluetooth SIG',
  'usb-if': 'USB-IF',
  'o-ran': 'O-RAN Alliance',
  regulators: 'Regulators & Policymakers',
  'industry-assoc': 'Industry Associations',
  oem: 'OEM Customers',
  foundry: 'Foundries',
  'platform-partner': 'Platform & Ecosystem Partners'
};
