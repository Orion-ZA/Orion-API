const User = require('../src/models/User');

describe('User Model', () => {
  describe('Constructor', () => {
    it('should create a user with default values', () => {
      const user = new User({});
      
      expect(user.profileInfo).toEqual({});
      expect(user.submittedTrails).toEqual([]);
      expect(user.favourites).toEqual([]);
      expect(user.completed).toEqual([]);
      expect(user.wishlist).toEqual([]);
    });

    it('should create a user with provided data', () => {
      const data = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        submittedTrails: ['trail1', 'trail2'],
        favourites: ['trail3'],
        completed: ['trail4'],
        wishlist: ['trail5']
      };
      
      const user = new User(data);
      
      expect(user.profileInfo).toEqual({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(user.submittedTrails).toEqual(['trail1', 'trail2']);
      expect(user.favourites).toEqual(['trail3']);
      expect(user.completed).toEqual(['trail4']);
      expect(user.wishlist).toEqual(['trail5']);
    });
  });

  describe('validateProfileInfo', () => {
    it('should validate valid profile info', () => {
      const profileInfo = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toEqual([]);
    });

    it('should return error for missing name', () => {
      const profileInfo = {
        email: 'john@example.com'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toContain('Name is required and must be a non-empty string');
    });

    it('should return error for empty name', () => {
      const profileInfo = {
        name: '',
        email: 'john@example.com'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toContain('Name is required and must be a non-empty string');
    });

    it('should return error for whitespace-only name', () => {
      const profileInfo = {
        name: '   ',
        email: 'john@example.com'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toContain('Name is required and must be a non-empty string');
    });

    it('should return error for non-string name', () => {
      const profileInfo = {
        name: 123,
        email: 'john@example.com'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toContain('Name is required and must be a non-empty string');
    });

    it('should return error for name too long', () => {
      const profileInfo = {
        name: 'a'.repeat(101),
        email: 'john@example.com'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toContain('Name cannot exceed 100 characters');
    });

    it('should return error for missing email', () => {
      const profileInfo = {
        name: 'John Doe'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toContain('Email is required');
    });

    it('should return error for non-string email', () => {
      const profileInfo = {
        name: 'John Doe',
        email: 123
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toContain('Email is required');
    });

    it('should return error for invalid email format', () => {
      const profileInfo = {
        name: 'John Doe',
        email: 'invalid-email'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toContain('Please enter a valid email address');
    });

    it('should validate various valid email formats', () => {
      const validEmails = [
        'john@example.com',
        'jane.doe@example.org',
        'user123@example.co.uk'
      ];
      
      validEmails.forEach(email => {
        const profileInfo = {
          name: 'John Doe',
          email: email
        };
        
        const errors = User.validateProfileInfo(profileInfo);
        expect(errors).not.toContain('Please enter a valid email address');
      });
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const profileInfo = {
        name: '',
        email: 'invalid-email'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toHaveLength(2);
      expect(errors).toContain('Name is required and must be a non-empty string');
      expect(errors).toContain('Please enter a valid email address');
    });
  });

  describe('validateTrailReferences', () => {
    it('should validate valid trail references', () => {
      const trailRefs = ['trail1', 'trail2', 'trail3'];
      const errors = User.validateTrailReferences(trailRefs, 'favourites');
      expect(errors).toEqual([]);
    });

    it('should return error for non-array trail references', () => {
      const trailRefs = 'not-an-array';
      const errors = User.validateTrailReferences(trailRefs, 'favourites');
      expect(errors).toContain('favourites must be an array');
    });

    it('should return error for invalid trail reference', () => {
      const trailRefs = ['trail1', 123, 'trail3'];
      const errors = User.validateTrailReferences(trailRefs, 'favourites');
      expect(errors).toContain('favourites[1] must be a valid trail document ID');
    });

    it('should return error for empty trail reference', () => {
      const trailRefs = ['trail1', '', 'trail3'];
      const errors = User.validateTrailReferences(trailRefs, 'favourites');
      expect(errors).toContain('favourites[1] must be a valid trail document ID');
    });

    it('should return error for whitespace-only trail reference', () => {
      const trailRefs = ['trail1', '   ', 'trail3'];
      const errors = User.validateTrailReferences(trailRefs, 'favourites');
      expect(errors).toContain('favourites[1] must be a valid trail document ID');
    });

    it('should return multiple errors for multiple invalid references', () => {
      const trailRefs = [123, '', '   ', null];
      const errors = User.validateTrailReferences(trailRefs, 'favourites');
      expect(errors).toHaveLength(4);
      expect(errors).toContain('favourites[0] must be a valid trail document ID');
      expect(errors).toContain('favourites[1] must be a valid trail document ID');
      expect(errors).toContain('favourites[2] must be a valid trail document ID');
      expect(errors).toContain('favourites[3] must be a valid trail document ID');
    });
  });

  describe('validate', () => {
    it('should validate a complete valid user', () => {
      const userData = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        submittedTrails: ['trail1', 'trail2'],
        favourites: ['trail3'],
        completed: ['trail4'],
        wishlist: ['trail5']
      };
      
      const errors = User.validate(userData);
      expect(errors).toEqual([]);
    });

    it('should validate user with only profile info', () => {
      const userData = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      };
      
      const errors = User.validate(userData);
      expect(errors).toEqual([]);
    });

    it('should return errors for invalid profile info', () => {
      const userData = {
        profileInfo: {
          name: '',
          email: 'invalid-email'
        }
      };
      
      const errors = User.validate(userData);
      expect(errors).toContain('Name is required and must be a non-empty string');
      expect(errors).toContain('Please enter a valid email address');
    });

    it('should return errors for invalid submitted trails', () => {
      const userData = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        submittedTrails: [123, '']
      };
      
      const errors = User.validate(userData);
      expect(errors).toContain('submittedTrails[0] must be a valid trail document ID');
      expect(errors).toContain('submittedTrails[1] must be a valid trail document ID');
    });

    it('should return errors for invalid favourites', () => {
      const userData = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        favourites: [null, '   ']
      };
      
      const errors = User.validate(userData);
      expect(errors).toContain('favourites[0] must be a valid trail document ID');
      expect(errors).toContain('favourites[1] must be a valid trail document ID');
    });

    it('should return errors for invalid completed trails', () => {
      const userData = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        completed: [456, undefined]
      };
      
      const errors = User.validate(userData);
      expect(errors).toContain('completed[0] must be a valid trail document ID');
      expect(errors).toContain('completed[1] must be a valid trail document ID');
    });

    it('should return errors for invalid wishlist', () => {
      const userData = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        wishlist: [true, false]
      };
      
      const errors = User.validate(userData);
      expect(errors).toContain('wishlist[0] must be a valid trail document ID');
      expect(errors).toContain('wishlist[1] must be a valid trail document ID');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const userData = {
        profileInfo: {
          name: '',
          email: 'invalid-email'
        },
        submittedTrails: [123],
        favourites: [''],
        completed: [null],
        wishlist: [undefined]
      };
      
      const errors = User.validate(userData);
      expect(errors.length).toBeGreaterThan(5);
      expect(errors).toContain('Name is required and must be a non-empty string');
      expect(errors).toContain('Please enter a valid email address');
      expect(errors).toContain('submittedTrails[0] must be a valid trail document ID');
      expect(errors).toContain('favourites[0] must be a valid trail document ID');
      expect(errors).toContain('completed[0] must be a valid trail document ID');
      expect(errors).toContain('wishlist[0] must be a valid trail document ID');
    });
  });

  describe('addSubmittedTrail', () => {
    it('should add a new trail to submitted trails', () => {
      const user = new User({});
      user.addSubmittedTrail('trail1');
      
      expect(user.submittedTrails).toContain('trail1');
    });

    it('should not add duplicate trail to submitted trails', () => {
      const user = new User({});
      user.addSubmittedTrail('trail1');
      user.addSubmittedTrail('trail1');
      
      expect(user.submittedTrails).toHaveLength(1);
      expect(user.submittedTrails).toContain('trail1');
    });

    it('should add multiple different trails', () => {
      const user = new User({});
      user.addSubmittedTrail('trail1');
      user.addSubmittedTrail('trail2');
      
      expect(user.submittedTrails).toHaveLength(2);
      expect(user.submittedTrails).toContain('trail1');
      expect(user.submittedTrails).toContain('trail2');
    });
  });

  describe('addToFavourites', () => {
    it('should add a new trail to favourites', () => {
      const user = new User({});
      user.addToFavourites('trail1');
      
      expect(user.favourites).toContain('trail1');
    });

    it('should not add duplicate trail to favourites', () => {
      const user = new User({});
      user.addToFavourites('trail1');
      user.addToFavourites('trail1');
      
      expect(user.favourites).toHaveLength(1);
      expect(user.favourites).toContain('trail1');
    });

    it('should add multiple different trails to favourites', () => {
      const user = new User({});
      user.addToFavourites('trail1');
      user.addToFavourites('trail2');
      
      expect(user.favourites).toHaveLength(2);
      expect(user.favourites).toContain('trail1');
      expect(user.favourites).toContain('trail2');
    });
  });

  describe('removeFromFavourites', () => {
    it('should remove existing trail from favourites', () => {
      const user = new User({});
      user.favourites = ['trail1', 'trail2', 'trail3'];
      
      user.removeFromFavourites('trail2');
      
      expect(user.favourites).not.toContain('trail2');
      expect(user.favourites).toContain('trail1');
      expect(user.favourites).toContain('trail3');
      expect(user.favourites).toHaveLength(2);
    });

    it('should handle removing non-existent trail from favourites', () => {
      const user = new User({});
      user.favourites = ['trail1', 'trail2'];
      
      user.removeFromFavourites('trail3');
      
      expect(user.favourites).toHaveLength(2);
      expect(user.favourites).toContain('trail1');
      expect(user.favourites).toContain('trail2');
    });

    it('should remove all instances of duplicate trail', () => {
      const user = new User({});
      user.favourites = ['trail1', 'trail2', 'trail1', 'trail3'];
      
      user.removeFromFavourites('trail1');
      
      expect(user.favourites).not.toContain('trail1');
      expect(user.favourites).toContain('trail2');
      expect(user.favourites).toContain('trail3');
      expect(user.favourites).toHaveLength(2);
    });
  });

  describe('addCompleted', () => {
    it('should add a new trail to completed', () => {
      const user = new User({});
      user.addCompleted('trail1');
      
      expect(user.completed).toContain('trail1');
    });

    it('should not add duplicate trail to completed', () => {
      const user = new User({});
      user.addCompleted('trail1');
      user.addCompleted('trail1');
      
      expect(user.completed).toHaveLength(1);
      expect(user.completed).toContain('trail1');
    });

    it('should add multiple different trails to completed', () => {
      const user = new User({});
      user.addCompleted('trail1');
      user.addCompleted('trail2');
      
      expect(user.completed).toHaveLength(2);
      expect(user.completed).toContain('trail1');
      expect(user.completed).toContain('trail2');
    });
  });

  describe('removeCompleted', () => {
    it('should remove existing trail from completed', () => {
      const user = new User({});
      user.completed = ['trail1', 'trail2', 'trail3'];
      
      user.removeCompleted('trail2');
      
      expect(user.completed).not.toContain('trail2');
      expect(user.completed).toContain('trail1');
      expect(user.completed).toContain('trail3');
      expect(user.completed).toHaveLength(2);
    });

    it('should handle removing non-existent trail from completed', () => {
      const user = new User({});
      user.completed = ['trail1', 'trail2'];
      
      user.removeCompleted('trail3');
      
      expect(user.completed).toHaveLength(2);
      expect(user.completed).toContain('trail1');
      expect(user.completed).toContain('trail2');
    });

    it('should remove all instances of duplicate trail', () => {
      const user = new User({});
      user.completed = ['trail1', 'trail2', 'trail1', 'trail3'];
      
      user.removeCompleted('trail1');
      
      expect(user.completed).not.toContain('trail1');
      expect(user.completed).toContain('trail2');
      expect(user.completed).toContain('trail3');
      expect(user.completed).toHaveLength(2);
    });
  });

  describe('addToWishlist', () => {
    it('should add a new trail to wishlist', () => {
      const user = new User({});
      user.addToWishlist('trail1');
      
      expect(user.wishlist).toContain('trail1');
    });

    it('should not add duplicate trail to wishlist', () => {
      const user = new User({});
      user.addToWishlist('trail1');
      user.addToWishlist('trail1');
      
      expect(user.wishlist).toHaveLength(1);
      expect(user.wishlist).toContain('trail1');
    });

    it('should add multiple different trails to wishlist', () => {
      const user = new User({});
      user.addToWishlist('trail1');
      user.addToWishlist('trail2');
      
      expect(user.wishlist).toHaveLength(2);
      expect(user.wishlist).toContain('trail1');
      expect(user.wishlist).toContain('trail2');
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove existing trail from wishlist', () => {
      const user = new User({});
      user.wishlist = ['trail1', 'trail2', 'trail3'];
      
      user.removeFromWishlist('trail2');
      
      expect(user.wishlist).not.toContain('trail2');
      expect(user.wishlist).toContain('trail1');
      expect(user.wishlist).toContain('trail3');
      expect(user.wishlist).toHaveLength(2);
    });

    it('should handle removing non-existent trail from wishlist', () => {
      const user = new User({});
      user.wishlist = ['trail1', 'trail2'];
      
      user.removeFromWishlist('trail3');
      
      expect(user.wishlist).toHaveLength(2);
      expect(user.wishlist).toContain('trail1');
      expect(user.wishlist).toContain('trail2');
    });

    it('should remove all instances of duplicate trail', () => {
      const user = new User({});
      user.wishlist = ['trail1', 'trail2', 'trail1', 'trail3'];
      
      user.removeFromWishlist('trail1');
      
      expect(user.wishlist).not.toContain('trail1');
      expect(user.wishlist).toContain('trail2');
      expect(user.wishlist).toContain('trail3');
      expect(user.wishlist).toHaveLength(2);
    });
  });

  describe('toFirestore', () => {
    it('should convert user to Firestore format', () => {
      const user = new User({
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        submittedTrails: ['trail1', 'trail2'],
        favourites: ['trail3'],
        completed: ['trail4'],
        wishlist: ['trail5']
      });
      
      const firestoreData = user.toFirestore();
      
      expect(firestoreData).toEqual({
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        submittedTrails: ['trail1', 'trail2'],
        favourites: ['trail3'],
        completed: ['trail4'],
        wishlist: ['trail5']
      });
    });

    it('should convert user with empty arrays to Firestore format', () => {
      const user = new User({
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      });
      
      const firestoreData = user.toFirestore();
      
      expect(firestoreData).toEqual({
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        submittedTrails: [],
        favourites: [],
        completed: [],
        wishlist: []
      });
    });
  });

  describe('fromFirestore', () => {
    it('should create user from Firestore document', () => {
      const mockDoc = {
        data: () => ({
          profileInfo: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          submittedTrails: ['trail1', 'trail2'],
          favourites: ['trail3'],
          completed: ['trail4'],
          wishlist: ['trail5']
        })
      };
      
      const user = User.fromFirestore(mockDoc);
      
      expect(user).toBeInstanceOf(User);
      expect(user.profileInfo).toEqual({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(user.submittedTrails).toEqual(['trail1', 'trail2']);
      expect(user.favourites).toEqual(['trail3']);
      expect(user.completed).toEqual(['trail4']);
      expect(user.wishlist).toEqual(['trail5']);
    });

    it('should create user from Firestore document with empty data', () => {
      const mockDoc = {
        data: () => ({})
      };
      
      const user = User.fromFirestore(mockDoc);
      
      expect(user).toBeInstanceOf(User);
      expect(user.profileInfo).toEqual({});
      expect(user.submittedTrails).toEqual([]);
      expect(user.favourites).toEqual([]);
      expect(user.completed).toEqual([]);
      expect(user.wishlist).toEqual([]);
    });
  });

  describe('Edge Cases and Complex Scenarios', () => {
    it('should handle user with mixed valid and invalid data', () => {
      const userData = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        submittedTrails: ['valid-trail', 123, ''],
        favourites: ['valid-trail', null],
        completed: ['valid-trail', undefined],
        wishlist: ['valid-trail', '   ']
      };
      
      const errors = User.validate(userData);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('submittedTrails[1] must be a valid trail document ID');
      expect(errors).toContain('submittedTrails[2] must be a valid trail document ID');
      expect(errors).toContain('favourites[1] must be a valid trail document ID');
      expect(errors).toContain('completed[1] must be a valid trail document ID');
      expect(errors).toContain('wishlist[1] must be a valid trail document ID');
    });

    it('should handle user operations across multiple lists', () => {
      const user = new User({});
      
      // Add same trail to multiple lists
      user.addToFavourites('trail1');
      user.addToWishlist('trail1');
      user.addCompleted('trail1');
      
      expect(user.favourites).toContain('trail1');
      expect(user.wishlist).toContain('trail1');
      expect(user.completed).toContain('trail1');
      
      // Remove from one list
      user.removeFromFavourites('trail1');
      
      expect(user.favourites).not.toContain('trail1');
      expect(user.wishlist).toContain('trail1');
      expect(user.completed).toContain('trail1');
    });

    it('should handle large arrays of trail references', () => {
      const user = new User({});
      
      // Add many trails to each list
      for (let i = 0; i < 100; i++) {
        user.addToFavourites(`trail${i}`);
        user.addToWishlist(`trail${i}`);
        user.addCompleted(`trail${i}`);
        user.addSubmittedTrail(`trail${i}`);
      }
      
      expect(user.favourites).toHaveLength(100);
      expect(user.wishlist).toHaveLength(100);
      expect(user.completed).toHaveLength(100);
      expect(user.submittedTrails).toHaveLength(100);
      
      // Remove some trails
      for (let i = 0; i < 50; i++) {
        user.removeFromFavourites(`trail${i}`);
        user.removeFromWishlist(`trail${i}`);
        user.removeCompleted(`trail${i}`);
      }
      
      expect(user.favourites).toHaveLength(50);
      expect(user.wishlist).toHaveLength(50);
      expect(user.completed).toHaveLength(50);
      expect(user.submittedTrails).toHaveLength(100); // submittedTrails doesn't have remove method
    });

    it('should handle profile info with additional fields', () => {
      const profileInfo = {
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'I love hiking!',
        location: 'New York',
        joinDate: '2023-01-01'
      };
      
      const errors = User.validateProfileInfo(profileInfo);
      expect(errors).toEqual([]);
    });

    it('should handle empty arrays in user data', () => {
      const userData = {
        profileInfo: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        submittedTrails: [],
        favourites: [],
        completed: [],
        wishlist: []
      };
      
      const errors = User.validate(userData);
      expect(errors).toEqual([]);
    });
  });
});
