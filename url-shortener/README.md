# URL Shortener Service

A high-performance URL shortening service built with Spring Boot, MongoDB Atlas, and Caffeine cache. Generates unique 7-character Base62 short codes using a distributed Snowflake-inspired ID generation algorithm.

## Features

- **Short URL Generation**: Creates 7-character Base62 encoded short URLs
- **Custom Aliases**: Support for user-defined custom short codes
- **URL Expiration**: Optional expiration dates for shortened URLs
- **Click Tracking**: Tracks the number of clicks for each shortened URL
- **High Performance**: Caffeine in-memory cache for fast lookups
- **Distributed**: Snowflake-inspired ID generation supports multiple instances
- **RESTful API**: Clean REST API for all operations

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        URL Shortener Service                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Controller  │───▶│   Service    │───▶│  Repository  │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                   │                   │                │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Validation │    │   Caffeine   │    │   MongoDB    │       │
│  │   (@Valid)   │    │    Cache     │    │    Atlas     │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                             │                                    │
│                      ┌──────────────┐                           │
│                      │  ID Generator│                           │
│                      │  (Snowflake) │                           │
│                      └──────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## ID Generation Algorithm

The service uses a compact 42-bit ID structure:

| Component    | Bits | Range       | Description                        |
|--------------|------|-------------|-----------------------------------|
| Timestamp    | 28   | ~8.5 years  | Seconds since 2024-01-01 UTC      |
| Machine ID   | 8    | 0-255       | Unique identifier per instance    |
| Sequence     | 6    | 0-63        | Sequential counter per second     |

**Performance Capacity**: 64 IDs/second × 256 machines = **16,384 URLs/second**

## Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **MongoDB Atlas** account (free tier available)

## MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier M0 is sufficient)
3. Create a database user with read/write permissions
4. Add your IP address to the network access whitelist (or allow access from anywhere for development)
5. Get your connection string from the cluster's "Connect" button

Your connection string should look like:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/urlshortener?retryWrites=true&w=majority
```

## Configuration

Update `src/main/resources/application.properties`:

```properties
# MongoDB Atlas Connection
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/urlshortener?retryWrites=true&w=majority

# Base URL for generated short URLs
urlshortener.base.url=http://localhost:8080

# Machine ID for distributed deployment (0-255)
urlshortener.machine.id=1
```

## Build & Run

### Using Maven

```bash
# Build the project
mvn clean package

# Run the application
mvn spring-boot:run

# Or run the jar directly
java -jar target/url-shortener-1.0.0.jar
```

### Using Docker

```bash
# Build the Docker image
docker build -t url-shortener .

# Run the container
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/urlshortener?retryWrites=true&w=majority" \
  -e MACHINE_ID=1 \
  --name url-shortener \
  url-shortener
```

## API Usage

### Create Short URL

```bash
# Basic shortening
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://www.example.com/very/long/url/path"}'
```

Response:
```json
{
  "shortUrl": "http://localhost:8080/ABC1234",
  "shortCode": "ABC1234",
  "longUrl": "https://www.example.com/very/long/url/path",
  "createdAt": "2024-01-15T10:30:00",
  "expiresAt": null
}
```

### Create Short URL with Custom Alias and Expiration

```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "longUrl": "https://www.example.com/special-offer",
    "customAlias": "mylink",
    "expirationDays": 30
  }'
```

Response:
```json
{
  "shortUrl": "http://localhost:8080/mylink",
  "shortCode": "mylink",
  "longUrl": "https://www.example.com/special-offer",
  "createdAt": "2024-01-15T10:30:00",
  "expiresAt": "2024-02-14T10:30:00"
}
```

### Get Long URL (API)

```bash
curl http://localhost:8080/api/url/ABC1234
```

Response:
```
https://www.example.com/very/long/url/path
```

### Redirect to Long URL (Browser)

Open in browser or use curl with redirect following:
```bash
curl -L http://localhost:8080/ABC1234
```

### Get URL Statistics

```bash
curl http://localhost:8080/api/stats/ABC1234
```

Response:
```json
{
  "shortCode": "ABC1234",
  "longUrl": "https://www.example.com/very/long/url/path",
  "clickCount": 42,
  "createdAt": "2024-01-15T10:30:00",
  "expiresAt": null
}
```

### Delete Short URL

```bash
curl -X DELETE http://localhost:8080/api/url/ABC1234
```

Response: `204 No Content`

### Health Check

```bash
curl http://localhost:8080/health
```

Response:
```
URL Shortener is running!
```

## API Endpoints Summary

| Method | Endpoint             | Description                    | Status Code |
|--------|---------------------|--------------------------------|-------------|
| POST   | `/api/shorten`      | Create a shortened URL         | 201 Created |
| GET    | `/api/url/{code}`   | Get long URL (API)             | 200 OK      |
| GET    | `/{code}`           | Redirect to long URL           | 302 Found   |
| GET    | `/api/stats/{code}` | Get URL statistics             | 200 OK      |
| DELETE | `/api/url/{code}`   | Delete a shortened URL         | 204 No Content |
| GET    | `/health`           | Health check                   | 200 OK      |

## Error Responses

All error responses follow this format:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "URL not found for short code: INVALID"
}
```

| Status Code | Error Type      | Description                           |
|-------------|-----------------|---------------------------------------|
| 400         | Bad Request     | Invalid URL format or duplicate alias |
| 404         | Not Found       | Short code does not exist             |
| 410         | Gone            | URL has expired                       |
| 500         | Internal Error  | Server error                          |

## Performance

### Caching
- **Cache Type**: Caffeine in-memory cache
- **Maximum Size**: 10,000 entries
- **TTL**: 24 hours after last access
- **Hit Rate**: Optimized for frequently accessed URLs

### Capacity
- **ID Generation**: 16,384 unique URLs per second (across all instances)
- **Per Machine**: 64 URLs per second per machine ID
- **Total Machines**: 256 unique machine IDs supported

## Deployment Considerations

### Scaling Horizontally

Each instance must have a unique `MACHINE_ID` (0-255):

```bash
# Instance 1
docker run -e MACHINE_ID=1 ...

# Instance 2
docker run -e MACHINE_ID=2 ...

# Instance 3
docker run -e MACHINE_ID=3 ...
```

### MongoDB Atlas Configuration

For production:
1. Use a dedicated cluster (M10+)
2. Enable auto-scaling
3. Configure backup and point-in-time recovery
4. Set up proper network security

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to MongoDB Atlas

**Solutions**:
1. Verify your IP is whitelisted in MongoDB Atlas Network Access
2. Check username/password in connection string
3. Ensure the cluster is running and accessible
4. Try connection from MongoDB Compass first

### ID Generation Issues

**Problem**: Clock moved backwards error

**Solution**: This occurs when system time goes backward. Ensure NTP is properly configured on your server.

### Cache Issues

**Problem**: Stale data being returned

**Solution**: The cache has a 24-hour TTL. For immediate updates, restart the service or implement cache eviction endpoints.

### Performance Issues

**Problem**: Slow response times

**Solutions**:
1. Check MongoDB Atlas metrics for slow queries
2. Verify indexes are created (shortCode, longUrl)
3. Increase JVM heap size if needed
4. Monitor cache hit rates

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
