# Elektr-Âme Backend Setup

This document explains how to set up the PHP backend for the Elektr-Âme website.

## Requirements

- PHP 8.4 or higher
- MySQL 8.0 or higher
- Web server (Apache/Nginx) or PHP built-in server
- Composer (optional, for dependency management)

## Quick Setup

### 1. Database Setup

1. **Create the database and tables:**
   ```bash
   php setup-database.php
   ```

2. **Or manually run the SQL schema:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### 2. Configure Database Connection

Edit `api/config.php` and update the database credentials:

```php
'database' => [
    'host' => 'localhost',
    'dbname' => 'elektr_ame',
    'username' => 'your_username',
    'password' => 'your_password',
    // ...
]
```

### 3. Start the Backend Server

#### Option A: PHP Built-in Server (Development)
```bash
cd /path/to/elektr-ame-website
php -S localhost:8000
```

#### Option B: Apache/Nginx (Production)
- Copy the project files to your web server document root
- Configure virtual host to point to the project directory
- Ensure PHP is enabled and configured

### 4. Test the API

Test the join-us endpoint:

```bash
curl -X POST http://localhost:8000/api/join-us.php \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "city": "Barcelona",
    "country": "Spain"
  }'
```

## API Endpoints

### POST /api/join-us.php

Registers a new member.

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "secondName": "string (optional)",
  "email": "string (required, valid email)",
  "phone": "string (required, international format)",
  "street": "string (optional)",
  "zipCode": "string (optional)",
  "city": "string (required)",
  "country": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member registration successful",
  "member_id": 123
}
```

## Database Schema

### Members Table
- `id` - Primary key
- `first_name` - Required
- `last_name` - Required
- `second_name` - Optional
- `email` - Required, unique
- `phone` - Required, international format
- `street` - Optional
- `zip_code` - Optional
- `city` - Required
- `country` - Required
- `status` - ENUM: pending, approved, rejected
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Security Considerations

1. **Input Validation:** All inputs are validated and sanitized
2. **SQL Injection Prevention:** Using prepared statements
3. **CORS Configuration:** Configured for development, update for production
4. **Error Handling:** Sensitive errors are logged, generic errors returned to client

## Production Deployment

1. **Update CORS origins** in `api/config.php`
2. **Set up SSL/HTTPS**
3. **Configure proper database credentials**
4. **Set up proper file permissions**
5. **Enable error logging**
6. **Set up database backups**

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials in `api/config.php`
   - Ensure MySQL server is running
   - Verify database exists

2. **CORS Errors**
   - Update CORS origins in `api/config.php`
   - Ensure frontend URL is included

3. **Permission Denied**
   - Check file permissions
   - Ensure web server can read/write to project directory

### Debug Mode

Enable error reporting in `api/join-us.php` by adding:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## File Structure

```
api/
├── join-us.php          # Main API endpoint
├── config.php           # Database configuration
database/
├── schema.sql           # Database schema
setup-database.php       # Database setup script
BACKEND_SETUP.md         # This file
```










