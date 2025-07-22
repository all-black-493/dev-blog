"use client";

import { useEffect } from 'react';
import { User, Code, Coffee, Github, Twitter, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

export default function AboutPage() {
  useEffect(() => {
    // Animate content sections
    gsap.fromTo('.about-section',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
      }
    );
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <header className="about-section mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
          <Code size={32} className="text-green-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          About DevBlog
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          3+ years of architecting, scaling, and maintaining production systems. 
          This is where I share the real-world lessons, battle-tested patterns, and hard-earned insights from the trenches.
        </p>
      </header>

      <div className="space-y-8">
        <Card className="about-section bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Code className="text-green-400" />
              My Expertise
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              I've spent 3+ years building software projects. 
              My expertise spans:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li className="list-disc">Production debugging and performance optimization</li>
              <li className="list-disc">UATs, Quality TypeScript patterns for enterprise applications</li>
              <li className="list-disc">Database design, optimization, and scaling strategies</li>
              <li className="list-disc">DevOps, monitoring, and incident response</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Every post comes from real developer experience—the successes, failures, and everything in between. 
              No theoretical fluff, just practical insights you can apply immediately.
            </p>
          </CardContent>
        </Card>

        <Card className="about-section bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Coffee className="text-green-400" />
              My Philosophy
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">
              Software engineering is about solving real problems for real people. After 3+ years in production environments, 
              I've learned that the best solutions are often the simplest ones that can evolve over time. 
              I believe in sharing knowledge openly—the mistakes, the victories, and the lessons learned along the way.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              My goal is to help other developers avoid the pitfalls I've encountered and accelerate their journey 
              from newbie to experienced engineer. Every war story shared here is a lesson that could save you hours of debugging 
              or prevent a production incident.
            </p>
          </CardContent>
        </Card>

        <Card className="about-section bg-black/40 backdrop-blur-sm border-green-500/20">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-white">
              Let's Connect
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Have questions about scaling challenges? Want to discuss architecture decisions? 
              Found a post helpful? I'd love to hear from you and learn about your experiences too.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                asChild
              >
                <a href="#" className="flex items-center gap-2">
                  <Github size={18} />
                  GitHub
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                asChild
              >
                <a href="#" className="flex items-center gap-2">
                  <Twitter size={18} />
                  Twitter
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-green-500/30 text-green-300 hover:bg-green-500/10"
                asChild
              >
                <a href="mailto:hello@dev.blog" className="flex items-center gap-2">
                  <Mail size={18} />
                  Email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}