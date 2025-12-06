# RTE Society's Rural Engineering College Hulkoti - Industrial Visit Website

A professional website showcasing the 3-day industrial visit to Mysore and Bangalore.

## Features

- Dynamic journey visualization
- Interactive place cards with detailed information
- Timetable with complete schedule
- Faculty contact information
- Responsive design for all devices
- Dark theme UI

## Deployment on Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Vercel will automatically detect it's a static site and deploy

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)

2. Click "Add New Project"

3. Drag and drop your project folder or upload via CLI

## Project Structure

```
trip/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript functionality
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
└── README.md           # This file
```

## Configuration

The `vercel.json` file includes:
- Static site configuration
- Security headers
- Proper routing

## Notes

- All images are hosted externally (no local image files needed)
- The site uses Google Fonts (Inter)
- No build process required - it's a pure static site

## Support

For issues or questions, contact the development team.

