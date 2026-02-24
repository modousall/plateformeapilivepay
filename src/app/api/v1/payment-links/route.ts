// GET /api/v1/payment-links - List all payment links
export async function GET() {
  return Response.json({ message: "All payment links" });
}

// POST /api/v1/payment-links - Create a new payment link
export async function POST() {
  return Response.json({ message: "Payment link created" });
}
