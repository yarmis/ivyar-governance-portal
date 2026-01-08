interface ModuleHeaderProps {
  icon: string;
  name: string;
  fullName: string;
  status: string;
  version: string;
  updated: string;
  apiEndpoints: number;
  compliance?: string[];
}

export default function ModuleHeader({
  icon,
  name,
  fullName,
  status,
  version,
  updated,
  apiEndpoints,
  compliance = []
}: ModuleHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-5xl font-bold mb-2">
        {icon} {name}
      </h1>
      <p className="text-2xl text-gray-600 mb-6">{fullName}</p>
      
      <div className="flex flex-wrap gap-4 items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Status:</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
            ✓ {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Version:</span>
          <span className="font-semibold">{version}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Updated:</span>
          <span className="font-semibold">{updated}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600">API Endpoints:</span>
          <span className="font-semibold">{apiEndpoints}</span>
        </div>
      </div>

      {compliance.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {compliance.map((cert) => (
            <span
              key={cert}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
            >
              {cert}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
