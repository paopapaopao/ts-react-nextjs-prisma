import { type NextRequest } from 'next/server';
import { Webhook } from 'svix';
import { type WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

const webhookSecret =
  process.env.SIGNING_SECRET || 'whsec_Kzi2hVWuwn5dMPVFqALiIY2eBaX+1mv7';

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

  const eventType = msg.type;

  if (eventType === 'user.created') {
    try {
      await prisma.user.create({
        data: {
          clerkId: msg.data.id,
          firstName: msg.data.first_name,
          lastName: msg.data.last_name,
          image: msg.data.image_url,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return new Response('OK', { status: 200 });
};

export { POST };
