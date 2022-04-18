import Script from "next/script";

export default function AccountsIndex() {
    return (
        <>
            <Script id="redir">
                {`
                    window.location.href = "/account";
                `}
            </Script>
        </>
    )
}