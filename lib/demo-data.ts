import {
  Bike,
  BookOpen,
  Calculator,
  Headphones,
  Laptop,
  Shirt,
  Sofa,
  Sparkles,
} from "lucide-react";

export type DemoListing = {
  id: string;
  title: string;
  price: string;
  seller: string;
  college: string;
  condition: string;
  posted: string;
  location: string;
  category: string;
  image: string;
  gradient: string;
  saved?: boolean;
};

export const demoListings: DemoListing[] = [
  {
    id: "macbook-air-m2",
    title: "MacBook Air M2, 13-inch",
    price: "$780",
    seller: "Maya Chen",
    college: "Stanford",
    condition: "Like new",
    posted: "2h ago",
    location: "East Campus",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    gradient: "from-emerald-50 via-stone-50 to-white",
    saved: true,
  },
  {
    id: "engineering-books",
    title: "Engineering textbook bundle",
    price: "$64",
    seller: "Arjun Rao",
    college: "MIT",
    condition: "Good",
    posted: "5h ago",
    location: "Library steps",
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    gradient: "from-amber-50 via-white to-emerald-50",
  },
  {
    id: "campus-cycle",
    title: "Hybrid campus cycle",
    price: "$145",
    seller: "Elena Brooks",
    college: "UCLA",
    condition: "Excellent",
    posted: "1d ago",
    location: "North Quad",
    category: "Transport",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
    gradient: "from-teal-50 via-white to-stone-50",
  },
  {
    id: "hostel-desk-chair",
    title: "Minimal study chair",
    price: "$38",
    seller: "Noah Kim",
    college: "Berkeley",
    condition: "Good",
    posted: "1d ago",
    location: "Dorm B",
    category: "Furniture",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80",
    gradient: "from-stone-100 via-white to-amber-50",
  },
  {
    id: "ti-calculator",
    title: "TI-84 Plus CE calculator",
    price: "$72",
    seller: "Sam Rivera",
    college: "NYU",
    condition: "Like new",
    posted: "2d ago",
    location: "Math building",
    category: "Supplies",
    image:
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=80",
    gradient: "from-slate-50 via-white to-emerald-50",
  },
  {
    id: "sony-headphones",
    title: "Sony noise-canceling headphones",
    price: "$118",
    seller: "Priya Shah",
    college: "Columbia",
    condition: "Excellent",
    posted: "3d ago",
    location: "Student center",
    category: "Audio",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    gradient: "from-emerald-50 via-white to-teal-50",
  },
];

export const categories = [
  { name: "Tech", count: 128, icon: Laptop },
  { name: "Books", count: 84, icon: BookOpen },
  { name: "Transport", count: 41, icon: Bike },
  { name: "Furniture", count: 57, icon: Sofa },
  { name: "Supplies", count: 66, icon: Calculator },
  { name: "Audio", count: 33, icon: Headphones },
  { name: "Lab gear", count: 24, icon: Shirt },
  { name: "Deals", count: 92, icon: Sparkles },
];

export const testimonials = [
  {
    quote: "CampusLoop made buying a laptop from another student feel safer than any random marketplace.",
    name: "Avery",
    detail: "Computer Science sophomore",
  },
  {
    quote: "I sold my dorm furniture in a weekend. The experience felt calm, clean, and trustworthy.",
    name: "Leah",
    detail: "Graduating senior",
  },
  {
    quote: "The campus context changes everything. It feels built for how students actually trade.",
    name: "Marcus",
    detail: "Engineering student",
  },
];
