'use client'

import { useMemo, useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing...' }],
  }
]

const Editor = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])

  return (
    
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={setValue}
      
    >
      <Editable
        className="p-4 border rounded"
        placeholder="Start typing..."
        spellCheck
        autoFocus
        
      />
    </Slate>
  )
}

export default Editor
