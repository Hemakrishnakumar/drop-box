# VFS Enterprise - Product Requirements Document (PRD)

**Version:** 1.0

## 1. Overview

VFS Enterprise is a cloud-based file management platform that allows
users to securely store, organize, preview, share, and manage files and
folders. The application follows a subscription-based SaaS model with
role-based collaboration, real-time notifications, audit logging, and
scalable cloud storage integration.

------------------------------------------------------------------------

# 2. Objectives

-   Secure file and folder management
-   Direct-to-storage uploads
-   Role-based collaboration
-   Subscription-based storage and feature limits
-   Real-time notifications
-   Complete audit trail
-   Production-ready architecture

------------------------------------------------------------------------

# 3. Functional Requirements

## 3.1 Authentication

-   User registration using email and password
-   Login
-   Email verification
-   Forgot password
-   Reset password
-   Google OpenID Connect
-   Session-based authentication
-   Session management
-   Logout

## 3.2 Folder Management

-   Create folders
-   Rename folders
-   Move folders
-   Delete folders
-   Recursive deletion
-   Trash
-   Restore
-   Permanent delete

## 3.3 File Management

-   Direct uploads using signed upload URLs
-   No file uploads through backend servers
-   File metadata management
-   Rename
-   Move
-   Delete
-   Restore
-   Download
-   In-app preview
-   Resume media playback

## 3.4 Storage

-   Default 5 GB storage
-   Storage usage tracking
-   Storage limits based on subscription
-   Maximum upload size based on subscription

## 3.5 Sharing & Collaboration

### Internal Sharing

-   Share folders
-   Share files
-   Owner, Editor and Viewer permissions
-   Permission revocation
-   Permission inheritance

### Public Sharing

-   Public share links
-   Expiring links
-   Non-expiring links
-   Password protected links (future)
-   Download restrictions (future)

## 3.6 Search

-   Search by filename
-   Folder
-   Extension
-   Owner
-   Sorting
-   Pagination

## 3.7 Video Playback

-   Play
-   Pause
-   Resume
-   Last playback position
-   Watch history
-   Playback analytics
-   Subscription-based preview restrictions

## 3.8 Subscription & Billing

-   Razorpay integration
-   Products
-   Plans
-   Subscriptions
-   Upgrade/Downgrade
-   Webhook processing
-   Storage and feature enforcement

## 3.9 Notifications

Real-time notifications using Socket.IO and Redis Pub/Sub.

Examples:

-   Folder shared
-   File shared
-   Subscription upgraded
-   Storage limit reached
-   Invitation accepted

## 3.10 Audit Logging

Capture all significant user activities including:

-   Authentication events
-   Uploads
-   Downloads
-   File and folder operations
-   Sharing
-   Permission updates
-   Subscription events

------------------------------------------------------------------------

# 4. Non-Functional Requirements

-   NestJS
-   TypeScript
-   PostgreSQL
-   Redis
-   Docker Compose
-   MinIO for local object storage
-   Storage abstraction for AWS S3 migration
-   CDN abstraction
-   Modular architecture
-   Environment-based configuration
-   Validation
-   Centralized exception handling
-   Structured logging
-   Scalable project structure

------------------------------------------------------------------------

# 5. Technology Stack

## Backend

-   NestJS
-   TypeScript
-   PostgreSQL
-   TypeORM
-   Redis
-   Socket.IO

## Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS
-   React Query
-   Zustand

## Storage

-   MinIO (Development)
-   AWS S3 (Production)

## Payments

-   Razorpay

------------------------------------------------------------------------

# 6. Project Roadmap

## Phase 0 - Planning

-   Requirements finalization
-   Database design
-   API design
-   Project structure

## Phase 1 - Foundation

-   Project setup
-   Docker
-   PostgreSQL
-   Redis
-   MinIO
-   Configuration
-   Logging
-   Health checks

## Phase 2 - Authentication

-   Registration
-   Login
-   Sessions
-   Email verification
-   Password reset
-   Google OIDC

## Phase 3 - Files & Folders

-   Folder management
-   File management
-   Signed uploads
-   Downloads
-   Preview
-   Trash

## Phase 4 - Sharing & RBAC

-   Resource permissions
-   Folder sharing
-   File sharing
-   Public links
-   Permission inheritance
-   Permission revocation

## Phase 5 - Billing

-   Razorpay
-   Plans
-   Products
-   Subscriptions
-   Feature enforcement

## Phase 6 - Collaboration

-   Notifications
-   Socket.IO
-   Redis Pub/Sub
-   Playback history
-   Search
-   Favorites
-   Recent items

## Phase 7 - Audit & Production

-   Audit logging
-   Performance optimization
-   Testing
-   Deployment
-   Documentation

------------------------------------------------------------------------

# 7. Future Enhancements

-   File versioning
-   Team workspaces
-   Multi-device session management
-   Password-protected public links
-   Download limits
-   Advanced search
-   Analytics dashboard
-   Admin dashboard
