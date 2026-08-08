import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const STEPS = [
  { status: 'processing', description: 'Your order is being prepared for shipment', location: 'Warehouse' },
  { status: 'shipped', description: 'Your order has been shipped', location: 'Distribution Center' },
  { status: 'out_for_delivery', description: 'Your order is out for delivery', location: 'Local Hub' },
  { status: 'delivered', description: 'Your order has been delivered', location: 'Destination' },
]

const ORDER = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)

    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )
    const { data: userData, error: userErr } = await anonClient.auth.getUser()
    if (userErr || !userData?.user) return json({ error: 'Unauthorized' }, 401)
    const userId = userData.user.id

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }
    const orderId = (body as { order_id?: unknown })?.order_id
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (typeof orderId !== 'string' || !UUID_RE.test(orderId)) {
      return json({ error: 'A valid order_id is required' }, 400)
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: order, error: orderErr } = await admin
      .from('orders')
      .select('id, user_id, order_status')
      .eq('id', orderId)
      .maybeSingle()

    if (orderErr) return json({ error: 'Unable to load order' }, 500)
    if (!order || order.user_id !== userId) return json({ error: 'Order not found' }, 404)

    const currentIdx = ORDER.indexOf(order.order_status)
    const next = STEPS[currentIdx < 0 ? 0 : currentIdx]
    if (!next) return json({ error: 'Order is already delivered' }, 400)

    const { error: insertErr } = await admin.from('order_tracking').insert({
      order_id: order.id,
      status: next.status,
      description: next.description,
      location: next.location,
    })
    if (insertErr) return json({ error: 'Unable to update tracking' }, 500)

    const { data: tracking } = await admin
      .from('order_tracking')
      .select('*')
      .eq('order_id', order.id)
      .order('created_at', { ascending: true })

    return json({ status: next.status, tracking: tracking ?? [] })
  } catch (_e) {
    return json({ error: 'Unexpected error' }, 500)
  }
})
