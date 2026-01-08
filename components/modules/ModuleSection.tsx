interface ModuleSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export default function ModuleSection({ title, icon, children }: ModuleSectionProps) {
  return (
    <div className="py-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold mb-4">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h2>
      <div className="text-base text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
