const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Habit = require('./models/Habit');
const HabitCompletion = require('./models/HabitCompletion');
const MoodEntry = require('./models/MoodEntry');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Habit.deleteMany({});
    await HabitCompletion.deleteMany({});
    await MoodEntry.deleteMany({});

    // Create test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      avatar: 'TU',
    });

    console.log('✅ User created:', user.email);

    // Create habits
    const habits = await Habit.insertMany([
      {
        userId: user._id,
        name: 'Morning Exercise',
        description: '30 minutes of cardio or yoga',
        icon: '🏃',
        target: '30 min',
        category: 'fitness',
        frequency: 'daily',
        streak: 5,
        bestStreak: 10,
        completionCount: 15,
      },
      {
        userId: user._id,
        name: 'Drink Water',
        description: 'Stay hydrated throughout the day',
        icon: '💧',
        target: '8 glasses',
        category: 'health',
        frequency: 'daily',
        streak: 12,
        bestStreak: 15,
        completionCount: 30,
      },
      {
        userId: user._id,
        name: 'Meditation',
        description: 'Morning mindfulness practice',
        icon: '🧘',
        target: '15 min',
        category: 'mindfulness',
        frequency: 'daily',
        streak: 3,
        bestStreak: 7,
        completionCount: 10,
      },
      {
        userId: user._id,
        name: 'Reading',
        description: 'Read books or articles',
        icon: '📚',
        target: '20 pages',
        category: 'productivity',
        frequency: 'daily',
        streak: 0,
        bestStreak: 5,
        completionCount: 8,
      },
      {
        userId: user._id,
        name: 'Healthy Eating',
        description: 'Eat nutritious meals',
        icon: '🥗',
        target: '3 meals',
        category: 'health',
        frequency: 'daily',
        streak: 7,
        bestStreak: 7,
        completionCount: 20,
      },
    ]);

    console.log('✅ Created', habits.length, 'habits');

    // Create completions for today for some habits
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await HabitCompletion.insertMany([
      {
        userId: user._id,
        habitId: habits._id,
        date: today,
        completed: true,
        notes: 'Morning jog completed',
      },
      {
        userId: user._id,
        habitId: habits._id,
        date: today,
        completed: true,
        notes: 'Drank all 8 glasses',
      },
      {
        userId: user._id,
        habitId: habits._id,
        date: today,
        completed: false,
      },
    ]);

    console.log('✅ Created habit completions for today');

    // Create mood entries
    await MoodEntry.insertMany([
      {
        userId: user._id,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        mood: 7,
        notes: 'Good day',
      },
      {
        userId: user._id,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        mood: 8,
        notes: 'Great day',
      },
      {
        userId: user._id,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        mood: 6,
        notes: 'Average day',
      },
      {
        userId: user._id,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        mood: 9,
        notes: 'Excellent day!',
      },
      {
        userId: user._id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        mood: 7,
        notes: 'Productive',
      },
      {
        userId: user._id,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        mood: 8,
        notes: 'Feeling good',
      },
      {
        userId: user._id,
        date: today,
        mood: 8,
        notes: 'Great start to the day',
      },
    ]);

    console.log('✅ Created mood entries');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\nLogin with:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
