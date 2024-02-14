import { X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface NoteProps{
    note:{
        id: string,
        date: Date
        content: string
        onNoteDelete: (id:string) => void
    }
}


export function Note({ note } : NoteProps){
    return(
        <Dialog.Root>
            <Dialog.Trigger className="h-[250px] flex flex-col relative gap-3 bg-slate-800 rounded-md p-5 outline-none overflow-hidden hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
                <div>
                    <span className="text-slate-200 text-sm font-medium">{formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}</span>
                </div>
                <div className='max-w-full'>
                    <p className="text-slate-400 text-sm leading-6 break-words">{note.content}</p>
                </div>  
                <div className="absolut bottom-0 right-0 left-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none"/>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
                <Dialog.Content className='z-10 fixed bg-slate-700 max-w-[600px] max-h-[600px] px-5 pt-5 w-full h-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-md'>
                    <Dialog.Close className='p-[6px] rounded-tr-md absolute top-0 right-0 bg-slate-800'>
                        <X size={20} className="text-slate-500" />
                    </Dialog.Close>
                    <div>
                        <span className="text-slate-200 text-sm font-medium">{formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}</span>
                    </div>
                    <div className='pt-5 flex-1 overflow-auto max-h-[85%]'>
                        <p className="text-slate-400 text-sm leading-6 break-words">{note.content}</p>
                    </div>
                    <button className='absolute bottom-0 left-0 rounded-b-md w-full bg-slate-800 h-[46px] flex justify-center items-center group' onClick={() => note.onNoteDelete(note.id)}>
                        <span className='text-slate-300 text-sm'>Deseja <span className='text-red-400 group-hover:underline'>apagar essa nota</span>?</span>
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}