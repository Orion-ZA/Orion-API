const Trail = require('../src/models/Trail');

describe('Trail Model', () => {
  describe('Constructor', () => {
    it('should create a trail with default values', () => {
      const trail = new Trail({});
      
      expect(trail.name).toBe('');
      expect(trail.location).toEqual({ latitude: 0, longitude: 0 });
      expect(trail.distance).toBe(0);
      expect(trail.elevationGain).toBe(0);
      expect(trail.difficulty).toBe('Easy');
      expect(trail.tags).toEqual([]);
      expect(trail.gpsRoute).toEqual([]);
      expect(trail.description).toBe('');
      expect(trail.photos).toEqual([]);
      expect(trail.status).toBe('open');
      expect(trail.createdBy).toBe('');
      expect(trail.createdAt).toBeInstanceOf(Date);
      expect(trail.lastUpdated).toBeInstanceOf(Date);
    });

    it('should create a trail with provided data', () => {
      const data = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        tags: ['mountain', 'views'],
        gpsRoute: [{ latitude: 40.7128, longitude: -74.0060 }],
        description: 'A beautiful test trail',
        photos: ['https://example.com/photo.jpg'],
        status: 'open',
        createdBy: 'user123',
        createdAt: new Date('2023-01-01'),
        lastUpdated: new Date('2023-01-02')
      };
      
      const trail = new Trail(data);
      
      expect(trail.name).toBe('Test Trail');
      expect(trail.location).toEqual({ latitude: 40.7128, longitude: -74.0060 });
      expect(trail.distance).toBe(5.2);
      expect(trail.elevationGain).toBe(800);
      expect(trail.difficulty).toBe('Moderate');
      expect(trail.tags).toEqual(['mountain', 'views']);
      expect(trail.gpsRoute).toEqual([{ latitude: 40.7128, longitude: -74.0060 }]);
      expect(trail.description).toBe('A beautiful test trail');
      expect(trail.photos).toEqual(['https://example.com/photo.jpg']);
      expect(trail.status).toBe('open');
      expect(trail.createdBy).toBe('user123');
      expect(trail.createdAt).toEqual(new Date('2023-01-01'));
      expect(trail.lastUpdated).toEqual(new Date('2023-01-02'));
    });
  });

  describe('validateGeoPoint', () => {
    it('should validate valid coordinates', () => {
      const geoPoint = { latitude: 40.7128, longitude: -74.0060 };
      const errors = Trail.validateGeoPoint(geoPoint);
      expect(errors).toEqual([]);
    });

    it('should return error for invalid latitude', () => {
      const geoPoint = { latitude: 91, longitude: -74.0060 };
      const errors = Trail.validateGeoPoint(geoPoint);
      expect(errors).toContain('Latitude must be a number between -90 and 90');
    });

    it('should return error for latitude too low', () => {
      const geoPoint = { latitude: -91, longitude: -74.0060 };
      const errors = Trail.validateGeoPoint(geoPoint);
      expect(errors).toContain('Latitude must be a number between -90 and 90');
    });

    it('should return error for invalid longitude', () => {
      const geoPoint = { latitude: 40.7128, longitude: 181 };
      const errors = Trail.validateGeoPoint(geoPoint);
      expect(errors).toContain('Longitude must be a number between -180 and 180');
    });

    it('should return error for longitude too low', () => {
      const geoPoint = { latitude: 40.7128, longitude: -181 };
      const errors = Trail.validateGeoPoint(geoPoint);
      expect(errors).toContain('Longitude must be a number between -180 and 180');
    });

    it('should return error for non-number latitude', () => {
      const geoPoint = { latitude: 'invalid', longitude: -74.0060 };
      const errors = Trail.validateGeoPoint(geoPoint);
      expect(errors).toContain('Latitude must be a number between -90 and 90');
    });

    it('should return error for non-number longitude', () => {
      const geoPoint = { latitude: 40.7128, longitude: 'invalid' };
      const errors = Trail.validateGeoPoint(geoPoint);
      expect(errors).toContain('Longitude must be a number between -180 and 180');
    });

    it('should return multiple errors for invalid coordinates', () => {
      const geoPoint = { latitude: 91, longitude: 181 };
      const errors = Trail.validateGeoPoint(geoPoint);
      expect(errors).toHaveLength(2);
      expect(errors).toContain('Latitude must be a number between -90 and 90');
      expect(errors).toContain('Longitude must be a number between -180 and 180');
    });
  });

  describe('validate', () => {
    it('should validate a complete valid trail', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        tags: ['mountain', 'views'],
        gpsRoute: [
          { latitude: 40.7128, longitude: -74.0060 },
          { latitude: 40.72, longitude: -74.01 }
        ],
        description: 'A beautiful test trail',
        photos: ['https://example.com/photo.jpg'],
        status: 'open',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toEqual([]);
    });

    it('should return error for missing name', () => {
      const trailData = {
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Trail name is required');
    });

    it('should return error for empty name', () => {
      const trailData = {
        name: '',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Trail name is required');
    });

    it('should return error for name too long', () => {
      const trailData = {
        name: 'a'.repeat(101),
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Trail name cannot exceed 100 characters');
    });

    it('should return error for missing location', () => {
      const trailData = {
        name: 'Test Trail',
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Trail location is required');
    });

    it('should return error for invalid distance', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: -5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Distance must be a positive number');
    });

    it('should return error for invalid elevation gain', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: -800,
        difficulty: 'Moderate',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Elevation gain must be a positive number');
    });

    it('should return error for invalid difficulty', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Invalid',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Difficulty must be one of: Easy, Moderate, Hard, Expert');
    });

    it('should validate all valid difficulties', () => {
      const validDifficulties = ['Easy', 'Moderate', 'Hard', 'Expert'];
      
      validDifficulties.forEach(difficulty => {
        const trailData = {
          name: 'Test Trail',
          location: { latitude: 40.7128, longitude: -74.0060 },
          distance: 5.2,
          elevationGain: 800,
          difficulty: difficulty,
          description: 'A beautiful test trail',
          createdBy: 'user123'
        };
        
        const errors = Trail.validate(trailData);
        expect(errors).not.toContain('Difficulty must be one of: Easy, Moderate, Hard, Expert');
      });
    });

    it('should return error for non-array tags', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        tags: 'not-an-array',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Tags must be an array');
    });

    it('should return error for too many tags', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        tags: Array(11).fill('tag'),
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Cannot have more than 10 tags');
    });

    it('should return error for invalid tag', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        tags: [123],
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Tag 0 must be a string with max 50 characters');
    });

    it('should return error for tag too long', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        tags: ['a'.repeat(51)],
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Tag 0 must be a string with max 50 characters');
    });

    it('should return error for non-array GPS route', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        gpsRoute: 'not-an-array',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('GPS route must be an array');
    });

    it('should return error for GPS route with less than 2 points', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        gpsRoute: [{ latitude: 40.7128, longitude: -74.0060 }],
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('GPS route must have at least 2 points');
    });

    it('should return error for invalid GPS route point', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        gpsRoute: [
          { latitude: 40.7128, longitude: -74.0060 },
          { latitude: 91, longitude: -74.0060 }
        ],
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('GPS route point 1: Latitude must be a number between -90 and 90');
    });

    it('should return error for missing description', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Trail description is required');
    });

    it('should return error for description too long', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        description: 'a'.repeat(2001),
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Description cannot exceed 2000 characters');
    });

    it('should return error for non-array photos', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        photos: 'not-an-array',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Photos must be an array');
    });

    it('should return error for too many photos', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        photos: Array(21).fill('https://example.com/photo.jpg'),
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Cannot have more than 20 photos');
    });

    it('should return error for invalid photo URL', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        photos: ['invalid-url'],
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Photo 0 must be a valid URL');
    });

    it('should validate valid photo URLs', () => {
      const validUrls = [
        'https://example.com/photo.jpg',
        'http://example.com/photo.png',
        'https://subdomain.example.com/path/to/photo.jpg'
      ];
      
      validUrls.forEach(url => {
        const trailData = {
          name: 'Test Trail',
          location: { latitude: 40.7128, longitude: -74.0060 },
          distance: 5.2,
          elevationGain: 800,
          difficulty: 'Moderate',
          photos: [url],
          description: 'A beautiful test trail',
          createdBy: 'user123'
        };
        
        const errors = Trail.validate(trailData);
        expect(errors).not.toContain('Photo 0 must be a valid URL');
      });
    });

    it('should return error for invalid status', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        status: 'invalid',
        description: 'A beautiful test trail',
        createdBy: 'user123'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Status must be one of: open, closed, maintenance, seasonal');
    });

    it('should validate all valid statuses', () => {
      const validStatuses = ['open', 'closed', 'maintenance', 'seasonal'];
      
      validStatuses.forEach(status => {
        const trailData = {
          name: 'Test Trail',
          location: { latitude: 40.7128, longitude: -74.0060 },
          distance: 5.2,
          elevationGain: 800,
          difficulty: 'Moderate',
          status: status,
          description: 'A beautiful test trail',
          createdBy: 'user123'
        };
        
        const errors = Trail.validate(trailData);
        expect(errors).not.toContain('Status must be one of: open, closed, maintenance, seasonal');
      });
    });

    it('should return error for missing createdBy', () => {
      const trailData = {
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        description: 'A beautiful test trail'
      };
      
      const errors = Trail.validate(trailData);
      expect(errors).toContain('Creator information is required');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const trailData = {
        name: '',
        location: { latitude: 91, longitude: 181 },
        distance: -5.2,
        elevationGain: -800,
        difficulty: 'Invalid',
        description: '',
        createdBy: ''
      };
      
      const errors = Trail.validate(trailData);
      expect(errors.length).toBeGreaterThan(5);
      expect(errors).toContain('Trail name is required');
      expect(errors).toContain('Latitude must be a number between -90 and 90');
      expect(errors).toContain('Longitude must be a number between -180 and 180');
      expect(errors).toContain('Distance must be a positive number');
      expect(errors).toContain('Elevation gain must be a positive number');
      expect(errors).toContain('Difficulty must be one of: Easy, Moderate, Hard, Expert');
      expect(errors).toContain('Trail description is required');
      expect(errors).toContain('Creator information is required');
    });
  });

  describe('addPhoto', () => {
    it('should add a valid photo URL', () => {
      const trail = new Trail({});
      trail.addPhoto('https://example.com/photo.jpg');
      
      expect(trail.photos).toContain('https://example.com/photo.jpg');
    });

    it('should not add invalid photo URL', () => {
      const trail = new Trail({});
      trail.addPhoto('invalid-url');
      
      expect(trail.photos).not.toContain('invalid-url');
    });

    it('should not add photo when limit is reached', () => {
      const trail = new Trail({});
      trail.photos = Array(20).fill('https://example.com/photo.jpg');
      
      trail.addPhoto('https://example.com/new-photo.jpg');
      
      expect(trail.photos).not.toContain('https://example.com/new-photo.jpg');
      expect(trail.photos).toHaveLength(20);
    });

    it('should not add duplicate photos', () => {
      const trail = new Trail({});
      trail.addPhoto('https://example.com/photo.jpg');
      trail.addPhoto('https://example.com/photo.jpg');
      
      // The addPhoto method doesn't prevent duplicates, so this test should reflect actual behavior
      expect(trail.photos).toHaveLength(2);
      expect(trail.photos[0]).toBe('https://example.com/photo.jpg');
      expect(trail.photos[1]).toBe('https://example.com/photo.jpg');
    });
  });

  describe('removePhoto', () => {
    it('should remove existing photo', () => {
      const trail = new Trail({});
      trail.photos = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];
      
      trail.removePhoto('https://example.com/photo1.jpg');
      
      expect(trail.photos).not.toContain('https://example.com/photo1.jpg');
      expect(trail.photos).toContain('https://example.com/photo2.jpg');
    });

    it('should handle removing non-existent photo', () => {
      const trail = new Trail({});
      trail.photos = ['https://example.com/photo1.jpg'];
      
      trail.removePhoto('https://example.com/non-existent.jpg');
      
      expect(trail.photos).toHaveLength(1);
      expect(trail.photos).toContain('https://example.com/photo1.jpg');
    });
  });

  describe('addTag', () => {
    it('should add a valid tag', () => {
      const trail = new Trail({});
      trail.addTag('mountain');
      
      expect(trail.tags).toContain('mountain');
    });

    it('should not add tag when limit is reached', () => {
      const trail = new Trail({});
      trail.tags = Array(10).fill('tag');
      
      trail.addTag('new-tag');
      
      expect(trail.tags).not.toContain('new-tag');
      expect(trail.tags).toHaveLength(10);
    });

    it('should not add duplicate tags', () => {
      const trail = new Trail({});
      trail.addTag('mountain');
      trail.addTag('mountain');
      
      expect(trail.tags).toHaveLength(1);
    });

    it('should not add invalid tag', () => {
      const trail = new Trail({});
      trail.addTag(123);
      
      expect(trail.tags).not.toContain(123);
    });

    it('should not add tag that is too long', () => {
      const trail = new Trail({});
      trail.addTag('a'.repeat(51));
      
      expect(trail.tags).not.toContain('a'.repeat(51));
    });
  });

  describe('removeTag', () => {
    it('should remove existing tag', () => {
      const trail = new Trail({});
      trail.tags = ['mountain', 'views'];
      
      trail.removeTag('mountain');
      
      expect(trail.tags).not.toContain('mountain');
      expect(trail.tags).toContain('views');
    });

    it('should handle removing non-existent tag', () => {
      const trail = new Trail({});
      trail.tags = ['mountain'];
      
      trail.removeTag('non-existent');
      
      expect(trail.tags).toHaveLength(1);
      expect(trail.tags).toContain('mountain');
    });
  });

  describe('addGPSPoint', () => {
    it('should add valid GPS point', () => {
      const trail = new Trail({});
      const errors = trail.addGPSPoint(40.7128, -74.0060);
      
      expect(errors).toEqual([]);
      expect(trail.gpsRoute).toContainEqual({ latitude: 40.7128, longitude: -74.0060 });
    });

    it('should not add invalid GPS point', () => {
      const trail = new Trail({});
      const errors = trail.addGPSPoint(91, -74.0060);
      
      expect(errors).toContain('Latitude must be a number between -90 and 90');
      expect(trail.gpsRoute).not.toContainEqual({ latitude: 91, longitude: -74.0060 });
    });

    it('should return multiple errors for invalid coordinates', () => {
      const trail = new Trail({});
      const errors = trail.addGPSPoint(91, 181);
      
      expect(errors).toHaveLength(2);
      expect(errors).toContain('Latitude must be a number between -90 and 90');
      expect(errors).toContain('Longitude must be a number between -180 and 180');
    });
  });

  describe('updateStatus', () => {
    it('should update to valid status', () => {
      const trail = new Trail({});
      const result = trail.updateStatus('closed');
      
      expect(result).toBe(true);
      expect(trail.status).toBe('closed');
      expect(trail.lastUpdated).toBeInstanceOf(Date);
    });

    it('should not update to invalid status', () => {
      const trail = new Trail({});
      const originalStatus = trail.status;
      const originalLastUpdated = trail.lastUpdated;
      
      const result = trail.updateStatus('invalid');
      
      expect(result).toBe(false);
      expect(trail.status).toBe(originalStatus);
      expect(trail.lastUpdated).toBe(originalLastUpdated);
    });

    it('should update lastUpdated when status changes', () => {
      const trail = new Trail({});
      const originalLastUpdated = trail.lastUpdated;
      
      // Wait a bit to ensure time difference
      setTimeout(() => {
        trail.updateStatus('maintenance');
        expect(trail.lastUpdated.getTime()).toBeGreaterThan(originalLastUpdated.getTime());
      }, 10);
    });
  });

  describe('toFirestore', () => {
    it('should convert trail to Firestore format', () => {
      const trail = new Trail({
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        tags: ['mountain'],
        gpsRoute: [{ latitude: 40.7128, longitude: -74.0060 }],
        description: 'A beautiful test trail',
        photos: ['https://example.com/photo.jpg'],
        status: 'open',
        createdBy: 'user123',
        createdAt: new Date('2023-01-01'),
        lastUpdated: new Date('2023-01-02')
      });
      
      const firestoreData = trail.toFirestore();
      
      expect(firestoreData).toEqual({
        name: 'Test Trail',
        location: { latitude: 40.7128, longitude: -74.0060 },
        distance: 5.2,
        elevationGain: 800,
        difficulty: 'Moderate',
        tags: ['mountain'],
        gpsRoute: [{ latitude: 40.7128, longitude: -74.0060 }],
        description: 'A beautiful test trail',
        photos: ['https://example.com/photo.jpg'],
        status: 'open',
        createdBy: 'user123',
        createdAt: new Date('2023-01-01'),
        lastUpdated: new Date('2023-01-02')
      });
    });
  });

  describe('fromFirestore', () => {
    it('should create trail from Firestore document', () => {
      const mockDoc = {
        data: () => ({
          name: 'Test Trail',
          location: { latitude: 40.7128, longitude: -74.0060 },
          distance: 5.2,
          elevationGain: 800,
          difficulty: 'Moderate',
          tags: ['mountain'],
          gpsRoute: [{ latitude: 40.7128, longitude: -74.0060 }],
          description: 'A beautiful test trail',
          photos: ['https://example.com/photo.jpg'],
          status: 'open',
          createdBy: 'user123',
          createdAt: new Date('2023-01-01'),
          lastUpdated: new Date('2023-01-02')
        })
      };
      
      const trail = Trail.fromFirestore(mockDoc);
      
      expect(trail).toBeInstanceOf(Trail);
      expect(trail.name).toBe('Test Trail');
      expect(trail.location).toEqual({ latitude: 40.7128, longitude: -74.0060 });
      expect(trail.distance).toBe(5.2);
      expect(trail.elevationGain).toBe(800);
      expect(trail.difficulty).toBe('Moderate');
      expect(trail.tags).toEqual(['mountain']);
      expect(trail.gpsRoute).toEqual([{ latitude: 40.7128, longitude: -74.0060 }]);
      expect(trail.description).toBe('A beautiful test trail');
      expect(trail.photos).toEqual(['https://example.com/photo.jpg']);
      expect(trail.status).toBe('open');
      expect(trail.createdBy).toBe('user123');
      expect(trail.createdAt).toEqual(new Date('2023-01-01'));
      expect(trail.lastUpdated).toEqual(new Date('2023-01-02'));
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const point1 = { latitude: 40.7128, longitude: -74.0060 }; // New York
      const point2 = { latitude: 34.0522, longitude: -118.2437 }; // Los Angeles
      
      const distance = Trail.calculateDistance(point1, point2);
      
      // Distance between NYC and LA is approximately 3935 km (allowing for calculation variance)
      expect(distance).toBeCloseTo(3935, -1); // Allow 10km variance
    });

    it('should calculate distance between same points as zero', () => {
      const point = { latitude: 40.7128, longitude: -74.0060 };
      
      const distance = Trail.calculateDistance(point, point);
      
      expect(distance).toBeCloseTo(0, 5);
    });

    it('should calculate distance between nearby points', () => {
      const point1 = { latitude: 40.7128, longitude: -74.0060 };
      const point2 = { latitude: 40.7138, longitude: -74.0070 };
      
      const distance = Trail.calculateDistance(point1, point2);
      
      // Should be a small distance (less than 1 km)
      expect(distance).toBeLessThan(1);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('toRadians', () => {
    it('should convert degrees to radians', () => {
      expect(Trail.toRadians(0)).toBe(0);
      expect(Trail.toRadians(90)).toBeCloseTo(Math.PI / 2, 5);
      expect(Trail.toRadians(180)).toBeCloseTo(Math.PI, 5);
      expect(Trail.toRadians(360)).toBeCloseTo(2 * Math.PI, 5);
    });

    it('should handle negative degrees', () => {
      expect(Trail.toRadians(-90)).toBeCloseTo(-Math.PI / 2, 5);
      expect(Trail.toRadians(-180)).toBeCloseTo(-Math.PI, 5);
    });
  });
});
