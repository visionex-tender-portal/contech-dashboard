import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const investors = db.prepare(`
      SELECT 
        inv.*,
        COUNT(DISTINCT ip.investment_id) as investment_count,
        COUNT(DISTINCT i.company_id) as company_count
      FROM investors inv
      LEFT JOIN investment_participants ip ON inv.id = ip.investor_id
      LEFT JOIN investments i ON ip.investment_id = i.id
      GROUP BY inv.id
      ORDER BY investment_count DESC
    `).all();

    return NextResponse.json({
      success: true,
      data: investors
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
