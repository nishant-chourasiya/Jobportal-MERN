import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);

    const getStatusIcon = (status) => {
        switch(status) {
            case 'accepted':
                return <CheckCircle className='w-4 h-4 text-green-600' />
            case 'rejected':
                return <XCircle className='w-4 h-4 text-red-600' />
            case 'pending':
                return <Clock className='w-4 h-4 text-gray-600' />
            default:
                return null
        }
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'accepted':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs with their current status</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan="4" className="text-center py-8">
                                    <div className='flex flex-col items-center justify-center gap-2'>
                                        <AlertCircle className='w-8 h-8 text-gray-400' />
                                        <span className='text-gray-500'>You haven't applied for any job yet.</span>
                                        <span className='text-sm text-gray-400'>Browse jobs and apply to get started!</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className='font-medium'>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <div className='flex items-center justify-end gap-2'>
                                        {getStatusIcon(appliedJob?.status)}
                                        <Badge className={`${getStatusColor(appliedJob?.status)} border-0`}>
                                            {appliedJob.status.charAt(0).toUpperCase() + appliedJob.status.slice(1)}
                                        </Badge>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable