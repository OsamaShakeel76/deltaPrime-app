import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Lightbulb, Heart, Award, Globe } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type LeadershipMember = {
  name: string;
  role: string;
  bio: string;
  skills: string[];
};

const leadershipTeam: LeadershipMember[] = [
  {
    name: "Rayan Ahmad",
    role: "QA Specialist",
    bio: "Focused on ensuring product reliability through smart test strategies, automation, and quality-driven delivery.",
    skills: ["Automation Testing", "Manual Testing", "Test Strategy", "Bug Reporting"],
  },
  {
    name: "Osama Shakeel",
    role: "Senior AI Engineer",
    bio: "Builds AI systems including LLM apps, RAG chatbots, and intelligent automation for real business use-cases.",
    skills: ["LLMs", "RAG", "LangChain", "AI Agents", "Python"],
  },
  {
    name: "Humza",
    role: "MERN Stack Developer",
    bio: "Develops scalable full-stack products using modern MERN tools with clean UI and production-ready architecture.",
    skills: ["MongoDB", "Express", "React", "Node.js", "REST APIs"],
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We push boundaries and embrace new technologies to deliver cutting-edge solutions.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description:
      "Transparency and honesty guide every decision we make and every solution we build.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Quality is non-negotiable. We strive for excellence in everything we do.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const [selectedMember, setSelectedMember] = useState<LeadershipMember | null>(null);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">DeltaPrime</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We&apos;re a team of engineers, strategists, and builders dedicated to
              transforming businesses through intelligent technology solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                <span>Our Mission</span>
              </div>

              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                AI That Works for Real Businesses
              </h2>

              <p className="text-muted-foreground mb-6">
                At DeltaPrime, we design AI solutions that deliver real impact — not hype.
                Our focus is on building practical, scalable, and intelligent systems that
                help businesses automate, innovate, and grow with confidence.
              </p>

              <p className="text-muted-foreground">
                Founded in 2025, we&apos;ve grown into a full-service AI and software
                consultancy, helping organizations ship real, measurable impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="p-6 bg-primary/10 rounded-2xl text-center">
                <div className="font-heading text-4xl font-bold text-primary mb-2">2025</div>
                <p className="text-sm text-muted-foreground">Founded</p>
              </div>

              <div className="p-6 bg-card rounded-2xl border border-border text-center">
                <div className="font-heading text-4xl font-bold mb-2">10+</div>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>

              <div className="p-6 bg-card rounded-2xl border border-border text-center">
                <div className="font-heading text-4xl font-bold mb-2">50+</div>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>

              <div className="p-6 bg-card rounded-2xl border border-border text-center">
                <div className="font-heading text-4xl font-bold mb-2">Global</div>
                <p className="text-sm text-muted-foreground">Delivery</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-background rounded-2xl border border-border text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-medium mb-6 border border-primary-foreground/10 backdrop-blur-sm">
              <Globe className="w-4 h-4" />
              <span>Global Scale</span>
            </div>

            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
              Serving Clients Worldwide
            </h2>

            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
              We serve clients across multiple countries, delivering software and AI solutions
              that scale across teams, regions, and industries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 md:py-32 bg-background relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Meet the <span className="gradient-text">Leadership</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visionaries, engineers, and strategists driving the future of AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMember(member)}
                className="group relative cursor-pointer"
              >
                {/* Glass Card */}
                <div className="relative h-full p-8 rounded-3xl bg-card/50 border border-border/50 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 overflow-hidden">
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Decorative Circle */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

                  {/* Avatar */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <span className="font-heading text-3xl font-bold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold font-heading mb-2 group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">
                      {member.bio}
                    </p>

                    {/* View Profile Link */}
                    <div className="flex items-center text-sm font-semibold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      View Profile <span className="ml-2">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Detail Modal */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none overflow-hidden">
          {selectedMember && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background rounded-3xl overflow-hidden shadow-2xl border border-border/50 flex flex-col md:flex-row h-[80vh] md:h-auto max-h-[800px]"
            >
              {/* Sidebar / Image Area */}
              <div className="relative w-full md:w-2/5 bg-gradient-to-br from-primary to-primary/90 p-8 md:p-12 flex flex-col justify-between text-primary-foreground min-h-[300px]">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                <div className="relative z-10">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl mb-8">
                    <span className="font-heading font-bold text-4xl md:text-5xl text-white">
                      {selectedMember.name.charAt(0)}
                    </span>
                  </div>

                  <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                    {selectedMember.name}
                  </h2>
                  <p className="text-primary-foreground/80 text-lg font-medium">
                    {selectedMember.role}
                  </p>
                </div>

                <div className="relative z-10 hidden md:block mt-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm cursor-pointer transition-colors">
                      {/* Placeholder generic social icon */}
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm cursor-pointer transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto bg-background">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 mb-4">
                      Biography
                    </h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {selectedMember.bio}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 mb-4">
                      Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-accent/50 border border-border text-sm font-medium hover:border-primary/50 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="block md:hidden pt-4">
                    <Button className="w-full" size="lg">Contact</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
