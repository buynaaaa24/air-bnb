import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { reservations: true },
  });

  if (!listing || listing.userId !== currentUser.id) {
    return NextResponse.error();
  }

  if (listing.reservations.length > 0) {
    return new NextResponse("Захиалагдсан тул устгагдах боломжгүй.", { status: 400 });
  }

  await prisma.listing.delete({
    where: { id: listingId },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  }

  const body = await request.json();
  const { title, description } = body;

  if (typeof title !== "string" || typeof description !== "string") {
    return new NextResponse("Invalid data", { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.userId !== currentUser.id) {
    return NextResponse.error();
  }

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      title,
      description,
    },
  });

  return NextResponse.json(updatedListing);
}
