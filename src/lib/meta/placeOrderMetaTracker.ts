type PlaceOrderMetaData = {
  orderId?: string;
  value: number;
  currency?: "BDT";
  num_items: number;
  content_ids: string[];
};

const createEventId = () => {
  return `Purchase_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

export const placeOrderMetaTracker = async (data: PlaceOrderMetaData) => {
  try {
    if (typeof window === "undefined") return;

    const eventId = createEventId();

    const customData = {
      order_id: data.orderId,
      value: data.value,
      currency: data.currency || "BDT",
      num_items: data.num_items,
      content_ids: data.content_ids,
      content_type: "product",
    };

    if ((window as any).fbq) {
      (window as any).fbq("track", "Purchase", customData, {
        eventID: eventId,
      });
    }

    await fetch("/api/meta-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: "Purchase",
        event_id: eventId,
        url: window.location.href,
        custom_data: customData,
      }),
    });
  } catch (error) {
    console.warn("Meta purchase tracking failed:", error);
  }
};