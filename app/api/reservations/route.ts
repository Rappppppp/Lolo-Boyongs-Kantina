import { type NextRequest, NextResponse } from "next/server"

// Mock database
const reservations: any[] = []

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status")
    const date = request.nextUrl.searchParams.get("date")

    let filtered = reservations

    if (status) {
      filtered = filtered.filter((r) => r.status === status)
    }

    if (date) {
      filtered = filtered.filter((r) => r.reservationDate === date)
    }

    return NextResponse.json({ success: true, data: filtered })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (
      !body.customerName ||
      !body.customerEmail ||
      !body.reservationDate ||
      !body.reservationTime ||
      !body.partySize
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create reservation
    const reservationNumber = `RES-${Date.now()}`
    const newReservation = {
      id: reservations.length + 1,
      reservationNumber,
      status: "confirmed",
      ...body,
      createdAt: new Date(),
    }

    reservations.push(newReservation)

    return NextResponse.json({ success: true, data: newReservation }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create reservation" }, { status: 500 })
  }
}
