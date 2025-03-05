import { Header, HeaderButton } from "@/components/features/layout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <Header>
            <HeaderButton text="所有监控" url='/monitor'></HeaderButton>
        </Header>
        
        {children}
    </>
}