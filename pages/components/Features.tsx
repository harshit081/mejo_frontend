import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: "✨",
    title: "Beautiful Interface",
    description:
      "A clean, distraction-free writing environment designed for focus and creativity",
    image: "/images/features/interface.jpg"
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description:
      "Your thoughts are encrypted and protected. Only you can access your journal",
    // image: "/images/features/security.jpg"
  },
  {
    icon: "🎯",
    title: "Smart Organization",
    description:
      "Easily organize entries with tags, search, and AI-powered insights",
    // image: "/images/features/organization.jpg"
  },
];

export const Features = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/background.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          backgroundSize: 'cover'
        }}
      />
      <div className="relative z-10 py-24 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900">
              Features
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to journal mindfully
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white/60 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-white/70 border border-white/20 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                  {/* <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    priority={index === 0}
                  /> */}
                </div>
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
