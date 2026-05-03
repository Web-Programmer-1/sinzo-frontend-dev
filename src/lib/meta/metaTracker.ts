type MetaEventName = "AddToCart";

type MetaEventData = {
  content_ids?: string[];
  content_name?: string;
  content_type?: "product";
  value?: number;
  currency?: "BDT";
};

const createEventId = (eventName: string) => {
  return `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

export const metaTracker = async (
  eventName: MetaEventName,
  data: MetaEventData
) => {
  if (typeof window === "undefined") return;

  const eventId = createEventId(eventName);

  if ((window as any).fbq) {
    (window as any).fbq("track", eventName, data, {
      eventID: eventId,
    });
  }

  await fetch("/api/meta-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      url: window.location.href,
      custom_data: data,
    }),
  });
};