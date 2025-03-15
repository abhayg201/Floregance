
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  artisan: string;
  artisanStory?: string;
  origin: string;
  materials: string[];
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  inStock: boolean;
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  specifications?: Record<string, string>;
  variants?: {
    id: string;
    name: string;
    price: number;
    inStock: boolean;
  }[];
}

export const products: Product[] = [
  {
    id: "hand-woven-wool-rug-01",
    name: "Hand-Woven Wool Rug",
    description: "This exquisite hand-woven wool rug is crafted by skilled artisans using traditional techniques. Each vibrant color comes from natural dyes, and the intricate patterns tell stories passed down through generations. The rug's sturdy construction ensures it will remain beautiful for years to come, while its soft texture provides comfort underfoot.",
    price: 299,
    originalPrice: 349,
    images: [
      "https://images.unsplash.com/photo-1584269600519-14dab465f3fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1588625500633-a0cd518f0f60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1585412721318-c7b9854a3989?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "Textiles",
    artisan: "Amina Khalid",
    artisanStory: "Amina Khalid learned the art of rug weaving from her grandmother at the age of 8. She has dedicated over 30 years to perfecting this craft, incorporating traditional patterns with her own artistic innovations. Each of her rugs takes several months to complete as she meticulously hand-ties thousands of knots to create durable, beautiful pieces that honor her heritage.",
    origin: "Morocco",
    materials: ["100% wool", "Natural dyes"],
    dimensions: "4' x 6'",
    weight: "8 lbs",
    careInstructions: "Professional cleaning recommended. Vacuum regularly without beater bar. Blot spills immediately.",
    inStock: true,
    featured: true,
    new: true,
    bestseller: false,
    specifications: {
      "Technique": "Hand-knotted",
      "Knot Density": "100 knots per square inch",
      "Pile Height": "0.5 inches",
      "Base": "Cotton warp and weft"
    }
  },
  {
    id: "handcrafted-ceramic-vase-02",
    name: "Handcrafted Ceramic Vase",
    description: "Elegantly handcrafted by master potter Ibrahim, this ceramic vase combines traditional techniques with modern design sensibilities. The subtle blue glaze, achieved through a special firing process, creates depth and character that changes with the light. Each piece has slight variations, making it truly one of a kind.",
    price: 129,
    images: [
      "https://images.unsplash.com/photo-1578500351865-0a9afd3a6397?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565978771542-0db9c5232acf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1609602914682-18aec6565e38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "Pottery",
    artisan: "Ibrahim Anwar",
    origin: "Egypt",
    materials: ["Clay", "Natural glazes"],
    dimensions: "10" H x 6" W",
    careInstructions: "Hand wash with mild soap. Not suitable for dishwasher or microwave.",
    inStock: true,
    featured: true,
    new: false,
    bestseller: true
  },
  {
    id: "hand-embroidered-pillow-03",
    name: "Hand-Embroidered Pillow Cover",
    description: "These exquisite pillow covers feature intricate hand embroidery using techniques passed down through generations. The vibrant threads create stunning patterns inspired by ancient motifs, adding a touch of artisanal beauty to any home. The natural cotton backing ensures durability and comfort.",
    price: 79,
    originalPrice: 99,
    images: [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517850945300-3d3ac4083326?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "Textiles",
    artisan: "Meera Patel",
    origin: "India",
    materials: ["Cotton", "Silk threads"],
    dimensions: "18" x 18"",
    careInstructions: "Dry clean only. Avoid direct sunlight to prevent fading.",
    inStock: true,
    featured: true,
    new: false,
    bestseller: true
  },
  {
    id: "handmade-brass-jewelry-04",
    name: "Handmade Brass Earrings",
    description: "These elegant handmade brass earrings combine traditional craftsmanship with contemporary design. Each piece is carefully cast and finished by hand, resulting in a unique product with subtle variations that tell the story of its creation. The earrings feature a hammered texture that catches the light beautifully.",
    price: 58,
    images: [
      "https://images.unsplash.com/photo-1602753058429-ebf7d208a16f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576552665000-8a9fc7f64813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "Jewelry",
    artisan: "Lucia Mendoza",
    origin: "Mexico",
    materials: ["Brass", "Sterling silver hooks"],
    dimensions: "2.5" length",
    careInstructions: "Polish with a soft cloth. Store in a dry place.",
    inStock: true,
    featured: true,
    new: true,
    bestseller: false
  },
  {
    id: "handwoven-basket-05",
    name: "Handwoven Storage Basket",
    description: "Meticulously crafted by skilled artisans, this handwoven basket combines functionality with beautiful design. Made from sustainable materials, each basket features a unique pattern achieved through traditional weaving techniques. Perfect for storage or as a decorative accent in any room.",
    price: 65,
    images: [
      "https://images.unsplash.com/photo-1615486511262-c7b5c11a6c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1622468415824-78383d140348?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616486788371-62d930495c44?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "Home Decor",
    artisan: "Nala Okafor",
    origin: "Ghana",
    materials: ["Natural grasses", "Palm leaves"],
    dimensions: "12" H x 14" diameter",
    careInstructions: "Dust with a dry cloth. Keep away from moisture.",
    inStock: true,
    featured: false,
    new: true,
    bestseller: false
  },
  {
    id: "block-printed-table-runner-06",
    name: "Block-Printed Table Runner",
    description: "This stunning table runner features intricate patterns created using traditional wooden block printing techniques. Artisans hand-carve each block and apply natural dyes to create these beautiful designs. The 100% cotton fabric provides durability while the hand-finished edges ensure longevity.",
    price: 45,
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1634322245656-fa0d4b8162be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "Textiles",
    artisan: "Rani Sharma",
    origin: "India",
    materials: ["100% cotton", "Natural dyes"],
    dimensions: "72" x 16"",
    careInstructions: "Hand wash cold. Lay flat to dry. Iron on reverse side.",
    inStock: true,
    featured: false,
    new: false,
    bestseller: true
  },
  {
    id: "carved-wooden-bowl-07",
    name: "Hand-Carved Wooden Bowl",
    description: "Expertly carved from a single piece of sustainable acacia wood, this bowl showcases the natural beauty of the material with its unique grain patterns. Each bowl is finished with food-safe oils to enhance the wood's natural luster and provide protection. Perfect for serving or as a decorative piece.",
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1635908365076-21e9b92a7c4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1633781297433-1f8af9b84392?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1623697899670-42399af05913?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "Kitchen",
    artisan: "Paulo Mendez",
    origin: "Peru",
    materials: ["Acacia wood", "Food-safe oils"],
    dimensions: "4" H x 10" diameter",
    careInstructions: "Hand wash only. Periodically treat with food-safe wood oil.",
    inStock: true,
    featured: false,
    new: false,
    bestseller: true
  },
  {
    id: "macrame-wall-hanging-08",
    name: "Macramé Wall Hanging",
    description: "This intricate macramé wall hanging is hand-knotted using traditional techniques. The natural cotton fibers create beautiful texture and dimension, while the asymmetrical design adds modern appeal. Each piece is unique due to the handmade nature, making it a special addition to any space.",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1605283176568-9b41fde3672e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1612212912995-0c7a2ecc0839?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "Home Decor",
    artisan: "Sofia Garcia",
    origin: "Spain",
    materials: ["100% cotton cord", "Driftwood"],
    dimensions: "36" L x 24" W",
    careInstructions: "Dust gently. Keep away from direct sunlight to prevent discoloration.",
    inStock: true,
    featured: false,
    new: true,
    bestseller: false
  }
];
