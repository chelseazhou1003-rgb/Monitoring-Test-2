// Qualcomm-relevance keywords for filtering (case-insensitive matching)
// Articles must match at least one primary keyword

export const QUALCOMM_KEYWORDS = [
  'Qualcomm',
  'QCOM',
  'Cristiano Amon',
  'Snapdragon',
];

// Keywords that only count as Qualcomm-relevant when appearing alongside Qualcomm/Snapdragon
export const CONDITIONAL_KEYWORDS = [
  '3GPP',
  'FRAND',
  'SEP',
  'standards-essential patent',
  'standard essential patent'
];

// Competitor name patterns for cross-tagging
// Only Apple and Huawei are monitored, both require co-occurrence with IP/Patent/SEP
// (see COMPETITOR_CONDITIONS below)
export const COMPETITOR_KEYWORDS = {
  apple: ['Apple'],
  huawei: ['Huawei']
};

// Co-occurrence conditions for specific competitors
// Article must contain BOTH a competitor keyword AND at least one condition keyword
// to be tagged with that competitor and scored into the Competitors section
export const COMPETITOR_CONDITIONS = {
  apple: ['IP', 'patent', 'SEP'],
  huawei: ['IP', 'patent', 'SEP'],
};

// Stakeholder keyword patterns
export const STAKEHOLDER_KEYWORDS = {
  '3gpp': ['3GPP', '3rd Generation Partnership Project'],
  etsi: ['ETSI', 'European Telecommunications Standards Institute'],
  ieee: ['IEEE', 'Institute of Electrical and Electronics Engineers'],
  'wi-fi-alliance': ['Wi-Fi Alliance', 'WiFi Alliance'],
  'bluetooth-sig': ['Bluetooth SIG', 'Bluetooth Special Interest Group'],
  'usb-if': ['USB-IF', 'USB Implementers Forum'],
  'o-ran': ['O-RAN', 'O-RAN Alliance', 'Open RAN'],
  regulators: ['FTC', 'Federal Trade Commission', 'European Commission', 'EU Commission', 'NDRC', 'SAMR', 'DOJ', 'Department of Justice', 'CMA', 'Competition and Markets Authority', 'KPPU'],
  'industry-assoc': ['SIA', 'Semiconductor Industry Association', 'GSMA', 'SEMI'],
  oem: ['Samsung', 'Apple', 'Xiaomi', 'OPPO', 'vivo', 'OnePlus', 'Motorola', 'Lenovo', 'Dell', 'HP', 'ASUS', 'Acer'],
  foundry: ['TSMC', 'Samsung Foundry', 'Intel Foundry', 'GlobalFoundries', 'UMC', 'SMIC', '中芯国际'],
  'platform-partner': ['Microsoft', 'Google', 'Meta', 'Amazon', 'AWS', 'Windows on Arm', 'WoA']
};

