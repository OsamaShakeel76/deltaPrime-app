import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    id: "ai-engineer",
    title: "AI Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    posted: "3 days ago",
    description:
      "Design, build, and deploy AI-powered solutions including LLMs, chatbots, and intelligent automation systems. Work on cutting-edge projects that leverage machine learning, natural language processing, and computer vision to solve complex business challenges.",
    requirements: [
      "Strong experience with Python and AI/ML frameworks (TensorFlow, PyTorch, scikit-learn)",
      "Hands-on experience with LLMs, APIs, or RAG pipelines",
      "Knowledge of data processing and model deployment",
      "Understanding of cloud platforms (AWS, GCP, or Azure)",
      "Experience with version control (Git) and collaborative development",
      "Strong problem-solving skills and ability to work in a fast-paced environment",
    ],
  },
  {
    id: "mern-stack-developer",
    title: "MERN Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $140k",
    posted: "5 days ago",
    description:
      "Build scalable web applications using MongoDB, Express, React, and Node.js with modern UI/UX practices. Develop full-stack solutions that are performant, maintainable, and user-friendly. Collaborate with cross-functional teams to deliver high-quality software products.",
    requirements: [
      "Strong experience with React, Node.js, and Express",
      "Hands-on experience with MongoDB or other NoSQL databases",
      "Understanding of REST APIs and authentication (JWT, OAuth)",
      "Familiarity with Git and modern frontend tools (Vite, Webpack, etc.)",
      "Experience with TypeScript and modern JavaScript (ES6+)",
      "Knowledge of responsive design and UI/UX best practices",
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote",
    type: "Full-time",
    salary: "$110k - $150k",
    posted: "1 week ago",
    description:
      "Manage cloud infrastructure, CI/CD pipelines, and deployment workflows to ensure system reliability and scalability. Automate infrastructure provisioning, monitor system performance, and implement best practices for security and compliance. Work closely with development teams to streamline the software delivery process.",
    requirements: [
      "Experience with Docker and Kubernetes for containerization and orchestration",
      "Strong knowledge of CI/CD tools (GitHub Actions, Jenkins, GitLab CI, etc.)",
      "Hands-on experience with cloud platforms (AWS, GCP, or Azure)",
      "Monitoring, logging, and infrastructure automation experience (Prometheus, Grafana, ELK stack)",
      "Proficiency in Infrastructure as Code (Terraform, CloudFormation, Ansible)",
      "Understanding of networking, security best practices, and disaster recovery",
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
              Join Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're looking for talented individuals to help us build the future of AI and software solutions.
              Explore our open positions and find your next career opportunity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-card transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="font-heading text-2xl font-bold">{job.title}</h2>
                      <Badge variant="secondary">{job.department}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
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
                        Posted {job.posted}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button asChild variant="default" className="group-hover:gap-2 transition-all">
                      <Link to={`/jobs/${job.id}`}>
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State (if no jobs) */}
          {jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="font-heading text-2xl font-bold mb-2">No Open Positions</h2>
              <p className="text-muted-foreground mb-6">
                We don't have any open positions at the moment, but we're always looking for great talent.
              </p>
              <Button asChild variant="outline">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-primary-foreground"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Don't See a Role That Fits?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              We're always interested in connecting with talented individuals. 
              Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button
              asChild
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Link to="/contact">
                Send Us Your Resume <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
