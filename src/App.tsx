/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Zap, 
  Award, 
  Home, 
  Users, 
  ArrowRight,
  Star,
  Building2,
  Trees,
  Dumbbell,
  Car,
  Cctv,
  Coffee
} from 'lucide-react';

import { generateProjectImage } from './services/imageService';

// --- Types ---
interface Project {
  id: number;
  title: string;
  location: string;
  description: string;
  image: string;
  category: string;
}

interface Amenity {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// --- Data ---
const PROJECTS_DATA: Omit<Project, 'image'>[] = [
  {
    id: 1,
    title: "The Royal Estate",
    location: "South Mumbai",
    description: "Ultra-luxurious 4 & 5 BHK residences with panoramic sea views.",
    category: "Residential"
  },
  {
    id: 2,
    title: "Emerald Townships",
    location: "Pune West",
    description: "A sprawling 100-acre integrated township with world-class amenities.",
    category: "Township"
  },
  {
    id: 3,
    title: "Bronze Heights",
    location: "Gurgaon Sector 65",
    description: "Modern architectural marvel offering sophisticated urban living.",
    category: "Residential"
  }
];

const AMENITIES: Amenity[] = [
  { icon: <Building2 className="w-8 h-8" />, title: "Grand Clubhouse", description: "A 50,000 sq.ft. space for social gatherings and leisure." },
  { icon: <Trees className="w-8 h-8" />, title: "Landscaped Gardens", description: "Thematic gardens designed by international landscape architects." },
  { icon: <Dumbbell className="w-8 h-8" />, title: "Elite Gymnasium", description: "State-of-the-art fitness center with personal trainers." },
  { icon: <Coffee className="w-8 h-8" />, title: "Sky Lounge", description: "Rooftop lounge with breathtaking city views." },
  { icon: <Cctv className="w-8 h-8" />, title: "24/7 Security", description: "Multi-tier security system with smart surveillance." },
  { icon: <Car className="w-8 h-8" />, title: "Valet Parking", description: "Ample parking space with dedicated valet services." }
];

const TESTIMONIALS = [
  { name: "Vikram Malhotra", role: "CEO, Tech Solutions", text: "Ramdev Builders delivered more than just a home; they delivered a lifestyle. The attention to detail is unparalleled." },
  { name: "Ananya Sharma", role: "Interior Designer", text: "As a designer, I appreciate the architectural brilliance and the quality of materials used in their projects." },
  { name: "Rajesh Gupta", role: "Investment Banker", text: "The appreciation value of Ramdev properties is consistently high. A trusted name in the industry." }
];

// --- Components ---

const Logo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative flex items-end gap-1 h-8">
      <div className="w-1.5 h-4 gold-gradient rounded-sm transform group-hover:scale-y-110 transition-transform duration-300" />
      <div className="w-1.5 h-7 gold-gradient rounded-sm transform group-hover:scale-y-110 transition-transform duration-300 delay-75" />
      <div className="w-1.5 h-5 gold-gradient rounded-sm transform group-hover:scale-y-110 transition-transform duration-300 delay-150" />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-serif font-bold tracking-[0.2em] text-white leading-none">RAMDEV</span>
      <span className="text-[8px] tracking-[0.3em] text-gold font-bold uppercase">Developers & Builders</span>
    </div>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Logo />

