import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer"
import { Button } from "./ui/button"
import { Input } from "./ui/input";

export default function AuthenticationDemo() {
    return (
        <Drawer shouldScaleBackground={true} direction="bottom">
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent handle={true}>
                <DrawerHeader>
                    <DrawerTitle className="text-3xl font-black font-display">Sign in</DrawerTitle>
                    <DrawerDescription>Sign in with your credentials here.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-2 pt-2 pb-6">
                    <div className="flex flex-col w-full gap-3 px-4">
                        <Input placeholder="Email / Username" />
                        <Input placeholder="Password" />
                        <Button>Submit</Button>
                    </div>
                    <div className="px-6 py-3 text-center">
                        <span className="">
                            By continuing, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
                        </span>
                    </div>
                </div>
                <DrawerFooter>
                    <DrawerClose className="flex flex-col items-center w-full gap-2 mx-auto border-t border-black/10 dark:border-white/10">
                        <div className="flex flex-col items-center gap-2 p-4">
                            <div className="flex flex-row gap-2">
                                <span>
                                    Forgot password?
                                </span>
                                <a href="#" className="text-blue-500 hover:underline">Reset</a>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span>
                                    Don't have an account?
                                </span>
                                <a href="#" className="text-blue-500 hover:underline">Register</a>
                            </div>
                        </div>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}