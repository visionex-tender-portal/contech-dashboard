import { NextResponse } from 'next/server';
import { getDashboardStats, getTimelineData, getStageDistribution, getTopInvestors, getCategoryBreakdown, getLocationData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = getDashboardStats();
    const timeline = getTimelineData();
    const stageDistribution = getStageDistribution();
    const topInvestors = getTopInvestors(10);
    const categories = getCategoryBreakdown();
    const locations = getLocationData();

    return NextResponse.json({
      success: true,
      data: {
        stats,
        timeline,
        stageDistribution,
        topInvestors,
        categories,
        locations
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
