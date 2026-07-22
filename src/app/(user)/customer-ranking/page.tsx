import { Metadata } from "next";
import UserSideCustomarRanking from "../../../components/_Products/UserSideCustomarRanking";

export const metadata: Metadata = {
  title: "Customer Ranking",
  description:
    "Check out top customer rankings and leaderboard rewards on Sinzo Official Bangladesh.",
  openGraph: {
    title: "Customer Ranking | Sinzo Official",
    description:
      "Top customer rankings and leaderboard rewards on Sinzo Official.",
    url: "https://sinzooffcial.com/customer-ranking",
  },
  alternates: {
    canonical: "https://sinzooffcial.com/customer-ranking",
  },
};

export default function CustomerRankingPage() {
  return (
    <div className="lg:mt-[75px] mt-[65px]">
      <UserSideCustomarRanking />
    </div>
  );
}
