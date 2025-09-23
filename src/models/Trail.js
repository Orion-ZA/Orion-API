// Firebase Trail model - No schema needed, just validation and helper functions

class Trail {
  constructor(data) {
    this.name = data.name || '';
    this.location = data.location || { latitude: 0, longitude: 0 };
    this.distance = data.distance || 0;
    this.elevationGain = data.elevationGain || 0;
    this.difficulty = data.difficulty || 'Easy';
    this.tags = data.tags || [];
    this.gpsRoute = data.gpsRoute || [];
    this.description = data.description || '';
    this.photos = data.photos || [];
    this.status = data.status || 'open';
    this.createdBy = data.createdBy || '';
    this.createdAt = data.createdAt || new Date();
    this.lastUpdated = data.lastUpdated || new Date();
  }

  // Validation for GeoPoint
  static validateGeoPoint(geoPoint) {
    const errors = [];
    
    if (typeof geoPoint.latitude !== 'number' || geoPoint.latitude < -90 || geoPoint.latitude > 90) {
      errors.push('Latitude must be a number between -90 and 90');
    }
    
    if (typeof geoPoint.longitude !== 'number' || geoPoint.longitude < -180 || geoPoint.longitude > 180) {
      errors.push('Longitude must be a number between -180 and 180');
    }
    
    return errors;
  }

  // Validation for entire trail document
  static validate(trailData) {
    const errors = [];
    
    // Validate name
    if (!trailData.name || typeof trailData.name !== 'string' || trailData.name.trim().length === 0) {
      errors.push('Trail name is required');
    } else if (trailData.name.length > 100) {
      errors.push('Trail name cannot exceed 100 characters');
    }
    
    // Validate location
    if (!trailData.location) {
      errors.push('Trail location is required');
    } else {
      errors.push(...this.validateGeoPoint(trailData.location));
    }
    
    // Validate distance
    if (typeof trailData.distance !== 'number' || trailData.distance < 0) {
      errors.push('Distance must be a positive number');
    }
    
    // Validate elevation gain
    if (typeof trailData.elevationGain !== 'number' || trailData.elevationGain < 0) {
      errors.push('Elevation gain must be a positive number');
    }
    
    // Validate difficulty
    const validDifficulties = ['Easy', 'Moderate', 'Hard', 'Expert'];
    if (!validDifficulties.includes(trailData.difficulty)) {
      errors.push('Difficulty must be one of: Easy, Moderate, Hard, Expert');
    }
    
    // Validate tags
    if (trailData.tags && !Array.isArray(trailData.tags)) {
      errors.push('Tags must be an array');
    } else if (trailData.tags && trailData.tags.length > 10) {
      errors.push('Cannot have more than 10 tags');
    } else if (trailData.tags) {
      trailData.tags.forEach((tag, index) => {
        if (typeof tag !== 'string' || tag.length > 50) {
          errors.push(`Tag ${index} must be a string with max 50 characters`);
        }
      });
    }
    
    // Validate GPS route
    if (trailData.gpsRoute && !Array.isArray(trailData.gpsRoute)) {
      errors.push('GPS route must be an array');
    } else if (trailData.gpsRoute && trailData.gpsRoute.length < 2) {
      errors.push('GPS route must have at least 2 points');
    } else if (trailData.gpsRoute) {
      trailData.gpsRoute.forEach((point, index) => {
        errors.push(...this.validateGeoPoint(point).map(err => `GPS route point ${index}: ${err}`));
      });
    }
    
    // Validate description
    if (!trailData.description || typeof trailData.description !== 'string' || trailData.description.trim().length === 0) {
      errors.push('Trail description is required');
    } else if (trailData.description.length > 2000) {
      errors.push('Description cannot exceed 2000 characters');
    }
    
    // Validate photos
    if (trailData.photos && !Array.isArray(trailData.photos)) {
      errors.push('Photos must be an array');
    } else if (trailData.photos && trailData.photos.length > 20) {
      errors.push('Cannot have more than 20 photos');
    } else if (trailData.photos) {
      trailData.photos.forEach((photo, index) => {
        if (typeof photo !== 'string' || !/^https?:\/\/.+/.test(photo)) {
          errors.push(`Photo ${index} must be a valid URL`);
        }
      });
    }
    
    // Validate status
    const validStatuses = ['open', 'closed', 'maintenance', 'seasonal'];
    if (trailData.status && !validStatuses.includes(trailData.status)) {
      errors.push('Status must be one of: open, closed, maintenance, seasonal');
    }
    
    // Validate createdBy
    if (!trailData.createdBy || typeof trailData.createdBy !== 'string') {
      errors.push('Creator information is required');
    }
    
    return errors;
  }

  // Helper method to add a photo
  addPhoto(photoUrl) {
    if (this.photos.length < 20 && /^https?:\/\/.+/.test(photoUrl)) {
      this.photos.push(photoUrl);
    }
  }

  // Helper method to remove a photo
  removePhoto(photoUrl) {
    this.photos = this.photos.filter(photo => photo !== photoUrl);
  }

  // Helper method to add a tag
  addTag(tag) {
    if (this.tags.length < 10 && typeof tag === 'string' && tag.length <= 50 && !this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  // Helper method to remove a tag
  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  // Helper method to add GPS route point
  addGPSPoint(latitude, longitude) {
    const errors = this.validateGeoPoint({ latitude, longitude });
    if (errors.length === 0) {
      this.gpsRoute.push({ latitude, longitude });
    }
    return errors;
  }

  // Helper method to update status
  updateStatus(newStatus) {
    const validStatuses = ['open', 'closed', 'maintenance', 'seasonal'];
    if (validStatuses.includes(newStatus)) {
      this.status = newStatus;
      this.lastUpdated = new Date();
      return true;
    }
    return false;
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      name: this.name,
      location: this.location,
      distance: this.distance,
      elevationGain: this.elevationGain,
      difficulty: this.difficulty,
      tags: this.tags,
      gpsRoute: this.gpsRoute,
      description: this.description,
      photos: this.photos,
      status: this.status,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Trail(data);
  }

  // Calculate distance between two GeoPoints (Haversine formula)
  static calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.latitude)) * Math.cos(this.toRadians(point2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Convert degrees to radians
  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

module.exports = Trail;
