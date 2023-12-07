import { useAppStore } from "@/stores/app-store";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../feedback";
import { useAuthStore } from "@/stores/auth";
import { signOutService } from "@/services/authService";
import { toast } from "../toast";

export const ConfirmLogoutModal = () => {

    const { setData: setDataAuth } = useAuthStore();
    const { isShowConfirmLogout, setData } = useAppStore();

    const handleLogout = async () => {
        try {
            await signOutService();
            setDataAuth({user: null, isAuthentication: false});
            toast({ title: 'Success', description: 'Sign out success' })
        } catch (err: any) {
            toast({ title: 'Error', description: err?.response?.data?.message })
        }
    }
    const closeModal = () => {
        setData({isShowConfirmLogout: false})
    }

    return (<AlertDialog open={isShowConfirmLogout} onOpenChange={closeModal}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                    Are you sure you want to log out?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be logged out of the application and will need to log in again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                    type="submit"
                    className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
                    onClick={handleLogout}
                    >
                    Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
