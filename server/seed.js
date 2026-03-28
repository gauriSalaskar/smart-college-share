/**
 * Seed script — creates demo admin + student accounts and sample listings.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-college-share';

const sampleListings = [
  {
    title: 'Engineering Mathematics Vol.2 by R.K. Jain',
    description: 'Good condition, used for one semester. All pages intact, minimal highlighting. Perfect for 2nd year students.',
    category: 'Books',
    type: 'Sell',
    price: 180,
    priceUnit: 'fixed',
    condition: 'Good',
    location: 'Boys Hostel Block A',
    tags: ['maths', 'btech', 'sem3', 'engineering'],
    contactPreference: 'both',
    status: 'approved',
  },
  {
    title: 'Scientific Calculator — Casio fx-991EX',
    description: 'Barely used Casio fx-991EX ClassWiz. All functions work perfectly. Comes with original cover.',
    category: 'Electronics',
    type: 'Sell',
    price: 700,
    priceUnit: 'fixed',
    condition: 'Like New',
    location: 'Library Notice Board',
    tags: ['calculator', 'casio', 'exam'],
    contactPreference: 'email',
    status: 'approved',
  },
  {
    title: 'Digital Multimeter (Fluke 107)',
    description: 'Available for rent during lab sessions. Works perfectly for ECE and EEE labs. Short-term rent preferred.',
    category: 'Lab Equipment',
    type: 'Rent',
    price: 50,
    priceUnit: 'per day',
    condition: 'Good',
    location: 'ECE Department Hostel',
    tags: ['multimeter', 'electronics', 'lab'],
    contactPreference: 'phone',
    status: 'approved',
  },
  {
    title: 'Table Fan — Usha Striker',
    description: 'Sharing my table fan for the summer. Hostel roommate gone home. Collect from room 204.',
    category: 'Appliances',
    type: 'Share',
    price: 0,
    priceUnit: 'fixed',
    condition: 'Good',
    location: 'Girls Hostel Block C, Room 204',
    tags: ['fan', 'summer', 'hostel'],
    contactPreference: 'both',
    status: 'approved',
  },
  {
    title: 'Data Structures & Algorithms — Cormen (CLRS)',
    description: '3rd edition CLRS textbook. Some notes in pencil that can be erased. Essential for CS placements.',
    category: 'Books',
    type: 'Rent',
    price: 30,
    priceUnit: 'per week',
    condition: 'Fair',
    location: 'CS Department',
    tags: ['dsa', 'algorithms', 'cs', 'placement'],
    contactPreference: 'email',
    status: 'approved',
  },
  {
    title: 'Electric Kettle — Prestige 1.5L',
    description: 'Perfect working condition. Selling because upgrading to a larger one. Ideal for instant noodles and tea.',
    category: 'Appliances',
    type: 'Sell',
    price: 350,
    priceUnit: 'fixed',
    condition: 'Good',
    location: 'Boys Hostel Block D',
    tags: ['kettle', 'hostel', 'kitchen'],
    contactPreference: 'phone',
    status: 'approved',
  },
  {
    title: 'Oscilloscope — DSO138 Kit',
    description: 'Assembled DSO138 oscilloscope, great for electronics projects. Renting out during exam breaks.',
    category: 'Lab Equipment',
    type: 'Rent',
    price: 80,
    priceUnit: 'per day',
    condition: 'Good',
    location: 'Electronics Lab Area',
    tags: ['oscilloscope', 'lab', 'electronics', 'project'],
    contactPreference: 'email',
    status: 'approved',
  },
  {
    title: 'Stationery Bundle — Rulers, Compass, Protractor Set',
    description: 'Complete geometry set. Giving away for free since I graduated. First come first serve.',
    category: 'Stationery',
    type: 'Share',
    price: 0,
    priceUnit: 'fixed',
    condition: 'Like New',
    location: 'Main Gate Notice Board',
    tags: ['stationery', 'geometry', 'free'],
    contactPreference: 'email',
    status: 'approved',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clean existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'admin',
      college: 'CampusShare University',
      phone: '+91 9000000001',
    });
    console.log('👑 Admin created: admin@college.edu / admin123');

    // Create student
    const student = await User.create({
      name: 'Arjun Sharma',
      email: 'student@college.edu',
      password: 'student123',
      role: 'student',
      college: 'CampusShare University',
      phone: '+91 9000000002',
    });
    console.log('🎓 Student created: student@college.edu / student123');

    // Create extra students
    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@college.edu',
      password: 'priya1234',
      role: 'student',
      college: 'CampusShare University',
      phone: '+91 9000000003',
    });

    // Create listings alternating between student and student2
    const owners = [student, student2, student, student2, student, student2, student, student2];
    for (let i = 0; i < sampleListings.length; i++) {
      await Listing.create({ ...sampleListings[i], owner: owners[i]._id });
    }
    console.log(`📋 Created ${sampleListings.length} sample listings`);

    // Create 1 pending listing
    await Listing.create({
      title: 'Python Programming Book (Pending Review)',
      description: 'Automate the Boring Stuff with Python — 2nd Edition. Submitted for review.',
      category: 'Books',
      type: 'Sell',
      price: 250,
      priceUnit: 'fixed',
      condition: 'New',
      location: 'Library',
      status: 'pending',
      owner: student._id,
      tags: ['python', 'programming'],
      contactPreference: 'email',
    });
    console.log('⏳ Created 1 pending listing for admin review demo');

    console.log('\n🚀 Seed complete! You can now start the server.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
