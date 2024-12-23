import { Player } from '../types';

export const samplePlayers = [
  {
    id: 'vk18',
    name: 'Virat Kohli',
    role: 'Batsman',
    country: 'India',
    basePrice: 200000000, // 20 Cr
    stats: { avg: 51.50, sr: 137.95 },
    image: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=400&fit=crop'
  },
  {
    id: 'rb45',
    name: 'Rohit Sharma',
    role: 'Batsman',
    country: 'India',
    basePrice: 160000000, // 16 Cr
    stats: { avg: 48.20, sr: 139.50 },
    image: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=400&fit=crop'
  },
  {
    id: 'jb17',
    name: 'Jasprit Bumrah',
    role: 'Bowler',
    country: 'India',
    basePrice: 150000000, // 15 Cr
    stats: { avg: 22.30, sr: 120.50 },
    image: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=400&fit=crop'
  },
  {
    id: 'hh47',
    name: 'Hardik Pandya',
    role: 'All-rounder',
    country: 'India',
    basePrice: 150000000, // 15 Cr
    stats: { avg: 35.40, sr: 145.30 },
    image: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=400&fit=crop'
  },
  {
    id: 'rj08',
    name: 'Ravindra Jadeja',
    role: 'All-rounder',
    country: 'India',
    basePrice: 140000000, // 14 Cr
    stats: { avg: 31.20, sr: 135.80 },
    image: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&h=400&fit=crop'
  }
] as Player[];