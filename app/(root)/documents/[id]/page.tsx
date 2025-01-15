import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.action";
import { getClerkUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";

const Document = async ({ params }: { params: { id: string } }) => {
  const { id } = params; // Extract id from params

  // Fetch the current user
  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.error("No user found, redirecting to sign-in.");
    redirect("/sign-in");
  }

  // Fetch room data
  const room = await getDocument({
    roomId: id,
    userId: clerkUser?.emailAddresses?.[0]?.emailAddress, // Ensure email is accessible
  });

  if (!room) {
    console.error("Room not found, redirecting to home.");
    redirect("/");
  }

  // Fetch user data
  const userIds = Object.keys(room.usersAccesses || {});
  const users = await getClerkUsers({ userIds });

  // Map user data with access types
  const usersData = (users || []).map((user: any) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

  // Determine the current user's access type
  const currentUserType = room.usersAccesses?.[clerkUser.emailAddresses?.[0]?.emailAddress]?.includes("room:write")
    ? "editor"
    : "viewer";

  // Ensure all necessary data is available before rendering
  if (!id || !room.metadata || !usersData || !currentUserType) {
    console.error("Missing required data for CollaborativeRoom.");
    return <Loader />;
  }

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
