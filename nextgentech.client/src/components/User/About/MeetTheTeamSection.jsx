import React from "react";
import { motion } from "framer-motion";
import { Users, ChevronDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // Hiệu ứng từng card xuất hiện lần lượt
    },
  },
};

const teamMembers = [
  {
    name: "Nguyễn Lưu Minh Đăng",
    role: "Project Leader",
    bio: "Contact info: 22520190@gm.uit.edu.vn",
    image:
      "https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/479496095_2273575333028250_5618835893194945727_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=DRDNHjSHC-8Q7kNvgHlDkv3&_nc_oc=AdhxRx4KobKPt2QVoTERBxWiCcK0qXf6UOmR7kyB5ibTui6MMbVfZm0a3jMtjiIjoRhtfLyrG-EK2LJs88xdH5kg&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=AYL_FjwBoFy_Rl9eVrmpwKX&oh=00_AYDF458uuxouriUJE1DKQKkAfVt51ze4dI3jIrvUoxnPcA&oe=67CCC3EC",
  },
  {
    name: "Bùi Khánh Đang",
    role: "Member",
    bio: "Contact info: @gm.uit.edu.vn",
    image:
      "https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.6435-1/38515504_104266080512654_2683816465022320640_n.jpg?stp=c232.0.616.616a_dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_ohc=xRWrP2LuUS0Q7kNvgEnyZrU&_nc_oc=AdgguTjplSTYeHUnAWgXF3biaQskKdbiiGusXFp4qHL3FIs0DSFRPe6HdaOI0VVWCimz8w1tuLSkVzRNQHeN4lzY&_nc_zt=24&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=AqmzsRuOA77z408HVRXO-1V&oh=00_AYBPw8T2ZVMMqw2BU1KXFRfdR6VUzjb9iThzz5QitAUIUw&oe=67EE6226",
  },
  {
    name: "Đặng Đạt Phát",
    role: "Member",
    bio: "Contact info: @gm.uit.edu.vn",
    image:
      "https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-1/432724266_122128019222207728_5974449286739924673_n.jpg?stp=c11.0.938.938a_dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=MBJpnewxYxMQ7kNvgGQAQB2&_nc_oc=AdiV-PbWXR6ixfdkw0g_FNND-vd58EGZsoYCd9prqOaQTLO3Rfr1p6klOTg1S5X9venTfNo7aVDNKZfq6BEz_ztO&_nc_zt=24&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=AY-BQhSuR4HwsquA5EGaKyA&oh=00_AYBRyVfpFoTK79PmtsJqs_Mi9YsS1njWqdDb4zwxMCTF3Q&oe=67CCBF6C",
  },
];

const MeetTheTeamSection = () => {
  return (
    <section className="bg-background  bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 rounded-4xl">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        {/* Tiêu đề */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-primary-300">
              Meet the Team
            </h2>
          </div>
          <h3 className="text-4xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-bold mb-2">
            The Experts Behind NextGenTech
          </h3>
          <p className="text-muted-foreground text-gray-600 text-base font-medium">
            Our diverse team of tech enthusiasts and e-commerce experts are
            passionate about bringing you the best products and shopping
            experience.
          </p>
        </motion.div>

        {/* Danh sách thành viên nhóm */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={fadeUp}>
              <div className="group bg-card border rounded-xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg mb-1">{member.name}</h4>
                  <p className="text-primary font-medium text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MeetTheTeamSection;
