import React from 'react';
import { Calendar, Users, FileText, Shield, Clock, Award, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import Button from "../components/Button/Button";
import doctorLanding from '../assets/doctorLanding.svg';
import landingImg from '../assets/Landingimg.svg';
import landingImg1 from '../assets/Landingimg1.svg';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, isAuthReady } = useSelector(state => state.auth);
  // Login persistence is now handled by App.jsx AuthPersistenceWrapper
  // No need for redirect logic here
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-foreground">MedTrax</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
            <a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a>
            <a href="#departments" className="text-muted-foreground hover:text-primary transition-colors">Departments</a>
            <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex" onClick={() => navigate('/login')}>Login</Button>
            <Button className="bg-primary hover:bg-primary/90">Book Appointment</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-hero-bg to-medical-blue/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Your Health, Our <span className="text-primary">Priority</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Experience world-class healthcare with our team of expert doctors and cutting-edge facilities. We're committed to providing compassionate care for you and your family.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate('/select-role')}>
  Get Started
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>

                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Expert Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Happy Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={doctorLanding} 
                alt="Professional healthcare team" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Change Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Change to MedTrax?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the benefits of choosing MedTrax for your healthcare needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <img 
                src={landingImg} 
                alt="24/7 Medical Support" 
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
              <p className="text-muted-foreground">Round-the-clock medical support whenever you need it</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-teal-50 to-white border border-teal-100">
              <img 
                src={landingImg1} 
                alt="Advanced Medical Technology" 
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-semibold mb-3">Advanced Technology</h3>
              <p className="text-muted-foreground">State-of-the-art medical equipment and facilities</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-white border border-orange-100">
               <img 
                src={landingImg} 
                alt="Expert Medical Team" 
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
              <p className="text-muted-foreground">Highly qualified and experienced medical professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Departments */}
      <section id="departments" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Departments</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive medical services across multiple specialties
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Oncology', 'Radiology', 'Emergency'].map((dept) => (
              <div key={dept} className="bg-white p-6 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{dept}</h3>
                <p className="text-sm text-muted-foreground">Expert care and treatment</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored to your needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-gray-200 hover:border-primary transition-colors">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Easy Appointments</h3>
              <p className="text-muted-foreground">Book your appointments online with just a few clicks</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 hover:border-primary transition-colors">
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Digital Records</h3>
              <p className="text-muted-foreground">Access your medical records anytime, anywhere</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 hover:border-primary transition-colors">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Expert Consultation</h3>
              <p className="text-muted-foreground">Connect with specialists from various fields</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Transforming Healthcare Together</h2>
          <p className="text-xl mb-8 text-white/90">Join thousands of satisfied patients who trust MedTrax</p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Blog Library */}
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Blog Library</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest health tips and medical insights
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-medical-blue to-medical-teal"></div>
                <div className="p-6">
                  <div className="text-sm text-primary mb-2">Health Tips</div>
                  <h3 className="text-xl font-semibold mb-3">Understanding Your Health</h3>
                  <p className="text-muted-foreground mb-4">Learn about preventive care and healthy living practices...</p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Excellence Banner */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-around gap-8">
            <div className="text-center">
              <Award className="w-16 h-16 text-primary mx-auto mb-2" />
              <div className="font-semibold">JCI Accredited</div>
            </div>
            <div className="text-center">
              <Shield className="w-16 h-16 text-primary mx-auto mb-2" />
              <div className="font-semibold">ISO Certified</div>
            </div>
            <div className="text-center">
              <Award className="w-16 h-16 text-primary mx-auto mb-2" />
              <div className="font-semibold">Award Winning</div>
            </div>
            <div className="text-center">
              <Users className="w-16 h-16 text-primary mx-auto mb-2" />
              <div className="font-semibold">Patient Focused</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-2xl font-bold">MedTrax</span>
              </div>
              <p className="text-gray-400">Your trusted partner in healthcare excellence</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#departments" className="hover:text-white transition-colors">Departments</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 234 567 8900</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@medtrax.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Medical St, City</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Monday - Friday: 8am - 8pm</li>
                <li>Saturday: 9am - 5pm</li>
                <li>Sunday: Closed</li>
                <li className="text-primary">Emergency: 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MedTrax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;