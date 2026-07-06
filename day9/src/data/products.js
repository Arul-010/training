// =====================================================
// SPORTZONE — Products Catalogue
// Football & Cricket jerseys have first priority
// =====================================================

export const products = [

  // ===== ⚽ FOOTBALL JERSEYS (Priority 1) =====

  {
    id: 1,
    name: "India National Football Team Home Jersey 2024",
    price: 1299,
    category: "Football",
    rating: 4.7,
    reviewsCount: 1243,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80",
    description: "Official replica jersey of the Indian National Football Team. Lightweight breathable fabric with AIFF emblem. Support the Blue Tigers!",
    tags: ["India", "AIFF", "Blue Tigers", "Official Replica"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["100% Polyester", "Moisture-wicking Dri-FIT", "AIFF Emblem print", "Machine washable"]
  },
  {
    id: 2,
    name: "Brazil 2024 Home Jersey — Canary Yellow",
    price: 2499,
    category: "Football",
    rating: 4.9,
    reviewsCount: 3421,
    image: "/jerseys/brazil.png",
    description: "The iconic yellow and green Brazil home jersey. Features VINICIUS JR 7 on the back. CBF emblem, vibrant sublimated print.",
    tags: ["Brazil", "CBF", "Canary Yellow", "Vinicius Jr"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Breathable mesh fabric", "Sublimated CBF crest", "Unisex fit", "Machine washable"]
  },
  {
    id: 3,
    name: "Real Madrid 2024-25 Home Jersey",
    price: 3499,
    category: "Football",
    rating: 4.8,
    reviewsCount: 2987,
    image: "/jerseys/real_madrid.png",
    description: "Classic all-white Real Madrid home jersey for the 2024-25 La Liga season. Features BELLINGHAM 5 on the back.",
    tags: ["Real Madrid", "La Liga", "Bellingham", "White"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Adidas Aeroready", "Club crest embroidered", "Slim fit", "Machine washable"]
  },
  {
    id: 4,
    name: "FC Barcelona Home Jersey 2024",
    price: 3499,
    category: "Football",
    rating: 4.8,
    reviewsCount: 2654,
    image: "/jerseys/barcelona.png",
    description: "Iconic Blaugrana stripes — FC Barcelona home jersey. Features LEWANDOWSKI 9 on the back. Nike Dri-FIT technology.",
    tags: ["Barcelona", "La Liga", "Lewandowski", "Blaugrana"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Nike Dri-FIT", "Barcelona crest embroidered", "Slim fit", "Recycled polyester"]
  },
  {
    id: 5,
    name: "Manchester United 24-25 Home Jersey",
    price: 3299,
    category: "Football",
    rating: 4.7,
    reviewsCount: 2110,
    image: "/jerseys/man_utd.png",
    description: "Iconic Theatre of Dreams red — Manchester United home jersey. Features RASHFORD 10 on the back.",
    tags: ["Man Utd", "Premier League", "Red Devils", "Old Trafford", "Rashford"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Adidas Aeroready", "Club badge embroidered", "Standard fit", "Machine washable"]
  },
  {
    id: 6,
    name: "Arsenal FC 2024-25 Home Jersey",
    price: 3199,
    category: "Football",
    rating: 4.7,
    reviewsCount: 1876,
    image: "/jerseys/arsenal.png",
    description: "Classic red and white Arsenal home jersey. Features SAKA 7 on the back. This is Saka's Arsenal!",
    tags: ["Arsenal", "Premier League", "Gunners", "Saka"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Adidas Aeroready", "Arsenal crest", "Slim fit", "Moisture-wicking"]
  },
  {
    id: 7,
    name: "Liverpool FC Home Jersey 24-25",
    price: 3299,
    category: "Football",
    rating: 4.8,
    reviewsCount: 2765,
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&auto=format&fit=crop&q=80",
    description: "The iconic Anfield red — Liverpool FC home jersey for the 2024-25 Premier League campaign. You'll Never Walk Alone!",
    tags: ["Liverpool", "Premier League", "Reds", "Salah"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Nike Dri-FIT", "Liverpool crest embroidered", "Standard fit", "Polyester"]
  },
  {
    id: 8,
    name: "Bayern Munich Away Jersey 2024",
    price: 2999,
    category: "Football",
    rating: 4.7,
    reviewsCount: 1234,
    image: "https://images.unsplash.com/photo-1529516548873-9ce57c8f155e?w=600&auto=format&fit=crop&q=80",
    description: "Sleek away jersey for FC Bayern München — the Rekordmeister. Adidas premium replica quality.",
    tags: ["Bayern Munich", "Bundesliga", "FCB", "Kane"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Adidas Aeroready", "Bayern crest", "Slim fit", "Machine washable"]
  },
  {
    id: 9,
    name: "Argentina Copa America 2024 Jersey",
    price: 2999,
    category: "Football",
    rating: 4.9,
    reviewsCount: 4102,
    image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600&auto=format&fit=crop&q=80",
    description: "Iconic light blue & white stripes — the jersey worn by Messi and Argentina to win Copa America 2024. Three gold stars.",
    tags: ["Argentina", "Messi", "AFA", "Copa America"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Adidas Aeroready", "AFA crest", "3 gold stars", "Slim fit"]
  },
  {
    id: 10,
    name: "Portugal 2024 Home Jersey (Euro Edition)",
    price: 2999,
    category: "Football",
    rating: 4.7,
    reviewsCount: 1887,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
    description: "Iconic red Portugal home jersey for Euro 2024, as worn by Cristiano Ronaldo. Nike Dri-FIT ADV.",
    tags: ["Portugal", "Ronaldo", "FPF", "Euro 2024"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Nike Dri-FIT ADV", "Portugal crest", "Breathable", "Recycled polyester"]
  },
  {
    id: 11,
    name: "Manchester City Home Jersey 24-25",
    price: 3399,
    category: "Football",
    rating: 4.8,
    reviewsCount: 2334,
    image: "/jerseys/man_city.png",
    description: "Sky blue Man City home jersey. Features HAALAND 9 on the back. Puma training technology.",
    tags: ["Man City", "Premier League", "Sky Blues", "Haaland"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Puma Aeroready", "MCFC crest", "Slim fit", "Moisture-wicking"]
  },
  {
    id: 12,
    name: "Juventus 24-25 Home Jersey",
    price: 2799,
    category: "Football",
    rating: 4.6,
    reviewsCount: 1456,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    description: "The iconic black and white stripes of Juventus FC for the 2024-25 Serie A season. La Vecchia Signora.",
    tags: ["Juventus", "Serie A", "Bianconeri", "Vlahovic"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Adidas Aeroready", "Juventus crest", "Standard fit", "Polyester blend"]
  },
  {
    id: 13,
    name: "PSG Jordan Strike Jersey 2024",
    price: 3299,
    category: "Football",
    rating: 4.8,
    reviewsCount: 2199,
    image: "https://images.unsplash.com/photo-1624367764798-a6d9e9869b4b?w=600&auto=format&fit=crop&q=80",
    description: "PSG x Jordan Brand limited edition strike jersey for 2024. Jumpman logo meets the Eiffel Tower.",
    tags: ["PSG", "Jordan Brand", "Ligue 1", "Mbappe"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Jordan Dri-FIT", "PSG & Jumpman logo", "Slim fit", "Premium polyester"]
  },
  {
    id: 14,
    name: "Chelsea FC 2024-25 Home Kit",
    price: 3199,
    category: "Football",
    rating: 4.6,
    reviewsCount: 1543,
    image: "https://images.unsplash.com/photo-1505830927105-f52b60be4b6d?w=600&auto=format&fit=crop&q=80",
    description: "Royal blue Chelsea home jersey for 2024-25 season with Nike Dri-FIT technology. Come on, Chelsea!",
    tags: ["Chelsea", "Premier League", "Blues", "Cole Palmer"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Nike Dri-FIT ADV", "Chelsea crest", "Stadium fit", "Recycled materials"]
  },

  // ===== 🏏 CRICKET JERSEYS (Priority 1) =====

  {
    id: 15,
    name: "India T20 Blue Jersey — World Cup 2024",
    price: 1499,
    category: "Cricket",
    rating: 4.9,
    reviewsCount: 5678,
    image: "https://images.unsplash.com/photo-1540747913346-19212a4b31b9?w=600&auto=format&fit=crop&q=80",
    description: "The iconic Team India T20 jersey as worn in the ICC T20 World Cup 2024 — the Champions Edition. Lightweight and breathable.",
    tags: ["Team India", "T20", "BCCI", "Blue Jersey", "Champions"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Dri-FIT moisture wicking", "BCCI approved replica", "Sublimated print", "Unisex"]
  },
  {
    id: 16,
    name: "India Test Cricket Whites 2024",
    price: 1799,
    category: "Cricket",
    rating: 4.7,
    reviewsCount: 987,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80",
    description: "Traditional cricket whites worn by Team India in Test matches. Clean premium quality with BCCI emblem.",
    tags: ["Team India", "Test Cricket", "Whites", "Classic"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Premium white polyester", "BCCI replica", "Breathable", "Machine washable"]
  },
  {
    id: 17,
    name: "Mumbai Indians IPL 2025 Jersey",
    price: 1299,
    category: "Cricket",
    rating: 4.8,
    reviewsCount: 3412,
    image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600&auto=format&fit=crop&q=80",
    description: "Official replica Mumbai Indians jersey for IPL 2025 — blue with gold accents. Jai MI!",
    tags: ["Mumbai Indians", "IPL", "MI", "Blue & Gold", "Rohit"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["MI official replica", "Breathable fabric", "Sublimated print", "Unisex"]
  },
  {
    id: 18,
    name: "Chennai Super Kings 2025 Yellow Kit",
    price: 1299,
    category: "Cricket",
    rating: 4.9,
    reviewsCount: 4234,
    image: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=600&auto=format&fit=crop&q=80",
    description: "Thala CSK yellow jersey for IPL 2025 — the most iconic franchise kit in world cricket! Whistle Podu!",
    tags: ["CSK", "IPL", "Yellow Army", "Dhoni", "Thala"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["CSK official replica", "Moisture-wicking", "Sublimated print", "Machine washable"]
  },
  {
    id: 19,
    name: "Royal Challengers Bengaluru 2025",
    price: 1399,
    category: "Cricket",
    rating: 4.7,
    reviewsCount: 2876,
    image: "https://images.unsplash.com/photo-1607743619859-0a6f1c92cee8?w=600&auto=format&fit=crop&q=80",
    description: "Red and black RCB jersey for IPL 2025. As worn by Virat Kohli, Du Plessis & team. E sala cup namde!",
    tags: ["RCB", "IPL", "Kohli", "Red & Black", "Bengaluru"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["RCB official replica", "Breathable mesh", "Sublimated crest", "Unisex"]
  },
  {
    id: 20,
    name: "Kolkata Knight Riders 2025 Champions Kit",
    price: 1299,
    category: "Cricket",
    rating: 4.7,
    reviewsCount: 2234,
    image: "https://images.unsplash.com/photo-1631748793394-b3fcb2e9f16c?w=600&auto=format&fit=crop&q=80",
    description: "KKR purple and gold jersey for IPL 2025 — the Champions Edition for title defenders. Korbo Lorbo Jeetbo!",
    tags: ["KKR", "IPL", "Purple & Gold", "Champions", "Shreyas"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["KKR official replica", "Polyester", "Sublimated print", "Machine washable"]
  },
  {
    id: 21,
    name: "Pakistan 2024 ODI Green Jersey",
    price: 1899,
    category: "Cricket",
    rating: 4.6,
    reviewsCount: 1543,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80",
    description: "The iconic Pakistan green jersey for 2024 international series. Officially styled replica.",
    tags: ["Pakistan", "PCB", "Green", "ODI", "Babar Azam"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Polyester Dri-FIT", "PCB replica", "Breathable fabric", "Unisex"]
  },
  {
    id: 22,
    name: "Australia 2024 Baggy Gold Cricket Jersey",
    price: 1999,
    category: "Cricket",
    rating: 4.7,
    reviewsCount: 1234,
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop&q=80",
    description: "Classic yellow Australian cricket jersey for 2024 international series — the legendary Baggy Gold.",
    tags: ["Australia", "Cricket Australia", "Yellow", "Smith", "Warner"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["CA official replica", "Breathable polyester", "Australia crest", "Unisex"]
  },
  {
    id: 23,
    name: "West Indies T20 Maroon Jersey 2024",
    price: 1799,
    category: "Cricket",
    rating: 4.6,
    reviewsCount: 876,
    image: "https://images.unsplash.com/photo-1587093336587-eeca6cb17cf4?w=600&auto=format&fit=crop&q=80",
    description: "The maroon West Indies jersey as worn in the T20 World Cup 2024 champions campaign. Calypso Cricket!",
    tags: ["West Indies", "T20 WC", "Maroon", "Champions", "Pollard"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["CWI official replica", "Moisture-wicking", "Embroidered crest", "Unisex"]
  },
  {
    id: 24,
    name: "Delhi Capitals IPL 2025 Kit",
    price: 1199,
    category: "Cricket",
    rating: 4.5,
    reviewsCount: 1098,
    image: "https://images.unsplash.com/photo-1561041806-0d5c04b78b32?w=600&auto=format&fit=crop&q=80",
    description: "DC blue and red jersey for IPL 2025 season. Lightweight and breathable fabric.",
    tags: ["Delhi Capitals", "IPL", "DC", "Blue & Red"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["DC official replica", "Polyester", "Sublimated print", "Machine washable"]
  },
  {
    id: 25,
    name: "Rajasthan Royals IPL 2025 Pink Kit",
    price: 1199,
    category: "Cricket",
    rating: 4.6,
    reviewsCount: 987,
    image: "https://images.unsplash.com/photo-1540747913346-19212a4b31b9?w=600&auto=format&fit=crop&q=80",
    description: "Pink & blue RR jersey for IPL 2025 season — the most stylish franchise kit! Halla Bol!",
    tags: ["RR", "IPL", "Pink", "Rajasthan", "Sanju"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["RR official replica", "Polyester", "Sublimated print", "Machine washable"]
  },
  {
    id: 26,
    name: "Sunrisers Hyderabad IPL 2025 Kit",
    price: 1199,
    category: "Cricket",
    rating: 4.5,
    reviewsCount: 876,
    image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600&auto=format&fit=crop&q=80",
    description: "SRH orange and black jersey for IPL 2025 season. Bold design for the Orange Army!",
    tags: ["SRH", "IPL", "Orange Army", "Hyderabad", "Klaasen"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["SRH official replica", "Polyester", "Sublimated print", "Machine washable"]
  },

  // ===== 🏀 BASKETBALL JERSEYS =====

  {
    id: 27,
    name: "LA Lakers LeBron #23 Replica Jersey",
    price: 2499,
    category: "Basketball",
    rating: 4.8,
    reviewsCount: 2314,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80",
    description: "Authentic NBA replica jersey for LA Lakers #23 LeBron James. Gold & purple colourway.",
    tags: ["Lakers", "NBA", "LeBron", "Gold", "Purple"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Nike NBA Swingman", "Twill lettering", "Machine washable", "Mesh fabric"]
  },
  {
    id: 28,
    name: "Golden State Warriors Home Jersey",
    price: 2299,
    category: "Basketball",
    rating: 4.7,
    reviewsCount: 1876,
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&auto=format&fit=crop&q=80",
    description: "Royal blue and gold GSW home jersey. Official NBA Swingman quality. Strength in Numbers!",
    tags: ["Warriors", "NBA", "Curry", "Gold", "Splash Bros"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Nike NBA Swingman", "Mesh construction", "Machine washable", "Twill lettering"]
  },
  {
    id: 29,
    name: "Chicago Bulls #23 Iconic Jersey",
    price: 2499,
    category: "Basketball",
    rating: 4.9,
    reviewsCount: 3102,
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&auto=format&fit=crop&q=80",
    description: "The most iconic basketball jersey ever — Chicago Bulls #23 Michael Jordan era replica. A living legend.",
    tags: ["Bulls", "NBA", "Jordan", "Classic", "Chicago"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Hardwood Classic edition", "Embroidered numbers", "Machine washable", "Premium mesh"]
  },
  {
    id: 30,
    name: "Brooklyn Nets Away Jersey",
    price: 2199,
    category: "Basketball",
    rating: 4.6,
    reviewsCount: 987,
    image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&auto=format&fit=crop&q=80",
    description: "Sleek black and white Brooklyn Nets away jersey. Minimalist streetwear design.",
    tags: ["Nets", "NBA", "Brooklyn", "Black & White"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Nike NBA Swingman", "Twill lettering", "Machine washable", "Breathable mesh"]
  },

  // ===== ⚽ FOOTBALL EQUIPMENT =====

  {
    id: 31,
    name: "Nivia Storm Football (FIFA Quality)",
    price: 1299,
    category: "Football",
    rating: 4.6,
    reviewsCount: 1876,
    image: "https://images.unsplash.com/photo-1559628233-100c798642d1?w=600&auto=format&fit=crop&q=80",
    description: "FIFA Quality certified Nivia Storm football. Durable 32-panel design ideal for matches and training.",
    tags: ["Football", "FIFA", "Match Ball", "Nivia"],
    customType: "none",
    specs: ["Size 5", "FIFA Quality certified", "PU outer casing", "Optimal bladder retention"]
  },
  {
    id: 32,
    name: "Goalkeeper Gloves Pro Level",
    price: 899,
    category: "Football",
    rating: 4.5,
    reviewsCount: 654,
    image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=600&auto=format&fit=crop&q=80",
    description: "Pro-grade goalkeeper gloves with 4mm flat palm German latex and adjustable wrist strap.",
    tags: ["Goalkeeper", "Gloves", "Pro", "Latex"],
    customType: "color-size",
    options: {
      colors: [
        { id: "red", name: "Red", code: "#dc2626" },
        { id: "black", name: "Black", code: "#111827" },
        { id: "neon-green", name: "Neon Green", code: "#16a34a" }
      ],
      sizes: ["6", "7", "8", "9", "10", "11"]
    },
    specs: ["4mm flat palm latex", "Wrist strap closure", "Breathable backhand", "Finger spine protection"]
  },
  {
    id: 33,
    name: "Carbon Fibre Football Shin Guards",
    price: 599,
    category: "Football",
    rating: 4.7,
    reviewsCount: 1234,
    image: "https://images.unsplash.com/photo-1584952811565-c4c4031b0a58?w=600&auto=format&fit=crop&q=80",
    description: "Lightweight carbon fibre shin guards with EVA foam padding and ankle strap. Maximum protection, minimal weight.",
    tags: ["Shin Guards", "Carbon Fibre", "Protection", "Lightweight"],
    customType: "none",
    specs: ["Carbon fibre shell", "EVA foam padding", "Ankle protection", "Pack of 2"]
  },
  {
    id: 34,
    name: "Adidas Predator 24 Football Boots",
    price: 4999,
    category: "Football",
    rating: 4.8,
    reviewsCount: 987,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "Adidas Predator 24 League FG football boots. Controlskin technology for enhanced ball control on firm ground.",
    tags: ["Adidas", "Predator", "Football Boots", "FG", "Firm Ground"],
    customType: "none",
    specs: ["Firm Ground (FG)", "Synthetic upper", "Controlskin tech", "Sizes UK 6-12"]
  },
  {
    id: 35,
    name: "Nike Mercurial Vapor 16 Speed Boots",
    price: 5999,
    category: "Football",
    rating: 4.9,
    reviewsCount: 765,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80",
    description: "Nike Mercurial Vapor 16 — built for speed. As worn by Kylian Mbappé and Erling Haaland.",
    tags: ["Nike", "Mercurial", "Speed", "FG", "Haaland", "Mbappe"],
    customType: "none",
    specs: ["Firm Ground (FG)", "Nike Silo FG plate", "Vaporposite upper", "Sizes UK 6-12"]
  },
  {
    id: 36,
    name: "Football Training Socks (3 Pack)",
    price: 299,
    category: "Football",
    rating: 4.5,
    reviewsCount: 2109,
    image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=600&auto=format&fit=crop&q=80",
    description: "Over-the-calf football socks with cushioned sole and anti-blister design. Pack of 3 pairs.",
    tags: ["Football Socks", "Pack of 3", "Anti-Blister", "Training"],
    customType: "none",
    specs: ["Pack of 3 pairs", "Over-the-calf", "Cushioned sole", "Machine washable"]
  },

  // ===== 🏏 CRICKET EQUIPMENT =====

  {
    id: 37,
    name: "SG Premium English Willow Cricket Bat",
    price: 3999,
    category: "Cricket",
    rating: 4.8,
    reviewsCount: 876,
    image: "https://images.unsplash.com/photo-1541941281-b53e6e32c74e?w=600&auto=format&fit=crop&q=80",
    description: "Grade 1 English Willow cricket bat from SG. Premium pick-up and power for senior players. Includes bat cover.",
    tags: ["SG", "English Willow", "Grade 1", "Senior", "Cricket Bat"],
    customType: "none",
    specs: ["Grade 1 English Willow", "Short handle", "6+ grains", "Includes bat cover + grip"]
  },
  {
    id: 38,
    name: "SS Supremo Batting Gloves (Senior)",
    price: 799,
    category: "Cricket",
    rating: 4.6,
    reviewsCount: 654,
    image: "https://images.unsplash.com/photo-1544899489-a083461b088c?w=600&auto=format&fit=crop&q=80",
    description: "High-quality leather batting gloves with reinforced sausage finger rolls and sweat absorption lining.",
    tags: ["SS", "Batting Gloves", "Senior", "Leather"],
    customType: "color-size",
    options: {
      colors: [
        { id: "white-red", name: "White/Red", code: "#dc2626" },
        { id: "white-blue", name: "White/Blue", code: "#2563eb" },
        { id: "white-green", name: "White/Green", code: "#16a34a" }
      ],
      sizes: ["Youth", "Small", "Medium", "Large"]
    },
    specs: ["Full leather", "Sausage finger rolls", "Velcro wrist closure", "Sweat absorption lining"]
  },
  {
    id: 39,
    name: "Cricket Batting Pads (Senior)",
    price: 1499,
    category: "Cricket",
    rating: 4.7,
    reviewsCount: 432,
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&auto=format&fit=crop&q=80",
    description: "Premium batting leg pads with high-density foam padding, cane bolster and adjustable straps.",
    tags: ["Batting Pads", "Senior", "Cricket", "Leg Pads"],
    customType: "none",
    specs: ["HDF knee roll", "3 velcro straps", "Cane bolster", "Approx 1.2 kg"]
  },
  {
    id: 40,
    name: "Shrey Master ICC Cricket Helmet",
    price: 2999,
    category: "Cricket",
    rating: 4.9,
    reviewsCount: 543,
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=80",
    description: "ICC approved Shrey Master stainless steel grille cricket helmet. Maximum head protection, ventilated inner.",
    tags: ["Shrey", "Helmet", "ICC Approved", "Senior", "Cricket"],
    customType: "color-size",
    options: {
      colors: [
        { id: "navy", name: "Navy Blue", code: "#1e40af" },
        { id: "white", name: "White", code: "#f8fafc" },
        { id: "black", name: "Black", code: "#111827" }
      ],
      sizes: ["Junior", "Small", "Medium", "Large", "XL"]
    },
    specs: ["ICC approved", "Stainless steel grille", "ABS outer shell", "Adjustable headband"]
  },
  {
    id: 41,
    name: "Kookaburra Match Grade Cricket Ball",
    price: 699,
    category: "Cricket",
    rating: 4.8,
    reviewsCount: 1234,
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop&q=80",
    description: "Kookaburra 4-piece match grade cricket ball. Used in international matches worldwide. Alum tanned leather.",
    tags: ["Kookaburra", "Match Ball", "Leather", "4-piece"],
    customType: "none",
    specs: ["4-piece leather", "Match grade", "155-163g", "International standard"]
  },

  // ===== 🏀 BASKETBALL EQUIPMENT =====

  {
    id: 42,
    name: "Spalding NBA Official Basketball",
    price: 1499,
    category: "Basketball",
    rating: 4.7,
    reviewsCount: 876,
    image: "https://images.unsplash.com/photo-1559628233-100c798642d1?w=600&auto=format&fit=crop&q=80",
    description: "NBA official game ball by Spalding. Full-grain leather for indoor play — authentic game feel.",
    tags: ["Spalding", "NBA", "Official", "Indoor", "Leather"],
    customType: "none",
    specs: ["Full leather", "Size 7", "NBA official grip", "Indoor use"]
  },
  {
    id: 43,
    name: "Basketball Training Shorts",
    price: 699,
    category: "Basketball",
    rating: 4.5,
    reviewsCount: 654,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    description: "Mesh basketball training shorts with side pockets and elastic waistband. Great for court or street.",
    tags: ["Basketball", "Shorts", "Training", "Mesh"],
    customType: "color-size",
    options: {
      colors: [
        { id: "black", name: "Black", code: "#111827" },
        { id: "navy", name: "Navy", code: "#1e40af" },
        { id: "red", name: "Red", code: "#dc2626" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    specs: ["100% polyester mesh", "Side pockets", "Elastic waistband", "Machine washable"]
  },

  // ===== 🏃 ATHLETICS =====

  {
    id: 44,
    name: "Nike Zoom Fly 5 Running Shoes",
    price: 4999,
    category: "Athletics",
    rating: 4.8,
    reviewsCount: 1543,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "Nike Zoom Fly 5 with React foam midsole and full-length carbon fibre plate. Built for personal bests.",
    tags: ["Nike", "Running", "Carbon Plate", "Speed", "Marathon"],
    customType: "none",
    specs: ["React foam", "Carbon plate", "Flyknit upper", "Sizes UK 5-12"]
  },
  {
    id: 45,
    name: "Adidas Adizero Boston 12",
    price: 5499,
    category: "Athletics",
    rating: 4.9,
    reviewsCount: 987,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80",
    description: "Adidas' most versatile performance running shoe. Lightstrike Pro midsole and Continental rubber outsole.",
    tags: ["Adidas", "Adizero", "Running", "Performance", "Eliud Kipchoge"],
    customType: "none",
    specs: ["Lightstrike Pro", "Continental rubber", "Engineered mesh upper", "Sizes UK 5-12"]
  },
  {
    id: 46,
    name: "Compression Running Tights",
    price: 1299,
    category: "Athletics",
    rating: 4.6,
    reviewsCount: 765,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=80",
    description: "Compression tights for performance running and recovery. Graduated compression for faster muscle recovery.",
    tags: ["Compression", "Running", "Recovery", "Tights"],
    customType: "color-size",
    options: {
      colors: [
        { id: "black", name: "Black", code: "#111827" },
        { id: "navy", name: "Navy", code: "#1e40af" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    specs: ["Graduated compression", "Moisture-wicking", "Reflective strips", "UV protection"]
  },
  {
    id: 47,
    name: "Performance Athletic Training Tee",
    price: 699,
    category: "Athletics",
    rating: 4.5,
    reviewsCount: 1234,
    image: "https://images.unsplash.com/photo-1467234030861-ea74014ab2b6?w=600&auto=format&fit=crop&q=80",
    description: "Lightweight training tee with raglan sleeves and moisture management technology. Train harder.",
    tags: ["Training", "Athletic", "T-Shirt", "Moisture-wicking"],
    customType: "color-size",
    options: {
      colors: [
        { id: "black", name: "Black", code: "#111827" },
        { id: "white", name: "White", code: "#f8fafc" },
        { id: "green", name: "Green", code: "#16a34a" },
        { id: "red", name: "Red", code: "#dc2626" }
      ],
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    specs: ["100% polyester", "Raglan sleeves", "Moisture-wicking", "Machine washable"]
  },

  // ===== 🎒 ACCESSORIES =====

  {
    id: 48,
    name: "Sports Duffel Bag — 50L (Waterproof)",
    price: 1499,
    category: "Accessories",
    rating: 4.6,
    reviewsCount: 876,
    image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=80",
    description: "Large capacity sports duffel with separate shoe compartment, wet pocket and padded shoulder strap.",
    tags: ["Sports Bag", "Duffel", "50L", "Waterproof", "Gym Bag"],
    customType: "none",
    specs: ["50L capacity", "Separate shoe pocket", "Wet pocket", "Padded shoulder strap"]
  },
  {
    id: 49,
    name: "Sports Water Bottle (1.5L — BPA Free)",
    price: 399,
    category: "Accessories",
    rating: 4.7,
    reviewsCount: 2345,
    image: "https://images.unsplash.com/photo-1549488344-cbb6c34a8b10?w=600&auto=format&fit=crop&q=80",
    description: "BPA-free sports water bottle with straw lid and carry loop. Keep hydrated on the pitch.",
    tags: ["Water Bottle", "BPA Free", "Hydration", "Sports"],
    customType: "none",
    specs: ["1.5L capacity", "BPA-free PETG", "Straw lid", "Dishwasher safe"]
  },
  {
    id: 50,
    name: "Sports Headband & Wristband Set",
    price: 249,
    category: "Accessories",
    rating: 4.4,
    reviewsCount: 1567,
    image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=600&auto=format&fit=crop&q=80",
    description: "Terry cotton headband + 2 wristbands set. Absorbs sweat during intense training or matches.",
    tags: ["Headband", "Wristband", "Sweat", "Terry Cotton"],
    customType: "none",
    specs: ["Terry cotton", "Elastic fit", "1 headband + 2 wristbands", "Machine washable"]
  },
  {
    id: 51,
    name: "Protein Shaker Bottle (700ml)",
    price: 349,
    category: "Accessories",
    rating: 4.5,
    reviewsCount: 3456,
    image: "https://images.unsplash.com/photo-1614537935871-33aa8f268a42?w=600&auto=format&fit=crop&q=80",
    description: "BlenderBottle classic shaker with wire whisk ball for smooth protein shakes post-match or training.",
    tags: ["Protein Shaker", "Post-Match", "Gym", "BlenderBottle"],
    customType: "none",
    specs: ["700ml capacity", "Wire whisk ball", "Flip cap", "Dishwasher safe"]
  },
  {
    id: 52,
    name: "Knee Support Brace — Pair (Neoprene)",
    price: 599,
    category: "Accessories",
    rating: 4.6,
    reviewsCount: 1234,
    image: "https://images.unsplash.com/photo-1520195916037-d13a2e64ba6c?w=600&auto=format&fit=crop&q=80",
    description: "Neoprene knee support brace for footballers, cricketers and runners. Reduces risk of injury.",
    tags: ["Knee Support", "Injury Prevention", "Neoprene", "Pair"],
    customType: "none",
    specs: ["Neoprene material", "Open patella design", "Adjustable straps", "Sold as pair"]
  },
  {
    id: 53,
    name: "England Cricket Test Whites Jersey",
    price: 2199,
    category: "Cricket",
    rating: 4.6,
    reviewsCount: 765,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80",
    description: "Traditional England Test whites with the Three Lions crest. Premium replica fabric.",
    tags: ["England", "Test Cricket", "ECB", "Three Lions"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["ECB official replica", "White polyester", "England crest", "Machine washable"]
  },
  {
    id: 54,
    name: "Lucknow Super Giants IPL 2025 Kit",
    price: 1199,
    category: "Cricket",
    rating: 4.4,
    reviewsCount: 654,
    image: "https://images.unsplash.com/photo-1607743619859-0a6f1c92cee8?w=600&auto=format&fit=crop&q=80",
    description: "Teal and gold LSG jersey for IPL 2025 season. Premium replica fabric. Go LSG!",
    tags: ["LSG", "IPL", "Teal & Gold", "Lucknow", "KL Rahul"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["LSG official replica", "Polyester", "Sublimated print", "Machine washable"]
  },
  {
    id: 55,
    name: "Inter Miami CF Home Jersey 2024",
    price: 3299,
    category: "Football",
    rating: 4.9,
    reviewsCount: 3876,
    image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&auto=format&fit=crop&q=80",
    description: "Pink Inter Miami CF home jersey for 2024 — as worn by Lionel Messi in MLS. Iconic and trending worldwide!",
    tags: ["Inter Miami", "MLS", "Messi", "Pink", "Adidas"],
    customType: "jersey",
    options: { sizes: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    specs: ["Adidas Aeroready", "Inter Miami crest", "Slim fit", "Recycled polyester"]
  }
];
