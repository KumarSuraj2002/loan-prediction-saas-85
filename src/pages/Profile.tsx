import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

interface ProfileData {
  full_name: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  employment_status: string;
  employer_name: string;
  monthly_income: string;
  occupation: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileData>();

  const employment_status = watch("employment_status");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to view your profile");
      navigate("/");
      return;
    }
    loadProfile(session.user.id);
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setValue('full_name', data.full_name || '');
        setValue('phone', data.phone || '');
        setValue('date_of_birth', data.date_of_birth || '');
        setValue('address', data.address || '');
        setValue('city', data.city || '');
        setValue('state', data.state || '');
        setValue('postal_code', data.postal_code || '');
        setValue('employment_status', data.employment_status || '');
        setValue('employer_name', data.employer_name || '');
        setValue('monthly_income', data.monthly_income?.toString() || '');
        setValue('occupation', data.occupation || '');
        setProfileCompleted(data.profile_completed || false);
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: ProfileData) => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in");
        return;
      }

      const isComplete = !!(
        formData.full_name &&
        formData.phone &&
        formData.date_of_birth &&
        formData.address &&
        formData.city &&
        formData.state &&
        formData.postal_code &&
        formData.employment_status &&
        formData.monthly_income
      );

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : null,
          profile_completed: isComplete
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      setProfileCompleted(isComplete);
      toast.success(isComplete ? "Profile completed!" : "Profile updated!");
    } catch (error: any) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              {profileCompleted 
                ? "Your profile is complete. You can update your information anytime."
                : "Complete your profile to apply for loans and access all features."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      {...register("full_name", { required: "Full name is required" })}
                      placeholder="John Doe"
                    />
                    {errors.full_name && (
                      <p className="text-sm text-destructive">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register("phone", { required: "Phone number is required" })}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      {...register("date_of_birth", { required: "Date of birth is required" })}
                    />
                    {errors.date_of_birth && (
                      <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    {...register("address", { required: "Address is required" })}
                    placeholder="123 Main St"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register("city", { required: "City is required" })}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...register("state", { required: "State is required" })}
                      placeholder="NY"
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code *</Label>
                    <Input
                      id="postal_code"
                      {...register("postal_code", { required: "Postal code is required" })}
                      placeholder="10001"
                    />
                    {errors.postal_code && (
                      <p className="text-sm text-destructive">{errors.postal_code.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Employment Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employment_status">Employment Status *</Label>
                    <Select
                      value={employment_status}
                      onValueChange={(value) => setValue("employment_status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly_income">Monthly Income *</Label>
                    <Input
                      id="monthly_income"
                      type="number"
                      {...register("monthly_income", { required: "Monthly income is required" })}
                      placeholder="5000"
                    />
                    {errors.monthly_income && (
                      <p className="text-sm text-destructive">{errors.monthly_income.message}</p>
                    )}
                  </div>

                  {(employment_status === "employed" || employment_status === "self-employed") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="employer_name">Employer Name</Label>
                        <Input
                          id="employer_name"
                          {...register("employer_name")}
                          placeholder="Company Name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                          id="occupation"
                          {...register("occupation")}
                          placeholder="Software Engineer"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
