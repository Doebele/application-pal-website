# Quick Start: Demo Accounts for application-pal

## TL;DR - SQL Method (Recommended)

```bash
# 1. Start application-pal
cd /path/to/application-pal && docker compose up -d

# 2. Seed demo accounts (SQL - fastest and most reliable)
cd /path/to/application-pal-website
docker compose -f /path/to/application-pal/docker-compose.yml \
  exec -T application-pal-db \
  psql -U postgres -d application_pal < seed-demo-users.sql

# 3. Login
open http://localhost:8070
# sarah.chen@demo.app
# marcus.johnson@demo.app  
# priya.sharma@demo.app
# Password: Demo123!
```

## Alternative: API Method

```bash
# Start application-pal
cd /path/to/application-pal && docker compose up -d

# Seed via API (requires 6 users)
cd /path/to/application-pal-website && node seed-demo-accounts.mjs
```

## What You Get

- **3 fully populated user accounts** with realistic names, roles, and profiles (SQL method)
- **9 job applications** across all pipeline stages
- **Ready-to-screenshot data** for marketing materials
- **Diverse personas** for testimonials and case studies

OR

- **6 user accounts** with 16 applications (API method via seed-demo-accounts.mjs)

## Files

- **`seed-demo-users.sql`** - SQL seeding script (3 users, direct DB access)
- `seed-demo-accounts.mjs` - API seeding script (6 users, via REST API)
- `demo-user-profiles.json` - User persona data (6 users)
- `demo-applications-data.json` - Job application data
- `DEMO_DATA_README.md` - Full documentation
- `TASK_DELIVERABLE_SUMMARY.md` - Technical details

## Users (SQL Method - 3 accounts)

1. **sarah.chen@demo.app** - Senior SWE → Staff Engineer
2. **marcus.johnson@demo.app** - Product Designer → Senior Designer
3. **priya.sharma@demo.app** - Data Scientist → Senior DS

## Users (API Method - 6 accounts)

1-3: Same as above, plus:
4. alex.r@demo.app - DevOps → Platform Engineer
5. emma.w@demo.app - Frontend Dev → Senior Frontend
6. james.park@demo.app - Backend Engineer → Principal

**All passwords:** `Demo123!`

## Troubleshooting

**Script can't find data files?**
- Run from the same directory as the JSON files

**Application not running?**
- Check: `docker compose ps` in application-pal directory

**API connection failed?**
- Use `--api-url http://localhost:3000` flag if using custom port

## Next Steps

- Run script to populate accounts
- Take screenshots for marketing website
- Use personas in testimonials and copy
- Demo the application with realistic data
