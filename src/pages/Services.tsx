import { motion } from "framer-motion";
import { Brain, Sparkles, Users, Code, Database, Cpu, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const services = [
  {
    id: "web",
    icon: Code,
    title: "Web Development",
    description: "Modern, responsive web applications tailored to your business needs.",
    features: [
      "Custom website and web app development",
      "Responsive and mobile-first design",
      "SEO-friendly architecture",
      "Integration with third-party services and APIs",
    ],
  },
  {
    id: "app",
    icon: Cpu,
    title: "App Development",
    description: "High-performance mobile and cross-platform applications.",
    features: [
      "iOS and Android development",
      "Cross-platform solutions",
      "App store deployment support",
      "Ongoing maintenance and updates",
    ],
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI Development",
    description: "Intelligent AI solutions that automate processes and unlock new capabilities.",
    features: [
      "Custom AI model development",
      "NLP and computer vision",
      "Recommendation and prediction systems",
      "Integration into existing products",
    ],
  },
  {
    id: "qa",
    icon: Users,
    title: "QA",
    description: "Comprehensive quality assurance to ensure reliability and performance.",
    features: [
      "Manual and automated testing",
      "End-to-end and regression testing",
      "Performance and load testing",
      "Detailed reporting and issue tracking",
    ],
  },
  {
    id: "devops",
    icon: Database,
    title: "DevOps",
    description: "Robust DevOps pipelines to keep your product fast, secure, and scalable.",
    features: [
      "CI/CD pipeline setup and optimization",
      "Cloud infrastructure management",
      "Monitoring, logging, and alerting",
      "Security and compliance best practices",
    ],
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

export default function Services() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Our Services</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              AI Solutions That Drive{" "}
              <span className="gradient-text">Real Results</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              From strategy to implementation, we provide comprehensive AI services 
              that transform how businesses operate and compete.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                id={service.id}
                variants={itemVariants}
                className="group p-8 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-card transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <service.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A proven methodology that ensures successful AI implementation
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              { step: "01", title: "Discover", description: "We analyze your needs and identify opportunities" },
              { step: "02", title: "Design", description: "Create a tailored solution architecture" },
              { step: "03", title: "Develop", description: "Build and test your AI solution" },
              { step: "04", title: "Deploy", description: "Launch and continuously optimize" },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-heading text-xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-12 text-center text-primary-foreground"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Contact us today to discuss how our AI services can transform your business.
            </p>
            <Button
              asChild
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link to="/contact">
                Contact Us <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
