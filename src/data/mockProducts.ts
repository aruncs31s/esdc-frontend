export interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  coupons: Coupon[];
  specs: Record<string, string>;
  features: string[];
  relatedProductIds: number[];
}

export const mockProducts: ProductDetail[] = [
  {
    id: 1,
    name: 'Arduino Starter Kit',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
    ],
    description:
      'Complete Arduino starter kit with sensors, LEDs, and components perfect for beginners and hobbyists',
    category: 'Hardware',
    stock: 25,
    rating: 4.5,
    reviewCount: 128,
    reviews: [
      {
        id: 1,
        author: 'John Doe',
        rating: 5,
        title: 'Perfect for beginners!',
        comment:
          'Great quality kit with excellent documentation. Highly recommended for anyone starting with Arduino.',
        date: '2025-10-10',
        verified: true,
      },
      {
        id: 2,
        author: 'Jane Smith',
        rating: 4,
        title: 'Good value for money',
        comment:
          'Everything works as expected. The sensors are reliable and the components are well packaged.',
        date: '2025-10-05',
        verified: true,
      },
      {
        id: 3,
        author: 'Mike Johnson',
        rating: 5,
        title: 'Amazing kit!',
        comment: 'Excellent quality and fast shipping. I am very satisfied with this purchase.',
        date: '2025-09-28',
        verified: true,
      },
    ],
    coupons: [
      {
        code: 'ARDUINO10',
        discount: 10,
        type: 'percentage',
        description: '10% off on Arduino kits',
      },
      {
        code: 'STARTER5',
        discount: 5,
        type: 'fixed',
        description: '$5 off on any order',
      },
    ],
    specs: {
      Microcontroller: 'ATmega328',
      'Operating Voltage': '5V',
      'Input Voltage': '7-12V',
      'Digital I/O Pins': '14',
      'PWM Pins': '6',
      'Analog Input Pins': '6',
      Memory: '32KB Flash, 2KB SRAM',
      'Clock Speed': '16 MHz',
      Dimensions: '73.66 x 53.34 mm',
      Weight: '25g',
    },
    features: [
      'Easy to use and program',
      'Open-source hardware and software',
      'Compatible with many sensors',
      'Multiple communication options (SPI, I2C, UART)',
      'Integrated LED on pin 13',
      'USB connection for programming and power',
      'Reset button for easy debugging',
      'Large community and extensive documentation',
    ],
    relatedProductIds: [3, 4, 6],
  },
  {
    id: 2,
    name: 'Raspberry Pi 4',
    price: 75.0,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
    ],
    description: 'Powerful single-board computer for IoT projects, media centers, and more',
    category: 'Hardware',
    stock: 15,
    rating: 4.8,
    reviewCount: 256,
    reviews: [
      {
        id: 1,
        author: 'Alex Williams',
        rating: 5,
        title: 'Excellent mini computer',
        comment:
          'Very powerful for its size. Works great for home automation and media server projects.',
        date: '2025-10-08',
        verified: true,
      },
      {
        id: 2,
        author: 'Sarah Brown',
        rating: 5,
        title: 'Best for projects!',
        comment: 'Fast performance and great community support. Definitely worth the investment.',
        date: '2025-09-30',
        verified: true,
      },
      {
        id: 3,
        author: 'Tom Davis',
        rating: 4,
        title: 'Good, but heats up',
        comment: 'Great performance but consider getting a heatsink for heavy workloads.',
        date: '2025-09-15',
        verified: true,
      },
    ],
    coupons: [
      {
        code: 'RPi15',
        discount: 15,
        type: 'percentage',
        description: '15% off on Raspberry Pi',
      },
    ],
    specs: {
      Processor: 'Broadcom BCM2711, Quad core',
      RAM: '4GB LPDDR4-3200',
      Storage: 'Micro-SD (Not included)',
      GPU: '500MHz VideoCore VI',
      Connectivity: 'Wi-Fi 802.11ac, Bluetooth 5.0',
      Ports: '2x USB 3.0, 4x USB 2.0, Gigabit Ethernet',
      Power: 'USB-C, 3A recommended',
      Dimensions: '85.6 x 56.5 mm',
      'Operating Temp': '0-50°C',
    },
    features: [
      'Dual 4K display support',
      'Gigabit Ethernet',
      'WiFi and Bluetooth connectivity',
      'Multiple USB 3.0 ports',
      'Compatible with Linux distributions',
      'GPIO pins for hardware projects',
      'Desktop, laptop, and media center ready',
      'Active cooling support',
    ],
    relatedProductIds: [1, 3, 4],
  },
  {
    id: 3,
    name: 'ESP32 Development Board',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=400&fit=crop',
    ],
    description: 'WiFi and Bluetooth enabled microcontroller with integrated wireless capabilities',
    category: 'Hardware',
    stock: 50,
    rating: 4.6,
    reviewCount: 189,
    reviews: [
      {
        id: 1,
        author: 'Chris Martin',
        rating: 5,
        title: 'Best value microcontroller',
        comment:
          'Amazing features at this price point. WiFi and Bluetooth built-in is a game changer.',
        date: '2025-10-07',
        verified: true,
      },
      {
        id: 2,
        author: 'Emma Wilson',
        rating: 4,
        title: 'Great for IoT',
        comment: 'Perfect for IoT applications. Easy to program and reliable connectivity.',
        date: '2025-09-25',
        verified: true,
      },
    ],
    coupons: [
      {
        code: 'ESP20',
        discount: 20,
        type: 'percentage',
        description: '20% off on ESP32 boards',
      },
    ],
    specs: {
      CPU: 'Xtensa dual-core 32-bit LX6',
      'Clock Speed': '160-240 MHz',
      RAM: '520 KB SRAM',
      Flash: '4 MB',
      WiFi: '802.11b/g/n',
      Bluetooth: 'v4.2 BR/EDR and BLE',
      'GPIO Pins': '34',
      'ADC Channels': '12',
      'Power Supply': '3.3V',
      Current: '80 mA typical',
    },
    features: [
      'Dual-core processor',
      'Built-in WiFi and Bluetooth',
      'Extensive GPIO and analog inputs',
      'Low power mode for battery projects',
      'OTA (Over-The-Air) updates',
      'Multiple communication protocols (SPI, I2C, UART)',
      'Excellent documentation and community',
      'Arduino IDE and MicroPython compatible',
    ],
    relatedProductIds: [1, 4, 6],
  },
  {
    id: 4,
    name: 'Sensor Kit',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    ],
    description:
      '37-in-1 sensor module kit with temperature, humidity, light, motion, and more sensors',
    category: 'Components',
    stock: 30,
    rating: 4.4,
    reviewCount: 95,
    reviews: [
      {
        id: 1,
        author: 'David Lee',
        rating: 5,
        title: 'Amazing variety of sensors',
        comment: 'All sensors work perfectly. Great for learning different sensor types.',
        date: '2025-10-06',
        verified: true,
      },
      {
        id: 2,
        author: 'Lisa Anderson',
        rating: 4,
        title: 'Good value kit',
        comment: 'Good collection of sensors. Some need calibration but overall great.',
        date: '2025-09-20',
        verified: true,
      },
    ],
    coupons: [
      {
        code: 'SENSOR25',
        discount: 25,
        type: 'percentage',
        description: '25% off on sensor kits',
      },
    ],
    specs: {
      'Number of Sensors': '37',
      'Sensor Types': 'Temperature, Humidity, Light, Motion, Gas, Sound, Pressure, etc.',
      Voltage: '3.3V - 5V',
      Interfaces: 'Analog, Digital, I2C, SPI',
      'Operating Temperature': '-20°C to 70°C',
      Accuracy: 'Varies by sensor (±2-5% typical)',
      Dimensions: 'Box: 23 x 17 x 4 cm',
      Weight: '500g',
      Included: 'Sensors, modules, jumper wires',
    },
    features: [
      'Wide variety of sensor types',
      'Compatible with Arduino and Raspberry Pi',
      'Detailed documentation for each sensor',
      'Plug-and-play design',
      'Excellent for learning',
      'Perfect for IoT projects',
      'Pre-calibrated modules',
      'Quality assured components',
    ],
    relatedProductIds: [1, 3, 6],
  },
  {
    id: 5,
    name: 'Soldering Station',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&h=400&fit=crop',
    ],
    description:
      'Professional digital temperature controlled soldering station with precision controls',
    category: 'Tools',
    stock: 10,
    rating: 4.7,
    reviewCount: 67,
    reviews: [
      {
        id: 1,
        author: 'Robert Martinez',
        rating: 5,
        title: 'Perfect for professional work',
        comment:
          'Excellent temperature control and build quality. Highly recommend for any electronics enthusiast.',
        date: '2025-10-04',
        verified: true,
      },
      {
        id: 2,
        author: 'Susan Garcia',
        rating: 5,
        title: 'Best soldering station!',
        comment: 'Fast heating time and stable temperature. Worth every penny.',
        date: '2025-09-18',
        verified: true,
      },
    ],
    coupons: [
      {
        code: 'SOLDER30',
        discount: 30,
        type: 'percentage',
        description: '30% off on soldering equipment',
      },
    ],
    specs: {
      'Temperature Range': '200-480°C',
      Display: 'Digital LED display',
      'Heating Time': '~10 seconds',
      Power: '220V AC, 60W',
      'Soldering Iron': 'Ceramic heater element',
      'Tip Sizes': '0.4mm, 0.6mm, 0.8mm available',
      Stability: '±2°C',
      Dimensions: '30 x 25 x 12 cm',
      Weight: '2.5 kg',
    },
    features: [
      'Precise temperature control',
      'Fast heating and recovery time',
      'Ceramic heater for longevity',
      'Multiple interchangeable tips',
      'Digital display with memory',
      'Lead-free solder compatible',
      'Adjustable iron stand',
      'Anti-static properties',
    ],
    relatedProductIds: [6, 7, 8],
  },
  {
    id: 6,
    name: 'Breadboard Set',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    ],
    description: 'Solderless breadboard with comprehensive set of jumper wires and components',
    category: 'Components',
    stock: 40,
    rating: 4.5,
    reviewCount: 110,
    reviews: [
      {
        id: 1,
        author: 'Kevin Chen',
        rating: 5,
        title: 'Great beginner kit',
        comment: 'Excellent quality breadboards and jumper wires. Perfect for prototyping.',
        date: '2025-10-03',
        verified: true,
      },
      {
        id: 2,
        author: 'Amanda White',
        rating: 4,
        title: 'Good value',
        comment: 'Durable breadboards with many color options for jumper wires.',
        date: '2025-09-22',
        verified: true,
      },
    ],
    coupons: [
      {
        code: 'BREAD15',
        discount: 15,
        type: 'percentage',
        description: '15% off on breadboard sets',
      },
    ],
    specs: {
      'Breadboard Count': '2 (400 tie-points each)',
      'Jumper Wires': '65 pieces, multiple colors',
      'Total Tie-points': '800',
      Material: 'ABS plastic',
      'Wire Gauge': '22 AWG',
      'Operating Voltage': 'Up to 5V',
      Dimensions: '22 x 8 cm per board',
      'Temperature Rating': '-10°C to 60°C',
      Durability: '10,000+ insertion cycles',
    },
    features: [
      'Reusable solderless design',
      'No tools required for prototyping',
      'Multiple color coded jumper wires',
      'Durable and long-lasting contacts',
      'Multiple breadboards for complex circuits',
      'Perfect for beginners and professionals',
      'Compatible with standard components',
      'Easy to learn and use',
    ],
    relatedProductIds: [1, 3, 4],
  },
  {
    id: 7,
    name: 'LED Strip Kit',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop',
    ],
    description:
      'RGB LED strip with wireless controller and power supply for creative lighting projects',
    category: 'Components',
    stock: 35,
    rating: 4.3,
    reviewCount: 78,
    reviews: [
      {
        id: 1,
        author: 'Patricia Davis',
        rating: 5,
        title: 'Beautiful LED strips!',
        comment: 'Vibrant colors and the controller is easy to use. Great for room decoration.',
        date: '2025-10-02',
        verified: true,
      },
      {
        id: 2,
        author: 'Michael Brown',
        rating: 4,
        title: 'Good but needs adhesive',
        comment: 'Good quality LEDs. Consider getting strong adhesive tape for installation.',
        date: '2025-09-16',
        verified: true,
      },
    ],
    coupons: [
      {
        code: 'LED20',
        discount: 20,
        type: 'percentage',
        description: '20% off on LED kits',
      },
    ],
    specs: {
      'LED Type': 'SMD 5050 RGB',
      'Strip Length': '5 meters',
      'LEDs per Meter': '60',
      Power: '12V DC, 5A',
      Controller: 'Wireless RF remote',
      Colors: '16 million colors',
      Modes: '20+ preset modes',
      'Waterproof Rating': 'IP65',
      Lifespan: '50,000 hours',
    },
    features: [
      'RGB color control with wireless remote',
      'Pre-set lighting modes and effects',
      'Easy installation with adhesive backing',
      'Waterproof for indoor and outdoor use',
      'Dimmable brightness control',
      'Energy efficient',
      'Smooth color transitions',
      'Timer function support',
    ],
    relatedProductIds: [1, 4, 6],
  },
  {
    id: 8,
    name: 'Multimeter',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&h=400&fit=crop',
    ],
    description: 'Digital multimeter with auto-ranging and comprehensive measurement capabilities',
    category: 'Tools',
    stock: 20,
    rating: 4.6,
    reviewCount: 142,
    reviews: [
      {
        id: 1,
        author: 'Paul Wilson',
        rating: 5,
        title: 'Accurate and reliable',
        comment: 'Great accuracy and very user-friendly. Perfect for DIY projects.',
        date: '2025-10-01',
        verified: true,
      },
      {
        id: 2,
        author: 'Rachel Lee',
        rating: 5,
        title: 'Professional grade at affordable price',
        comment: 'Excellent build quality and features. Highly recommend.',
        date: '2025-09-19',
        verified: true,
      },
    ],
    coupons: [
      {
        code: 'METER25',
        discount: 25,
        type: 'percentage',
        description: '25% off on multimeters',
      },
    ],
    specs: {
      Display: '3.5 digit LCD',
      Accuracy: '±(0.5% + 1 digit)',
      'DC Voltage': '200mV - 1000V',
      'AC Voltage': '200V - 750V',
      'DC Current': '200µA - 10A',
      Resistance: '200Ω - 20MΩ',
      Continuity: 'Audible alert',
      'Diode Test': 'Yes',
      Power: '2 × 1.5V AAA batteries',
      'Display Update': '3 times/second',
    },
    features: [
      'Auto-ranging measurement',
      'Large easy-to-read LCD display',
      'Multiple measurement modes (voltage, current, resistance, diode)',
      'Continuity testing with audible alert',
      'Hold function for reading measurements',
      'Low battery indicator',
      'Durable protective case included',
      'Excellent for troubleshooting and testing circuits',
    ],
    relatedProductIds: [5, 6, 7],
  },
];
