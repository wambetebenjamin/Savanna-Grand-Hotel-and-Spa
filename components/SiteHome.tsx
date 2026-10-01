"use client";

import HotelImage from "./HotelImage";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Baby,
  Bath,
  BedDouble,
  Bell,
  Building2,
  CalendarCheck2,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  ConciergeBell,
  Dumbbell,
  Flower2,
  Heart,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  Navigation,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { formatKes, rooms, type Room } from "@/lib/rooms";

type FormFeedback = { kind: "success" | "error"; message: string } | null;

const phoneNumber = "+254112272061";
const bookingWhatsApp = "https://wa.me/254112272061?text=Hello!%20I'd%20like%20to%20book%20a%20room.";
const quickWhatsApp = "https://wa.me/254112272061?text=Hello!%20I'd%20like%20to%20inquire%20about%20a%20booking%20at%20Savanna%20Grand%20Hotel.";

const heroSlides = [
  { src: "/images/hero-1.jpg", alt: "Savanna Grand by the water at sunset" },
  { src: "/images/hero-3.jpg", alt: "An evening sundowner beside Lake Naivasha" },
  { src: "/images/hero-2.jpg", alt: "A tranquil guest room opening to the lake" },
];

const galleryShots = [
  { src: "/images/hero-1.jpg", title: "The lake at last light", position: "center" },
  { src: "/images/room-deluxe.jpg", title: "A softer place to land", position: "center" },
  { src: "/images/dining-food.jpg", title: "A taste of the season", position: "center" },
  { src: "/images/hero-3.jpg", title: "Sundowners, slowly", position: "center" },
  { src: "/images/room-presidential-villa.jpg", title: "Your own little corner", position: "center" },
  { src: "/images/dining-interior.jpg", title: "Evenings at Savanna Kitchen", position: "center" },
  { src: "/images/room-junior-suite.jpg", title: "Room to settle in", position: "center" },
  { src: "/images/hero-2.jpg", title: "Morning, without an alarm", position: "center" },
  { src: "/images/room-executive-suite.jpg", title: "A little more room", position: "center" },
  { src: "/images/room-superior.jpg", title: "A welcoming retreat", position: "center" },
  { src: "/images/dining-food.jpg", title: "Made for the table", position: "58% center" },
  { src: "/images/hero-1.jpg", title: "Naivasha, in its quiet hour", position: "30% center" },
];

const guestNotes = [
  {
    quote: "The lake at sunrise, the warmest welcome, and a room we didn't want to leave. We found our little pause from the world.",
    name: "A. Morgan",
    country: "United Kingdom",
    source: "Sample guest story",
    rating: "5.0",
  },
  {
    quote: "A beautiful base for exploring Naivasha. Every detail felt considered, from the first coffee to the last light over the water.",
    name: "W. Kamau",
    country: "Kenya",
    source: "Sample guest story",
    rating: "5.0",
  },
  {
    quote: "Peaceful, generous and wonderfully unhurried. The team made our weekend feel like it had been made just for us.",
    name: "S. Patel",
    country: "India",
    source: "Sample guest story",
    rating: "5.0",
  },
];

const spaServices = [
  { title: "Swedish Massage", duration: "60 minutes", price: "KES 6,000", Icon: Flower2 },
  { title: "Hot Stone Therapy", duration: "75 minutes", price: "KES 8,500", Icon: Sparkles },
  { title: "Facial Treatments", duration: "50 minutes", price: "KES 5,500", Icon: Sun },
  { title: "Yoga Sessions", duration: "45 minutes", price: "KES 2,000", Icon: Wind },
];

const facilities = [
  { label: "Swimming pool", detail: "A refreshing pause by the lake", Icon: Waves },
  { label: "Fitness studio", detail: "Room to keep your rhythm", Icon: Dumbbell },
  { label: "Conference rooms", detail: "Gather, focus, make progress", Icon: Building2 },
  { label: "Complimentary Wi-Fi", detail: "Stay connected when you need to", Icon: Wifi },
  { label: "Airport shuttle", detail: "A smoother arrival, on request", Icon: Car },
  { label: "24-hour room service", detail: "A little comfort, any time", Icon: Bell },
  { label: "Wedding venue", detail: "A setting worth remembering", Icon: Heart },
  { label: "Kids' play area", detail: "Space for little explorers", Icon: Baby },
];

const packages = [
  {
    number: "01",
    name: "Honeymoon Escape",
    note: "For two, and nowhere else to be.",
    price: "KES 38,000",
    unit: "per couple · 2 nights",
    benefits: ["Two nights in a Deluxe Room", "Breakfast for two", "One couples' spa ritual"],
    className: "offer-card--rose",
  },
  {
    number: "02",
    name: "Weekend by the Lake",
    note: "Trade the rush for a slower rhythm.",
    price: "KES 24,000",
    unit: "per couple · 2 nights",
    benefits: ["Two nights in a Superior Room", "Daily breakfast", "Late check-out, subject to availability"],
    className: "offer-card--sand",
  },
  {
    number: "03",
    name: "Meet in Naivasha",
    note: "A change of scene for better ideas.",
    price: "From KES 6,500",
    unit: "per person · day delegate",
    benefits: ["Meeting room and screen", "Tea, coffee and working lunch", "Dedicated event support"],
    className: "offer-card--navy",
  },
];

function getLocalDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function addOneDay(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + 1);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function whatsappLink(message: string) {
  return `https://wa.me/254112272061?text=${encodeURIComponent(message)}`;
}

export default function SiteHome() {
  const rootRef = useRef<HTMLElement | null>(null);
  const roomTrackRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [availabilityBusy, setAvailabilityBusy] = useState(false);
  const [availabilityFeedback, setAvailabilityFeedback] = useState<FormFeedback>(null);
  const [adults, setAdults] = useState("2");
  const [roomCount, setRoomCount] = useState("1");
  const [bookingFeedback, setBookingFeedback] = useState<FormFeedback>(null);
  const [contactFeedback, setContactFeedback] = useState<FormFeedback>(null);
  const [newsletterFeedback, setNewsletterFeedback] = useState<FormFeedback>(null);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [contactBusy, setContactBusy] = useState(false);
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const [roomModal, setRoomModal] = useState<Room | null>(null);
  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const [activeGuest, setActiveGuest] = useState(0);

  useEffect(() => {
    setMinDate(getLocalDate());
    const handleScroll = () => setScrolled(window.scrollY > 36);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    const interval = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 6500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let animationContext: { revert: () => void } | undefined;

    const startAnimations = async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (disposed || !rootRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        gsap.registerPlugin(ScrollTrigger);
        animationContext = gsap.context(() => {
          root.querySelectorAll<HTMLElement>(".reveal-up").forEach((element) => {
            gsap.fromTo(
              element,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.78,
                ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 91%", once: true },
              },
            );
          });
        }, root);
      } catch (error) {
        console.warn("Scroll animations could not be loaded.", error);
      }
    };

    void startAnimations();
    return () => {
      disposed = true;
      animationContext?.revert();
    };
  }, []);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring || !window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("custom-cursor-enabled");
    const handleMove = (event: PointerEvent) => {
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      ring.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      const target = event.target as HTMLElement | null;
      document.body.classList.toggle("cursor-hovering", Boolean(target?.closest("a, button, input, select, textarea")));
    };
    const handleLeave = () => document.body.classList.add("cursor-outside");
    const handleEnter = () => document.body.classList.remove("cursor-outside");
    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    document.documentElement.addEventListener("pointerenter", handleEnter);
    return () => {
      document.body.classList.remove("custom-cursor-enabled", "cursor-hovering", "cursor-outside");
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      document.documentElement.removeEventListener("pointerenter", handleEnter);
    };
  }, []);

  useEffect(() => {
    if (!roomModal && activeGallery === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setRoomModal(null);
        setActiveGallery(null);
      }
      if (activeGallery !== null && event.key === "ArrowRight") {
        setActiveGallery((current) => current === null ? null : (current + 1) % galleryShots.length);
      }
      if (activeGallery !== null && event.key === "ArrowLeft") {
        setActiveGallery((current) => current === null ? null : (current - 1 + galleryShots.length) % galleryShots.length);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [roomModal, activeGallery]);

  async function checkAvailability(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAvailabilityBusy(true);
    setAvailabilityFeedback(null);
    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut, adults: Number(adults), rooms: Number(roomCount), roomType: "any" }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "We couldn't check those dates. Please try again.");
      setAvailabilityFeedback({ kind: data.available ? "success" : "error", message: data.message });
    } catch (error) {
      setAvailabilityFeedback({ kind: "error", message: error instanceof Error ? error.message : "We couldn't check those dates. Please try again." });
    } finally {
      setAvailabilityBusy(false);
    }
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBookingBusy(true);
    setBookingFeedback(null);
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, adults: Number(payload.adults), rooms: Number(payload.rooms) }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "We couldn't send your enquiry. Please try again.");
      setBookingFeedback({ kind: "success", message: `${data.message} Reference: ${data.referenceId}.` });
      formElement.reset();
      setCheckIn("");
      setCheckOut("");
      setAdults("2");
      setRoomCount("1");
    } catch (error) {
      setBookingFeedback({ kind: "error", message: error instanceof Error ? error.message : "We couldn't send your enquiry. Please try again." });
    } finally {
      setBookingBusy(false);
    }
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setContactBusy(true);
    setContactFeedback(null);
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "We couldn't send your message. Please try again.");
      setContactFeedback({ kind: "success", message: data.message });
      formElement.reset();
    } catch (error) {
      setContactFeedback({ kind: "error", message: error instanceof Error ? error.message : "We couldn't send your message. Please try again." });
    } finally {
      setContactBusy(false);
    }
  }

  async function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setNewsletterBusy(true);
    setNewsletterFeedback(null);
    const form = new FormData(formElement);
    const email = String(form.get("email") || "");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter subscriber",
          email,
          message: "Please add this email address to the Savanna Grand newsletter list.",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "We couldn't add you just now.");
      setNewsletterFeedback({ kind: "success", message: "You're on the list. Asante." });
      formElement.reset();
    } catch (error) {
      setNewsletterFeedback({ kind: "error", message: error instanceof Error ? error.message : "We couldn't add you just now." });
    } finally {
      setNewsletterBusy(false);
    }
  }

  function scrollRooms(direction: -1 | 1) {
    roomTrackRef.current?.scrollBy({ left: direction * 390, behavior: "smooth" });
  }

  function scrollToBooking() {
    setMenuOpen(false);
    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeShot = activeGallery === null ? null : galleryShots[activeGallery];
  const activeReview = guestNotes[activeGuest];

  return (
    <main className="site-shell" ref={rootRef}>
      <div className="topbar">
        <div className="topbar-inner page-width">
          <div className="topbar-message">
            <ShieldCheck size={14} strokeWidth={1.8} aria-hidden="true" />
            <span>Best rate guarantee</span>
            <span className="topbar-separator">|</span>
            <span>Free cancellation</span>
            <span className="topbar-separator topbar-call-separator">|</span>
            <a href={`tel:${phoneNumber}`}><Phone size={13} aria-hidden="true" /> Call +254 112 272 061</a>
          </div>
          <a className="topbar-whatsapp" href={bookingWhatsApp} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
            <MessageCircle size={14} aria-hidden="true" /> WhatsApp reservations
          </a>
        </div>
      </div>

      <header className={`main-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner page-width">
          <a className="brand" href="#home" aria-label="Savanna Grand Hotel and Spa home" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true"><span>S</span><i>G</i></span>
            <span className="brand-copy"><strong>Savanna Grand</strong><small>Hotel <i>&</i> Spa · Naivasha</small></span>
          </a>
          <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className={`nav-links ${menuOpen ? "nav-links--open" : ""}`} aria-label="Main navigation">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#rooms" onClick={() => setMenuOpen(false)}>Rooms &amp; Suites</a>
            <a href="#dining" onClick={() => setMenuOpen(false)}>Dining</a>
            <a href="#spa" onClick={() => setMenuOpen(false)}>Spa &amp; Wellness</a>
            <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
            <a href="#offers" onClick={() => setMenuOpen(false)}>Offers</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <button className="header-book button button--small" type="button" onClick={scrollToBooking}>Book Now <ArrowUpRight size={15} /></button>
        </div>
      </header>

      <section id="home" className="hero" aria-label="Welcome to Savanna Grand Hotel and Spa">
        <div className="hero-images" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <div className={`hero-image ${activeSlide === index ? "is-active" : ""}`} key={slide.src}>
              <HotelImage src={slide.src} alt="" fill priority={index === 0} sizes="100vw" quality={85} />
            </div>
          ))}
          <div className="hero-shade" />
        </div>
        <div className="hero-content page-width">
          <div className="hero-kicker"><span className="kicker-line" /> <span>Lake Naivasha · Kenya</span> <span className="kicker-line" /></div>
          <h1>Where Wilderness<br /><em>Meets Luxury</em></h1>
          <p className="hero-subtitle">A softer kind of escape, on the quiet shores of Lake Naivasha.</p>
          <div className="hero-actions">
            <a className="button button--coral" href="#rooms">Explore the stay <ArrowDown size={15} /></a>
            <a className="hero-call-link" href={`tel:${phoneNumber}`}><span className="hero-call-icon"><Phone size={15} /></span> Speak with our team</a>
          </div>
        </div>
        <div className="hero-pagination" aria-label="Hero slides">
          <span className="hero-pagination-count">0{activeSlide + 1}</span><span className="hero-pagination-rule" />
          {heroSlides.map((slide, index) => (
            <button key={slide.src} type="button" aria-label={`Show hero slide ${index + 1}`} aria-pressed={activeSlide === index} className={activeSlide === index ? "is-active" : ""} onClick={() => setActiveSlide(index)} />
          ))}
          <span className="hero-pagination-total">03</span>
        </div>
        <form className="booking-widget" onSubmit={checkAvailability}>
          <div className="booking-widget-title"><span className="booking-widget-icon"><CalendarCheck2 size={18} /></span><span><small>Start your stay</small><strong>Find your dates</strong></span></div>
          <label className="booking-field">
            <span>Check-in</span>
            <div className="booking-input-wrap"><CalendarDays size={16} aria-hidden="true" /><input aria-label="Check-in date" type="date" required min={minDate || undefined} value={checkIn} onChange={(event) => { setCheckIn(event.target.value); if (checkOut && event.target.value >= checkOut) setCheckOut(""); }} /></div>
          </label>
          <label className="booking-field">
            <span>Check-out</span>
            <div className="booking-input-wrap"><CalendarDays size={16} aria-hidden="true" /><input aria-label="Check-out date" type="date" required min={checkIn ? addOneDay(checkIn) : minDate || undefined} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></div>
          </label>
          <label className="booking-field booking-field--compact">
            <span>Guests</span>
            <div className="booking-input-wrap"><select aria-label="Number of adults" value={adults} onChange={(event) => setAdults(event.target.value)}><option value="1">1 adult</option><option value="2">2 adults</option><option value="3">3 adults</option><option value="4">4 adults</option><option value="5">5 adults</option><option value="6">6 adults</option></select><ChevronDown size={14} aria-hidden="true" /></div>
          </label>
          <label className="booking-field booking-field--compact">
            <span>Rooms</span>
            <div className="booking-input-wrap"><select aria-label="Number of rooms" value={roomCount} onChange={(event) => setRoomCount(event.target.value)}><option value="1">1 room</option><option value="2">2 rooms</option><option value="3">3 rooms</option><option value="4">4 rooms</option><option value="5">5 rooms</option></select><ChevronDown size={14} aria-hidden="true" /></div>
          </label>
          <button className="button button--coral booking-submit" type="submit" disabled={availabilityBusy}>
            {availabilityBusy ? <span className="button-spinner" /> : <>Check availability <ArrowRight size={16} /></>}
          </button>
          {availabilityFeedback && <div className={`availability-feedback feedback-${availabilityFeedback.kind}`} role="status">{availabilityFeedback.kind === "success" ? <Check size={15} /> : <X size={15} />}{availabilityFeedback.message}</div>}
        </form>
        <div className="hero-scroll-note"><span>Scroll to discover</span><span className="hero-scroll-line" /></div>
      </section>

      <section className="service-ribbon" aria-label="A stay at Savanna Grand">
        <div className="service-ribbon-inner page-width">
          <div className="service-ribbon-item"><span><Waves size={21} strokeWidth={1.5} /></span><div><strong>Lakefront living</strong><small>Let the day slow down</small></div></div>
          <div className="service-ribbon-item"><span><ConciergeBell size={21} strokeWidth={1.5} /></span><div><strong>Thoughtful service</strong><small>Here when you need us</small></div></div>
          <div className="service-ribbon-item"><span><UtensilsCrossed size={21} strokeWidth={1.5} /></span><div><strong>Local flavours</strong><small>Seasonal, from the source</small></div></div>
          <div className="service-ribbon-item"><span><Flower2 size={21} strokeWidth={1.5} /></span><div><strong>Room to restore</strong><small>Rituals at the spa</small></div></div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="page-width about-layout">
          <div className="about-visual reveal-up">
            <div className="about-main-photo">
              <HotelImage src="/images/hero-2.jpg" alt="A warm, quiet guest suite at Savanna Grand" fill sizes="(max-width: 800px) 90vw, 47vw" />
              <div className="about-photo-label"><span>01 / 03</span><span>Come away a little</span></div>
            </div>
            <div className="about-small-photo"><HotelImage src="/images/hero-3.jpg" alt="Lantern-lit terrace overlooking the lake" fill sizes="(max-width: 800px) 45vw, 20vw" /></div>
            <div className="about-seal"><span>SG</span><small>made for<br />the moments</small></div>
          </div>
          <div className="about-copy reveal-up">
            <p className="eyebrow"><span className="eyebrow-mark" /> A little about us</p>
            <h2>Make space for<br /><em>the extraordinary.</em></h2>
            <p className="body-copy">On the shores of Lake Naivasha, the Savanna Grand is a place to pause between worlds. Wake to water and birdsong, follow the day&apos;s own rhythm, and return to warm hospitality that feels like it has always known you.</p>
            <p className="body-copy body-copy--muted">A considered stay, shaped by the spirit of the Rift Valley and the simple pleasure of feeling right at home.</p>
            <div className="about-stats">
              <div className="about-stat"><span className="about-stat-icon"><Star size={12} fill="currentColor" /></span><strong>5<span>★</span></strong><small>Star-rated comfort</small></div>
              <div className="about-stat"><span className="about-stat-icon"><BedDouble size={13} /></span><strong>50<span>+</span></strong><small>Rooms &amp; suites</small></div>
              <div className="about-stat"><span className="about-stat-icon"><CalendarCheck2 size={12} /></span><strong>20</strong><small>Years of experience</small></div>
            </div>
            <a className="text-link" href="#facilities">Discover our story <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>

      <section id="rooms" className="section rooms-section">
        <div className="page-width">
          <div className="section-heading section-heading--split reveal-up">
            <div><p className="eyebrow"><span className="eyebrow-mark" /> A place to call yours</p><h2>Find your room<br /><em>to roam.</em></h2></div>
            <div className="section-heading-aside"><p>From a soft landing to your own private villa, every stay has a little more room for wonder.</p><div className="carousel-controls"><button type="button" aria-label="Scroll rooms left" onClick={() => scrollRooms(-1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Scroll rooms right" onClick={() => scrollRooms(1)}><ArrowRight size={18} /></button></div></div>
          </div>
          <div className="room-track" ref={roomTrackRef} aria-label="Room and suite options">
            {rooms.map((room, index) => (
              <article className="room-card" key={room.id}>
                <button className="room-card-image" type="button" onClick={() => setRoomModal(room)} aria-label={`View ${room.name}`}>
                  <HotelImage src={room.image} alt={room.alt} fill sizes="(max-width: 640px) 84vw, (max-width: 1024px) 48vw, 32vw" />
                  <span className="room-index">0{index + 1} / 05</span><span className="room-image-arrow"><ArrowUpRight size={18} /></span>
                </button>
                <div className="room-card-body">
                  <div className="room-meta"><span>{room.size} sqm</span><span className="meta-divider" /><span>Up to {room.guests} guests</span></div>
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                  <div className="room-amenities"><span><Wifi size={14} /> Wi-Fi</span><span><Coffee size={14} /> Breakfast</span><span><Bath size={14} /> Ensuite</span></div>
                  <div className="room-card-bottom"><div className="room-price"><small>From</small><strong>KES {formatKes(room.price)}</strong><span>/ night</span></div><button type="button" className="room-view-link" onClick={() => setRoomModal(room)}>View room <ArrowUpRight size={14} /></button></div>
                </div>
              </article>
            ))}
          </div>
          <div className="rooms-footnote"><span><Check size={14} /> Best rate when you book direct</span><button type="button" className="text-link" onClick={scrollToBooking}>Plan your stay <ArrowUpRight size={15} /></button></div>
        </div>
      </section>

      <section id="dining" className="dining-section section">
        <div className="page-width dining-layout">
          <div className="dining-copy reveal-up">
            <p className="eyebrow eyebrow--light"><span className="eyebrow-mark" /> Gather around</p>
            <h2>Good things<br />come to <em>the table.</em></h2>
            <p className="dining-name">Savanna Kitchen</p>
            <p className="dining-description">A generous taste of the Rift Valley, with garden-fresh produce, familiar favourites and a little something unexpected.</p>
            <div className="dining-details"><span><Clock3 size={17} /> Daily, 7:00 am – 10:30 pm</span><span><UtensilsCrossed size={17} /> East African &amp; seasonal cuisine</span></div>
            <a className="button button--coral" href={whatsappLink("Hello! I'd like to reserve a table at Savanna Kitchen.")} target="_blank" rel="noreferrer">Reserve a table <ArrowUpRight size={16} /></a>
          </div>
          <div className="dining-gallery reveal-up">
            <button type="button" className="dining-photo dining-photo--main" onClick={() => setActiveGallery(2)} aria-label="View seasonal dining at Savanna Kitchen">
              <HotelImage src="/images/dining-food.jpg" alt="A seasonal dish prepared at Savanna Kitchen" fill sizes="(max-width: 800px) 90vw, 32vw" /><span className="dining-photo-tag">From our kitchen</span><span className="dining-photo-title">Rooted in the season</span>
            </button>
            <button type="button" className="dining-photo dining-photo--top" onClick={() => setActiveGallery(5)} aria-label="View the Savanna Kitchen dining room">
              <HotelImage src="/images/dining-interior.jpg" alt="Warm, candlelit dining room at Savanna Kitchen" fill sizes="(max-width: 800px) 45vw, 24vw" /><span className="dining-photo-title">Settle in, stay awhile</span>
            </button>
            <button type="button" className="dining-photo dining-photo--bottom" onClick={() => setActiveGallery(3)} aria-label="View the lakeside terrace at sunset">
              <HotelImage src="/images/hero-3.jpg" alt="A lakeside terrace in the last light of day" fill sizes="(max-width: 800px) 45vw, 24vw" /><span className="dining-photo-title">Supper in the open air</span>
            </button>
          </div>
        </div>
      </section>

      <section id="spa" className="section spa-section">
        <div className="page-width spa-layout">
          <div className="spa-visual reveal-up">
            <HotelImage src="/images/hero-3.jpg" alt="A peaceful lake view at golden hour, the perfect setting to unwind" fill sizes="(max-width: 800px) 90vw, 46vw" />
            <div className="spa-image-shade" />
            <div className="spa-visual-caption"><span>01</span><span>The art of slowing down</span></div>
            <div className="spa-roundel"><Sparkles size={20} /><span>Pause<br />here</span></div>
          </div>
          <div className="spa-copy reveal-up">
            <p className="eyebrow"><span className="eyebrow-mark" /> Savanna Spa &amp; Wellness</p>
            <h2>Let the outside<br /><em>wait a while.</em></h2>
            <p className="body-copy">A gentle return to yourself. Choose a restorative treatment, find your breath by the water, and leave the day a little lighter.</p>
            <div className="spa-list">
              {spaServices.map(({ title, duration, price, Icon }) => <div className="spa-service" key={title}><span className="spa-icon"><Icon size={18} strokeWidth={1.5} /></span><span className="spa-service-copy"><strong>{title}</strong><small>{duration}</small></span><span className="spa-service-price">{price}</span></div>)}
            </div>
            <a className="button button--navy" href={whatsappLink("Hello! I'd like to book a spa treatment at Savanna Grand.")} target="_blank" rel="noreferrer">Book a spa ritual <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>

      <section id="facilities" className="facilities-section section">
        <div className="page-width">
          <div className="section-heading section-heading--center reveal-up"><p className="eyebrow"><span className="eyebrow-mark" /> The good things, included</p><h2>Everything in <em>its place.</em></h2><p className="section-intro">All the little comforts that help you feel at home, with a few good reasons to stay in.</p></div>
          <div className="facilities-grid">
            {facilities.map(({ label, detail, Icon }) => <div className="facility-card reveal-up" key={label}><span className="facility-icon"><Icon size={23} strokeWidth={1.5} /></span><strong>{label}</strong><p>{detail}</p></div>)}
          </div>
        </div>
      </section>

      <section id="gallery" className="section gallery-section">
        <div className="page-width">
          <div className="section-heading section-heading--split gallery-heading reveal-up">
            <div><p className="eyebrow"><span className="eyebrow-mark" /> A glimpse of the good life</p><h2>Take a little<br /><em>look around.</em></h2></div>
            <p className="gallery-heading-note">The light, the landscape, the moments in between. A stay at Savanna Grand is best discovered slowly.</p>
          </div>
          <div className="gallery-grid">
            {galleryShots.map((shot, index) => <button className={`gallery-card gallery-card--${index + 1} reveal-up`} key={`${shot.src}-${index}`} type="button" onClick={() => setActiveGallery(index)} aria-label={`Open image: ${shot.title}`}>
              <HotelImage src={shot.src} alt={shot.title} fill sizes="(max-width: 700px) 48vw, (max-width: 1100px) 33vw, 25vw" style={{ objectPosition: shot.position }} />
              <span className="gallery-card-number">0{index + 1}</span><span className="gallery-card-caption">{shot.title}</span><span className="gallery-card-open"><ArrowUpRight size={17} /></span>
            </button>)}
          </div>
        </div>
      </section>

      <section className="guestbook-section section" aria-labelledby="guestbook-title">
        <div className="guestbook-inner page-width">
          <div className="guestbook-side reveal-up"><p className="eyebrow eyebrow--light"><span className="eyebrow-mark" /> Kind words</p><h2 id="guestbook-title">The moments<br />that <em>stay.</em></h2><p>Every visit leaves a story. Here are a few notes from the guestbook.</p><div className="guestbook-rating"><div className="rating-stars" aria-label="Five out of five sample rating"><Star /><Star /><Star /><Star /><Star /></div><strong>{activeReview.rating}<span> / 5</span></strong><small>Illustrative sample · Google &amp; TripAdvisor</small></div></div>
          <div className="guestbook-quote-wrap reveal-up"><div className="guestbook-quote-mark"><Quote size={34} /></div><blockquote>“{activeReview.quote}”</blockquote><div className="guestbook-author"><div className="guestbook-avatar">{activeReview.name.slice(0, 1)}</div><div><strong>{activeReview.name}</strong><span>{activeReview.country}</span></div><span className="guestbook-source">{activeReview.source}</span></div><div className="guestbook-controls"><div className="guestbook-dots" aria-label="Guest stories">{guestNotes.map((note, index) => <button key={note.name} type="button" aria-label={`Show guest story ${index + 1}`} aria-pressed={activeGuest === index} className={activeGuest === index ? "is-active" : ""} onClick={() => setActiveGuest(index)} />)}</div><div className="carousel-controls carousel-controls--light"><button type="button" aria-label="Previous guest story" onClick={() => setActiveGuest((current) => (current - 1 + guestNotes.length) % guestNotes.length)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next guest story" onClick={() => setActiveGuest((current) => (current + 1) % guestNotes.length)}><ArrowRight size={18} /></button></div></div></div>
        </div>
      </section>

      <section id="offers" className="section offers-section">
        <div className="page-width">
          <div className="section-heading section-heading--split reveal-up"><div><p className="eyebrow"><span className="eyebrow-mark" /> Make a little more of it</p><h2>A good stay,<br /><em>made even better.</em></h2></div><div className="section-heading-aside"><p>Thoughtful extras, made for the moments you came here to find. Ask our team about dates and details.</p><a className="text-link" href={quickWhatsApp} target="_blank" rel="noreferrer">Ask about an offer <ArrowUpRight size={16} /></a></div></div>
          <div className="offers-grid">
            {packages.map((offer) => <article className={`offer-card ${offer.className} reveal-up`} key={offer.number}><div className="offer-card-top"><span>{offer.number} / SAVANNA GRAND</span><Sparkles size={18} /></div><p className="offer-note">{offer.note}</p><h3>{offer.name}</h3><div className="offer-price"><strong>{offer.price}</strong><span>{offer.unit}</span></div><ul>{offer.benefits.map((benefit) => <li key={benefit}><Check size={15} /> {benefit}</li>)}</ul><a href={whatsappLink(`Hello! I'd like to enquire about the ${offer.name} package at Savanna Grand.`)} target="_blank" rel="noreferrer" className="offer-link">Enquire via WhatsApp <ArrowUpRight size={15} /></a></article>)}
          </div>
        </div>
      </section>

      <section id="location" className="location-section section">
        <div className="page-width location-layout">
          <div className="location-copy reveal-up"><p className="eyebrow"><span className="eyebrow-mark" /> Find your way here</p><h2>Naivasha is<br /><em>calling.</em></h2><p className="body-copy">Settle in on the shores of Lake Naivasha, in the heart of Kenya&apos;s Great Rift Valley. A restorative escape, with a little adventure just beyond the gate.</p><div className="location-address"><MapPin size={19} /><div><strong>Savanna Grand Hotel &amp; Spa</strong><span>Naivasha, Nakuru County<br />Kenya</span></div></div><a className="button button--navy" href="https://www.google.com/maps/search/?api=1&query=Savanna+Grand+Hotel+%26+Spa%2C+Naivasha%2C+Kenya" target="_blank" rel="noreferrer">Get directions <Navigation size={16} /></a><div className="nearby-list"><strong>Make a day of it</strong><span><Mountain size={15} /> Hell&apos;s Gate National Park</span><span><Waves size={15} /> Crescent Island Sanctuary</span><span><Mountain size={15} /> Mount Longonot</span><span><Navigation size={15} /> Lake Naivasha boat trips</span></div></div>
          <div className="map-frame reveal-up"><iframe title="Map centered on Naivasha, Kenya" src="https://www.google.com/maps?q=Lake%20Naivasha%2C%20Kenya&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><div className="map-label"><span className="map-pin-mark"><MapPin size={18} /></span><div><strong>Savanna Grand</strong><small>Lake Naivasha · Kenya</small></div><span className="map-label-east">RIFT VALLEY</span></div></div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="page-width contact-layout">
          <div className="contact-intro reveal-up"><p className="eyebrow eyebrow--light"><span className="eyebrow-mark" /> Make it yours</p><h2>Your stay<br />starts <em>here.</em></h2><p>Tell us a little about your plans and our reservations team will be in touch to help shape your stay.</p><div className="contact-direct"><a href={`tel:${phoneNumber}`}><Phone size={17} /> +254 112 272 061</a><a href="mailto:reservations@savannagrand.co.ke"><Mail size={17} /> reservations@savannagrand.co.ke</a><span><Clock3 size={17} /> Reservations · 24 hours</span></div><a className="contact-whatsapp" href={quickWhatsApp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Prefer WhatsApp? Start a conversation <ArrowUpRight size={15} /></a></div>
          <form id="booking" className="booking-form reveal-up" onSubmit={submitBooking}>
            <div className="booking-form-heading"><div><span className="form-step">01 / YOUR ENQUIRY</span><h3>Let&apos;s plan something lovely.</h3></div><span className="form-heading-icon"><CalendarCheck2 size={21} /></span></div>
            <div className="form-grid">
              <label className="form-field"><span>Full name <i>*</i></span><input name="name" type="text" placeholder="Your name" autoComplete="name" minLength={2} maxLength={100} required /></label>
              <label className="form-field"><span>Email address <i>*</i></span><input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
              <label className="form-field"><span>Phone number <i>*</i></span><input name="phone" type="tel" placeholder="+254 ..." autoComplete="tel" required /></label>
              <label className="form-field"><span>Room type <i>*</i></span><select name="roomType" defaultValue="superior" required>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select></label>
              <label className="form-field"><span>Check-in <i>*</i></span><input name="checkIn" type="date" min={minDate || undefined} required value={checkIn} onChange={(event) => { setCheckIn(event.target.value); if (checkOut && event.target.value >= checkOut) setCheckOut(""); }} /></label>
              <label className="form-field"><span>Check-out <i>*</i></span><input name="checkOut" type="date" min={checkIn ? addOneDay(checkIn) : minDate || undefined} required value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
              <label className="form-field"><span>Adults</span><select name="adults" value={adults} onChange={(event) => setAdults(event.target.value)}><option value="1">1 adult</option><option value="2">2 adults</option><option value="3">3 adults</option><option value="4">4 adults</option><option value="5">5 adults</option><option value="6">6 adults</option></select></label>
              <label className="form-field"><span>Rooms</span><select name="rooms" value={roomCount} onChange={(event) => setRoomCount(event.target.value)}><option value="1">1 room</option><option value="2">2 rooms</option><option value="3">3 rooms</option><option value="4">4 rooms</option><option value="5">5 rooms</option></select></label>
              <label className="form-field form-field--full"><span>Special requests</span><textarea name="specialRequests" rows={3} maxLength={2000} placeholder="A celebration, a dietary note, or anything else we should know?" /></label>
            </div>
            <div className="booking-form-footer"><p><ShieldCheck size={15} /> No payment is taken now. Your stay is confirmed by our team.</p><button className="button button--coral" type="submit" disabled={bookingBusy}>{bookingBusy ? <span className="button-spinner" /> : <>Send enquiry <ArrowRight size={16} /></>}</button></div>
            {bookingFeedback && <p className={`form-feedback feedback-${bookingFeedback.kind}`} role="status">{bookingFeedback.kind === "success" ? <Check size={16} /> : <X size={16} />}{bookingFeedback.message}</p>}
          </form>
        </div>
      </section>

      <section className="contact-note-section">
        <div className="page-width contact-note-layout">
          <div><p className="eyebrow"><span className="eyebrow-mark" /> A note is always welcome</p><h2>Something on your mind?</h2><p>For a question, a celebration or a little help planning, send a note to our team.</p></div>
          <form className="quick-contact-form" onSubmit={submitContact}>
            <label><span className="sr-only">Your name</span><input name="name" type="text" placeholder="Your name" autoComplete="name" required /></label>
            <label><span className="sr-only">Your email</span><input name="email" type="email" placeholder="Email address" autoComplete="email" required /></label>
            <label className="quick-contact-message"><span className="sr-only">Your message</span><input name="message" type="text" placeholder="How can we help?" minLength={5} required /></label>
            <button className="button button--navy" type="submit" disabled={contactBusy}>{contactBusy ? <span className="button-spinner" /> : <>Send a note <ArrowRight size={16} /></>}</button>
            {contactFeedback && <p className={`form-feedback feedback-${contactFeedback.kind}`} role="status">{contactFeedback.kind === "success" ? <Check size={16} /> : <X size={16} />}{contactFeedback.message}</p>}
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-width footer-main">
          <div className="footer-brand-column"><a className="brand brand--footer" href="#home"><span className="brand-mark" aria-hidden="true"><span>S</span><i>G</i></span><span className="brand-copy"><strong>Savanna Grand</strong><small>Hotel <i>&</i> Spa · Naivasha</small></span></a><p>A slower kind of stay, on the quiet shores of Lake Naivasha.</p><div className="footer-socials"><a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer"><span>ig</span></a><a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer"><span>f</span></a><a href="https://www.tripadvisor.com/" aria-label="Tripadvisor" target="_blank" rel="noreferrer"><span>tA</span></a></div></div>
          <div className="footer-links-column"><h3>Explore</h3><a href="#about">Our story</a><a href="#rooms">Rooms &amp; suites</a><a href="#dining">Savanna Kitchen</a><a href="#spa">Spa &amp; wellness</a><a href="#offers">Offers &amp; packages</a></div>
          <div className="footer-links-column"><h3>Find us</h3><a href="#location">Naivasha, Kenya</a><a href={`tel:${phoneNumber}`}>+254 112 272 061</a><a href="mailto:reservations@savannagrand.co.ke">Email reservations</a><a href="#contact">Contact &amp; booking</a><span className="footer-opening"><Clock3 size={14} /> Always here to help</span></div>
          <div className="footer-newsletter"><h3>A little note from the lake</h3><p>Occasional news, good offers and reasons to return.</p><form className="newsletter-form" onSubmit={submitNewsletter}><label><span className="sr-only">Email address for newsletter</span><input name="email" type="email" placeholder="Your email address" required /></label><button type="submit" aria-label="Sign up for the newsletter" disabled={newsletterBusy}>{newsletterBusy ? <span className="button-spinner" /> : <ArrowRight size={17} />}</button></form>{newsletterFeedback && <p className={`newsletter-feedback feedback-${newsletterFeedback.kind}`} role="status">{newsletterFeedback.message}</p>}<div className="footer-trust"><span><ShieldCheck size={15} /> Best rate guarantee</span><span><Check size={15} /> Free cancellation</span></div></div>
        </div>
        <div className="footer-bottom"><div className="page-width footer-bottom-inner"><p>© {new Date().getFullYear()} Savanna Grand Hotel &amp; Spa. All rights reserved.</p><div className="footer-payments"><span>We accept</span><b className="mpesa-mark">M-PESA</b><b className="visa-mark">VISA</b><b className="mastercard-mark"><i /><i /> Mastercard</b></div><a href="https://www.themevault.net/" className="template-credit" target="_blank" rel="noreferrer">Template inspiration by ThemeVault</a><a href="#home" className="back-to-top">Back to top <ArrowUpRight size={14} /></a></div></div>
      </footer>

      <a className="whatsapp-float" href={quickWhatsApp} target="_blank" rel="noreferrer" aria-label="Book a room instantly on WhatsApp"><span className="whatsapp-float-tooltip">Book a Room Instantly <span>🌿</span></span><MessageCircle size={25} strokeWidth={1.8} /><span className="whatsapp-pulse" /></a>
      <div className="mobile-booking-bar" aria-label="Quick contact options"><a href="#booking" onClick={() => setMenuOpen(false)}><CalendarDays size={17} /><span>Book</span></a><a href={quickWhatsApp} target="_blank" rel="noreferrer"><MessageCircle size={17} /><span>WhatsApp</span></a><a href={`tel:${phoneNumber}`}><Phone size={17} /><span>Call</span></a></div>
      <div className="cursor-dot" ref={cursorDotRef} aria-hidden="true" /><div className="cursor-ring" ref={cursorRingRef} aria-hidden="true" />

      {roomModal && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setRoomModal(null); }}><div className="room-dialog" role="dialog" aria-modal="true" aria-labelledby="room-dialog-title" tabIndex={-1}><button type="button" className="dialog-close" onClick={() => setRoomModal(null)} aria-label="Close room details"><X size={20} /></button><div className="room-dialog-image"><HotelImage src={roomModal.image} alt={roomModal.alt} fill sizes="(max-width: 700px) 95vw, 50vw" /></div><div className="room-dialog-copy"><p className="eyebrow"><span className="eyebrow-mark" /> {roomModal.size} sqm · Sleeps {roomModal.guests}</p><h2 id="room-dialog-title">{roomModal.name}</h2><p>{roomModal.description}</p><div className="room-dialog-amenities">{roomModal.amenities.map((amenity) => <span key={amenity}><Check size={14} /> {amenity}</span>)}</div><div className="room-dialog-bottom"><div><small>From</small><strong>KES {formatKes(roomModal.price)} <small>/ night</small></strong></div><button type="button" className="button button--coral" onClick={() => { setRoomModal(null); window.setTimeout(scrollToBooking, 100); }}>Enquire now <ArrowRight size={16} /></button></div></div></div></div>}

      {activeShot && activeGallery !== null && <div className="lightbox-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveGallery(null); }}><div className="lightbox-dialog" role="dialog" aria-modal="true" aria-label={`Gallery image: ${activeShot.title}`}><button className="dialog-close lightbox-close" type="button" onClick={() => setActiveGallery(null)} aria-label="Close gallery"><X size={21} /></button><button className="lightbox-arrow lightbox-arrow--left" type="button" aria-label="Previous image" onClick={() => setActiveGallery((activeGallery - 1 + galleryShots.length) % galleryShots.length)}><ArrowLeft size={21} /></button><div className="lightbox-image"><HotelImage src={activeShot.src} alt={activeShot.title} fill sizes="95vw" priority /></div><button className="lightbox-arrow lightbox-arrow--right" type="button" aria-label="Next image" onClick={() => setActiveGallery((activeGallery + 1) % galleryShots.length)}><ArrowRight size={21} /></button><div className="lightbox-caption"><span>{activeShot.title}</span><small>0{activeGallery + 1} / 12</small></div></div></div>}
    </main>
  );
}
