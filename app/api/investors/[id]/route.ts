import { NextRequest, NextResponse } from 'next/server';
import { getInvestorById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const investor = getInvestorById(id);

    if (!investor || !investor.name) {
      return NextResponse.json(
        { success: false, error: 'Investor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: investor
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
