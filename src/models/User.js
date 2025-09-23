// Firebase User model - No schema needed, just validation and helper functions

class User {
  constructor(data) {
    this.profileInfo = data.profileInfo || {};
    this.submittedTrails = data.submittedTrails || [];
    this.favourites = data.favourites || [];
    this.completedHikes = data.completedHikes || [];
    this.wishlist = data.wishlist || [];
  }

  // Validation for profile info
  static validateProfileInfo(profileInfo) {
    const errors = [];
    
    if (!profileInfo.name || typeof profileInfo.name !== 'string' || profileInfo.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }
    
    if (!profileInfo.email || typeof profileInfo.email !== 'string') {
      errors.push('Email is required');
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(profileInfo.email)) {
        errors.push('Please enter a valid email address');
      }
    }
    
    if (profileInfo.name && profileInfo.name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
    
    return errors;
  }

  // Validation for trail references
  static validateTrailReferences(trailRefs, fieldName) {
    if (!Array.isArray(trailRefs)) {
      return [`${fieldName} must be an array`];
    }
    
    const errors = [];
    trailRefs.forEach((ref, index) => {
      if (typeof ref !== 'string' || ref.trim().length === 0) {
        errors.push(`${fieldName}[${index}] must be a valid trail document ID`);
      }
    });
    
    return errors;
  }

  // Validate entire user document
  static validate(userData) {
    const errors = [];
    
    // Validate profile info
    if (userData.profileInfo) {
      errors.push(...this.validateProfileInfo(userData.profileInfo));
    }
    
    // Validate trail references
    if (userData.submittedTrails) {
      errors.push(...this.validateTrailReferences(userData.submittedTrails, 'submittedTrails'));
    }
    
    if (userData.favourites) {
      errors.push(...this.validateTrailReferences(userData.favourites, 'favourites'));
    }
    
    if (userData.completedHikes) {
      errors.push(...this.validateTrailReferences(userData.completedHikes, 'completedHikes'));
    }
    
    if (userData.wishlist) {
      errors.push(...this.validateTrailReferences(userData.wishlist, 'wishlist'));
    }
    
    return errors;
  }

  // Helper method to add a trail to submitted trails
  addSubmittedTrail(trailId) {
    if (!this.submittedTrails.includes(trailId)) {
      this.submittedTrails.push(trailId);
    }
  }

  // Helper method to add a trail to favourites
  addToFavourites(trailId) {
    if (!this.favourites.includes(trailId)) {
      this.favourites.push(trailId);
    }
  }

  // Helper method to remove from favourites
  removeFromFavourites(trailId) {
    this.favourites = this.favourites.filter(id => id !== trailId);
  }

  // Helper method to add a completed hike
  addCompletedHike(trailId) {
    if (!this.completedHikes.includes(trailId)) {
      this.completedHikes.push(trailId);
    }
  }

  // Helper method to add to wishlist
  addToWishlist(trailId) {
    if (!this.wishlist.includes(trailId)) {
      this.wishlist.push(trailId);
    }
  }

  // Helper method to remove from wishlist
  removeFromWishlist(trailId) {
    this.wishlist = this.wishlist.filter(id => id !== trailId);
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      profileInfo: this.profileInfo,
      submittedTrails: this.submittedTrails,
      favourites: this.favourites,
      completedHikes: this.completedHikes,
      wishlist: this.wishlist
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new User(data);
  }
}

module.exports = User;
