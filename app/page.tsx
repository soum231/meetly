"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Video,
  Monitor,
  Radio,
  Shield,
  Globe,
  ArrowRight,
  Loader2,
  Users,
  Clock,
  Zap,
  ChevronDown,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="text-center mb-14"
    >
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-medium tracking-wide uppercase mb-4">
        <Sparkles className="w-3 h-3" />
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{title}</h2>
    </motion.div>
  );
}

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`px-6 py-20 md:py-28 ${className}`}>{children}</section>;
}

export default function Home() {
  const router = useRouter();
  const [joinId, setJoinId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/meeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: "Host" }),
      });
      const data = await res.json();
      if (data.meetingId) {
        router.push(`/meeting/${data.meetingId}?host=Host`);
      }
    } catch {
      setIsCreating(false);
    }
  };

  const handleJoinMeeting = () => {
    if (joinId.trim()) {
      router.push(`/meeting/${joinId.trim()}`);
    }
  };

  const features = [
    { icon: Video, title: "HD Video & Audio", desc: "Crystal-clear 1080p video with noise suppression and echo cancellation for lifelike conversations." },
    { icon: Monitor, title: "Screen Sharing", desc: "Present your entire screen, a specific window, or a browser tab with a single click." },
    { icon: Radio, title: "Cloud Recording", desc: "Record meetings to Stream cloud storage. Access recordings anytime via your dashboard." },
    { icon: Users, title: "Up to 25 Participants", desc: "Collaborate with your team, clients, or friends. No limits on meeting duration." },
    { icon: Globe, title: "No Account Required", desc: "Join any meeting instantly by just entering your name. Zero friction, zero sign-ups." },
    { icon: Shield, title: "Private & Secure", desc: "Each meeting gets a unique, non-guessable ID. End-to-end encrypted connections." },
  ];

  const faqs = [
    { q: "Do I need to create an account?", a: "No. Just enter your name and join. No email, no password, no verification required." },
    { q: "Is Meetly free?", a: "Yes, completely free. Create unlimited meetings with up to 25 participants per session." },
    { q: "How do I share a meeting?", a: "After creating a meeting, copy the link and send it to anyone. They'll join with just their name." },
    { q: "Do participants need to download anything?", a: "No. Meetly runs entirely in the browser. No downloads, no plugins, no installations." },
    { q: "Can I record meetings?", a: "Yes, hosts can start and stop recording. Recordings are stored securely in the cloud." },
    { q: "What devices are supported?", a: "Meetly works on desktop Chrome, Firefox, Edge, and Safari. Mobile browser support is also available." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mt-3 rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo.png"
                  alt="Meetly"
                  width={96}
                  height={28}
                  className="h-7 w-auto"
                />
              </div>
              <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
                <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              </nav>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCreateMeeting}
                  disabled={isCreating}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm h-9 px-4 rounded-xl shadow-lg shadow-blue-500/20"
                >
                  {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
              backgroundSize: `60px 60px`,
            }}
          />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Instant video meetings, no sign-up required</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
              Video calls
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                made simple
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Create a meeting in one click, share the link, and start talking.
              No downloads. No accounts. No friction.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Button
                size="lg"
                onClick={handleCreateMeeting}
                disabled={isCreating}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-base rounded-xl w-full sm:w-auto shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              >
                {isCreating ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Video className="w-5 h-5 mr-2" />
                )}
                Create Meeting
              </Button>

              <div className="hidden sm:flex items-center gap-3 text-muted-foreground/40 text-sm">
                <div className="w-8 h-px bg-border" />
                or
                <div className="w-8 h-px bg-border" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Enter meeting code"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 px-5 w-full sm:w-44 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
                <Button
                  size="lg"
                  onClick={handleJoinMeeting}
                  disabled={!joinId.trim()}
                  className="bg-secondary hover:bg-accent text-secondary-foreground rounded-xl h-12 px-5 border border-border"
                >
                  Join
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> No download</span>
              <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Up to 25 people</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Unlimited duration</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <Section id="features" className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent pointer-events-none" />
          <div className="relative max-w-6xl mx-auto">
            <SectionTitle label="Features" title="Everything you need for great meetings" />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={fadeIn}
                  className="relative group bg-card p-7 hover:bg-accent/50 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/10 flex items-center justify-center mb-4 group-hover:from-blue-500/20 group-hover:to-blue-600/10 transition-colors">
                    <feature.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-foreground font-semibold text-base mb-1.5">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* How it Works */}
        <Section id="how-it-works" className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] via-transparent to-blue-500/[0.02] pointer-events-none" />
          <div className="relative max-w-4xl mx-auto">
            <SectionTitle label="How it Works" title="Three steps to start meeting" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 relative">
              <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-blue-500/40 via-blue-500/40 to-blue-500/40" />

              {[
                { step: "01", icon: Video, title: "Create", desc: "Click create and get your unique meeting link instantly." },
                { step: "02", icon: Globe, title: "Share", desc: "Send the link to anyone — email, chat, or calendar." },
                { step: "03", icon: Users, title: "Connect", desc: "Join with one click. Camera and mic work right away." },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center px-6"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 relative z-10">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-blue-500/60 mb-1.5">{item.step}</span>
                  <h3 className="text-foreground font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA */}
        <section className="relative px-6 py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-blue-500/[0.02] to-transparent pointer-events-none" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative max-w-2xl mx-auto text-center"
          >
            <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-10 md:p-14 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Ready to meet?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start a meeting now. No sign-up, no downloads, no waiting.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={handleCreateMeeting}
                  disabled={isCreating}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-base rounded-xl w-full sm:w-auto shadow-xl shadow-blue-500/25"
                >
                  {isCreating ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Video className="w-5 h-5 mr-2" />
                  )}
                  Create Your Meeting
                </Button>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    placeholder="Or enter a code"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 px-5 w-full sm:w-40"
                  />
                  <Button
                    onClick={handleJoinMeeting}
                    disabled={!joinId.trim()}
                    className="bg-secondary hover:bg-accent text-secondary-foreground rounded-xl h-12 px-5 border border-border"
                  >
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <Section id="faq" className="relative">
          <div className="relative max-w-3xl mx-auto">
            <SectionTitle label="FAQ" title="Common questions" />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="space-y-2"
            >
              {faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
              ))}
            </motion.div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Image
                  src="/logo.png"
                  alt="Meetly"
                  width={96}
                  height={28}
                  className="h-7 w-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Simple, instant video meetings for everyone. No account needed.
              </p>
            </div>
            <div>
              <h4 className="text-foreground text-sm font-medium mb-3">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a></li>
                <li><a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground text-sm font-medium mb-3">Company</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-muted-foreground">Privacy</span></li>
                <li><span className="text-sm text-muted-foreground">Terms</span></li>
                <li><span className="text-sm text-muted-foreground">Contact</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground text-sm font-medium mb-3">Connect</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors">
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-accent transition-colors">
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Meetly. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Built for simple, instant video conversations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeIn} className="group">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-muted/50 hover:bg-accent/50 border border-border hover:border-border transition-all text-left"
      >
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-4 pt-2">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
