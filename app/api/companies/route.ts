import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const companies = db.prepare(`
      SELECT 
        c.*,
        COUNT(DISTINCT i.id) as investment_count,
        SUM(i.amount) as total_funding
      FROM companies c
      LEFT JOIN investments i ON c.id = i.company_id
      GROUP BY c.id
      ORDER BY total_funding DESC
    `).all();

    return NextResponse.json({
      success: true,
      data: companies
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
