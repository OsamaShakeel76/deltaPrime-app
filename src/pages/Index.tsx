import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, BarChart3, Users, ChevronRight, Star, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const services = [
  {
    icon: Brain,
    title: "AI Development",
    description: "We design and build intelligent AI solutions that automate processes, unlock insights, and drive real business outcomes.",
  },
  {
    icon: BarChart3,
    title: "QA & Machine Learning",
    description: "We ensure quality at every stage while using machine learning to optimize performance, predict issues, and deliver reliable, intelligent systems.",
  },
  {
    icon: Sparkles,
    title: "DevOps & Automation",
    description: "We automate your infrastructure, deployments, and workflows to ship faster, scale reliably, and eliminate operational chaos.",
  },
  {
    icon: Users,
    title: "Web & Mobile Apps",
    description: "End-to-end web & mobile app development using modern architectures, clean UX, and production-ready engineering.",
  },
];

const stats = [
  { value: "10+", label: "Projects Delivered" },
  { value: "20+", label: "Enterprise Clients" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support Available" },
];

const testimonials = [
  {
    quote: "Great work and communication! Easy to work with, understood tasks, and provided quality work. The project was to assist us with rapid development of a graphic postcard editing tool.",
    author: "Geoff Lilienfeld",
    role: " Wise Pelican",
    rating: 5,
  },
{
  quote: "Deltaprimaisolutions delivered exceptional work troubleshooting and optimizing our Docker build within GitHub Actions. Their strong DevOps expertise, quick problem-solving, and clear communication ensured a flawless CI/CD pipeline. Highly recommended.",
  author: "John TenBrink",
  role: "MD, Marketifyllc ",
  rating: 5,
},
{
  quote: "DeltaPrimeAISolutions did an excellent job delivering a Gen-AI driven automation framework with a complete Bitbucket CI/CD pipeline, exceeding expectations.They demonstrated strong automation architecture expertise, used GenAI intelligently to improve test coverage and maintainability, and delivered a scalable, clean, and production-ready solution. Highly cooperative, proactive, and technically strong — I’m extremely satisfied and would highly recommend them for GenAI-driven QA automation and modern CI/CD work.",
  author: "Emily Watson",
  role: "Director of Innovation, FutureCorp",
  rating: 5,
},
];

const features = [
  { icon: Zap, title: "Fast Deployment", description: "Get your AI solutions up and running quickly" },
  { icon: Shield, title: "Enterprise Security", description: "Bank-grade security for all your data" },
  { icon: Globe, title: "Global Scale", description: "Solutions that scale with your business" },
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

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/20" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pioneering AI Innovation</span>
              </motion.div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Transform Your Business with{" "}
                <span className="gradient-text">Intelligent AI</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                DeltaPrime AI Solutions delivers cutting-edge artificial intelligence 
                that drives growth, efficiency, and innovation for forward-thinking enterprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild variant="hero" size="xl">
                  <Link to="/contact">
                    Get Started <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="hero-outline" size="xl">
                  <Link to="/services">Explore Services</Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                {/* Main Visual Element */}
                <div className="w-80 h-80 relative animate-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-3xl rotate-6 shadow-glow" />
                  <div className="absolute inset-0 bg-card rounded-3xl flex items-center justify-center border border-border">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-2xl flex items-center justify-center">
                        <svg viewBox="0 0 40 40" className="w-12 h-12 text-primary-foreground" fill="currentColor">
                          <polygon points="20,4 36,32 4,32" />
                        </svg>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">DeltaPrime</h3>
                      <p className="text-sm text-muted-foreground">AI Solutions</p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-8 -right-8 w-20 h-20 bg-card rounded-2xl shadow-card flex items-center justify-center border border-border"
                >
                  <Brain className="w-10 h-10 text-primary" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                  className="absolute -bottom-4 -left-8 w-16 h-16 bg-card rounded-xl shadow-card flex items-center justify-center border border-border"
                >
                  <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our Core Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI solutions designed to transform your business operations
              and unlock new opportunities for growth.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-card transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <Link
                  to="/services"
                  className="inline-flex items-center text-primary text-sm font-medium hover:gap-2 transition-all"
                >
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="gradient-text">DeltaPrime?</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                We combine deep technical expertise with industry knowledge to deliver 
                AI solutions that truly transform businesses. Our team of experts works 
                closely with you to understand your unique challenges.
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl" />
                <div className="absolute inset-4 bg-card rounded-2xl border border-border shadow-card flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl font-heading font-bold gradient-text mb-4">AI</div>
                    <p className="text-muted-foreground">Powered by Innovation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what industry leaders 
              have to say about working with DeltaPrime.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-card rounded-2xl border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-heading font-semibold">{testimonial.author}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

  {/* CTA Section */}
 {/*
<section className="py-20 bg-gradient-to-br from-primary to-primary/80">
  <div className="container mx-auto px-4">
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 text-primary-foreground">
      <a
        href="tel:+923047057347"
        className="font-medium hover:underline"
      >
        📞 +92 304 7057347
      </a>

      <span className="hidden sm:block">|</span>

      <a
        href="mailto:hr@deltaprimeaisolutions.com"
        className="font-medium hover:underline"
      >
        📧 hr@deltaprimeaisolutions.com
      </a>
    </div>
  </div>
</section>
*/}


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-primary-foreground"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Let's discuss how AI can revolutionize your operations. 
                Schedule a free consultation with our experts today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Link to="/contact">
                    Schedule Consultation <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/jobs">View Open Positions</Link>
                </Button>
              </div>
            </motion.div>
          </Layout>
        );
      }
  
