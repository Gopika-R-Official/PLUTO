import { GroupRoom } from "@/features/together/GroupRoom";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  return <GroupRoom groupId={groupId} />;
}
