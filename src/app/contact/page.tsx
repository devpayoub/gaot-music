"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Send, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121315] via-[#17191D] to-[#1a1c20]">
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Have questions, suggestions, or need support? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-8">
                    <CardTitle className="text-2xl text-white mb-6">Send us a Message</CardTitle>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Name
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Email
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Subject
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Message
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more..."
                          rows={6}
                          className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 resize-none"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Contact Methods */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6">
                    <CardTitle className="text-xl text-white mb-6">Contact Information</CardTitle>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-zinc-700 rounded-full">
                          <Mail className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Email</p>
                          <p className="text-zinc-400">support@goatmusic.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-zinc-700 rounded-full">
                          <Phone className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Phone</p>
                          <p className="text-zinc-400">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-zinc-700 rounded-full">
                          <MapPin className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Address</p>
                          <p className="text-zinc-400">123 Music Street, Los Angeles, CA 90210</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-zinc-700 rounded-full">
                          <MessageSquare className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Live Chat</p>
                          <p className="text-zinc-400">Available 24/7</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Hours */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6">
                    <CardTitle className="text-xl text-white mb-4">Support Hours</CardTitle>
                    <div className="space-y-2 text-zinc-400">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6">
                    <CardTitle className="text-xl text-white mb-4">Follow Us</CardTitle>
                    <div className="flex space-x-4">
                      <a href="#" className="p-3 bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors">
                        <Instagram className="w-5 h-5 text-pink-500" />
                      </a>
                      <a href="#" className="p-3 bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors">
                        <Twitter className="w-5 h-5 text-blue-400" />
                      </a>
                      <a href="#" className="p-3 bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors">
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </a>
                      <a href="#" className="p-3 bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors">
                        <Youtube className="w-5 h-5 text-red-500" />
                      </a>
                      
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6">
                    <CardTitle className="text-white mb-3">How do I upload my music?</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Artists can upload their music through their account dashboard. Simply go to "Upload Album" and follow the step-by-step process.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6">
                    <CardTitle className="text-white mb-3">How do I get verified as an artist?</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Apply for verification through your account settings. We'll review your application and get back to you within 7 days.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6">
                    <CardTitle className="text-white mb-3">What payment methods do you accept?</CardTitle>
                    <CardDescription className="text-zinc-400">
                      We accept all major credit cards, PayPal, and Apple Pay for album purchases and event tickets.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6">
                    <CardTitle className="text-white mb-3">How do I get a refund?</CardTitle>
                    <CardDescription className="text-zinc-400">
                      Refunds are available within 30 days of purchase. Contact our support team with your order number to process a refund.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 