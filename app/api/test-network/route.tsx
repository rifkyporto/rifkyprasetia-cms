import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test fetch mentah ke URL API Supabase kamu
    const res = await fetch('https://qymmyyqiqqosttomthxi.supabase.co/rest/v1/', {
      headers: { 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }
    });
    
    return NextResponse.json({ 
      status: 'Connected', 
      supabaseStatus: res.status 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'Network Error', 
      message: error.message 
    }, { status: 500 });
  }
}