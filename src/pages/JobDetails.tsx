import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Upload, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { jobs } from "./Jobs";

const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  linkedin: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const job = jobs.find((j) => j.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  if (!job) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-6">The position you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/jobs">View All Positions</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume to apply.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Application submitted:", { ...data, resume: resumeFile.name, jobId: job.id });

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-heading text-3xl font-bold mb-4">Application Submitted!</h1>
              <p className="text-muted-foreground mb-8">
                Thank you for applying for the {job.title} position. 
                We'll review your application and get back to you soon.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/jobs">View More Positions</Link>
                </Button>
                <Button asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/jobs")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Positions
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h1 className="font-heading text-3xl md:text-4xl font-bold">{job.title}</h1>
              <Badge variant="secondary">{job.department}</Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
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
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Job Details */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-heading text-2xl font-bold mb-4">About the Role</h2>
                <p className="text-muted-foreground">{job.description}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-heading text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 p-6 bg-card rounded-2xl border border-border">
                <h2 className="font-heading text-xl font-bold mb-6">Apply Now</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
                    <Input
                      id="linkedin"
                      {...register("linkedin")}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume/CV</Label>
                    <div className="relative">
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="resume"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {resumeFile ? resumeFile.name : "Upload Resume (PDF, DOC)"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      rows={4}
                      {...register("coverLetter")}
                      placeholder="Tell us why you're a great fit for this role..."
                      className={errors.coverLetter ? "border-destructive" : ""}
                    />
                    {errors.coverLetter && (
                      <p className="text-xs text-destructive">{errors.coverLetter.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
