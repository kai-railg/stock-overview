
import './header.css'

export default function Header(
    {navList}: {navList: string[]}
) {
    return (
        <div className='header'>
            <nav >
                {navList.map((item) => (
                    <button key={item}>{item}</button>
                ))}
            </nav>
        </div>
    )
}
 
