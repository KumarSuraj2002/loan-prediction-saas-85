-- Create RLS policy to allow admins to view all user documents
CREATE POLICY "Admins can view all user documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);