# Supabase Email Confirmation Setup

## 1. Enable Email Confirmation in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Under **Email Auth**, make sure **Enable email confirmations** is checked
4. Configure your email templates if needed

## 2. Email Template Configuration (Optional)

You can customize the email templates in Supabase:

1. Go to **Authentication** → **Email Templates**
2. Edit the **Confirm signup** template
3. You can customize the subject and content

## 3. SMTP Configuration (Optional)

For production, you might want to use your own SMTP provider:

1. Go to **Authentication** → **Settings**
2. Under **SMTP Settings**, configure your SMTP provider
3. Test the email delivery

## 4. Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Testing Email Confirmation

1. Register a new account
2. Check your email for the confirmation code
3. Enter the 6-digit code in the confirmation page
4. Your account should be created and you can log in

## 6. Troubleshooting

### Email not received:
- Check spam folder
- Verify email address is correct
- Check Supabase logs for email delivery errors

### Invalid code:
- Make sure you're using the latest code sent
- Codes expire after a certain time
- Use the "Resend code" button if needed

### Profile creation fails:
- Check database permissions
- Verify RLS policies are correct
- Check Supabase logs for database errors 