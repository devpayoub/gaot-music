# 🎵 Music Platform - GOAT Albums

A comprehensive music platform built with Next.js, Supabase, and TypeScript. Features include user authentication, artist verification, album management, social interactions, and more.

## 🚀 Features

### 🔐 Authentication & User Management
- **Supabase Authentication** - Secure user registration and login
- **User Profiles** - Customizable profiles with bio, location, genre
- **Profile Pictures** - Upload and manage profile images
- **User Types** - Regular users and verified artists
- **Password/Email Updates** - Secure account management

### 🎤 Artist Features
- **Artist Verification** - Application system for artist verification
- **Artist Profiles** - Detailed profiles with social links
- **Follower System** - Follow/unfollow artists
- **Artist Statistics** - Follower count, album count, likes

### 🎵 Album Management
- **Album Creation** - Upload albums with covers and tracks
- **Track Management** - Add, edit, and organize tracks
- **Album Visibility** - Public/private album settings
- **Album Analytics** - Like counts, play statistics
- **Search & Discovery** - Find albums by title, artist, genre

### 💰 Monetization
- **Album Purchases** - Buy albums with secure transactions
- **Artist Earnings** - Track revenue from sales
- **Payout System** - Manage artist payouts
- **Pricing Control** - Set album prices

### 🎪 Events
- **Event Creation** - Artists can create music events
- **Ticket Sales** - Book tickets for events
- **Event Management** - Track capacity and sales

### 🔔 Notifications
- **Toast Notifications** - Success, error, and warning messages
- **Real-time Updates** - Live notifications for interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Animations**: AOS (Animate On Scroll)
- **Icons**: Lucide React

## 📊 Database Schema

### Core Tables

#### `users`
- Extends Supabase auth.users
- Stores user profiles, types (User/Artist)
- Profile pictures, bio, location, genre
- Social media links

#### `albums`
- Album metadata (title, description, genre)
- Cover images, pricing, visibility settings
- Automatic duration calculation from tracks
- Like count tracking

#### `tracks`
- Individual song information
- Audio file URLs, duration, track numbers
- Explicit content flags
- Like count tracking

#### `user_interactions`
- Unified table for likes and follows
- Supports albums, tracks, and artists
- Automatic like count updates via triggers

#### `artist_verifications`
- Verification application system
- Status tracking (not_applied, pending, verified, rejected)
- Application data and rejection reasons

#### `album_purchases`
- Purchase history and transactions
- Revenue tracking for artists

#### `events`
- Music event management
- Ticket pricing and capacity
- Booking system

### Key Features

- **Row Level Security (RLS)** - Secure data access
- **Automatic Triggers** - Update counts and timestamps
- **Foreign Key Relationships** - Data integrity
- **Indexes** - Optimized query performance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd goat_albums
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create a New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Set Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Run Database Schema
1. Go to your Supabase project SQL editor
2. Copy and paste the contents of `database/schema.sql`
3. Execute the SQL to create all tables and functions

#### Set Up Storage Buckets
Create the following storage buckets in Supabase:
- `avatars` - For profile pictures
- `album-covers` - For album cover images
- `track-audio` - For audio files

Set bucket policies to allow authenticated users to upload files.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── account/           # Account dashboard
│   ├── albums/            # Album pages
│   ├── artists/           # Artist pages
│   ├── events/            # Event pages
│   ├── login/             # Authentication pages
│   └── register/          # Registration pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── account/          # Account-specific components
│   └── navbar.tsx        # Main navigation
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
│   └── use-toast.ts      # Toast notification hook
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
├── services/             # API service classes
│   ├── userService.ts    # User management
│   ├── albumService.ts   # Album operations
│   ├── artistService.ts  # Artist operations
│   └── verificationService.ts # Verification system
└── database/             # Database schema
    └── schema.sql        # Complete database schema
```

## 🔧 Services Architecture

### UserService
- Profile updates (name, bio, location, genre)
- Password and email changes
- Profile picture upload/delete
- User statistics and account deletion

### AlbumService
- Album CRUD operations
- Track management
- File uploads (covers, audio)
- Like/unlike functionality
- Search and discovery

### ArtistService
- Artist profile management
- Follow/unfollow system
- Artist statistics
- Search and filtering

### VerificationService
- Application submission
- Status tracking
- Admin approval/rejection
- Verification statistics

## 🎨 UI Components

Built with shadcn/ui components:
- **Cards** - Album and artist displays
- **Buttons** - Consistent action buttons
- **Dialogs** - Modal interactions
- **Forms** - Input validation and handling
- **Toast** - Notification system
- **Dropdowns** - User menus and navigation

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level security
- **Authentication Required** - Protected routes and actions
- **File Upload Validation** - Secure file handling
- **Input Sanitization** - XSS protection
- **CORS Configuration** - Cross-origin security

## 📱 Responsive Design

- **Mobile First** - Optimized for all screen sizes
- **Touch Friendly** - Gesture support
- **Progressive Enhancement** - Works without JavaScript
- **Accessibility** - WCAG compliant

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🔮 Future Features

- **Real-time Chat** - Artist-fan messaging
- **Live Streaming** - Virtual concerts
- **Playlist System** - User-curated playlists
- **Advanced Analytics** - Detailed insights
- **Mobile App** - React Native version
- **API Documentation** - REST API endpoints
- **Webhook System** - Third-party integrations

---

**Built with ❤️ using Next.js and Supabase**
