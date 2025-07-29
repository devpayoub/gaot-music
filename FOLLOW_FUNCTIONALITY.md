# Follow and Favorites Functionality

This document describes the implementation of the follow and favorites functionality in the music platform.

## Features Implemented

### 1. Artist Follow Functionality
- **Real-time Follow/Unfollow**: Users can follow and unfollow artists with immediate UI updates
- **Follower Count Updates**: Follower counts update automatically when users follow/unfollow
- **Database Persistence**: All follow actions are saved to the `user_interactions` table
- **Cross-page Consistency**: Follow state is maintained across all pages

### 2. Album Like Functionality
- **Real-time Like/Unlike**: Users can like and unlike albums with immediate UI updates
- **Like Count Updates**: Like counts update automatically when users like/unlike
- **Database Persistence**: All like actions are saved to the `user_interactions` table
- **Cross-page Consistency**: Like state is maintained across all pages

### 3. Favorites Page
- **Tabbed Interface**: Separate tabs for "Followed Artists" and "Liked Albums"
- **Real-time Updates**: Changes reflect immediately when following/unfollowing or liking/unliking
- **Empty States**: Helpful messages and call-to-action buttons when no favorites exist
- **Direct Actions**: Users can unfollow/unlike directly from the favorites page

## Database Schema

The functionality uses the existing `user_interactions` table:

```sql
CREATE TABLE public.user_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('album', 'track', 'artist')),
    target_id UUID NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'follow')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id, interaction_type)
);
```

## API Services

### ArtistService
- `toggleFollowArtist(userId, artistId)`: Toggle follow state for an artist
- `checkFollowArtist(userId, artistId)`: Check if user follows an artist
- `getFollowedArtists(userId)`: Get all artists followed by a user

### AlbumService
- `toggleAlbumLike(userId, albumId)`: Toggle like state for an album
- `checkAlbumLike(userId, albumId)`: Check if user likes an album
- `getUserLikedAlbums(userId)`: Get all albums liked by a user

## Components Updated

### 1. Artist Profile Page (`/artists/[aka]`)
- Real-time follow button with state management
- Follower count updates
- Album like functionality
- Proper error handling

### 2. Artists Page (`/artists`)
- Follow buttons for each artist
- Real-time state updates
- Proper authentication checks

### 3. Albums Page (`/albums`)
- Like buttons for each album
- Real-time state updates
- Like count updates

### 4. Account Page (`/account`)
- URL parameter support for direct navigation to Favorites tab
- New FavoritesContent component integration

### 5. FavoritesContent Component
- Tabbed interface for followed artists and liked albums
- Real-time updates when following/unfollowing or liking/unliking
- Empty states with helpful messaging
- Direct action buttons (unfollow, unlike)

## Usage Examples

### Following an Artist
1. Navigate to an artist's profile page
2. Click the "Follow" button
3. The button changes to "Following" and follower count increases
4. Artist appears in the user's Favorites > Followed Artists tab

### Liking an Album
1. Navigate to the albums page or an artist's profile
2. Click the heart icon on an album
3. The heart fills with red and like count increases
4. Album appears in the user's Favorites > Liked Albums tab

### Accessing Favorites
1. Navigate to `/account?tab=Favorites`
2. Switch between "Followed Artists" and "Liked Albums" tabs
3. View, manage, and interact with favorites

## Technical Implementation Details

### State Management
- Uses React hooks for local state management
- Real-time updates using async/await patterns
- Proper error handling and loading states

### Database Triggers
The database includes triggers that automatically update like counts:
- `update_likes_count_insert_trigger`: Increments like count when a like is added
- `update_likes_count_delete_trigger`: Decrements like count when a like is removed

### Authentication
- All follow/like actions require user authentication
- Uses the existing `requireAuth` function from AuthContext
- Proper user ID validation before database operations

### Performance Considerations
- Efficient database queries using proper indexing
- Batch operations where possible
- Optimistic UI updates for better user experience

## Future Enhancements

1. **Notifications**: Send notifications when followed artists release new albums
2. **Recommendations**: Suggest artists/albums based on follow/like history
3. **Social Features**: Show mutual follows, activity feed
4. **Analytics**: Track follow/like patterns for artists
5. **Caching**: Implement Redis caching for frequently accessed data 