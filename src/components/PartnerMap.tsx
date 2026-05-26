import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PartnerMapInner = lazy(() => import("./PartnerMapInner"));

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  boxCount: number;
}

export function PartnerMap({ markers }: { markers: MapMarker[] }) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) {
    return (
      <div className="rescue-map flex items-center justify-center text-sm text-qayta-muted">
        Mapbox token missing
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <Skeleton className="rescue-map" />
      }
    >
      <PartnerMapInner markers={markers} token={token} />
    </Suspense>
  );
}