        <div className="hidden lg:flex items-center gap-10">
          {['Home', 'About', 'Projects', 'Amenities', 'Gallery', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium tracking-widest uppercase hover:text-gold transition-colors">
              {item}
            </a>
          ))}
          <button className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 text-xs font-bold tracking-widest uppercase">
            Enquire Now
          </button>
        </div>

        <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 lg:hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {['Home', 'About', 'Projects', 'Amenities', 'Gallery', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-lg font-serif tracking-widest uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920");

  useEffect(() => {
    const loadHero = async () => {
      const img = await generateProjectImage("A cinematic, ultra-luxurious real estate development hero image. A futuristic yet elegant architectural masterpiece, a mix of glass, gold accents, and lush tropical greenery. Sunset lighting, 8k resolution, architectural photography style, inspired by Della Townships resort luxury.");
      if (img) setHeroImage(img);
    };
    loadHero();
  }, []);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Luxury Architecture" 
          className="w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1920";
          }}
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />

      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-gold tracking-[0.5em] uppercase text-sm font-bold mb-6 block">Crafting Legacies Since 2005</span>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 leading-tight">
            Elevate Your <br />
            <span className="text-gold-gradient italic">Lifestyle</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-12 font-light leading-relaxed">
            Experience the pinnacle of luxury living with Ramdev Builders. We create architectural masterpieces that redefine sophistication and comfort.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-10 py-4 gold-gradient text-black font-bold tracking-widest uppercase hover:scale-105 transition-transform">
              Explore Projects
            </button>
            <button className="px-10 py-4 border border-white/30 hover:border-gold hover:text-gold transition-all tracking-widest uppercase">
              Enquire Now
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-gold rounded-full" />
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const [aboutImages, setAboutImages] = useState([
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&q=80&w=400"
  ]);

  useEffect(() => {
    const loadAbout = async () => {
      const prompts = [
        "Modern architectural grid facade, glass and steel, luxury building detail, high-end design.",
        "Luxury building entrance, marble and gold accents, architectural photography, premium aesthetic.",
        "Close-up of high-end architectural materials, bronze and glass textures, modern lines.",
        "Sleek architectural lines of a modern luxury skyscraper, futuristic design."
      ];
      const loaded = await Promise.all(prompts.map(p => generateProjectImage(p)));
      setAboutImages(prev => loaded.map((img, i) => img || prev[i]));
    };
    loadAbout();
  }, []);

  return (
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-lg mx-auto lg:mx-0"
          >
            <div className="grid grid-cols-2 gap-4">
              {aboutImages.map((img, idx) => (
                <div key={idx} className="aspect-square overflow-hidden rounded-xl border border-white/5">
                  <img 
                    src={img} 
                    alt={`Architecture Detail ${idx}`} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-luxury-blue p-8 rounded-2xl border border-gold/20 hidden md:block shadow-2xl z-10">
              <div className="text-4xl font-serif font-bold text-gold mb-1">21+</div>
              <div className="text-[10px] tracking-widest uppercase text-gray-400">Years of Excellence</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold tracking-widest uppercase text-sm font-bold mb-4 block">About Ramdev Builders</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              A Vision for <br />
              <span className="italic">Timeless Spaces</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              For nearly three decades, Ramdev Builders has been at the forefront of luxury real estate development. Our philosophy is simple: to create homes that are not just structures, but legacies.
            </p>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              We combine innovative design, sustainable practices, and uncompromising quality to deliver spaces that inspire and endure. Every project is a testament to our commitment to excellence.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="text-gold font-serif text-xl mb-2">Our Vision</h4>
                <p className="text-sm text-gray-500">To be the most trusted name in luxury living across the nation.</p>
              </div>
              <div>
                <h4 className="text-gold font-serif text-xl mb-2">Our Mission</h4>
                <p className="text-sm text-gray-500">Delivering architectural marvels with transparency and integrity.</p>
              </div>
            </div>

            <button className="flex items-center gap-3 text-gold font-bold tracking-widest uppercase group">
              Learn More About Us <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const prompts = [
        "A creative and attractive luxury building project, unique architecture with curved balconies, infinity pools, and vertical gardens. High-end materials like marble and bronze. Daytime lighting, clear blue sky.",
        "A sprawling luxury township master plan, aerial view, showing elegant villas, a grand clubhouse, and winding water bodies. Lush green landscape, resort-style living.",
        "A sleek, futuristic urban skyscraper with a unique twist design, glass and bronze facade, glowing lights at dusk. Modern luxury aesthetic."
      ];

      const loadedProjects = await Promise.all(PROJECTS_DATA.map(async (p, i) => {
        const img = await generateProjectImage(prompts[i]);
        return { ...p, image: img || "https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=800" };
      }));
      setProjects(loadedProjects);
    };
    loadProjects();
  }, []);

  return (
    <section id="projects" className="py-24 bg-luxury-blue/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-gold tracking-widest uppercase text-sm font-bold mb-4 block">Our Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Featured Projects</h2>
          </div>
          <div className="flex gap-4">
            {['All', 'Residential', 'Township', 'Commercial'].map((cat) => (
              <button key={cat} className="px-6 py-2 text-xs tracking-widest uppercase border border-white/10 hover:border-gold transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <button className="w-full py-4 bg-white text-black font-bold tracking-widest uppercase text-xs">
                    View Details
                  </button>
                </div>
                <div className="absolute top-6 left-6 px-4 py-1 bg-gold text-black text-[10px] font-bold tracking-widest uppercase rounded-full">
                  {project.category}
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-gold transition-colors">{project.title}</h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4 text-gold" />
                {project.location}
              </div>
              <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MasterPlan = () => {
  const [planImage, setPlanImage] = useState("https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=1920");

  useEffect(() => {
    const loadPlan = async () => {
      const img = await generateProjectImage("An artistic, high-end architectural rendering of a luxury township master plan. Top-down view showing pools, gardens, and modern buildings. Inspired by Della Townships.");
      if (img) setPlanImage(img);
    };
    loadPlan();
  }, []);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold tracking-widest uppercase text-sm font-bold mb-4 block">The Blueprint</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Master Plan Overview</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our townships are meticulously planned to offer a harmonious blend of nature, infrastructure, and luxury. Explore the vision behind our latest development.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gold/5 border border-white/5">
          <img 
            src={planImage} 
            alt="Master Plan" 
            className="w-full h-auto brightness-75"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=1920";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-black shadow-xl"
            >
              <ChevronRight className="w-10 h-10" />
            </motion.button>
          </div>
          <div className="absolute bottom-10 left-10 right-10 flex flex-wrap justify-between items-end gap-6">
            <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 max-w-xs">
              <h4 className="text-gold font-bold mb-2">Sustainable Infrastructure</h4>
              <p className="text-xs text-gray-300">Advanced water recycling and solar energy systems integrated throughout the township.</p>
            </div>
            <div className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 max-w-xs">
              <h4 className="text-gold font-bold mb-2">Connectivity Hub</h4>
              <p className="text-xs text-gray-300">Strategic location with direct access to major highways and upcoming metro stations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Amenities = () => {
  return (
    <section id="amenities" className="py-24 bg-luxury-green/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-gold tracking-widest uppercase text-sm font-bold mb-4 block">Unmatched Lifestyle</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">World-Class Amenities</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {AMENITIES.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 group"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([
    "https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600585154526-990dcea4db0d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800"
  ]);

  useEffect(() => {
    const loadGallery = async () => {
      const prompts = [
        "Luxury living room interior, modern design, high-end furniture, gold accents, large windows. Inspired by Della Townships.",
        "Luxury bedroom interior, elegant decor, soft lighting, premium materials. Inspired by Della Townships.",
        "Luxury bathroom, marble walls, gold fixtures, standalone tub. Inspired by Della Townships.",
        "Infinity pool at dusk, luxury resort aesthetic, glowing lights. Inspired by Della Townships.",
        "Outdoor lounge area, fire pit, luxury furniture, lush greenery. Inspired by Della Townships.",
        "Grand lobby of a luxury building, high ceilings, artistic chandelier. Inspired by Della Townships."
      ];
      const loaded = await Promise.all(prompts.map(p => generateProjectImage(p)));
      setGalleryImages(prev => loaded.map((img, i) => img || prev[i]));
    };
    loadGallery();
  }, []);

  return (
    <section id="gallery" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold tracking-widest uppercase text-sm font-bold mb-4 block">Visual Journey</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Lifestyle Gallery</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((img, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-xl ${index % 3 === 1 ? 'lg:row-span-2' : ''}`}
            >
              <img 
                src={img} 
                alt={`Gallery ${index}`} 
                className="w-full h-full object-cover aspect-square lg:aspect-auto"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1600607687940-4e2a09695d51?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white tracking-widest uppercase text-xs font-bold border-b border-white pb-1">View Large</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Location = () => {
  return (
    <section className="py-24 bg-luxury-blue/20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-gold tracking-widest uppercase text-sm font-bold mb-4 block">Strategic Location</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Connected to <br />Everything</h2>
            <p className="text-gray-400 text-lg mb-10">
              Our projects are situated in prime locations that offer the perfect balance between tranquility and urban connectivity.
            </p>

            <div className="space-y-8">
              {[
                { label: "International Airport", time: "20 Mins", icon: <Zap className="w-5 h-5 text-gold" /> },
                { label: "Business District", time: "10 Mins", icon: <Building2 className="w-5 h-5 text-gold" /> },
                { label: "Elite Schools", time: "05 Mins", icon: <Award className="w-5 h-5 text-gold" /> },
                { label: "Premium Hospitals", time: "08 Mins", icon: <Shield className="w-5 h-5 text-gold" /> }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                  <span className="text-gold font-bold">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-[500px] border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1000" 
              alt="Map Placeholder" 
              className="w-full h-full object-cover brightness-50 grayscale"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1000";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gold rounded-full animate-ping absolute inset-0" />
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                  <MapPin className="text-black w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <h4 className="text-white font-bold mb-1">Ramdev Emerald Tower</h4>
              <p className="text-xs text-gray-400">Plot No. 45, Sector 18, South Mumbai, MH - 400001</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold tracking-widest uppercase text-sm font-bold mb-4 block">Client Stories</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">What Our Residents Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-luxury-blue/20 rounded-3xl border border-white/5 relative"
            >
              <Star className="text-gold w-8 h-8 mb-6 fill-gold" />
              <p className="text-gray-300 italic mb-8 leading-relaxed">"{t.text}"</p>
              <div>
                <h4 className="text-white font-bold">{t.name}</h4>
                <p className="text-gold text-xs tracking-widest uppercase">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-luxury-green/5">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <span className="text-gold tracking-widest uppercase text-sm font-bold mb-4 block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Start Your Journey <br />to Luxury</h2>
            <p className="text-gray-400 text-lg mb-12">
              Our dedicated luxury consultants are ready to help you find your dream home. Reach out to us for a private viewing or detailed project information.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Call Us</h4>
                  <p className="text-gray-400">+91 22 4567 8900</p>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Email Us</h4>
                  <p className="text-gray-400">sales@ramdevbuilders.com</p>
                  <p className="text-gray-400">info@ramdevbuilders.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Visit Us</h4>
                  <p className="text-gray-400">Ramdev Corporate Park, Level 12, <br />BKC, Mumbai - 400051</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-luxury-blue/40 p-10 rounded-3xl border border-white/10">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-gray-500 font-bold">Full Name</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:border-gold outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-gray-500 font-bold">Phone Number</label>
                  <input type="tel" className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:border-gold outline-none transition-all" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-widest uppercase text-gray-500 font-bold">Email Address</label>
                <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:border-gold outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-widest uppercase text-gray-500 font-bold">Interested In</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:border-gold outline-none transition-all appearance-none">
                  <option>The Royal Estate</option>
                  <option>Emerald Townships</option>
                  <option>Bronze Heights</option>
                  <option>Other Projects</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-widest uppercase text-gray-500 font-bold">Your Message</label>
                <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:border-gold outline-none transition-all" placeholder="Tell us about your requirements..."></textarea>
              </div>
              <button className="w-full py-5 gold-gradient text-black font-bold tracking-widest uppercase hover:scale-[1.02] transition-transform">
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-8">
              <Logo />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Redefining luxury real estate with architectural brilliance and uncompromising quality since 2005.
            </p>
            <div className="flex gap-4">
              {['FB', 'IG', 'LI', 'TW'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xs text-gray-400 hover:border-gold hover:text-gold transition-all">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 tracking-widest uppercase text-sm">Quick Links</h4>
            <ul className="space-y-4">
              {['About Us', 'Our Projects', 'Amenities', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-gold transition-colors text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 tracking-widest uppercase text-sm">Projects</h4>
            <ul className="space-y-4">
              {['The Royal Estate', 'Emerald Townships', 'Bronze Heights', 'Sapphire Villas', 'Corporate Park'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-gold transition-colors text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 tracking-widest uppercase text-sm">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-6">Subscribe to receive updates on our latest projects and offers.</p>
            <div className="flex">
              <input type="email" className="bg-white/5 border border-white/10 rounded-l-lg p-3 outline-none focus:border-gold transition-all flex-grow text-sm" placeholder="Email Address" />
              <button className="bg-gold text-black px-4 rounded-r-lg hover:bg-white transition-colors">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600 tracking-widest uppercase">
          <p>© 2026 Ramdev Builders. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms & Conditions</a>
            <a href="#" className="hover:text-gold">RERA Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black selection:bg-gold selection:text-black scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <MasterPlan />
        <Amenities />
        <Gallery />
        <Location />
        <Testimonials />
        <Contact />
      </main>
      <Footer />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-50 w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
