// src/app/api/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('Testing email to:', email);
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

    const result = await sendEmail({
      to: email,
      subject: 'CashNova Test Email',
      html: `
        <h1>Test Email from CashNova</h1>
        <p>If you received this, your email service is working! 🎉</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      `
    });

    return NextResponse.json({ 
      success: result,
      message: result ? 'Test email sent successfully!' : 'Failed to send test email',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}