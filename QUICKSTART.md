# Quick Start: Demo Accounts for application-pal

## TL;DR

```bash
# 1. Start application-pal
cd /path/to/application-pal && docker compose up -d

# 2. Seed demo accounts
cd /path/to/application-pal-website && node seed-demo-accounts.mjs

# 3. Login
open http://localhost:8070
# Use any email from demo-user-profiles.json
# Password: Demo123!
```

## What You Get

- **6 fully populated user accounts** with realistic names, roles, and profiles
- **16 job applications** across Wishlist, Applied, Interview, and Offer stages
- **Ready-to-screenshot data** for marketing materials
- **Diverse personas** for testimonials and case studies

## Files

- `demo-user-profiles.json` - User persona data
- `demo-applications-data.json` - Job application data
- `seed-demo-accounts.mjs` - Automated seeding script
- `DEMO_DATA_README.md` - Full documentation
- `TASK_DELIVERABLE_SUMMARY.md` - Technical details

## Users

1. sarah.chen@demo.app - Senior SWE → Staff Engineer
2. marcus.j@demo.app - Product Designer → Senior Designer
3. priya.sharma@demo.app - Data Scientist → Senior DS
4. alex.r@demo.app - DevOps → Platform Engineer
5. emma.w@demo.app - Frontend Dev → Senior Frontend
6. james.park@demo.app - Backend Engineer → Principal

All passwords: `Demo123!`

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
