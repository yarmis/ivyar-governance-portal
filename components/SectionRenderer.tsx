import { SectionHeader } from './SectionHeader';
import { ModuleCard } from './ModuleCard';
import { modules } from '@/data/modules';
import { sections } from '@/data/sections';

export function SectionRenderer() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        {sections.map((section) => {
          const sectionModules = modules.filter((m) => m.category === section.id);
          if (sectionModules.length === 0) return null;

          return (
            <section key={section.id} id={section.id} className="mb-24 scroll-mt-24">
              <SectionHeader title={section.title} subtitle={section.description} />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectionModules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
