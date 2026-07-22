import { Metadata } from "next";
import React from "react";
import SinzoContact from "../../../components/_ContackPage/contack";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Sinzo Official customer support. Call, message, or visit us for any inquiries about our products and orders.",
  openGraph: {
    title: "Contact Us | Sinzo Official",
    description:
      "Get in touch with Sinzo Official customer support for any inquiries.",
    url: "https://sinzooffcial.com/contact",
  },
  alternates: {
    canonical: "https://sinzooffcial.com/contact",
  },
};

export default function ContackPage() {
  return (
    <div>
      <SinzoContact />
    </div>
  );
}
