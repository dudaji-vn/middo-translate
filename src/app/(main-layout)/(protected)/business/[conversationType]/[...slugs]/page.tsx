import HelpDeskConversation from "@/app/(main-layout)/(need-not-auth)/help-desk/[businessId]/[...slugs]/_components/help-desk-conversation/help-desk-conversation"
import { businessAPI } from "@/features/chat/help-desk/api/business.service";

import { notFound } from "next/navigation";

const BusinessConversationPage = async ({ params: { slugs }, ...props }: {
    params: {
        slugs: string[];
    }
}) => {
    const [roomId, anonymousUserId] = slugs;
    const room = await businessAPI.getChatRoom(roomId);
    if (!room || !room?._id) {
        notFound();
    }
    const anonymousUser = anonymousUserId ? await businessAPI.getChatRoom(roomId, anonymousUserId) : undefined;
    return (
        <HelpDeskConversation room={room} params={{ slugs }}  {...props} anonymousUser={anonymousUser}/>
    )
}
export default BusinessConversationPage