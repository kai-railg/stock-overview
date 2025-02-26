import { Header, HeaderButton } from "@/components/features/layout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
        <Header>
            <HeaderButton text="分组" url='/stock/group'></HeaderButton>
        </Header>
        {children}
        </>
    )
}