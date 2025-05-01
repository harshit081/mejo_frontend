import Image from "next/image";
import { motion } from "framer-motion";

const team = [
  {
    image: "/images/harshit.jpg",
    name: "Harshit Tiwari",
    role: "Backend Dev",
    bio: "Passionate about mental wellness and technology",
  },
  {
    image: "/images/muskan.jpg",
    name: "Mushkan Chandravanshi",
    role: "UI UX Designer",
    bio: "Creating intuitive and beautiful interfaces for digital wellbeing",
  },
  {
    image: "/images/nigga.jpg",
    name: "Samagra Singh",
    role: "Frontend Dev",
    bio: "Frontend developer with a love for clean code and user experience ",
  },
  {
    image: "/images/rio.jpg",
    name: "Rio Deb",
    role: "Integration Engineer",
    bio: "Expert in mindfulness and digital content creation",
  },
];

export const Team = () => {
  return (
    <main className="py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-[#656cf3] via-[#fa7c0b] to-[#8d56eb] bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <p className="mt-6 text-2xl text-gray-600 max-w-3xl mx-auto">
            The passionate minds behind Mejo working together to create the best
            journaling experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {team.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                {member.name}
              </h3>
              <p className="text-lg text-purple-600 font-medium mb-3">
                {member.role}
              </p>
              <p className="text-gray-600">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};
