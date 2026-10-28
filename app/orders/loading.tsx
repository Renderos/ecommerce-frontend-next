import { ListSkeleton } from "@/components/skeletons";

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-9 w-56" />
      <div className="skeleton h-10 w-96 max-w-full" />
      <ListSkeleton rows={5} />
    </div>
  );
}
