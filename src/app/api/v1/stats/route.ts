// GET /api/v1/stats - Get statistics
export async function GET() {
  return Response.json({ 
    message: "Statistics endpoint",
    data: {
      total_transactions: 0,
      total_volume: 0,
    }
  });
}
