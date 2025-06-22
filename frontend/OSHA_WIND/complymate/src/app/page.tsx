import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Users, BarChart3, CheckCircle, Star, Play } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ComplyMate
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">
                About
              </Link>
              <Button variant="outline" className="glass-button">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 glass">
              <Star className="h-3 w-3 mr-1" />
              AI-Powered OSHA Compliance
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simplify
              </span>{" "}
              Safety Compliance
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Enterprise-grade OSHA compliance platform powered by AI. Streamline safety management, 
              automate compliance tracking, and protect your workforce with intelligent insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6">
              <Play className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="glass-button text-lg px-8 py-6">
              <ArrowRight className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Compliance Rate</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50%</div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
            </div>
            <div className="glass-card text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Users Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                OSHA Compliance
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From automated compliance tracking to intelligent incident reporting, 
              ComplyMate provides comprehensive safety management tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Intelligent analysis of safety data to predict and prevent incidents before they occur.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Automated Compliance</CardTitle>
                <CardDescription>
                  Streamlined compliance tracking with automated reminders and deadline management.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Comprehensive dashboards and reports to track safety metrics and performance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Manage training, certifications, and team safety responsibilities efficiently.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Incident Reporting</CardTitle>
                <CardDescription>
                  Quick and comprehensive incident reporting with automated workflows and notifications.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>
                  Complete audit trail for all safety activities with detailed logging and compliance verification.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-card">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to transform your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  safety compliance
                </span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of organizations that trust ComplyMate to protect their workforce 
                and maintain OSHA compliance with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="glass-button text-lg px-8 py-6">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold">ComplyMate</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered OSHA compliance platform for modern enterprises.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Status</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ComplyMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
