import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export default db;

// Helper function to get all investments with details
export function getAllInvestments(filters?: {
  stage?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = `
    SELECT 
      i.*,
      c.location,
      c.website,
      c.description as company_description,
      GROUP_CONCAT(inv.name, ', ') as investors
    FROM investments i
    LEFT JOIN companies c ON i.company_id = c.id
    LEFT JOIN investment_participants ip ON i.id = ip.investment_id
    LEFT JOIN investors inv ON ip.investor_id = inv.id
    WHERE 1=1
  `;

  const params: any[] = [];

  if (filters?.stage) {
    query += ` AND i.stage = ?`;
    params.push(filters.stage);
  }

  if (filters?.location) {
    query += ` AND c.location LIKE ?`;
    params.push(`%${filters.location}%`);
  }

  if (filters?.startDate) {
    query += ` AND i.date >= ?`;
    params.push(filters.startDate);
  }

  if (filters?.endDate) {
    query += ` AND i.date <= ?`;
    params.push(filters.endDate);
  }

  if (filters?.minAmount) {
    query += ` AND i.amount >= ?`;
    params.push(filters.minAmount);
  }

  if (filters?.maxAmount) {
    query += ` AND i.amount <= ?`;
    params.push(filters.maxAmount);
  }

  if (filters?.search) {
    query += ` AND (i.company_name LIKE ? OR i.description LIKE ? OR c.description LIKE ?)`;
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ` GROUP BY i.id ORDER BY i.date DESC`;

  if (filters?.limit) {
    query += ` LIMIT ?`;
    params.push(filters.limit);
  }

  if (filters?.offset) {
    query += ` OFFSET ?`;
    params.push(filters.offset);
  }

  return db.prepare(query).all(...params);
}

// Get dashboard stats
export function getDashboardStats() {
  const totalInvestments = db.prepare('SELECT COUNT(*) as count FROM investments').get() as { count: number };
  const totalCompanies = db.prepare('SELECT COUNT(*) as count FROM companies').get() as { count: number };
  const totalInvestors = db.prepare('SELECT COUNT(*) as count FROM investors').get() as { count: number };
  const totalFunding = db.prepare('SELECT SUM(amount) as total FROM investments WHERE amount IS NOT NULL').get() as { total: number };

  return {
    totalInvestments: totalInvestments.count,
    totalCompanies: totalCompanies.count,
    totalInvestors: totalInvestors.count,
    totalFunding: totalFunding.total || 0
  };
}

// Get timeline data (investments over time)
export function getTimelineData() {
  return db.prepare(`
    SELECT 
      DATE(date) as date,
      COUNT(*) as count,
      SUM(COALESCE(amount, 0)) as total_amount
    FROM investments
    WHERE date IS NOT NULL
    GROUP BY DATE(date)
    ORDER BY date
  `).all();
}

// Get stage distribution
export function getStageDistribution() {
  return db.prepare(`
    SELECT 
      stage,
      COUNT(*) as count,
      SUM(COALESCE(amount, 0)) as total_amount
    FROM investments
    WHERE stage IS NOT NULL
    GROUP BY stage
    ORDER BY count DESC
  `).all();
}

// Get top investors
export function getTopInvestors(limit = 10) {
  return db.prepare(`
    SELECT 
      inv.id,
      inv.name,
      inv.type,
      inv.website,
      inv.location,
      COUNT(DISTINCT ip.investment_id) as investment_count,
      COUNT(DISTINCT i.company_id) as company_count
    FROM investors inv
    JOIN investment_participants ip ON inv.id = ip.investor_id
    JOIN investments i ON ip.investment_id = i.id
    GROUP BY inv.id
    ORDER BY investment_count DESC
    LIMIT ?
  `).all(limit);
}

// Get category breakdown
export function getCategoryBreakdown() {
  return db.prepare(`
    SELECT 
      cat.name as category,
      COUNT(DISTINCT cc.company_id) as company_count
    FROM categories cat
    LEFT JOIN company_categories cc ON cat.id = cc.category_id
    GROUP BY cat.id
    ORDER BY company_count DESC
  `).all();
}

// Get location data
export function getLocationData() {
  return db.prepare(`
    SELECT 
      location,
      COUNT(*) as count
    FROM companies
    WHERE location IS NOT NULL
    GROUP BY location
    ORDER BY count DESC
  `).all();
}

// Global search
export function globalSearch(query: string) {
  const searchTerm = `%${query}%`;
  
  const companies = db.prepare(`
    SELECT 'company' as type, id, name, description, location
    FROM companies
    WHERE name LIKE ? OR description LIKE ?
    LIMIT 10
  `).all(searchTerm, searchTerm);

  const investors = db.prepare(`
    SELECT 'investor' as type, id, name, website as description, location
    FROM investors
    WHERE name LIKE ? OR focus_areas LIKE ?
    LIMIT 10
  `).all(searchTerm, searchTerm);

  const investments = db.prepare(`
    SELECT 'investment' as type, id, company_name as name, description, date as location
    FROM investments
    WHERE company_name LIKE ? OR description LIKE ?
    LIMIT 10
  `).all(searchTerm, searchTerm);

  return [...companies, ...investors, ...investments];
}

// Get single investment
export function getInvestmentById(id: number) {
  return db.prepare(`
    SELECT 
      i.*,
      c.name as company_name,
      c.website,
      c.location,
      c.description as company_description,
      c.linkedin_url,
      GROUP_CONCAT(
        JSON_OBJECT(
          'id', inv.id,
          'name', inv.name,
          'type', inv.type,
          'website', inv.website,
          'lead', ip.lead_investor
        )
      ) as investors_json
    FROM investments i
    LEFT JOIN companies c ON i.company_id = c.id
    LEFT JOIN investment_participants ip ON i.id = ip.investment_id
    LEFT JOIN investors inv ON ip.investor_id = inv.id
    WHERE i.id = ?
    GROUP BY i.id
  `).get(id);
}

// Get single investor
export function getInvestorById(id: number) {
  const investor = db.prepare(`
    SELECT * FROM investors WHERE id = ?
  `).get(id);

  const portfolio = db.prepare(`
    SELECT 
      i.*,
      c.name,
      c.website,
      c.location
    FROM investments i
    JOIN investment_participants ip ON i.id = ip.investment_id
    LEFT JOIN companies c ON i.company_id = c.id
    WHERE ip.investor_id = ?
    ORDER BY i.date DESC
  `).all(id);

  const coInvestors = db.prepare(`
    SELECT 
      inv.id,
      inv.name,
      inv.type,
      COUNT(*) as co_investment_count
    FROM investors inv
    JOIN investment_participants ip1 ON inv.id = ip1.investor_id
    JOIN investment_participants ip2 ON ip1.investment_id = ip2.investment_id
    WHERE ip2.investor_id = ? AND inv.id != ?
    GROUP BY inv.id
    ORDER BY co_investment_count DESC
    LIMIT 10
  `).all(id, id);

  return {
    ...(investor as any),
    portfolio,
    coInvestors
  };
}

// Get single company
export function getCompanyById(id: number) {
  const company = db.prepare(`
    SELECT * FROM companies WHERE id = ?
  `).get(id);

  const investments = db.prepare(`
    SELECT 
      i.*,
      GROUP_CONCAT(inv.name, ', ') as investors
    FROM investments i
    LEFT JOIN investment_participants ip ON i.id = ip.investment_id
    LEFT JOIN investors inv ON ip.investor_id = inv.id
    WHERE i.company_id = ?
    GROUP BY i.id
    ORDER BY i.date DESC
  `).all(id);

  const categories = db.prepare(`
    SELECT c.name
    FROM categories c
    JOIN company_categories cc ON c.id = cc.category_id
    WHERE cc.company_id = ?
  `).all(id);

  return {
    ...(company as any),
    investments,
    categories: categories.map((c: any) => c.name)
  };
}
