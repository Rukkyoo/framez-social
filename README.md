# Framez Social

A modern social media application built with React Native and Expo, featuring Firebase authentication and Cloudinary image hosting.

## Overview

Framez Social is a mobile-first social media platform that allows users to share posts with text and images. The app provides a clean, intuitive interface with protected routes and persistent user sessions.

## Tech Stack

### Frontend
- **React Native** (v0.81.5) - Cross-platform mobile development
- **Expo** (v~54.0.23) - Platform for universal React applications
- **Expo Router** (v~6.0.14) - File-based routing for React Native
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library for React Native apps

### Backend Services
- **Firebase Authentication** - User authentication and session management
- **Firestore** - NoSQL cloud database for posts and user data
- **Cloudinary** - Cloud-based image hosting and management

### Key Dependencies
- `@firebase/auth` and `firebase` - Firebase services integration
- `@cloudinary/url-gen` and `cloudinary` - Image processing and hosting
- `expo-image-picker` - Native image selection functionality
- `@expo/vector-icons` - Cross-platform icon library

## Features

### Authentication
- User registration and login with email/password
- Persistent user sessions across app restarts
- Secure logout functionality
- Protected routes with authentication guards

### Core Functionality
- **Feed**: View posts from all users in chronological order
- **Create**: Compose new posts with text and optional images
- **Profile**: View personal profile information and user's own posts

### User Experience
- Clean, modern UI with dark theme
- Responsive design for mobile devices
- Intuitive navigation with tab-based interface
- Real-time authentication state management
- Image upload with Cloudinary integration

### Technical Features
- Cross-platform compatibility (iOS, Android, Web)
- TypeScript for enhanced code reliability
- Firebase Firestore for scalable data storage
- Expo's file-based routing system
- React Context for global state management

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project with Authentication and Firestore enabled
- Cloudinary account for image hosting

### Installation

1. **Clone the repository**
   ```bash
   git clone <[repository-url](https://github.com/Rukkyoo/framez-social)>
   cd framez-social
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:
   ```env
   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Firebase Configuration**

   Update `firebaseConfig.ts` with your Firebase project credentials:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id",
     measurementId: "your-measurement-id"
   };
   ```

### Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

3. **Set up Firestore Database**
   - Go to Firestore Database > Create database
   - Choose "Start in test mode" for development

4. **Configure Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read/write access to authenticated users
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Cloudinary Setup

1. **Create a Cloudinary account** at [Cloudinary](https://cloudinary.com/)

2. **Create an upload preset**
   - Go to Settings > Upload
   - Create a new upload preset with the following settings:
     - Mode: `Unsigned` (for client-side uploads)
     - Folder: `framez-posts`
     - Format: `Auto`
     - Allowed formats: `jpg,png,jpeg,gif,webp`

3. **Get your cloud name and upload preset name** from the dashboard

### Running the Application

1. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

2. **Run on your preferred platform**
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Web Browser**: Press `w` in the terminal
   - **Physical Device**: Scan QR code with Expo Go app

### Build for Production

1. **Build for specific platforms**
   ```bash
   # For Android APK
   npx expo build:android

   # For iOS (requires Apple Developer account)
   npx expo build:ios

   # For web static build
   npx expo export:web
   ```

## Project Structure

```
framez-social/
├── app/                          # Main application directory
│   ├── (auth)/                   # Authentication routes
│   │   ├── login.tsx            # Login screen
│   │   └── signup.tsx           # Registration screen
│   ├── (tabs)/                  # Main app tabs
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── feed.tsx             # Feed screen
│   │   ├── create.tsx           # Create post screen
│   │   └── profile.tsx          # User profile screen
│   ├── utils/                   # Utility functions
│   └── _layout.tsx              # Root layout
├── components/                  # Reusable UI components
│   ├── ui/                      # UI component library
│   └── themed-text.tsx          # Themed text component
├── constants/                   # App constants and theme
├── context/                     # React Context providers
├── firebaseConfig.ts            # Firebase configuration
├── cloudinary.ts                # Cloudinary configuration
└── README.md                    # This file
```

## Authentication Flow

1. **User Registration**: New users create accounts via the signup screen
2. **Email Verification**: Firebase handles email/password authentication
3. **Session Persistence**: User sessions persist across app restarts
4. **Route Protection**: Tab screens check authentication state and redirect unauthenticated users

## Data Flow

### Post Creation
1. User composes post with text and optional image
2. Image uploaded to Cloudinary for hosting
3. Post data stored in Firestore with user information
4. Feed updates to show new posts

### Authentication State
1. Firebase Auth listener monitors authentication changes
2. UserContext provides authentication state to all components
3. Protected routes conditionally render based on user state

## Development Notes

- The app uses React Context for global state management
- Firebase Auth persistence ensures users remain logged in across sessions
- Cloudinary handles image optimization and delivery
- Expo Router enables file-based routing for better developer experience
- TypeScript provides compile-time type checking

## Troubleshooting

### Common Issues

1. **Icons not displaying**: Ensure icon mappings are added to `icon-symbol.tsx`
2. **Authentication not persisting**: Check Firebase configuration and persistence settings
3. **Images not uploading**: Verify Cloudinary credentials and upload preset configuration
4. **Build failures**: Ensure all environment variables are properly set

### Debug Mode

Enable debugging by checking console logs for authentication and image upload processes. The app includes logging for:
- Authentication state changes
- User session management
- Image upload operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple platforms
5. Submit a pull request

## License

This project is private and proprietary.
