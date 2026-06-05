#!/usr/bin/env node
/**
 * Seed script for creating demo user accounts in application-pal
 * 
 * Prerequisites:
 * 1. application-pal must be running (docker compose up -d)
 * 2. Run from application-pal repository root: node /path/to/seed-demo-accounts.mjs
 * 3. Or copy this file into application-pal/backend/scripts/ and run from there
 * 
 * Usage:
 *   node seed-demo-accounts.mjs [--api-url http://localhost:3000]
 */

import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line args
const args = process.argv.slice(2);
const apiUrlIndex = args.indexOf('--api-url');
const API_URL = apiUrlIndex >= 0 && args[apiUrlIndex + 1] 
  ? args[apiUrlIndex + 1] 
  : 'http://localhost:3000';

console.log(`🌱 Demo Account Seeder for application-pal`);
console.log(`📡 API URL: ${API_URL}\n`);

// Load demo data
let profiles, applicationsData;
try {
  const profilesPath = join(__dirname, 'demo-user-profiles.json');
  const appsPath = join(__dirname, 'demo-applications-data.json');
  profiles = JSON.parse(await readFile(profilesPath, 'utf-8'));
  applicationsData = JSON.parse(await readFile(appsPath, 'utf-8'));
  console.log(`✓ Loaded ${profiles.length} user profiles`);
  console.log(`✓ Loaded application data for ${applicationsData.length} users\n`);
} catch (err) {
  console.error('❌ Failed to load demo data files:');
  console.error('   Make sure demo-user-profiles.json and demo-applications-data.json');
  console.error('   are in the same directory as this script.');
  console.error(`\n   Error: ${err.message}`);
  process.exit(1);
}

const DEMO_PASSWORD = 'Demo123!';
const createdUsers = [];

/**
 * Call API endpoint
 */
async function apiCall(endpoint, method = 'GET', body = null, accessToken = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Cookie'] = `access_token=${accessToken}`;
  }
  
  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`API Error (${response.status}): ${JSON.stringify(data)}`);
  }
  
  return { data, headers: response.headers };
}

/**
 * Extract access token from set-cookie header
 */
function extractAccessToken(headers) {
  const setCookie = headers.get('set-cookie');
  if (!setCookie) return null;
  const match = setCookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Create user account
 */
async function createUser(profile, isFirst = false, inviteToken = null) {
  console.log(`👤 Creating user: ${profile.name} (${profile.email})`);
  
  try {
    const payload = {
      email: profile.email,
      password: DEMO_PASSWORD,
      rememberMe: true
    };
    
    if (!isFirst && inviteToken) {
      payload.inviteToken = inviteToken;
    }
    
    const { data, headers } = await apiCall('/api/auth/setup', 'POST', payload);
    const accessToken = extractAccessToken(headers);
    
    if (!accessToken) {
      throw new Error('No access token received');
    }
    
    console.log(`   ✓ Account created: ${data.email}`);
    return accessToken;
    
  } catch (err) {
    console.error(`   ❌ Failed: ${err.message}`);
    return null;
  }
}

/**
 * Update user profile
 */
async function updateProfile(accessToken, profile) {
  console.log(`   📝 Updating profile for ${profile.name}...`);
  
  try {
    await apiCall('/api/profile', 'PATCH', {
      name: profile.name,
      title: profile.title,
      location: profile.location,
      bio: profile.bio,
      skills: profile.skills.join(', ')
    }, accessToken);
    
    console.log(`   ✓ Profile updated`);
  } catch (err) {
    console.error(`   ❌ Profile update failed: ${err.message}`);
  }
}

/**
 * Create job applications for a user
 */
async function createApplications(accessToken, userEmail) {
  const userData = applicationsData.find(u => u.user === userEmail);
  if (!userData || !userData.applications) {
    console.log(`   ⚠ No application data found for ${userEmail}`);
    return;
  }
  
  console.log(`   📋 Creating ${userData.applications.length} job applications...`);
  
  for (const app of userData.applications) {
    try {
      const payload = {
        company: app.company,
        position: app.position,
        stage: app.status.toLowerCase(), // Wishlist, Applied, Interview, Offer
        notes: app.notes || '',
        createdAt: app.dateApplied || new Date().toISOString().split('T')[0]
      };
      
      await apiCall('/api/applications', 'POST', payload, accessToken);
      console.log(`      ✓ ${app.company} - ${app.position} (${app.status})`);
      
    } catch (err) {
      console.error(`      ❌ Failed to create ${app.company} application: ${err.message}`);
    }
  }
}

/**
 * Create invite token from first user
 */
async function createInvite(accessToken, email = null) {
  try {
    const { data } = await apiCall('/api/invites', 'POST', {
      email,
      expiresInDays: 365
    }, accessToken);
    
    return data.token;
  } catch (err) {
    console.error(`   ❌ Failed to create invite: ${err.message}`);
    return null;
  }
}

/**
 * Main seeding flow
 */
async function main() {
  console.log('─'.repeat(60));
  console.log('Starting demo account creation...\n');
  
  // Check if application is running
  try {
    const { data } = await apiCall('/api/auth/status');
    if (data.setup) {
      console.log('⚠️  Warning: Users already exist in the database.');
      console.log('   This script creates multiple accounts via the invite system.');
      console.log('   Some accounts may fail if emails are already registered.\n');
    }
  } catch (err) {
    console.error('❌ Cannot connect to application-pal API.');
    console.error(`   Make sure the application is running at ${API_URL}`);
    console.error(`   Error: ${err.message}\n`);
    process.exit(1);
  }
  
  // Create first user
  const firstProfile = profiles[0];
  const firstToken = await createUser(firstProfile, true);
  if (!firstToken) {
    console.error('\n❌ Failed to create first user. Aborting.');
    process.exit(1);
  }
  createdUsers.push({ profile: firstProfile, token: firstToken });
  
  await updateProfile(firstToken, firstProfile);
  await createApplications(firstToken, firstProfile.email);
  
  console.log('');
  
  // Create invites for remaining users
  console.log(`🎫 Creating invite tokens for ${profiles.length - 1} additional users...\n`);
  const invites = [];
  for (let i = 1; i < profiles.length; i++) {
    const token = await createInvite(firstToken, profiles[i].email);
    if (token) {
      invites.push({ email: profiles[i].email, token });
      console.log(`   ✓ Invite created for ${profiles[i].email}`);
    }
  }
  
  console.log('');
  
  // Create remaining users
  for (let i = 1; i < profiles.length; i++) {
    const profile = profiles[i];
    const invite = invites.find(inv => inv.email === profile.email);
    
    if (!invite) {
      console.error(`⚠️  Skipping ${profile.email} - no invite token`);
      continue;
    }
    
    const userToken = await createUser(profile, false, invite.token);
    if (userToken) {
      createdUsers.push({ profile, token: userToken });
      await updateProfile(userToken, profile);
      await createApplications(userToken, profile.email);
    }
    
    console.log('');
  }
  
  // Summary
  console.log('─'.repeat(60));
  console.log(`\n✅ Demo account creation complete!\n`);
  console.log(`Created ${createdUsers.length} / ${profiles.length} accounts:\n`);
  
  for (const { profile } of createdUsers) {
    console.log(`   • ${profile.name} (${profile.email})`);
  }
  
  console.log(`\n📝 All accounts use password: ${DEMO_PASSWORD}`);
  console.log(`\n🌐 Login at: ${API_URL.replace(':3000', ':8070')}\n`);
}

// Run
main().catch(err => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
