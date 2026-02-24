// GET /api/v1/payment-links/[id] - Get a specific payment link
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return Response.json({ id: params.id });
}

// PATCH /api/v1/payment-links/[id] - Update a payment link
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  return Response.json({ id: params.id, updated: true });
}

// DELETE /api/v1/payment-links/[id] - Delete a payment link
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return Response.json({ id: params.id, deleted: true });
}
