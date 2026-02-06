import { NextRequest, NextResponse } from 'next/server';
import { globalSearch } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const results = globalSearch(query);

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
