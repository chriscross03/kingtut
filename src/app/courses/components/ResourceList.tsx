import ResourceItem from "./ResourceItem";

interface Resource {
  id: string | number;
  name: string;
  slug?: string | null;
  description?: string | null;
}

interface ResourceListProps {
  items?: Resource[]; // optional because it might still be loading
  loading?: boolean;
  error?: Error | null;
  basePath: string;
}

export default function ResourceList({
  items = [],
  loading = false,
  error = null,
  basePath,
}: ResourceListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        <p>{error.message}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-gray-600 italic text-center py-6">
        No resources available.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <ResourceItem key={item.id} {...item} basePath={basePath} />
      ))}
    </ul>
  );
}
