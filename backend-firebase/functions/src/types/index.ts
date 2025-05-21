export interface User {
    displayName: string;
    email: string;
    roles: string[];       // Role doc ID-k
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
    start: string;                // ISO string vagy Timestamp, ha időintervallum kell
    end: string;                  // ISO string vagy Timestamp
    description?: string;
    categoryId?: string;          // opcionális, ha nem kötelező
    resources?: string[];         // opcionális, ha nem kötelező
    createdBy: string;            // <-- EZ KELL
    invitedUsers: string[];       // <-- EZ KELL
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
  
  export interface Invitation {
    eventId: string;       // Event doc ID
    userId: string;        // User doc ID
    status: 'pending' | 'accepted' | 'declined';
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
  }
