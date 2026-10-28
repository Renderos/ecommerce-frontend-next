import { ListSkeleton } from "@/components/skeletons";

export default function CheckoutLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-6 w-72" />
      <div className="skeleton h-9 w-56" />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ListSkeleton rows={2} />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );
}
