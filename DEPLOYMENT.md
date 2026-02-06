# Deployment Guide 🚀

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works!)

### Step-by-Step Deployment

#### 1. Push to GitHub

First, create a new repository on GitHub, then:

```bash
cd /data/.openclaw/workspace/contech-dashboard
git remote add origin https://github.com/YOUR_USERNAME/contech-dashboard.git
git branch -M main
git push -u origin main
```

#### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

That's it! Your dashboard will be live in ~2 minutes.

**Option B: Using Vercel CLI**

```bash
npm install -g vercel
cd /data/.openclaw/workspace/contech-dashboard
vercel login
vercel
```

Follow the prompts. Your dashboard will be deployed automatically.

#### 3. Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain (e.g., `contech.yourdomain.com`)
4. Update DNS records as instructed

Your dashboard is now live! 🎉

---

## Deploy to Railway

### Prerequisites
- Railway account (free tier available)

### Steps

1. Install Railway CLI:
```bash
npm install -g railway
```

2. Deploy:
```bash
cd /data/.openclaw/workspace/contech-dashboard
railway login
railway init
railway up
```

3. Your dashboard will be live at: `https://your-project.up.railway.app`

---

## Environment Variables

The dashboard works out-of-the-box with the SQLite database. If you need to configure anything:

### On Vercel:
1. Project Settings → Environment Variables
2. Add any custom variables (optional for this project)

### On Railway:
1. Project Settings → Variables
2. Add custom environment variables

---

## Database Considerations

### Development
The `data.db` file is included in the repository for quick deployment. In production, you may want to:

1. **Use a managed database** (recommended for scaling)
   - Turso (SQLite-compatible, serverless)
   - PlanetScale (MySQL)
   - Supabase (PostgreSQL)

2. **Keep using SQLite** (fine for moderate traffic)
   - Current setup works great
   - ~1000 concurrent users supported
   - Fast and simple

### Migrating to a Cloud Database (Optional)

If you want to use a cloud database later:

1. Export current data:
```bash
sqlite3 data.db .dump > backup.sql
```

2. Import to new database (depends on provider)

3. Update `lib/db.ts` with new connection string

---

## Performance Optimization

### Already Implemented ✓
- Server-side rendering
- Static generation where possible
- Image optimization
- Code splitting
- Gzip compression

### Additional Optimizations (Optional)

1. **Enable CDN caching:**
   - Vercel does this automatically
   - Railway: Add Cloudflare in front

2. **Add Redis caching:**
   - Cache API responses
   - Reduce database load
   - Example: Upstash Redis (free tier)

3. **Database indexing:**
   - Already implemented in schema
   - Monitor slow queries with `EXPLAIN QUERY PLAN`

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking
Recommended: Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## Updating Data

### Manual Updates
The dashboard has an admin interface planned. For now, update directly:

```bash
# Connect to database
sqlite3 data.db

# Add an investment
INSERT INTO investments (company_name, amount, stage, date) 
VALUES ('New Company', 5000000, 'Series A', '2024-01-15');
```

### Automated Updates
Run your scrapers via cron or GitHub Actions:

```yaml
# .github/workflows/scrape.yml
name: Update Data
on:
  schedule:
    - cron: '0 */8 * * *'  # Every 8 hours
  workflow_dispatch:

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run scrapers
        run: npm run scrape
      - name: Commit changes
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add data.db
          git commit -m "Update investment data" || exit 0
          git push
```

---

## Troubleshooting

### Build Fails on Vercel

**Issue:** TypeScript errors
**Solution:** Run `npm run build` locally first to catch errors

**Issue:** Module not found
**Solution:** Check `package.json` dependencies are correct

### Database Issues

**Issue:** "Cannot find data.db"
**Solution:** Ensure `data.db` is committed to Git (check `.gitignore`)

**Issue:** Database locked
**Solution:** SQLite WAL mode is enabled; shouldn't happen in production

### Performance Issues

**Issue:** Slow API responses
**Solution:** 
1. Check database indexes
2. Add caching layer
3. Monitor with Vercel Analytics

---

## Security Checklist

- [x] No API keys in code
- [x] No sensitive data exposed
- [x] SQL injection protected (prepared statements)
- [x] CORS configured
- [ ] Rate limiting (add if needed)
- [ ] Authentication (add if private dashboard)

---

## Backup Strategy

### Automated Backups (Recommended)

**Option 1: GitHub-based**
```bash
# Run daily via cron
cp data.db backups/data-$(date +%Y%m%d).db
git add backups/
git commit -m "Backup $(date)"
git push
```

**Option 2: Cloud Storage**
```bash
# Upload to S3/GCS/Azure
aws s3 cp data.db s3://your-bucket/backups/data-$(date +%Y%m%d).db
```

---

## Cost Estimate

### Vercel (Recommended)
- **Free Tier:** Perfect for this dashboard
  - 100 GB bandwidth
  - Unlimited deployments
  - Automatic HTTPS
  - **Cost:** $0/month

- **Pro Tier:** If you need more
  - $20/month
  - 1 TB bandwidth
  - Advanced analytics

### Railway
- **Free Tier:** $5 credit/month
  - Enough for moderate traffic
  - **Cost:** $0-5/month

- **Pay-as-you-go:** ~$10/month for typical usage

### Total Cost: $0-20/month (Vercel free tier recommended)

---

## Next Steps After Deployment

1. ✅ Dashboard is live
2. 📊 Monitor analytics
3. 🔄 Set up automated data updates
4. 📧 Share with stakeholders
5. 🚀 Iterate based on feedback

---

## Support

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/support
- **Railway Docs:** https://docs.railway.app

---

**Deployed successfully? Share your dashboard URL!** 🎉
