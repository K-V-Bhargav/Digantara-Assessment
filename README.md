Here’s a cleaner and more readable version of your project README:

---

# 🚀 Space Object Tracking System

A **modern, interactive satellite tracking application** built with **React** and **Vite** that allows users to monitor and filter real-time satellite and space debris data.

---

## 🌟 Features

### 🛰️ Real-time Satellite Data

* Fetches and displays comprehensive satellite information from the **Digantara API**

### 🔍 Interactive Filtering

* Filter by **object type**: Rocket Bodies, Debris, Payloads, Unknown
* Toggle between **all objects** and **selected objects only**
* **Search** across all satellite data fields

### ✅ Selection Management

* Select up to **10 satellites**
* Visual selection feedback with counter
* Error shown when selection exceeds the limit

### 🧾 Detailed Information Display

* **NORAD Catalog ID**
* **Object Name** and **Type**
* **Country Code**
* **Launch Date**
* **Orbit Code**

### 📊 Statistics Dashboard

* Real-time counts of:

  * All Objects
  * Rocket Bodies
  * Debris
  * Payloads
  * Unknown Types

### 💻 Responsive Design

* Clean, modern UI
* Space-themed design
* Smooth animations and transitions

---

## 🛠️ Technology Stack

| Tool      | Description                     |
| --------- | ------------------------------- |
| React 18  | Frontend Framework with Hooks   |
| Vite      | Lightweight Build Tool          |
| CSS       | Custom styling with transitions |
| Fetch API | Real-time data fetching         |

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js **v14.0 or higher**
* npm or yarn

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/K-V-Bhargav/Digantara-Assessment.git
cd Digantara-Assessment

# Install dependencies
npm install
# or
yarn

# Start development server
npm run dev
# or
yarn dev
```

🔗 Open your browser and navigate to: **[http://localhost:5173](http://localhost:5173)**

---

## 📘 Usage Guide

### 🎛️ Filtering Data

* Click any **category card** (e.g., Rocket Bodies) to filter by object type.
* Use the **search bar** to search satellites by **name, country, type**, or **any field**.
* Use the **"Show Selected Only"** button to toggle between all and selected objects.

### ✅ Selecting Satellites

* Use checkboxes on satellite cards to **select up to 10 satellites**.
* A **counter** displays the current number of selections.
* Error is shown if trying to select more than 10.

### 📄 Pagination

* Navigate pages using **Previous** and **Next** buttons.
* Current page and total pages are shown at the bottom.

---

## 📁 Project Structure

```
/src
  ├── /assets             # Static assets
  ├── App.jsx             # Main application component
  ├── SatelliteData.jsx   # Satellite tracking logic and UI
  ├── SatelliteData.css   # Styling for satellite component
  └── main.jsx            # App entry point
```
