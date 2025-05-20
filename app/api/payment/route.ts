import { NextResponse } from "next/server";
import prisma from "../../libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let {
    reservationId,
    amount,
    currency = "MNT",
    status,
    paymentMethod,
    transactionId,
  } = body || {};

  if (!reservationId || !amount || !status || !paymentMethod) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    new ObjectId(currentUser.id); // validate userId
    reservationId = new ObjectId(reservationId).toHexString();
  } catch {
    return NextResponse.json({ error: "Invalid ObjectId format" }, { status: 400 });
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        userId: currentUser.id,
        reservationId,
        amount,
        currency,
        status,
        paymentMethod,
        transactionId,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
