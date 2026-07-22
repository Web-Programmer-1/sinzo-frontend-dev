import { Metadata } from "next";
import SinzoAbout from "../../../components/_AboutPage/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Sinzo Official - the premier e-commerce platform in Bangladesh providing high quality wood products and online shopping services.",
  openGraph: {
    title: "About Us | Sinzo Official",
    description:
      "Learn more about Sinzo Official - premier e-commerce shopping in Bangladesh.",
    url: "https://sinzooffcial.com/about",
  },
  alternates: {
    canonical: "https://sinzooffcial.com/about",
  },
};

export default function AboutUsPage() {
  return (
    <div>
      <SinzoAbout />
    </div>
  );
}
