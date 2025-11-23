import { type NextRequest, NextResponse } from "next/server"

// Mock database
const orders: any[] = []

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status")

    let filtered = orders
    if (status) {
      filtered = orders.filter((order) => order.status === status)
    }

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.customerName || !body.items || body.items.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create order with generated order number
    const orderNumber = `ORD-${Date.now()}`
    const totalAmount = body.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const newOrder = {
      id: orders.length + 1,
      orderNumber,
      status: "pending",
      ...body,
      totalAmount,
      createdAt: new Date(),
    }

    orders.push(newOrder)

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
