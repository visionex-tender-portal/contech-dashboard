import { NextRequest, NextResponse } from 'next/server';
import { getAllInvestments } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      stage: searchParams.get('stage') || undefined,
      location: searchParams.get('location') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      minAmount: searchParams.get('minAmount') ? Number(searchParams.get('minAmount')) : undefined,
      maxAmount: searchParams.get('maxAmount') ? Number(searchParams.get('maxAmount')) : undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 100,
      offset: searchParams.get('offset') ? Number(searchParams.get('offset')) : 0,
    };

    const investments = getAllInvestments(filters);

    return NextResponse.json({
      success: true,
      data: investments,
      meta: {
        total: investments.length,
        limit: filters.limit,
        offset: filters.offset
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
