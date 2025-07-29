import { techStackItemsData, type TechStackItemData } from "@/data/tech-stack-data"

interface TechStackItemProps {
    stackItem: TechStackItemData
}
function TechStackItem({ stackItem }: TechStackItemProps) {
    return (
        <a href={stackItem.url} target='_blank'>
            <div className="h-10 p-2 rounded-t-sm bg-slate-600/15 text-slate-900 text-sm">{stackItem.category}</div>
            <div className={`relative p-2 h-full`}>
                <div className='pb-2 font-semibold'>{stackItem.chosenStack}</div>
                <div className='text-xs'>{stackItem.description}</div>
                <div className='absolute -z-10 top-1 right-1 opacity-15 size-full overflow-hidden'>
                    <img src={stackItem.logoImg} className='absolute h-[150px] right-0' />
                </div>
            </div>
        </a>
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
                        <li key={`stackItem_${idx}`} className="w-[300px] h-[160px] overflow-hidden rounded-sm shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
                            <TechStackItem stackItem={techStackItem} />
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}