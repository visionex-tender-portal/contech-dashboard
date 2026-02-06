# Construction Tech Intelligence Dashboard - User Guide 📖

## Overview

Welcome to your new construction tech investment intelligence platform! This guide will help you navigate and get the most out of the dashboard.

## Quick Start

### Accessing the Dashboard

1. Open your web browser
2. Navigate to your dashboard URL (e.g., `https://your-dashboard.vercel.app`)
3. The homepage loads automatically

### Dashboard Layout

```
┌─────────────────────────────────────┐
│         Navigation Header           │
├─────────────────────────────────────┤
│                                     │
│  📊 Key Metrics (4 cards)          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📈 Charts (Timeline, Stages)      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  👥 Top Investors Table            │
│                                     │
└─────────────────────────────────────┘
```

---

## Features Guide

### 1. Homepage Dashboard

#### Key Metrics Cards
Four animated cards show:
- **Total Investments:** Count of all deals in database
- **Companies:** Number of unique companies funded
- **Investors:** Number of unique VCs/Angels
- **Total Funding:** Aggregate capital deployed

**Tip:** Numbers animate on load for visual impact!

#### Quick Action Buttons
Three large buttons for rapid navigation:
- **Browse Investments:** See all deals with filters
- **View Companies:** Explore funded companies
- **Explore Investors:** Discover active VCs

#### Timeline Chart
Interactive line chart showing:
- Investment count over time
- Hover to see exact dates and numbers
- Spot trends and hot periods

#### Stage Distribution Chart
Pie chart breaking down investments by:
- Seed
- Series A, B, C, D, E
- Growth
- Late Stage

**Tip:** Great for understanding market maturity!

#### Top Investors Table
Sortable table showing:
- Investor name (click to see profile)
- Type (VC, Angel, Corporate)
- Location
- Number of investments
- Number of companies in portfolio

---

### 2. Investments Page

#### Search & Filters
**Search Bar:**
- Type company name, investor, or keyword
- Real-time filtering as you type
- Searches across: company name, description, investors

**Stage Filter:**
- Dropdown to filter by investment stage
- Select "All Stages" to see everything
- Instant results

#### Export to CSV
- Click "Export CSV" button (top-right)
- Downloads filtered results
- Includes: Company, Amount, Stage, Date, Location, Investors

#### Investment Cards
Each card shows:
- **Company Name** (large, bold)
- **Stage Badge** (colored pill)
- **Amount:** Funding raised (or "Undisclosed")
- **Date:** Investment date
- **Location:** Company HQ
- **Investors:** List of participating VCs
- **Description:** Deal summary (if available)

**Interaction:**
- Cards hover with shadow effect
- Click to view full details (coming soon)

---

### 3. Investors Page

#### Search
- Find investors by name or location
- Real-time filtering

#### Investor Grid
Grid layout showing investor cards with:
- **Name** (bold, clickable)
- **Type Badge** (VC, Angel, Corporate)
- **Location** (with 📍 icon)
- **Investment Count:** Number of deals
- **Company Count:** Portfolio size
- **Website Link** (if available)

**Interaction:**
- Click card to see full profile
- Click website link to visit (opens new tab)

---

### 4. Investor Detail Page

Detailed investor profile with:

#### Header Section
- Investor name (large heading)
- Type badge
- Location
- Website link
- Portfolio size (right side, large number)

#### Portfolio Companies
List of all investments by this investor:
- Company name
- Location
- Funding amount
- Investment date
- Stage

**Sorted:** Most recent investments first

#### Frequent Co-Investors
Grid showing VCs who often co-invest:
- Co-investor name (clickable)
- Number of shared deals

**Use Case:** Discover investor networks and patterns!

---

### 5. Companies Page

#### Search
- Find companies by name, location, or description
- Instant results

#### Company Grid
Cards showing:
- **Company Name**
- **Location** (📍)
- **Description** (3-line preview)
- **Investment Count:** Number of funding rounds
- **Total Funding:** All capital raised
- **Website Link**

**Tip:** Companies are sorted by total funding (highest first)

---

## Use Cases

### For Fundraising
1. **Research Potential Investors:**
   - Go to Investors page
   - Filter by stage/focus
   - Click investor to see portfolio
   - Check if they invest in similar companies

2. **Find Warm Intros:**
   - View investor profile
   - Check "Frequent Co-Investors"
   - Look for connections you have

