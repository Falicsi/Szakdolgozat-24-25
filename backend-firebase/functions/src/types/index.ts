export interface User {
    displayName: string;
    email: string;
    roles: string[];
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
  
  export interface Role {
    name: string;
    description?: string;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
  
  export interface Category {
    name: string;
    color?: string;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
  
  export interface Resource {
    name: string;
    type: 'room' | 'equipment' | 'online' | 'other';
    description?: string;
    url?: string;
    metadata?: any;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
  
  export interface Event {
    title: string;
    start: string;
    end: string;
    description?: string;
    categoryId?: string;
    resources?: string[];
    createdBy: string;
    invitedUsers: string[];
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
  
  export interface Invitation {
    eventId: string;
    userId: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
  
  export interface Profile {
    userId: string;
    fullName: string;
    avatarUrl?: string;
    bio?: string;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
