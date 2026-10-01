export type Room = {
  id: string;
  name: string;
  shortName: string;
  size: number;
  guests: number;
  price: number;
  image: string;
  alt: string;
  description: string;
  amenities: string[];
};

export const rooms: Room[] = [
  {
    id: "superior",
    name: "Superior Room",
    shortName: "Superior",
    size: 32,
    guests: 2,
    price: 8000,
    image: "/images/room-superior.jpg",
    alt: "A softly lit Superior Room with a king bed and warm timber finishes",
    description: "A restful hideaway, thoughtfully appointed for slow mornings and easy evenings.",
    amenities: ["King bed", "Garden view", "Rain shower"],
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    shortName: "Deluxe",
    size: 39,
    guests: 2,
    price: 12500,
    image: "/images/room-deluxe.jpg",
    alt: "Deluxe Room with a king bed, a quiet sitting corner and balcony doors",
    description: "More room to unwind, with a private balcony and views across the gardens.",
    amenities: ["Private balcony", "King bed", "Lake view"],
  },
  {
    id: "junior-suite",
    name: "Junior Suite",
    shortName: "Junior Suite",
    size: 54,
    guests: 3,
    price: 18000,
    image: "/images/room-junior-suite.jpg",
    alt: "Junior Suite lounge with linen armchairs and a warm wood coffee table",
    description: "A generous suite with a separate lounge for lingering over the little things.",
    amenities: ["Separate lounge", "King bed", "Soaking tub"],
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    shortName: "Executive",
    size: 76,
    guests: 4,
    price: 26500,
    image: "/images/room-executive-suite.jpg",
    alt: "Executive Suite living room with soft linen seating and warm pendant light",
    description: "A polished, spacious retreat designed for longer stays and shared moments.",
    amenities: ["Dining area", "Lake-facing", "Lounge"],
  },
  {
    id: "presidential-villa",
    name: "Presidential Villa",
    shortName: "Villa",
    size: 118,
    guests: 6,
    price: 42000,
    image: "/images/room-presidential-villa.jpg",
    alt: "Private stone and timber villa with a plunge pool overlooking the lake",
    description: "A secluded lakeside residence with a private plunge pool and its own terrace.",
    amenities: ["Private plunge pool", "Butler service", "Lake terrace"],
  },
];

export function formatKes(value: number): string {
  return new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(value);
}
