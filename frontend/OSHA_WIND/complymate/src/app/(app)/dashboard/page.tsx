import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your safety compliance status.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
              -1 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              +3 this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Since Last Incident</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
              New record!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest safety and compliance updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Safety training completed</p>
                  <p className="text-xs text-muted-foreground">
                    John Smith completed "Hazard Communication" training
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Incident reported</p>
                  <p className="text-xs text-muted-foreground">
                    Minor injury reported in Warehouse B
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">4h ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Shield className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Compliance check completed</p>
                  <p className="text-xs text-muted-foreground">
                    Monthly PPE inspection completed
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">1d ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Report generated</p>
                  <p className="text-xs text-muted-foreground">
                    Q4 Safety Performance Report available
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2d ago</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Inspection
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Assign Training
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Overdue Training</span>
                </div>
                <Badge variant="destructive">5</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Upcoming Inspections</span>
                </div>
                <Badge variant="secondary">3</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Compliance Updates</span>
                </div>
                <Badge variant="secondary">2</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>
            Current status of all compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm font-medium">Training</div>
              <div className="text-xs text-muted-foreground">127/150 completed</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-sm font-medium">Inspections</div>
              <div className="text-xs text-muted-foreground">23/25 completed</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600">78%</div>
              <div className="text-sm font-medium">Documentation</div>
              <div className="text-xs text-muted-foreground">156/200 updated</div>
            </div>

            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600">96%</div>
              <div className="text-sm font-medium">Equipment</div>
              <div className="text-xs text-muted-foreground">48/50 inspected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 