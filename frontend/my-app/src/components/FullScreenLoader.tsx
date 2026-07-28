import { LoaderIcon } from "lucide-react";

export function FullScreenLoader(){
    return (
        <div className="flex h-[calc(100dvh-var(--header-height))] items-center justif-center">
            <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
        </div>
    )
}