import React from 'react'
import { Skeleton } from './ui/skeleton'

const AdminSkeleton = () => {
    return (
        <div>
            {/* <div className="flex justify-between mb-3">
                <div className="space-y-3">
                    <Skeleton className="h-16 w-76" />
                    <Skeleton className="h-10 w-52" />
                </div>
                <Skeleton className="h-10 w-68" />
            </div> */}
            <Skeleton className="h-96 w-full" />
        </div>
    )
}

export default AdminSkeleton