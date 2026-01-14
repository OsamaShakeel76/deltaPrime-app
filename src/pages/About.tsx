import { motion } from "framer-motion";
import { Target, Lightbulb, Heart, Award, Globe } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

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
              We're a team of engineers, strategists, and builders dedicated to
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
                At DeltaPrime, we design AI solutions that deliver real impact not hype.
                Our focus is on building practical, scalable, and intelligent systems that
                help businesses automate, innovate, and grow with confidence.
              </p>
              <p className="text-muted-foreground">
                Founded in 2025, we've grown into a full-service AI and software
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
                <div className="font-heading text-4xl font-bold text-primary mb-2">
                  2025
                </div>
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
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Global Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-primary-foreground"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              <span>Global Reach</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Serving Clients Worldwide
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              We serve clients across multiple countries, delivering software and
              AI solutions that scale across teams, regions, and industries.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
