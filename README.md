   # 🏃‍♂️ BDM Ultramarathon Companion

> A comprehensive, mobile-first web application designed to help runners and support crews conquer the grueling Bataan Death March (BDM) 102km and 160km ultramarathons.

## 📖 Overview

The BDM Ultramarathon Companion is a specialized logistics, pacing, and navigation tool. Because the BDM imposes strict cutoffs, extreme heat, and specific pacer rules, this app serves as a centralized command center. It features offline-ready route maps, automated crew task generation, dynamic pacing calculators, and real-time DNF risk analysis. 

## ✨ Key Features

### 🗺️ Navigation & Mapping
* **Multi-Distance Support:** Instant toggling between BDM 102 (Mariveles to San Fernando) and BDM 160 (Mariveles to Capas).
* **Offline-Ready Vector Maps:** Custom SVG-based route rendering with precise lat/long projections. One-touch caching ensures maps work in dead zones.
* **GPX Exports:** Built-in `GPXService` to generate smartwatch-compatible GPX 1.1 files directly from the map view.

### ⏱️ Pacing & Cutoff Tracking
* **Run/Walk Strategy Calculator:** Project your finish time based on custom intervals (e.g., 4:1, 2:1).
* **DNF Risk Analysis:** Real-time race clock calculates required pace for intermediate cutoffs (50km @ 9h, 102km @ 18h). Triggers visual warnings if you fall behind.
* **AI Pacing Consultant:** Gemini-powered advice tailored to your strategy, BDM heat, and specific terrain segments.

### 🚐 Support Crew Command Center
* **Runner Progress Tracker:** Real-time KM slider syncing with logistical instructions.
* **Dynamic Pacer Protocol:** Automatically enforces race rules (Strictly NO pacers for BDM 102; Pacers ALLOWED from KM 102 for BDM 160). 
* **Targeted Orders:** Automated, location-based task lists for the Driver, Pacer, and Food Prep.
* **Survival Inventory:** Persistent, auto-saving checklist for mandatory gear, hydration, and medical supplies.

## 🛠️ Technical Details

* **TypeScript:** Robust type safety across all services and components.
* **State Persistence:** Custom `CacheService` handles all `localStorage` operations for offline use, progress tracking, and inventory states.
* **Mobile-First UX:** High-contrast Dark Mode, large touch targets, and a carefully managed z-index architecture for flawless field use.
* **AI Integration:** "Pro Mode" utilizes the Gemini API for advanced analytics and image generation.

### 2. Release Notes Draft

**Release Title: v1.1.0 - Strict Cutoffs, Smart Logistics & GPX Support**

**🚀 New Features:**
* **GPX Downloads:** Added a dedicated GPX Export button in the header and map views. Easily download 102km or 160km routes for your Garmin/Coros smartwatch.
* **Race Clock & DNF Risk Analysis:** The Crew View now features a real-time race clock. It calculates the required pace to hit the dreaded 50km (9h) and 102km (18h) cutoffs, displaying "ON TRACK", "WARNING", or "CRITICAL" badges.
* **AI Strategy Warnings:** The pacing tab now pulses a red "RISK OF DNF" warning if your target Run/Walk strategy mathematically misses the intermediate cutoffs. 

**🛡️ Rule Enforcements & Logistics:**
* **Dynamic Pacer Protocols:** Crew view now strictly enforces BDM rules. Pacer status explicitly shows "FORBIDDEN" (red) below 102km, switching to "ALLOWED" (green) at the 102km mark for the 160 distance.
* **Start Time Reminders:** Added clear logistical reminders in the Race Selector (10:00 PM for 102k, 05:00 AM for 160k).

**🛠️ Refinements & Bug Fixes:**
* **Offline Caching:** Enhanced the `CacheService` to ensure the last viewed KM marker is remembered even after app restarts.
* **UI/UX Fixes:** Resolved complex z-index layering issues between the sticky navigation, backdrops, and the race selector dropdown. 

View the app in AI Studio: https://ai.studio/apps/a4adb5f9-bb96-4412-b3e7-8baeb0d96d27

## 🚀 Getting Started

```bash
# Clone the repository
git clone [https://github.com/yourusername/bdm-companion.git](https://github.com/yourusername/bdm-companion.git)

# Install dependencies
npm install

# Run the development server
npm run dev
