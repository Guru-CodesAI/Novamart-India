import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId, // NovaMart order ID
    } = body;

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // TODO: Update order in database
    // await prisma.order.update({
    //   where: { id: orderId },
    //   data: {
    //     paymentStatus: "PAID",
    //     razorpayPaymentId: razorpay_payment_id,
    //     status: "CONFIRMED",
    //   },
    // });

    return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
