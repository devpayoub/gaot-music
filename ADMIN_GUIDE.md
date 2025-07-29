# Admin Guide: Artist Verification

## Admin Authentication System

### Admin Email Requirement
- **Only users with @admin.com email addresses** can access the admin panel
- **Admin accounts must be created manually** in the database or through the admin registration page
- **Regular users cannot access admin functions** even if they are not artists

## How to Set Up Admin Access

### Option 1: Manual Database Setup
1. **Add admin user directly to database** in the `users` table:
   ```sql
   INSERT INTO users (id, email, full_name, user_type, created_at, updated_at)
   VALUES (
     gen_random_uuid(),
     'admin@admin.com',
     'Admin User',
     'User',
     NOW(),
     NOW()
   );
   ```

### Option 2: Use Admin Registration Page
1. **Go to `/admin/register`** in your browser
2. **Fill out the admin registration form**:
   - Full Name: Your admin name
   - Email: Must end with `@admin.com` (e.g., `admin@admin.com`)
   - Password: At least 8 characters
   - Confirm Password: Must match
3. **Submit the form** to create the admin account
4. **Check your email** for verification link
5. **Verify your account** by clicking the link

## How to Access the Admin Panel

### Step 1: Admin Login
1. **Go to `/admin/login`** in your browser
2. **Enter your admin credentials**:
   - Email: Must be `@admin.com` email
   - Password: Your admin password
3. **Click "Sign In as Admin"**
4. **You'll be redirected to the admin dashboard**

### Step 2: Access Admin Functions
1. **From the admin dashboard**, click on **"Artist Verifications"**
2. **You'll see three tabs**: Pending, Verified, and Rejected

## How to Verify Artists

### Step 1: Review Pending Applications
1. **Go to the "Pending" tab**
2. **Review each application** which includes:
   - Artist name and genre
   - Bio and social media links
   - User information (name, email)

### Step 2: Approve or Reject
For each pending application, you have two options:

#### **Approve an Artist:**
- Click the **"Approve"** button (green)
- The artist will immediately get:
  - ✅ "Verified" status
  - ✅ Blue verification badge
  - ✅ Access to upload albums and sell music

#### **Reject an Application:**
- Click the **"Reject"** button (red)
- The artist will see:
  - ❌ "Rejected" status
  - ❌ Option to apply again
  - ❌ No verification badge

### Step 3: Monitor Results
- **"Verified" tab**: See all approved artists
- **"Rejected" tab**: See all rejected applications

## What Happens When You Verify an Artist

### For the Artist:
1. **Status changes** from "Pending" to "Verified"
2. **Verification badge** appears next to their name
3. **Can upload albums** and set prices
4. **Can sell music** on the platform
5. **Gets access** to artist-specific features

### For the Platform:
1. **Verified artists** appear with blue badges
2. **Users can trust** verified artists
3. **Better user experience** with verified content

## Security Features

- **@admin.com email requirement**: Only admin emails can access admin panel
- **Email verification**: Admin accounts require email confirmation
- **Password strength**: Minimum 8 characters required
- **Access control**: Automatic redirects for non-admin users
- **Session management**: Secure admin sessions

## Troubleshooting

### If you can't access the admin panel:
- **Check your email**: Must end with `@admin.com`
- **Verify your account**: Check email for verification link
- **Try admin login**: Go to `/admin/login`
- **Create admin account**: Use `/admin/register` if no admin exists

### If admin registration doesn't work:
- **Check email format**: Must be `@admin.com`
- **Verify password strength**: At least 8 characters
- **Check email verification**: Must verify email before login
- **Database connection**: Ensure Supabase is connected

### If verification doesn't work:
- **Check browser console** for errors
- **Ensure database connection** is working
- **Verify admin permissions** are correct
- **Check RLS policies** in Supabase

## Best Practices

1. **Use strong passwords** for admin accounts
2. **Keep admin emails secure** and private
3. **Review thoroughly** before approving artists
4. **Check social media links** for authenticity
5. **Document rejection reasons** if needed
6. **Monitor admin activity** regularly

## Quick Actions

- **Create admin**: Use `/admin/register` for first admin
- **Admin login**: Use `/admin/login` for existing admins
- **Approve artists**: Use green approve button
- **Reject applications**: Use red reject button
- **Monitor activity**: Check verified/rejected tabs

## Admin URLs

- **Admin Login**: `/admin/login`
- **Admin Registration**: `/admin/register`
- **Admin Dashboard**: `/admin`
- **Artist Verifications**: `/admin/verifications` 