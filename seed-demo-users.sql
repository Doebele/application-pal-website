-- Demo User Account Seeding Script for application-pal
-- Run this against the application_pal database after initial setup
--
-- Prerequisites:
--   1. Application must be running (docker compose up -d)
--   2. Database migrations must be complete
--
-- Usage:
--   docker compose exec -T application-pal-db psql -U postgres -d application_pal < seed-demo-users.sql
--
-- OR connect directly:
--   psql postgresql://postgres:YOUR_PASSWORD@localhost:5432/application_pal < seed-demo-users.sql
--
-- All accounts use password: Demo123!
-- Password hash generated with bcrypt (12 rounds)

-- Password hash for "Demo123!" (bcrypt with cost 12)
-- Generated via: bcrypt.hash('Demo123!', 12)
-- Hash: $2b$12$9BeDxRW3oROGgKwseS.N/.wFHDpS.iBtUZRLawoTjNgwrPgGZ.UnS

BEGIN;

-- Create three demo users
INSERT INTO users (id, email, password_hash, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'sarah.chen@demo.app', '$2b$12$9BeDxRW3oROGgKwseS.N/.wFHDpS.iBtUZRLawoTjNgwrPgGZ.UnS', NOW() - INTERVAL '30 days'),
  ('22222222-2222-2222-2222-222222222222', 'marcus.johnson@demo.app', '$2b$12$9BeDxRW3oROGgKwseS.N/.wFHDpS.iBtUZRLawoTjNgwrPgGZ.UnS', NOW() - INTERVAL '25 days'),
  ('33333333-3333-3333-3333-333333333333', 'priya.sharma@demo.app', '$2b$12$9BeDxRW3oROGgKwseS.N/.wFHDpS.iBtUZRLawoTjNgwrPgGZ.UnS', NOW() - INTERVAL '20 days')
ON CONFLICT (email) DO NOTHING;

-- Create user profiles
INSERT INTO user_profile (user_id, name, title, location, bio, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 
   'Sarah Chen', 
   'Senior Software Engineer', 
   'San Francisco, CA',
   'Full-stack engineer passionate about developer tools and performance optimization. Currently seeking staff-level positions at product-focused companies.',
   NOW() - INTERVAL '30 days',
   NOW() - INTERVAL '1 day'),
  
  ('22222222-2222-2222-2222-222222222222',
   'Marcus Johnson',
   'Product Designer',
   'New York, NY',
   'Product designer focused on B2B SaaS. Love creating intuitive experiences for complex workflows.',
   NOW() - INTERVAL '25 days',
   NOW() - INTERVAL '2 days'),
  
  ('33333333-3333-3333-3333-333333333333',
   'Priya Sharma',
   'Data Scientist',
   'Toronto, ON',
   'ML engineer specializing in recommendation systems and natural language processing. Looking for roles with strong ML infrastructure.',
   NOW() - INTERVAL '20 days',
   NOW() - INTERVAL '3 days')
ON CONFLICT (user_id) DO NOTHING;

-- Create demo applications for Sarah Chen (user 1)
INSERT INTO applications (id, user_id, company, role, stage, notes, created_at, updated_at) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Google', 'Staff Software Engineer - Infrastructure', 'interview_2', 'Referred by former colleague. Focus on system design and distributed systems in prep.', NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Stripe', 'Staff Engineer - Platform', 'application_sent', 'Completed take-home assessment. Waiting for feedback.', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'Vercel', 'Senior Engineer - Frontend Infrastructure', 'preparing_cv', 'Dream company. Need to finish portfolio site before applying.', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Create demo applications for Marcus Johnson (user 2)
INSERT INTO applications (id, user_id, company, role, stage, notes, created_at, updated_at) VALUES
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Figma', 'Senior Product Designer', 'interview_1', 'Portfolio review went well. Team fit interview next week.', NOW() - INTERVAL '20 days', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Linear', 'Product Designer', 'accepted', 'Received offer! 48-hour deadline to respond. Need to negotiate equity.', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'Notion', 'Senior Designer - Templates', 'application_sent', 'Applied through referral. Waiting to hear back.', NOW() - INTERVAL '8 days', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Create demo applications for Priya Sharma (user 3)
INSERT INTO applications (id, user_id, company, role, stage, notes, created_at, updated_at) VALUES
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Shopify', 'Senior Data Scientist - Recommendations', 'interview_2', 'Technical interview completed. ML case study in progress.', NOW() - INTERVAL '12 days', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Meta', 'Data Scientist - Integrity', 'application_sent', 'Interesting team working on content moderation ML.', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'Spotify', 'Senior Data Scientist - Personalization', 'preparing_cv', 'Perfect fit for recommendation systems experience.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify the seeded data
SELECT 
  u.email,
  up.name,
  up.title,
  COUNT(a.id) as application_count
FROM users u
LEFT JOIN user_profile up ON u.id = up.user_id
LEFT JOIN applications a ON u.id = a.user_id
WHERE u.email LIKE '%@demo.app'
GROUP BY u.email, up.name, up.title
ORDER BY u.email;

-- Success message
\echo ''
\echo '✅ Demo accounts created successfully!'
\echo ''
\echo 'Login credentials:'
\echo '  • sarah.chen@demo.app'
\echo '  • marcus.johnson@demo.app'
\echo '  • priya.sharma@demo.app'
\echo ''
\echo 'Password for all accounts: Demo123!'
\echo ''
\echo 'Access at: http://localhost:8070'
\echo ''
