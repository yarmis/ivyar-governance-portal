import LaunchDashboard from '@/components/launch-requirements/LaunchDashboard';

export default function ModuleLaunchPage({ params }: { params: { id: string } }) {
  return <LaunchDashboard moduleId={params.id} moduleName={params.id.toUpperCase()} />;
}
