import Link from "next/link"

export function SidebarButton({ text, url }: { text: string, url: string }) {
    return (
        <Link className='
        w-full h-16
        border border-black border-solid
        flex justify-center items-center
        text-white 
        hover:bg-white hover:text-black'
            href={`${url}`}>
            {text}
        </Link>
    )
}

export function Header({children}: {children: React.ReactNode}) {
    return (
        <div className='flex flex-row flex-auto 
        mb-2
        h-16 w-full bg-[rgb(50,50,50)]'>
            {children}
        </div>
    )
}


export function HeaderButton({ text, url }: { text: string, url: string }) {
    return (
        <Link className='
        w-28
        border border-black border-solid
        flex justify-center items-center
        text-white 
        hover:bg-white hover:text-black'
            href={`${url}`}>
            {text}
        </Link>
    )
}
