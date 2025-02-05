/**
 * Firestore service module for productions and user profiles.
 * Provides methods for managing production data and user profiles in Firestore.
 * @module
 */

import { 
  collection,
  query,
  where,
  addDoc,
  getDocs,
  orderBy,
  Timestamp,
  DocumentData,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase-config';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * User profile data structure
 * @interface
 */
export interface UserProfile {
  email: string;
  full_name: string;
  created_at: Timestamp;
  avatar_url: string | null;
}

/**
 * Production admin data structure
 * @interface
 */
export interface ProductionAdmin {
  id: string;      // User's Firebase Auth ID
  name: string;    // User's full name from their profile
}

/**
 * Cast member data structure
 * @interface
 */
export interface CastMember {
  id: string;
  name: string;
  production_role: string;
  email: string;
  phone?: string;
  created_at: Timestamp;
}

/**
 * Production data structure
 * @interface
 */
export interface Production {
  id: string;
  title: string;
  producer: string;
  created_by: string;
  created_at: Timestamp;
  admins: ProductionAdmin[];
}

// ============================================================================
// User Profile Services
// ============================================================================

/**
 * Creates or updates a user profile in Firestore
 * @param {string} userId - The user's ID
 * @param {UserProfile} profileData - The profile data to set
 * @returns {Promise<void>}
 */
export const setUserProfile = async (userId: string, profileData: UserProfile): Promise<void> => {
  try {
    const userRef = doc(db, 'profiles', userId);
    await setDoc(userRef, profileData);
  } catch (error) {
    console.error('[error setting user profile] ==>', error);
    throw error;
  }
};

// ============================================================================
// Cast Member Services
// ============================================================================

/**
 * Adds a new cast member to a production
 * @param {string} productionId - The ID of the production
 * @param {Omit<CastMember, 'id' | 'created_at'>} data - Cast member data
 * @returns {Promise<CastMember>} Created cast member
 */
export const addCastMember = async (
  productionId: string,
  data: Omit<CastMember, 'id' | 'created_at'>
): Promise<CastMember> => {
  try {
    const castRef = collection(db, 'productions', productionId, 'cast_members');
    const castData = {
      ...data,
      created_at: Timestamp.now()
    };

    const docRef = await addDoc(castRef, castData);
    
    return {
      id: docRef.id,
      ...castData
    } as CastMember;
  } catch (error) {
    console.error('[error adding cast member] ==>', error);
    throw error;
  }
};

/**
 * Fetches all cast members for a production
 * @param {string} productionId - The ID of the production
 * @returns {Promise<CastMember[]>} Array of cast members
 */
export const fetchProductionCastMembers = async (
  productionId: string
): Promise<CastMember[]> => {
  try {
    const castRef = collection(db, 'productions', productionId, 'cast_members');
    const q = query(castRef, orderBy('created_at', 'desc'));
    
    const querySnapshot = await getDocs(q);
    console.log("[fetchUserProductions] Raw data:", querySnapshot.docs.map(doc => doc.data()));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CastMember[];
  } catch (error) {
    console.error('[error fetching cast members] ==>', error);
    throw error;
  }
};

/**
 * Deletes a cast member from a production
 * @param {string} productionId - The ID of the production
 * @param {string} castMemberId - The ID of the cast member to delete
 * @returns {Promise<void>}
 */
export const deleteCastMember = async (
  productionId: string,
  castMemberId: string
): Promise<void> => {
  try {
    const castRef = doc(db, 'productions', productionId, 'cast_members', castMemberId);
    await setDoc(castRef, {}, { merge: true }); // Soft delete for now
  } catch (error) {
    console.error('[error deleting cast member] ==>', error);
    throw error;
  }
};

/**
 * Fetches a user's profile from Firestore
 * @param {string} userId - The user's ID
 * @returns {Promise<UserProfile | null>} User profile object or null if not found
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as UserProfile;
  } catch (error) {
    console.error('[error fetching user profile] ==>', error);
    throw error;
  }
};

// ============================================================================
// Production Services
// ============================================================================

/**
 * Fetches all productions where the user is either the creator or an admin
 * @param {string} userId - Current user's ID
 * @returns {Promise<Production[]>} Array of production objects
 */
export const fetchUserProductions = async (userId: string): Promise<Production[]> => {
  try {
    const q = query(
      collection(db, 'productions'),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(q);
    console.log("[fetchUserProductions] Raw data:", querySnapshot.docs.map(doc => doc.data()));
    const allProductions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Production[];
    return allProductions.filter(production =>
      production.created_by === userId ||
      (production.admins && production.admins.some((admin: ProductionAdmin) => admin.id === userId))
    );
  } catch (error) {
    console.error('[error fetching productions] ==>', error);
    throw error;
  }
};

/**
 * Fetches a specific production by its ID
 * @param {string} productionId - The ID of the production to fetch
 * @returns {Promise<Production>} Production object
 */
export const fetchProductionById = async (productionId: string): Promise<Production | null> => {
  try {
    const docRef = doc(db, 'productions', productionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Production;
  } catch (error) {
    console.error('[error fetching production] ==>', error);
    throw error;
  }
};

/**
 * Creates a new production in Firestore
 * @param {Object} data - Production data (title and producer)
 * @param {string} userId - Current user's ID
 * @returns {Promise<Production>} Created production object
 */
export const createProduction = async (
  data: { title: string; producer: string },
  userId: string
): Promise<Production> => {
  try {
    // Get user's profile to include their name in admins
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const productionData = {
      ...data,
      created_by: userId,
      created_at: Timestamp.now(),
      admins: [{
        id: userId,
        name: userProfile.full_name
      }]
    };

    const docRef = await addDoc(collection(db, 'productions'), productionData);
    
    return {
      id: docRef.id,
      ...productionData
    } as Production;
  } catch (error) {
    console.error('[error creating production] ==>', error);
    throw error;
  }
};

/**
 * Add a new admin to a production
 * @param {string} productionId - The ID of the production
 * @param {string} userId - The user ID to add as admin
 * @returns {Promise<void>}
 */
export const addProductionAdmin = async (productionId: string, userId: string): Promise<void> => {
  try {
    // Get user's profile to get their name
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const productionRef = doc(db, 'productions', productionId);
    const productionSnap = await getDoc(productionRef);
    
    if (!productionSnap.exists()) {
      throw new Error("Production not found");
    }

    const production = productionSnap.data() as Production;
    
    // Check if user is already an admin
    if (production.admins.some(admin => admin.id === userId)) {
      return; // User is already an admin
    }

    // Add new admin
    await setDoc(productionRef, {
      ...production,
      admins: [
        ...production.admins,
        {
          id: userId,
          name: userProfile.full_name
        }
      ]
    });
  } catch (error) {
    console.error('[error adding production admin] ==>', error);
    throw error;
  }
};

/**
 * Remove an admin from a production
 * @param {string} productionId - The ID of the production
 * @param {string} userId - The user ID to remove as admin
 * @returns {Promise<void>}
 */
export const removeProductionAdmin = async (productionId: string, userId: string): Promise<void> => {
  try {
    const productionRef = doc(db, 'productions', productionId);
    const productionSnap = await getDoc(productionRef);
    
    if (!productionSnap.exists()) {
      throw new Error("Production not found");
    }

    const production = productionSnap.data() as Production;
    
    // Cannot remove the last admin
    if (production.admins.length <= 1) {
      throw new Error("Cannot remove the last admin");
    }
    // Filter out the admin to remove
    await setDoc(productionRef, {
      ...production,
      admins: production.admins.filter(admin => admin.id !== userId)
    });
  } catch (error) {
    console.error('[error removing production admin] ==>', error);
    throw error;
  }
};

/**
 * Check if a user is an admin of a production
 * @param {string} productionId - The ID of the production
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} True if user is an admin
 */
export const isProductionAdmin = async (productionId: string, userId: string): Promise<boolean> => {
  try {
    const productionRef = doc(db, 'productions', productionId);
    const productionSnap = await getDoc(productionRef);
    
    if (!productionSnap.exists()) {
      return false;
    }

    const production = productionSnap.data() as Production;
    return production.admins.some(admin => admin.id === userId);
  } catch (error) {
    console.error('[error checking production admin] ==>', error);
    throw error;
  }
};