// Section keyword maps for automatic tagging
export const SECTION_KEYWORDS = {
  'core-businesses': {
    name: 'Core Businesses',
    subs: {
      semiconductors: ['chip', 'foundry', 'wafer', 'semiconductor', 'process node', 'nanometer', 'finfet', 'GAA', 'chiplet', 'advanced packaging', '3D packaging', 'die', 'transistor', 'silicon'],
      wireless: ['5G', '6G', 'ranking', 'leadership', 'IPLytics', '3GPP', 'Wi-Fi', 'WiFi', 'Dragonfly'],
      'mobile-chips': ['Snapdragon', 'Snapdragon 8', 'Snapdragon 7', 'mobile platform', 'smartphone chip', 'flagship', 'handset', 'mobile', 'phone'],
      'pc-chips-computing': ['X Elite', 'X Plus', 'Windows on Arm', 'WoA', 'PC chip', 'laptop chip', 'PC'],
      automotive: ['Snapdragon Ride', 'Digital Chassis', 'cockpit', 'telematics', 'V2X', 'C-V2X', 'auto grade', 'autonomous vehicle', 'auto'],
      'iot-xr': ['IoT', 'Snapdragon AR', 'Snapdragon XR', 'XR2', 'AR2', 'wearable', 'smartwatch', 'embedded', 'edge device', 'Dragonwing', 'XR']
    }
  },
  'ip-legal': {
    name: 'Intellectual Property and Legal',
    subs: {
      sep: ['SEP', 'standard-essential patent', 'essential patent'],
      ip: ['patent', 'IP portfolio', 'intellectual property', 'patent filing'],
      'patent-litigation': ['suit', 'infringement', 'lawsuit', 'litigation', 'court', 'ITC', 'injunction', 'damages', 'jury'],
      'frand-licensing': ['FRAND', 'licensing', 'royalty', 'license', 'cross-license', 'patent pool', 'Avanci', 'HEVC', 'VVC'],
      'regulatory-antitrust': ['antitrust', 'competition law', 'monopoly', 'market dominance', 'consent decree', 'FTC']
    }
  },
  'growth-areas': {
    name: 'Growth Areas',
    subs: {
      'on-device-ai': ['edge AI', 'on-device AI', 'on-device ML', 'Hexagon NPU', 'AI engine', 'on-device inference', 'tinyML', 'edge computing', 'federated learning', 'AI acceleration', 'neural processing', 'NPU'],
      'ai-pc': ['AI PC', 'Copilot', 'AI laptop', 'NPU TOPS', 'AI TOPS', 'AI computing', 'local AI'],
      'embodied-ai-robotics': ['embodied AI', 'robotics', 'robot platform', 'humanoid', 'autonomous machine', 'robotics chip', 'robot vision', 'SLAM'],
      'in-vehicle-infotainment-adas': ['in-vehicle', 'infotainment', 'digital cockpit', 'ADAS', 'autonomous driving', 'driver assistance', 'driver monitoring', 'surround view', 'parking assist'],
      'xr-spatial-computing': ['spatial computing', 'XR', 'AR glasses', 'VR headset', 'mixed reality', 'extended reality', 'Meta Quest', 'Apple Vision', 'Snapdragon Spaces', 'hand tracking', 'passthrough', 'spatial', 'MR headset'],
      'data-center': ['data center', 'data centre', 'AI server', 'cloud server', 'server chip', 'server CPU', 'hyperscaler', 'cloud infrastructure', 'server processor', 'rack server', 'edge server']
    }
  },
  'macro-environment': {
    name: 'Macro',
    subs: {
      'customers-partners': ['OEM', 'partner', 'partnership', 'collaboration', 'customer', 'design win', 'supply agreement', 'multi-year agreement', 'joint development', 'co-engineering'],
      'supply-chain': ['supply chain', 'fabrication', 'capacity', 'yield', 'wafer', 'shortage', 'lead time', 'inventory', 'procurement', 'dual source'],
      'geopolitics-export-controls': ['export control', 'sanction', 'trade war', 'tariff', 'CHIPS Act', 'entity list', 'BIS', 'Commerce Department', 'U.S. Department of Commerce', 'Bureau of Industry and Security', 'MOFCOM', 'Dual-use', 'Chip ban', 'national security', 'CFIUS', 'technology transfer', 'decoupling', 'China', 'US-China', 'Sino-US', 'tech rivalry', 'tech cold war', 'export license', 'restriction', 'section 301', 'import ban', 'CHIPS and Science Act'],
      'market-performance': ['stock price', 'share price', 'valuation', 'earnings', 'market cap', 'index', 'Russell', 'S&P', 'NASDAQ', 'QCOM stock', 'stock outlook', 'investor', 'investors', 'stocks', 'shares', 'closed at', 'trading session', 'broader market', 'stock market']
    }
  },
  competitors: {
    name: 'Competitors',
    subs: {
      apple: ['Apple'],
      huawei: ['Huawei']
    }
  },
  stakeholders: {
    name: 'Key Stakeholders',
    subs: {
      '3gpp': ['3GPP'],
      etsi: ['ETSI'],
      ieee: ['IEEE'],
      'wi-fi-alliance': ['Wi-Fi Alliance', 'WiFi Alliance', 'Wi-Fi 7', 'Wi-Fi 6E'],
      'bluetooth-sig': ['Bluetooth SIG', 'Bluetooth 6', 'Bluetooth 5'],
      'usb-if': ['USB-IF', 'USB4', 'USB 3'],
      'o-ran': ['O-RAN', 'Open RAN'],
      regulators: ['FTC', 'European Commission', 'DOJ', 'CMA', 'antitrust regulator'],
      'industry-assoc': ['SIA', 'GSMA', 'SEMI', 'industry association'],
      oem: ['smartphone maker', 'phone manufacturer', 'OEM partner', 'handset maker'],
      foundry: ['TSMC', 'Samsung Foundry', 'GlobalFoundries', 'SMIC', '中芯国际'],
      'platform-partner': ['Microsoft', 'Google', 'Meta', 'Amazon', 'Windows on Arm']
    }
  }
};
