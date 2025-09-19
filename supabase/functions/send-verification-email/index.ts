import { corsHeaders } from '../_shared/cors.ts';

interface EmailRequest {
  email: string;
  fullname: string;
  verificationToken: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, fullname, verificationToken }: EmailRequest = await req.json();

    // In a real application, you would use a service like SendGrid, Mailgun, etc.
    // For now, we'll simulate sending an email and return success
    
    const verificationUrl = `${req.headers.get('origin')}/verificar-email?token=${verificationToken}`;
    
    // Here you would integrate with your email service
    // Example with a hypothetical email service:
    /*
    const emailResponse = await fetch('https://api.emailservice.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('EMAIL_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'Activa tu cuenta en RMoney',
        html: `
          <h1>¡Bienvenido a RMoney, ${fullname}!</h1>
          <p>Para activar tu cuenta, haz clic en el siguiente enlace:</p>
          <a href="${verificationUrl}" style="background: #00B871; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Activar Cuenta
          </a>
          <p>Este enlace expira en 24 horas.</p>
          <p>Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
        `
      })
    });
    */

    // For development, we'll log the verification URL
    console.log(`Verification email would be sent to ${email}`);
    console.log(`Verification URL: ${verificationUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification email sent successfully',
        // In development, return the verification URL for testing
        verificationUrl: verificationUrl
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error sending verification email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send verification email' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});