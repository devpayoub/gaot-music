# Supabase Storage Setup for Album Uploads

## Required Storage Buckets

You need to create two storage buckets in your Supabase project for album uploads to work:

### 1. Create `album-covers` Bucket

1. **Go to your Supabase Dashboard**
2. **Navigate to Storage** in the left sidebar
3. **Click "Create a new bucket"**
4. **Bucket name**: `album-covers`
5. **Public bucket**: ✅ Check this (so album covers can be viewed)
6. **Click "Create bucket"**

### 2. Create `tracks` Bucket

1. **Click "Create a new bucket"** again
2. **Bucket name**: `tracks`
3. **Public bucket**: ✅ Check this (so tracks can be played)
4. **Click "Create bucket"**

## Storage Policies

After creating the buckets, you need to set up RLS (Row Level Security) policies:

### For `album-covers` Bucket:

```sql
-- Allow authenticated users to upload their own album covers
CREATE POLICY "Users can upload album covers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'album-covers' AND 
  auth.role() = 'authenticated'
);

-- Allow public to view album covers
CREATE POLICY "Public can view album covers" ON storage.objects
FOR SELECT USING (bucket_id = 'album-covers');
```



```sql
-- Allow authenticated users to upload their own album covers
CREATE POLICY "Users can upload profile pic" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' AND 
  auth.role() = 'authenticated'
);

-- Allow public to view album covers
CREATE POLICY "Public can view profile pic" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-pictures');
```

### For `tracks` Bucket:

```sql
-- Allow authenticated users to upload their own tracks
CREATE POLICY "Users can upload tracks" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'tracks' AND 
  auth.role() = 'authenticated'
);

-- Allow public to view tracks
CREATE POLICY "Public can view tracks" ON storage.objects
FOR SELECT USING (bucket_id = 'tracks');
```

## How to Apply Policies

1. **Go to your Supabase Dashboard**
2. **Navigate to Storage** → **Policies**
3. **Click on each bucket** (`album-covers` and `tracks`)
4. **Click "New Policy"**
5. **Copy and paste the SQL policies above**
6. **Click "Review" and then "Save policy"**

## Testing the Upload

After setting up the storage buckets and policies:

1. **Login as a verified artist**
2. **Go to `/account?tab=Upload%20Album`**
3. **Fill in album details**:
   - Album title
   - Upload album cover (image file)
   - Upload tracks (audio files)
4. **Click "Upload Album"**
5. **Check the database** to see if the album and tracks were saved
6. **Check Supabase Storage** to see if files were uploaded

## Troubleshooting

### If upload fails with "bucket not found":
- Make sure you created both `album-covers` and `tracks` buckets
- Check that bucket names match exactly (case-sensitive)

### If upload fails with "permission denied":
- Make sure you applied the RLS policies
- Check that the user is authenticated
- Verify the policies are active

### If files upload but don't appear in database:
- Check the browser console for errors
- Verify the database tables (`albums`, `tracks`) exist
- Check that the user has the correct `artist_id`

### If files don't play/download:
- Make sure buckets are set to "Public"
- Check that the public URL policies are applied
- Verify the file URLs are correct in the database

## File Size Limits

By default, Supabase has these limits:
- **Individual file size**: 50MB
- **Total storage**: Depends on your plan

For music files, you might want to:
- **Compress audio files** before upload
- **Use smaller file formats** (MP3 instead of WAV)
- **Consider streaming** for large files

## Security Notes

- **Public buckets** mean anyone can view/download files
- **Consider implementing** access controls based on purchases
- **Monitor storage usage** to avoid exceeding limits
- **Regular backups** of important files 