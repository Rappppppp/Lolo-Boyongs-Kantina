import { type NextRequest, NextResponse } from "next/server"

// Mock database
const mockOrders: Record<string, any> = {}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In production, fetch from database
    if (!mockOrders[id]) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: mockOrders[id] })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // In production, update in database
    if (!mockOrders[id]) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    mockOrders[id] = { ...mockOrders[id], ...body, updatedAt: new Date() }

    return NextResponse.json({ success: true, data: mockOrders[id] })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 })
  }
}
