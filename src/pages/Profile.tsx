import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Upload, X } from "lucide-react";

interface ProfileData {
  full_name: string;
  phone: string;
  date_of_birth: string;
  pan_number: string;
  aadhar_number: string;
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState({
    pan_card_url: '',
    aadhar_card_url: '',
    income_certificate_url: '',
    address_proof_url: '',
    bank_statement_url: ''
  });
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
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
    setUserId(session.user.id);
    loadProfile(session.user.id);
  };

  const loadProfile = async (userId: string) => {
    try {
      console.log("🔍 Loading profile for user:", userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("❌ Error loading profile:", error);
        
        // If no profile exists, create one
        if (error.code === 'PGRST116') {
          console.log("📝 No profile found, creating new profile...");
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ user_id: userId })
            .select()
            .single();
          
          if (insertError) {
            console.error("❌ Error creating profile:", insertError);
            throw insertError;
          }
          
          console.log("✅ New profile created:", newProfile);
          return;
        }
        
        throw error;
      }

      if (data) {
        console.log("✅ Profile loaded successfully:", data);
        setValue('full_name', data.full_name || '');
        setValue('phone', data.phone || '');
        setValue('date_of_birth', data.date_of_birth || '');
        setValue('pan_number', data.pan_number || '');
        setValue('aadhar_number', data.aadhar_number || '');
        setValue('address', data.address || '');
        setValue('city', data.city || '');
        setValue('state', data.state || '');
        setValue('postal_code', data.postal_code || '');
        setValue('employment_status', data.employment_status || '');
        setValue('employer_name', data.employer_name || '');
        setValue('monthly_income', data.monthly_income?.toString() || '');
        setValue('occupation', data.occupation || '');
        setProfileCompleted(data.profile_completed || false);
        setAvatarUrl(data.avatar_url || null);
        setDocuments({
          pan_card_url: data.pan_card_url || '',
          aadhar_card_url: data.aadhar_card_url || '',
          income_certificate_url: data.income_certificate_url || '',
          address_proof_url: data.address_proof_url || '',
          bank_statement_url: data.bank_statement_url || ''
        });
      }
    } catch (error: any) {
      console.error("❌ Failed to load profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      // Delete old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success("Profile photo updated!");
    } catch (error: any) {
      toast.error("Error uploading photo");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);

      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', userId);

      if (error) throw error;

      setAvatarUrl(null);
      toast.success("Profile photo removed!");
    } catch (error: any) {
      toast.error("Error removing photo");
    } finally {
      setUploading(false);
    }
  };

  const uploadDocument = async (file: File, docType: string) => {
    if (!userId) return;

    try {
      setUploadingDoc(docType);
      const fileExt = file.name.split('.').pop();
      const fileName = `${docType}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const oldUrl = documents[docType as keyof typeof documents];
      if (oldUrl) {
        const oldPath = oldUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('user-documents').remove([oldPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Store the file path instead of public URL for private bucket
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [docType]: filePath })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setDocuments(prev => ({ ...prev, [docType]: filePath }));
      toast.success("Document uploaded successfully!");
    } catch (error: any) {
      toast.error("Failed to upload document");
    } finally {
      setUploadingDoc(null);
    }
  };

  const removeDocument = async (docType: string) => {
    if (!userId) return;

    try {
      setUploadingDoc(docType);
      const docUrl = documents[docType as keyof typeof documents];
      if (!docUrl) return;

      const filePath = docUrl.split('/').slice(-2).join('/');
      
      const { error: deleteError } = await supabase.storage
        .from('user-documents')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [docType]: null })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setDocuments(prev => ({ ...prev, [docType]: '' }));
      toast.success("Document removed successfully!");
    } catch (error: any) {
      toast.error("Failed to remove document");
    } finally {
      setUploadingDoc(null);
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

      console.log("📝 Submitting profile update for user:", session.user.id);
      console.log("Profile data being submitted:", formData);

      const isComplete = !!(
        formData.full_name &&
        formData.phone &&
        formData.date_of_birth &&
        formData.pan_number &&
        formData.aadhar_number &&
        formData.address &&
        formData.city &&
        formData.state &&
        formData.postal_code &&
        formData.employment_status &&
        formData.monthly_income
      );

      const updateData = {
        ...formData,
        monthly_income: formData.monthly_income ? parseFloat(formData.monthly_income) : null,
        profile_completed: isComplete
      };

      console.log("Profile completion status:", isComplete);
      console.log("Update data payload:", updateData);

      const { data, error, status, statusText } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', session.user.id)
        .select();

      console.log("📊 Update response:", { data, error, status, statusText });

      if (error) {
        console.error("❌ Error updating profile:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (!data || data.length === 0) {
        console.error("⚠️ Update succeeded but no data returned - possible RLS issue");
        console.log("Attempting to verify update by re-fetching...");
        
        const { data: verifyData, error: verifyError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        console.log("Verification result:", { verifyData, verifyError });
      }

      console.log("✅ Profile updated successfully:", data);
      console.log("Updated profile should now be visible in Admin -> Users section");

      setProfileCompleted(isComplete);
      toast.success(isComplete ? "Profile completed!" : "Profile updated!");
    } catch (error: any) {
      console.error("❌ Profile update failed:", error);
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
              {/* Profile Photo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Photo</h3>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || ''} />
                    <AvatarFallback>
                      {watch('full_name')?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={uploadAvatar}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                        </>
                      )}
                    </Button>
                    {avatarUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeAvatar}
                        disabled={uploading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove Photo
                      </Button>
                    )}
                  </div>
                </div>
              </div>

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

                  <div className="space-y-2">
                    <Label htmlFor="pan_number">PAN Card Number *</Label>
                    <Input
                      id="pan_number"
                      {...register("pan_number", { required: "PAN number is required" })}
                      placeholder="ABCDE1234F"
                    />
                    {errors.pan_number && (
                      <p className="text-sm text-destructive">{errors.pan_number.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhar_number">Aadhar Card Number *</Label>
                    <Input
                      id="aadhar_number"
                      {...register("aadhar_number", { required: "Aadhar number is required" })}
                      placeholder="1234 5678 9012"
                    />
                    {errors.aadhar_number && (
                      <p className="text-sm text-destructive">{errors.aadhar_number.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Documents</h3>
                
                {[
                  { key: 'pan_card_url', label: 'PAN Card', accept: 'image/*,application/pdf' },
                  { key: 'aadhar_card_url', label: 'Aadhar Card', accept: 'image/*,application/pdf' },
                  { key: 'income_certificate_url', label: 'Income Certificate', accept: 'image/*,application/pdf' },
                  { key: 'address_proof_url', label: 'Address Proof', accept: 'image/*,application/pdf' },
                  { key: 'bank_statement_url', label: 'Bank Statement (Last 3 months)', accept: 'image/*,application/pdf' }
                ].map(({ key, label, accept }) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">{label}</Label>
                      {documents[key as keyof typeof documents] && (
                        <p className="text-xs text-muted-foreground mt-1">✓ Document uploaded</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {documents[key as keyof typeof documents] ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const filePath = documents[key as keyof typeof documents];
                              const { data, error } = await supabase.storage
                                .from('user-documents')
                                .createSignedUrl(filePath, 60);
                              
                              if (error) {
                                toast.error("Failed to load document");
                                return;
                              }
                              
                              if (data?.signedUrl) {
                                window.open(data.signedUrl, '_blank');
                              }
                            }}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDocument(key)}
                            disabled={uploadingDoc === key}
                          >
                            {uploadingDoc === key ? "Removing..." : "Remove"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = accept;
                            input.onchange = (e: any) => {
                              const file = e.target?.files?.[0];
                              if (file) uploadDocument(file, key);
                            };
                            input.click();
                          }}
                          disabled={uploadingDoc === key}
                        >
                          {uploadingDoc === key ? "Uploading..." : "Upload"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
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
