export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-[#EAE5DF] overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-[#EFE9E0]" />
      <div className="p-3 space-y-2.5">
        <div className="h-3 w-1/2 bg-[#EFE9E0] rounded" />
        <div className="h-4 w-full bg-[#EFE9E0] rounded" />
        <div className="h-4 w-3/4 bg-[#EFE9E0] rounded" />
        <div className="h-5 w-1/3 bg-[#EFE9E0] rounded mt-2" />
      </div>
    </div>
  );
}
