import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.action";
import { getClerkUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";

// Define the type for a User object
interface User {
  email: string;
  emailAddresses: Array<{ emailAddress: string }>;
  // Add any other properties your user objects have here
}

const Document = async ({ params }: { params: { id: string } }) => {
  const { id } = await params; // Extract id directly from params

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses);
  const users = (await getClerkUsers({ userIds })) || [];

  // Map users with the User type defined above
  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes("room:write")
    ? "editor"
    : "viewer";

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
