import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

const webhookSecret =
  process.env.WEBHOOK_SECRET || 'whsec_C4lFw+XOLb7576ojQ+79aFszSSG6nFUg';

const POST = async (request: NextRequest) => {
  const svix_id = request.headers.get('svix-id') ?? '';
  const svix_timestamp = request.headers.get('svix-timestamp') ?? '';
  const svix_signature = request.headers.get('svix-signature') ?? '';

  const body = await request.text();

  const sivx = new Webhook(webhookSecret);

  let msg;

  try {
    msg = sivx.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error(error);

    return new Response('Bad Request', { status: 400 });
  }

  console.log(msg);

  // Rest

  const eventType = msg.type;

  if (eventType === 'user.created') {
    try {
      const user = await prisma.user.create({
        data: {
          clerkId: msg.data.id,
          firstName: String(msg.data.first_name),
          lastName: String(msg.data.last_name),
          image: msg.data.image_url,
        },
      });

      console.log('newUser', user);
    } catch (error) {
      console.error(error);
    }
  }

  return new Response('OK', { status: 200 });
};

export { POST };

// import { Webhook } from 'svix';
// import { headers } from 'next/headers';
// import { WebhookEvent } from '@clerk/nextjs/server';

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.SIGNING_SECRET;

//   if (!SIGNING_SECRET) {
//     throw new Error(
//       'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
//     );
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET);

//   // Get headers
//   const headerPayload = await headers();
//   const svix_id = headerPayload.get('svix-id');
//   const svix_timestamp = headerPayload.get('svix-timestamp');
//   const svix_signature = headerPayload.get('svix-signature');

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error: Missing Svix headers', {
//       status: 400,
//     });
//   }

//   // Get body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   let evt: WebhookEvent;

//   // Verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp': svix_timestamp,
//       'svix-signature': svix_signature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error('Error: Could not verify webhook:', err);
//     return new Response('Error: Verification error', {
//       status: 400,
//     });
//   }

//   // Do something with payload
//   // For this guide, log payload to console
//   const { id } = evt.data;
//   const eventType = evt.type;
//   console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
//   console.log('Webhook payload:', body);

//   if (evt.type === 'user.created') {
//     console.log('userId:', evt.data.id);
//   }

//   return new Response('Webhook received', { status: 200 });
// }

// ngrok http --url=funny-hornet-faithful.ngrok-free.app 80
