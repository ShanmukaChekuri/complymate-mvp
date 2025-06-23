import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, ArrowRight, Chrome, Github } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Shield className="h-10 w-10 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ComplyMate
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-6 p-0">
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-12"
                  />
                </div>
              </div>

              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Sign in
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                href="/auth/register" 
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-grid-16" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6">
              Simplify Your Safety Compliance
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of organizations using ComplyMate to streamline OSHA compliance and protect their workforce.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm opacity-75">Compliance Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-75">Users Protected</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm opacity-75">Time Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-75">AI Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-32 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-12 w-16 h-16 bg-white/20 rounded-full blur-lg" />
      </div>
    </div>
  );
} 