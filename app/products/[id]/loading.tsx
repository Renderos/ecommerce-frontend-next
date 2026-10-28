import { DetailSkeleton } from "@/components/skeletons";

export default function ProductLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-5 w-36" />
      <DetailSkeleton />
    </div>
  );
}
