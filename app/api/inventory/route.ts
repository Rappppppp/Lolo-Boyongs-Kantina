import { type NextRequest, NextResponse } from "next/server"

// Mock inventory data
const inventory: any[] = []

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status")

    let filtered = inventory

    if (status === "low") {
      filtered = inventory.filter((item) => item.quantityInStock <= item.reorderLevel)
    }

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.menuItemId || body.quantityInStock === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newInventory = {
      id: inventory.length + 1,
      ...body,
      updatedAt: new Date(),
    }

    inventory.push(newInventory)

    return NextResponse.json({ success: true, data: newInventory }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create inventory record" }, { status: 500 })
  }
}
