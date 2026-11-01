/ app/careers/[slug]/page.tsx
import { notFound } from "next/navigation";
export const revalidate = 3600;
export async function generateStaticParams() {
  const roles = await getOpenRoles();
  return roles.map((r) => ({ slug: r.slug }));
}
export default async function Role({ params }: { params: { slug: string } }) {
  const role = await getRole(params.slug); // only returns roles with status "open"
  if (!role) notFound();
  return <RoleView role={role} />;
}
