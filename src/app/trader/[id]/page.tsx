import Link from "next/link";
import { getTraderById, ARCHETYPES, TRADERS } from "@/data/traders";
import { notFound } from "next/navigation";
import TraderClient from "./TraderClient";

export default async function TraderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trader = getTraderById(id);
  if (!trader) notFound();

  return <TraderClient trader={trader} />;
}
