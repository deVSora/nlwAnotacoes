import { ArrowUpRight } from "@phosphor-icons/react";
import { X } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from 'sonner';

interface NewNote{
    handleNewNote: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNote({handleNewNote}: NewNote){
    const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
    const [shouldShowOnRecording, setShouldShowRecording] = useState(false)
    const [content, setContent] = useState('')

    function handleWriteNote(){
        setShouldShowOnBoarding(false)
    }

    function handleClearField(event:ChangeEvent<HTMLTextAreaElement>){
        setContent(event.target.value)

        event.target.value === "" && setShouldShowOnBoarding(true) 
    }

    function handleSaveNote(event:FormEvent){
        event.preventDefault()

        if(content === ""){
            return 
        } 

        handleNewNote(content)
        toast.success("Nota criada com sucesso!")
        document.getElementById("closeModal")?.click()
        setContent("")
        setShouldShowOnBoarding(true)

    }

    function handleStartRecording(){
        setShouldShowRecording(true)

        let browserSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if(!browserSpeechRecognition){
            return window.alert("Seu browser não suporta está funcionalidade!")
        }

        speechRecognition = new browserSpeechRecognition()
        setShouldShowOnBoarding(false)

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, results) => {
                return text.concat(results[0].transcript)
            }, '')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()
    }

    function handleStopRecording(){
        setShouldShowRecording(false)

        if(speechRecognition !== null){
            speechRecognition.stop()
        }
    }

    return(
        <Dialog.Root>
            <Dialog.Trigger className="h-[250px] flex flex-col text-left gap-3 bg-slate-700 rounded-md p-5 relative cursor-pointer outline-none overflow-hidden hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
                <div className="bg-slate-800 p-[6px] absolute rounded-tr-md top-0 right-0">
                <ArrowUpRight size={32} className="text-slate-600" />
                </div>
                <div>
                <span className="text-slate-200 text-sm font-medium">Adicionar nota</span>
                </div>
                <div>
                <span className="text-slate-400 text-sm leading-6">Grave uma nota em áudio que será convertida para texto automaticamente.</span>
                </div>            
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
                <Dialog.Content className='z-10 fixed flex flex-col gap-3 bg-slate-700 max-w-[600px] max-h-[600px] px-5 pt-5 w-full h-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-md outline-none'>
                    <Dialog.Close className='p-[6px] rounded-tr-md absolute top-0 right-0 bg-slate-800' id="closeModal">
                        <X size={20} className="text-slate-500" />
                    </Dialog.Close>
                    <div>
                        <span className="text-slate-200 text-sm font-medium">Adicionar nota</span>
                    </div>
                    <form className="flex flex-1">
                        <div className='flex flex-1'>
                            {
                                shouldShowOnBoarding ? 
                                <span className="text-slate-400 text-sm leading-6">Comece <button type="button" onClick={handleStartRecording} className="text-lime-400 hover:underline">gravando uma nota</button> em áudio ou se preferir <button onClick={handleWriteNote} className="text-lime-400 hover:underline">utilize apenas texto.</button></span>
                                :
                                <textarea autoFocus className="text-sm bg-transparent text-slate-400 flex-1 resize-none outline-none w-full leading-6" onChange={handleClearField} value={content}/>
                            }
                        </div>  
                        {
                            shouldShowOnRecording ?
                            <button type="button" className='absolute bottom-0 left-0 rounded-b-md w-full bg-slate-800 h-[46px] flex justify-center items-center group' onClick={handleStopRecording}>
                                <div className="rounded-full bg-red-500 w-[10px] h-[10px] mr-2 animate-pulse"/><span className='text-slate-50 text-sm'>Gravando! (clique p/interromper)</span>
                            </button>
                            :
                            <button type="button" onClick={handleSaveNote} className='absolute bottom-0 left-0 rounded-b-md w-full bg-lime-400 h-[46px] flex justify-center items-center group'>
                                <span className='text-lime-900 text-sm'>Salvar nota</span>
                            </button>
                        }
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}