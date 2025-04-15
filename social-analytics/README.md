# Social Media Analytics Microservice

## Description

Fetches user posts and comments, calculates average likes/comments, most liked and most commented posts.

## API Endpoint

**GET** `/analyze/:userId`

### Response:

```json
{
  "userId": "2",
  "totalPosts": 10,
  "averageLikes": "25.40",
  "averageComments": "12.10",
  "mostLikedPost": { ... },
  "mostCommentedPost": { ... }
}
```
