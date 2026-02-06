import { NextRequest, NextResponse } from 'next/server';
import { getInvestmentById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const investment = getInvestmentById(id) as any;

    if (!investment) {
      return NextResponse.json(
        { success: false, error: 'Investment not found' },
        { status: 404 }
      );
    }

    // Parse investors JSON
    if (investment.investors_json) {
      try {
        investment.investors = JSON.parse(`[${investment.investors_json}]`);
        delete investment.investors_json;
      } catch (e) {
        investment.investors = [];
      }
    }

    return NextResponse.json({
      success: true,
      data: investment
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
