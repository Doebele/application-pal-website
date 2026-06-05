# Demo User Profiles for application-pal

This directory contains demo user profiles and application data that can be used to:
1. Create fake user accounts in the application-pal application for testing and screenshots
2. Provide realistic personas for marketing materials and testimonials
3. Demonstrate the full feature set of application-pal

## Files

- `demo-user-profiles.json` - 6 user personas with varied roles, locations, and career goals
- `demo-applications-data.json` - Sample job applications for each user showing different pipeline stages

## User Profiles Summary

1. **Sarah Chen** - Senior Software Engineer → Staff Engineer (Full-stack, developer tools)
2. **Marcus Johnson** - Product Designer → Senior Product Designer (B2B SaaS)
3. **Priya Sharma** - Data Scientist → Senior Data Scientist (ML/NLP)
4. **Alex Rodriguez** - DevOps Engineer → Platform Engineer (Infrastructure)
5. **Emma Williams** - Frontend Developer → Senior Frontend Engineer (Remote-first)
6. **James Park** - Backend Engineer → Principal Engineer (Distributed systems)

## Creating Accounts in application-pal

### Manual Method (for screenshots)

1. Start application-pal:
   ```bash
   cd /path/to/application-pal
   docker compose up -d
   ```

2. Open http://localhost:8070

3. For each profile in `demo-user-profiles.json`:
   - Click "Create Account"
   - Use the email from the profile (e.g., `sarah.chen@demo.app`)
   - Set password: `Demo123!` (or any secure password)
   - Fill in profile information from the JSON data

4. Add applications for each user:
   - Log in as the user
   - Create applications matching the data in `demo-applications-data.json`
   - Use the status, notes, and dates provided

### Automated Method (requires application-pal API access)

> **Note**: This requires programmatic access to application-pal's API.
> The application team would need to implement a seeding script that:
> 1. Creates users via the registration API
> 2. Populates applications for each user
> 3. Sets appropriate dates and statuses

**Expected API endpoints needed:**
- `POST /api/auth/register` - Create user accounts
- `POST /api/applications` - Create job applications
- `PATCH /api/applications/:id` - Update application status

## Use Cases

### Marketing Website Screenshots

These profiles provide realistic data for capturing screenshots showing:
- Kanban board with applications in different stages
- Calendar view with interview dates and deadlines
- Profile page with complete user information
- AI coaching conversations (manually create after account setup)
- Google Drive folder organization

### Testimonials and Case Studies

The diverse personas can be referenced in marketing copy:
- Different career levels (4-9 years experience)
- Various tech roles (engineering, design, data science, DevOps)
- Global locations (SF, NY, Toronto, Austin, London, Seattle)
- Different job search strategies and challenges

### Feature Demonstrations

Each user has applications that demonstrate specific features:
- **Sarah** - Active job search with high-priority companies
- **Marcus** - Offer negotiation scenario (urgent timeline)
- **Priya** - Take-home assessments and case studies
- **Alex** - Technical interview preparation
- **Emma** - Remote-first job search
- **James** - Principal-level applications (bar raiser interviews)

## Password Convention

For demo accounts, use: `Demo123!`

**Security Note**: These are fake accounts for demonstration only. Never use real email addresses or share actual user data.

## Scope Note

This data was created for the **marketing website team** to have realistic personas and application data available for:
- Screenshot generation
- Marketing copy development
- Demo videos and walkthroughs

**Implementation note**: Actually creating these accounts in the application-pal codebase would require access to the application repository and is outside the scope of the marketing website team. This deliverable provides the **data and documentation** needed for whoever has that access.

If automated seeding is desired, the application-pal team should implement a database seeding script (e.g., `scripts/seed-demo-data.ts`) that reads these JSON files and populates the database directly.
