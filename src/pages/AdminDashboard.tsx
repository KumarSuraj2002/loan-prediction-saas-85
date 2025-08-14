import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">DASHBOARD</h1>
      </div>

      {/* Top Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-green-600">New Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-yellow-600">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-600">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-cyan-600">User Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-cyan-600">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium text-cyan-400">Rating & Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-cyan-400">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Loan Analytics</h2>
          <Select defaultValue="30days">
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
              <CardTitle className="text-lg font-medium text-blue-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">8</p>
              <p className="text-lg font-semibold text-blue-600 mt-2">₹15900</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-green-600">Approved Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">7</p>
              <p className="text-lg font-semibold text-green-600 mt-2">₹15300</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-red-600">Rejected Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-600">1</p>
              <p className="text-lg font-semibold text-red-600 mt-2">₹600</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">User, Queries, Reviews Analytics</h2>
          <Select defaultValue="30days">
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
              <p className="text-4xl font-bold text-green-600">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-blue-600">Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-blue-600">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">6</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;