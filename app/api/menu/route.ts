import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use actual database
const menuItems = [
  {
    id: 1,
    name: "Truffle Dumplings",
    category: "Appetizers",
    price: 12.99,
    description: "Handmade dumplings with truffle oil",
    rating: 4.9,
    available: true,
  },
  {
    id: 2,
    name: "Pan-Seared Salmon",
    category: "Main Courses",
    price: 24.99,
    description: "Atlantic salmon with seasonal vegetables",
    rating: 4.9,
    available: true,
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 8.99,
    description: "Warm chocolate cake with melting center",
    rating: 4.9,
    available: true,
  },
  {
    id: 4,
    name: "Crispy Spring Rolls",
    category: "Appetizers",
    price: 8.99,
    description: "Golden rolls with sweet chili sauce",
    rating: 4.7,
    available: false,
  },
  {
    id: 5,
    name: "Wagyu Beef Steak",
    category: "Main Courses",
    price: 32.99,
    description: "Prime cut with truffle mashed potatoes",
    rating: 5.0,
    available: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get("category")

    let filtered = menuItems
    if (category) {
      filtered = menuItems.filter((item) => item.category === category)
    }

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch menu items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // In production, save to database
    const newItem = {
      id: Math.max(...menuItems.map((m) => m.id)) + 1,
      ...body,
      available: true,
      rating: 0,
    }

    return NextResponse.json({ success: true, data: newItem }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create menu item" }, { status: 500 })
  }
}
