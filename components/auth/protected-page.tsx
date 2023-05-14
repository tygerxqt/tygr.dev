import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/context";
import React from "react";
import { Mail } from "lucide-react";
import pb from "@/lib/pocketbase";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { user, logIn, register, resetPassword } = useAuth();

    const [mode, setMode] = React.useState<"login" | "register" | "reset">("login");

    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "Enter" && !user) {
                e.preventDefault()
                switch (mode) {
                    case "login": {
                        logIn(email, password);
                        break;
                    }

                    case "register": {
                        register(name, username, email, password, confirmPassword);
                        break;
                    }

                    case "reset": {
                        resetPassword(email);
                        setMode("login");
                        break;
                    }
                }
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [confirmPassword, email, logIn, mode, name, password, register, resetPassword, username, user])

    return (
        <>
            {user ? (
                <>
                    {user.verified ? (
                        <>
                            {children}
                        </>
                    ) : (
                        <>
                            {/* If user is not verified */}
                            <div className="absolute w-3/4 -translate-x-1/2 -translate-y-1/2 sm:w-3/4 top-1/2 left-1/2">
                                <div className="flex flex-col items-center justify-center gap-6 text-center">
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h1 className="text-3xl font-bold text-center sm:text-4xl">Verification required</h1>
                                        <p className="text-sm sm:text-base text-primary-500">To continue, please check your email for a verification link.</p>
                                    </div>
                                    <Button onClick={() => {
                                        pb.collection("users").requestVerification(user.email).then(() => {
                                            alert("Verification email sent!");
                                        }).catch((err) => {
                                            alert(err);
                                        });
                                    }} className="flex flex-row items-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Resend verification email
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    {/* If not authenticated */}
                    <div className="absolute w-3/4 -translate-x-1/2 -translate-y-1/2 sm:w-1/2 md:w-auto top-1/2 left-1/2">
                        <div className="flex flex-col items-center justify-center gap-6 text-center">
                            <div className="flex flex-col items-center justify-center w-full gap-2">
                                <h1 className="text-3xl font-bold text-center sm:text-4xl">
                                    {mode === "login" && "Login to Pixel"}
                                    {mode === "register" && "Join the club!"}
                                    {mode === "reset" && "Reset password"}
                                </h1>

                                <p className="text-sm sm:text-base text-primary-500">
                                    {mode === "login" && "Please log in with your Pixel account to continue."}
                                    {mode === "register" && "Register a Pixel account and join the club!"}
                                    {mode === "reset" && "Please enter your email address to reset your password."}
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center w-full gap-4">
                                {mode === "login" && (
                                    <>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Button
                                            className="w-full text-md"
                                            onClick={() => logIn(email, password)}
                                        >
                                            Submit
                                        </Button>
                                        <small className="px-2 pt-2 text-center text-primary-500 dark:text-primary-400">
                                            By continuing, you agree to our{" "}
                                            <a className="text-blue-500" href="/tos">
                                                Terms of Service
                                            </a>
                                            {" "} and {" "}
                                            <a className="text-blue-500" href="/privacy">
                                                Privacy Policy
                                            </a>
                                            .
                                        </small>
                                    </>
                                )}
                                {mode === "register" && (
                                    <>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Input
                                            id="passwordConfirm"
                                            type="password"
                                            placeholder="Password Confirmation"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <Button
                                            className="w-full text-md"
                                            onClick={() => {
                                                register(name, username, email, password, confirmPassword)
                                                setMode("login")
                                            }}
                                        >
                                            Create Account
                                        </Button>
                                        <small className="px-2 pt-2 text-center text-primary-500 dark:text-primary-400">
                                            By continuing, you agree to our{" "}
                                            <a className="text-blue-500" href="/tos">
                                                Terms of Service
                                            </a>
                                            {" "}
                                            and
                                            {" "}
                                            <a className="text-blue-500" href="/privacy">
                                                Privacy Policy
                                            </a>
                                            .
                                        </small>
                                    </>
                                )}
                                {mode === "reset" && (
                                    <>
                                        <Input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <Button className="w-full text-md" onClick={() => {
                                            resetPassword(email);
                                            setMode("login");
                                        }}>Send</Button>
                                    </>
                                )}
                            </div>
                            <hr className="w-full border border-black/10 dark:border-white/10" />
                            <div className="flex flex-col items-center w-full gap-1">
                                {mode === "login" && (
                                    <>
                                        <span>
                                            Forgot password?{" "}
                                            <Button
                                                variant={"link"}
                                                className="p-0 text-blue-500 dark:text-blue-500"
                                                onClick={() => setMode("reset")}
                                            >
                                                Reset
                                            </Button>
                                        </span>
                                        <span>
                                            Don&apos;t have an account?{" "}
                                            <Button
                                                variant={"link"}
                                                className="p-0 text-blue-500 dark:text-blue-500"
                                                onClick={() => setMode("register")}
                                            >
                                                Sign up
                                            </Button>
                                        </span>
                                    </>
                                )}
                                {mode === "reset" && (
                                    <>
                                        <span>
                                            Remember your password?{" "}
                                            <Button
                                                variant={"link"}
                                                className="p-0 text-blue-500 dark:text-blue-500"
                                                onClick={() => setMode("login")}
                                            >
                                                Login
                                            </Button>
                                        </span>
                                    </>
                                )}
                                {mode === "register" && (
                                    <>
                                        <span>
                                            Already have an account?{" "}
                                            <Button
                                                variant={"link"}
                                                className="p-0 text-blue-500 dark:text-blue-500"
                                                onClick={() => setMode("login")}
                                            >
                                                Login
                                            </Button>
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}