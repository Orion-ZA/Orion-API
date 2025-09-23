// Orion Trail API Client Examples
// Base URL: https://orion-api-qeyv.onrender.com

const API_BASE_URL = 'https://orion-api-qeyv.onrender.com';

// Example 1: Health Check
async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('Health Check:', data);
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

// Example 2: Create a Trail
async function createTrail() {
  const trailData = {
    name: "Sunset Peak Trail",
    location: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    distance: 4.2,
    elevationGain: 650,
    difficulty: "Moderate",
    tags: ["mountain", "sunset", "views"],
    gpsRoute: [
      { latitude: 40.7128, longitude: -74.0060 },
      { latitude: 40.7200, longitude: -74.0100 },
      { latitude: 40.7300, longitude: -74.0150 }
    ],
    description: "A beautiful trail perfect for watching the sunset with panoramic mountain views.",
    photos: ["https://example.com/sunset-trail-1.jpg"],
    status: "open",
    createdBy: "user123"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/trails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trailData)
    });
    
    const result = await response.json();
    console.log('Trail Created:', result);
    return result;
  } catch (error) {
    console.error('Failed to create trail:', error);
  }
}

// Example 3: Get All Trails
async function getAllTrails(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trails?page=${page}&limit=${limit}`);
    const data = await response.json();
    console.log('All Trails:', data);
    return data;
  } catch (error) {
    console.error('Failed to get trails:', error);
  }
}

// Example 4: Get Trail by ID
async function getTrailById(trailId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trails/${trailId}`);
    const data = await response.json();
    console.log('Trail Details:', data);
    return data;
  } catch (error) {
    console.error('Failed to get trail:', error);
  }
}

// Example 5: Search Trails
async function searchTrails(query, difficulty = null) {
  let url = `${API_BASE_URL}/api/trails/search?q=${encodeURIComponent(query)}`;
  if (difficulty) {
    url += `&difficulty=${difficulty}`;
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Search Results:', data);
    return data;
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Example 6: Find Trails Near Location
async function findTrailsNearLocation(latitude, longitude, maxDistance = 10000) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/trails/near?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`
    );
    const data = await response.json();
    console.log('Nearby Trails:', data);
    return data;
  } catch (error) {
    console.error('Location search failed:', error);
  }
}

// Example 7: Update Trail
async function updateTrail(trailId, updateData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trails/${trailId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    console.log('Trail Updated:', result);
    return result;
  } catch (error) {
    console.error('Failed to update trail:', error);
  }
}

// Example 8: Delete Trail
async function deleteTrail(trailId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trails/${trailId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    console.log('Trail Deleted:', result);
    return result;
  } catch (error) {
    console.error('Failed to delete trail:', error);
  }
}

// Example Usage:
async function runExamples() {
  console.log('🚀 Testing Orion Trail API...\n');
  
  // 1. Check if API is running
  await checkHealth();
  
  // 2. Create a new trail
  const newTrail = await createTrail();
  
  // 3. Get all trails
  await getAllTrails();
  
  // 4. Search for trails
  await searchTrails('mountain', 'Moderate');
  
  // 5. Find trails near New York
  await findTrailsNearLocation(40.7128, -74.0060, 5000);
  
  // 6. If we created a trail, update it
  if (newTrail && newTrail.data && newTrail.data.id) {
    await updateTrail(newTrail.data.id, {
      status: 'maintenance',
      description: 'Updated description for maintenance'
    });
  }
}

// Run examples if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runExamples().catch(console.error);
} else {
  // Browser environment - expose functions globally
  window.OrionAPI = {
    checkHealth,
    createTrail,
    getAllTrails,
    getTrailById,
    searchTrails,
    findTrailsNearLocation,
    updateTrail,
    deleteTrail,
    runExamples
  };
  
  console.log('Orion API client loaded! Use OrionAPI.runExamples() to test.');
}
