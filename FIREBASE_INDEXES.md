# Firebase Indexes Guide

## Required Indexes for Orion Trail API

To get the full functionality of your API, you'll need to create these composite indexes in Firebase Console.

### How to Create Indexes

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`orion-sdp`)
3. Go to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Set up each index as described below

### Required Indexes

#### 1. Difficulty + CreatedAt Index
- **Collection ID:** `Trails`
- **Fields:**
  - `difficulty` (Ascending)
  - `createdAt` (Ascending)
- **Used for:** Filtering by difficulty with sorting

#### 2. Status + CreatedAt Index
- **Collection ID:** `Trails`
- **Fields:**
  - `status` (Ascending)
  - `createdAt` (Ascending)
- **Used for:** Filtering by status with sorting

#### 3. Difficulty + Name Index
- **Collection ID:** `Trails`
- **Fields:**
  - `difficulty` (Ascending)
  - `name` (Ascending)
- **Used for:** Filtering by difficulty, sorting by name

#### 4. Status + Difficulty + CreatedAt Index
- **Collection ID:** `Trails`
- **Fields:**
  - `status` (Ascending)
  - `difficulty` (Ascending)
  - `createdAt` (Ascending)
- **Used for:** Multiple filters with sorting

#### 5. Tags + CreatedAt Index
- **Collection ID:** `Trails`
- **Fields:**
  - `tags` (Arrays)
  - `createdAt` (Ascending)
- **Used for:** Filtering by tags with sorting

#### 6. Distance + CreatedAt Index
- **Collection ID:** `Trails`
- **Fields:**
  - `distance` (Ascending)
  - `createdAt` (Ascending)
- **Used for:** Distance range filters with sorting

#### 7. ElevationGain + CreatedAt Index
- **Collection ID:** `Trails`
- **Fields:**
  - `elevationGain` (Ascending)
  - `createdAt` (Ascending)
- **Used for:** Elevation range filters with sorting

### Auto-Create Indexes

When you get an error like this:
```
9 FAILED_PRECONDITION: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/orion-sdp/firestore/indexes?create_composite=...
```

**Just click the link!** Firebase will automatically create the required index for you.

### Index Building Time

- **Single-field indexes:** Usually instant
- **Composite indexes:** 2-10 minutes depending on data size
- **Large collections:** May take longer

### What Happens Without Indexes

Your API will still work, but with limitations:
- ✅ **Basic queries work** (no filters, sort by createdAt)
- ✅ **Simple filters work** (difficulty only, no sorting)
- ⚠️ **Complex queries fallback** to simple queries
- ❌ **Some combinations won't work** until indexes are created

### Testing Your Indexes

After creating indexes, test these API calls:

```bash
# Should work with difficulty + createdAt index
curl "https://orion-api-qeyv.onrender.com/api/trails?difficulty=Easy&sort=createdAt"

# Should work with status + createdAt index  
curl "https://orion-api-qeyv.onrender.com/api/trails?status=open&sort=createdAt"

# Should work with tags + createdAt index
curl "https://orion-api-qeyv.onrender.com/api/trails?tags=mountain&sort=createdAt"
```

### Monitoring Index Usage

In Firebase Console → Firestore → Usage, you can see:
- Which indexes are being used
- Query performance
- Index storage costs

### Cost Considerations

- **Indexes use storage space** (usually minimal)
- **More indexes = more storage costs**
- **But better query performance**
- **Start with essential indexes, add more as needed**

## Quick Start

1. **Create the first 3 indexes** (difficulty, status, tags + createdAt)
2. **Test your API** with those filters
3. **Add more indexes** as needed based on your usage patterns
4. **Use the auto-create links** when you get index errors

Your API will work immediately, and you can add indexes gradually for better performance!
