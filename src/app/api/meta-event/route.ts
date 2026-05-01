import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    const testCode = process.env.META_TEST_EVENT_CODE;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { success: false, message: "Meta env missing" },
        { status: 500 }
      );
    }

    // 🔥 Base payload
    const payload: any = {
      data: [
        {
          event_name: body.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: body.event_id,
          action_source: "website",
          event_source_url: body.url,
          user_data: {
            client_user_agent: req.headers.get("user-agent") || "",
            client_ip_address:
              req.headers.get("x-forwarded-for")?.split(",")[0] ||
              "127.0.0.1",
          },
        },
      ],
    };

    // 🔥 ONLY dev mode-এ test_event_code add হবে
    if (process.env.NODE_ENV === "development" && testCode) {
      payload.test_event_code = testCode;
    }

    const metaRes = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await metaRes.json();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Meta event failed" },
      { status: 500 }
    );
  }
}