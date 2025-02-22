// pages/index.tsx 或 app/page.tsx
import Editor from './editor'
// const Editor = dynamic(
//     () => import('./editor'),
//     {
//         ssr: false,
//         loading: () => <p>Loading editor...</p>
//     }
// )

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl mb-4">Slate Editor Demo</h1>
            <Editor />
        </div>
    )
}
