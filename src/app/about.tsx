import { techStackItemsData, type TechStackItemData } from "@/data/tech-stack-data"

interface TechStackItemProps {
    stackItem: TechStackItemData
}
function TechStackItem({ stackItem }: TechStackItemProps) {
    return (
        <>
            <div className="h-10 p-2 bg-slate-800 text-slate-300 dark:text-slate-300 text-sm">{stackItem.category}</div>
            <a href={stackItem.url} target='_blank'>
                <div className={`relative size-full`}>
                    <div className="p-2">
                        <div className='pb-2 font-semibold'>{stackItem.chosenStack}</div>
                        <div className='text-xs'>{stackItem.description}</div>
                    </div>
                    <div className='absolute dark:bg-slate-700 dark:in-[a:hover]:bg-slate-600 -z-1 top-0 left-0 size-full transition-colors duration-300 ease-in-out'>
                        <img src={stackItem.logoImg} className='absolute h-[150px] in-[a:hover]:h-[175px] opacity-15 right-0 transition-[height] duration-2000 ease-in-out' />
                    </div>
                </div>
            </a>
        </>
    )
}

export function About() {
    return (
        <div className="p-3">
            <h1 className="pb-3">About</h1>
            <div>This is a single page application that I've used to test out different frontend technology, frameworks and paradigms in 2025.</div>
            <div className="pb-3">The source code can be found <a href="https://github.com/prasadsilva/fe-playground-2025" target="_blank" className="italic underline">here</a>.</div>
            <div className="flex flex-col gap-y-4 wrap-normal">
                <div className="font-semibold pt-0">Current stack</div>
                <ul className="flex flex-row gap-3 flex-wrap">
                    {techStackItemsData.map((techStackItem, idx) =>
                        <li key={`stackItem_${idx}`} className="w-[300px] h-[160px] overflow-hidden rounded-sm shadow-sm hover:shadow-xl dark:shadow-none transition-shadow duration-200 ease-in outline outline-black/5 dark:-outline-offset-1 dark:outline-white/10">
                            <TechStackItem stackItem={techStackItem} />
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}