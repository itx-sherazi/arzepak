import { Suspense } from "react";
import PropertiesListView from "@/components/properties/PropertiesListView";

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PropertiesListView />
    </Suspense>
  );
}