3. **Understand Market Trends:**
   - Check Timeline chart for hot periods
   - Review Stage Distribution for market maturity
   - Analyze Top Investors for active players

### For Market Analysis
1. **Track Competition:**
   - Go to Companies page
   - Search by category keyword
   - See who's raising and how much

2. **Identify Active VCs:**
   - Check Top Investors table
   - Sort by Investment Count
   - Focus on most active firms

3. **Spot Emerging Trends:**
   - Filter investments by date (recent)
   - Look at stage distribution changes
   - Track new entrants

### For Networking
1. **Find Co-Investment Opportunities:**
   - View investor profiles
   - Check co-investor networks
   - Map out relationships

2. **Discover New Players:**
   - Browse recent investments
   - Note new VCs participating
   - Research their thesis

---

## Tips & Tricks

### Keyboard Shortcuts
- **Ctrl/Cmd + K:** Focus search (coming soon)
- **Back button:** Use browser back to navigate

### Performance
- Dashboard auto-refreshes data every 5 minutes
- Manual refresh: Click "Refresh" button in header
- For faster loading, use stage/date filters

### Mobile Usage
- Fully responsive design
- Best experience: Portrait mode on tablets, any orientation on phones
- All features available on mobile

### Bookmarking
- Bookmark specific investor/company pages
- Deep links work for sharing

---

## Data Understanding

### Investment Amounts
- **Displayed as:** $5.0M, $15.3M, $100K
- **"Undisclosed":** Amount not publicly known
- **Totals:** May be conservative (some undisclosed)

### Dates
- Format: Jan 15, 2024
- If "N/A": Date not available in source data

### Investment Stages
- **Seed:** Early-stage, pre-product
- **Series A:** Product-market fit, scaling
- **Series B+:** Growth and expansion
- **Growth/Late Stage:** Pre-IPO or mature

### Data Sources
Each investment tracked from:
- VC portfolio pages
- Press releases
- News articles
- Industry databases

---

## Troubleshooting

### Issue: "No results found"
**Solution:**
- Clear search filters
- Try broader search terms
- Check spelling

### Issue: Data seems outdated
**Solution:**
- Click "Refresh" button
- Wait for auto-refresh (5 min)
- Contact admin to run scrapers

### Issue: Page loading slowly
**Solution:**
- Check internet connection
- Reduce number of results (use filters)
- Try a different browser

### Issue: Chart not displaying
**Solution:**
- Refresh page
- Try different browser
- Clear cache

---

## Upcoming Features

🚧 **In Development:**
- [ ] Dark mode toggle
- [ ] Advanced filters (amount range, date range)
- [ ] Save filter presets
- [ ] Email finder for VCs
- [ ] Company detail pages
- [ ] Network graph visualization
- [ ] Export custom reports
- [ ] API access

💡 **Planned:**
- [ ] AI-powered insights
- [ ] Trend detection
- [ ] Weekly email digest
- [ ] Mobile app
- [ ] Slack integration

---

## Best Practices

### For Accurate Analysis
1. Cross-reference with other sources
2. Note "Undisclosed" amounts in your analysis
3. Look at investor count, not just amount

### For Effective Networking
1. Research investor thesis before reaching out
2. Find warm intros via co-investors
3. Track multiple touchpoints

### For Market Research
1. Export data regularly for tracking
2. Combine with other market data
3. Note seasonality in investment timing

---

## FAQ

**Q: How often is data updated?**
A: Dashboard checks every 5 minutes. Scrapers run every 8 hours (configurable).

**Q: Can I add my own data?**
A: Currently manual via database. Admin panel coming soon!

**Q: Is this data public?**
A: Yes, all data is sourced from public announcements and VC websites.

**Q: Can I export everything?**
A: Yes! Use "Export CSV" on Investments page. More export options coming.

**Q: How accurate are the amounts?**
A: Amounts are from public sources. "Undisclosed" means not publicly known.

**Q: Can I share specific pages?**
A: Yes! URLs are shareable. Just copy and send.

**Q: Is there a mobile app?**
A: Not yet, but the website is fully mobile-responsive!

**Q: Can I get API access?**
A: Planned feature! Stay tuned.

---

## Contact & Support

For questions, feature requests, or issues:
- Email: [your-email]
- GitHub: [repo-url]/issues

---

**Happy analyzing! 🏗️📊**
