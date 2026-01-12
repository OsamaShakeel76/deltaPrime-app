import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Clock, DollarSign, ChevronRight, Search, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
}

export const jobs: Job[] = [
  {
    id: "ml-engineer",
    title: "Senior Machine Learning Engineer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    salary: "$150k - $200k",
    posted: "2 days ago",
    description: "We're looking for a Senior ML Engineer to develop and deploy machine learning models at scale.",
    requirements: [
      "5+ years of experience in machine learning",
      "Proficiency in Python, TensorFlow, and PyTorch",
      "Experience with cloud platforms (AWS, GCP, Azure)",
      "Strong understanding of ML algorithms and best practices",
    ],
  },
  {
    id: "ai-researcher",
    title: "AI Research Scientist",
    department: "Research",
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $180k",
    posted: "1 week ago",
    description: "Join our research team to push the boundaries of AI and contribute to groundbreaking projects.",
    requirements: [
      "PhD in Computer Science, ML, or related field",
      "Publications in top-tier AI/ML conferences",
      "Experience with deep learning frameworks",
      "Strong mathematical background",
    ],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    department: "Engineering",
    location: "London, UK",
    type: "Full-time",
    salary: "$120k - $160k",
    posted: "3 days ago",
    description: "Build and maintain data pipelines that power our AI solutions.",
    requirements: [
      "3+ years of data engineering experience",
      "Expertise in SQL and NoSQL databases",
      "Experience with Apache Spark, Kafka, or Airflow",
      "Knowledge of data modeling and ETL processes",
    ],
  },
  {
    id: "product-manager",
    title: "Product Manager - AI Platform",
    department: "Product",
    location: "Singapore",
    type: "Full-time",
    salary: "$130k - $170k",
    posted: "5 days ago",
    description: "Lead product strategy and development for our AI platform offerings.",
    requirements: [
      "4+ years of product management experience",
      "Background in AI/ML or enterprise software",
      "Strong analytical and communication skills",
      "Experience with agile methodologies",
    ],
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    salary: "$110k - $150k",
    posted: "1 week ago",
    description: "Create beautiful and intuitive interfaces for our AI-powered applications.",
    requirements: [
      "3+ years of frontend development experience",
      "Expertise in React, TypeScript, and modern CSS",
      "Experience with data visualization",
      "Strong eye for design and UX",
    ],
  },
  {
    id: "sales-engineer",
    title: "Sales Engineer",
    department: "Sales",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $140k + commission",
    posted: "2 weeks ago",
    description: "Help our clients understand the value of AI solutions through technical demonstrations.",
    requirements: [
      "2+ years of sales engineering experience",
      "Technical background in software or data",
      "Excellent presentation and communication skills",
      "Understanding of AI/ML concepts",
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

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const departments = [...new Set(jobs.map((job) => job.department))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || job.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

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
              <Briefcase className="w-4 h-4" />
              <span>Join Our Team</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Build the Future of{" "}
              <span className="gradient-text">AI With Us</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're always looking for talented individuals who share our passion for AI innovation. 
              Explore our open positions and find your next opportunity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDepartment === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDepartment(null)}
              >
                All Departments
              </Button>
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="block p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-card transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading text-xl font-semibold group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <Badge variant="secondary">{job.department}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.posted}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{job.description}</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">No positions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Why Work at DeltaPrime?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer competitive compensation and benefits to attract and retain top talent.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { title: "Competitive Salary", description: "Top-tier compensation packages with equity options" },
              { title: "Remote-First", description: "Work from anywhere with flexible hours" },
              { title: "Health & Wellness", description: "Comprehensive health, dental, and vision coverage" },
              { title: "Learning Budget", description: "$2,500 annual budget for courses and conferences" },
              { title: "Unlimited PTO", description: "Take the time you need to recharge" },
              { title: "Team Events", description: "Annual company retreats and team gatherings" },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-background rounded-xl border border-border text-center"
              >
                <h3 className="font-heading font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
