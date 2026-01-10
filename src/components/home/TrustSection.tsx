import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    rating: 5,
    title: "24/7 Amazing Support",
    content: "Echipa de suport este incredibilă. Au rezolvat problema mea într-un timp record, chiar și în weekend la 3 dimineața. Recomand cu încredere!",
    author: "Alex M.",
  },
  {
    rating: 5,
    title: "Easy to understand!",
    content: "Panoul de control este super intuitiv. Am reușit să-mi configurez serverul de Minecraft în mai puțin de 10 minute. Perfect pentru începători!",
    author: "Maria P.",
  },
  {
    rating: 5,
    title: "Reliable Services",
    content: "De 2 ani folosesc VPS-ul lor pentru proiectele mele. Zero downtime, performanță constantă. Cel mai bun hosting pe care l-am avut.",
    author: "Andrei C.",
  },
];

export function TrustSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Trusted by Gamers Worldwide
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Experience why thousands of players choose our hosting for their gaming communities. 
              With 99.9% uptime and 24/7 support, we keep your game running smoothly.
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg border border-border hover:border-primary/50 text-sm transition-colors"
            >
              Review us on →
            </Link>
          </motion.div>

          {/* Testimonials */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`glass-card p-5 ${index === activeIndex ? "border-primary/40" : ""}`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <h4 className="font-semibold text-foreground mb-2">{testimonial.title}</h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                  {testimonial.content}
                </p>
                <p className="text-xs text-primary">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
