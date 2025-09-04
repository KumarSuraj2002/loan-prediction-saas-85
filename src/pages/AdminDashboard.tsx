import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  newApplications: number;
  pendingApplications: number;
  userQueries: number;
  reviews: number;
  totalApplications: number;
  totalApplicationsAmount: number;
  approvedApplications: number;
  approvedApplicationsAmount: number;
  rejectedApplications: number;
  rejectedApplicationsAmount: number;
  newRegistrations: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("30days");
  const [userTimeFilter, setUserTimeFilter] = useState("30days");

  const getDateFilter = (filter: string) => {
    const now = new Date();
    let startDate = new Date();
    
    switch (filter) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }
    
    return startDate.toISOString();
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const startDate = getDateFilter(timeFilter);
      const userStartDate = getDateFilter(userTimeFilter);

      // Fetch applications data
      const { data: applications } = await supabase
        .from('loan_applications')
        .select('application_status, loan_amount, created_at')
        .gte('created_at', startDate);

      // Fetch user queries
      const { data: queries } = await supabase
        .from('user_queries')
        .select('created_at')
        .gte('created_at', userStartDate);

      // Fetch reviews/testimonials
      const { data: reviews } = await supabase
        .from('testimonials')
        .select('created_at')
        .gte('created_at', userStartDate);

      // Fetch new users
      const { data: users } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', userStartDate);

      // Calculate stats
      const totalApplications = applications?.length || 0;
      const pendingApplications = applications?.filter(app => app.application_status === 'pending').length || 0;
      const approvedApplications = applications?.filter(app => app.application_status === 'approved').length || 0;
      const rejectedApplications = applications?.filter(app => app.application_status === 'rejected').length || 0;

      const totalAmount = applications?.reduce((sum, app) => sum + Number(app.loan_amount || 0), 0) || 0;
      const approvedAmount = applications?.filter(app => app.application_status === 'approved')
        .reduce((sum, app) => sum + Number(app.loan_amount || 0), 0) || 0;
      const rejectedAmount = applications?.filter(app => app.application_status === 'rejected')
        .reduce((sum, app) => sum + Number(app.loan_amount || 0), 0) || 0;

      // Get recent applications (last 24 hours for "new")
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newApplications = applications?.filter(app => 
        new Date(app.created_at) > yesterday
      ).length || 0;

      setStats({
        newApplications,
        pendingApplications,
        userQueries: queries?.length || 0,
        reviews: reviews?.length || 0,
        totalApplications,
        totalApplicationsAmount: totalAmount,
        approvedApplications,
        approvedApplicationsAmount: approvedAmount,
        rejectedApplications,
        rejectedApplicationsAmount: rejectedAmount,
        newRegistrations: users?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeFilter, userTimeFilter]);

  const LoadingCard = ({ title, color }: { title: string; color: string }) => (
    <Card>
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <CardTitle className={`text-base sm:text-lg font-medium ${color}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <Skeleton className="h-8 sm:h-12 w-16" />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">DASHBOARD</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <LoadingCard title="New Applications" color="text-green-600" />
          <LoadingCard title="Pending Applications" color="text-yellow-600" />
          <LoadingCard title="User Queries" color="text-cyan-600" />
          <LoadingCard title="Rating & Review" color="text-cyan-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">DASHBOARD</h1>
      </div>

      {/* Top Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-medium text-green-600">New Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-4xl font-bold text-green-600">{stats?.newApplications || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-medium text-yellow-600">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-4xl font-bold text-yellow-600">{stats?.pendingApplications || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-medium text-cyan-600">User Queries</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-4xl font-bold text-cyan-600">{stats?.userQueries || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-medium text-cyan-400">Rating & Review</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <p className="text-2xl sm:text-4xl font-bold text-cyan-400">{stats?.reviews || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Analytics Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Loan Analytics</h2>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Past 30 Days</SelectItem>
              <SelectItem value="7days">Past 7 Days</SelectItem>
              <SelectItem value="90days">Past 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-blue-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{stats?.totalApplications || 0}</p>
              <p className="text-lg font-semibold text-blue-600 mt-2">₹{stats?.totalApplicationsAmount?.toLocaleString() || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-green-600">Approved Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{stats?.approvedApplications || 0}</p>
              <p className="text-lg font-semibold text-green-600 mt-2">₹{stats?.approvedApplicationsAmount?.toLocaleString() || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-red-600">Rejected Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600">{stats?.rejectedApplications || 0}</p>
              <p className="text-lg font-semibold text-red-600 mt-2">₹{stats?.rejectedApplicationsAmount?.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">User, Queries, Reviews Analytics</h2>
          <Select value={userTimeFilter} onValueChange={setUserTimeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Past 30 Days</SelectItem>
              <SelectItem value="7days">Past 7 Days</SelectItem>
              <SelectItem value="90days">Past 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-green-600">New Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">{stats?.newRegistrations || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-blue-600">Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{stats?.userQueries || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-blue-600">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{stats?.reviews || 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;