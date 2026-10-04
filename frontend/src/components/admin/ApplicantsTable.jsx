import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Check, X, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';

const statusOptions = [
    { label: "Pending", value: "pending", color: "bg-yellow-100 text-yellow-800 border border-yellow-300" },
    { label: "Accepted", value: "accepted", color: "bg-green-100 text-green-800 border border-green-300" },
    { label: "Rejected", value: "rejected", color: "bg-red-100 text-red-800 border border-red-300" }
];

const getStatusBadge = (status) => {
    const statusItem = statusOptions.find(s => s.value === status?.toLowerCase());
    return statusItem || statusOptions[0];
};

const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
        case 'accepted':
            return <Check className='w-4 h-4' />;
        case 'rejected':
            return <X className='w-4 h-4' />;
        case 'pending':
        default:
            return <Clock className='w-4 h-4' />;
    }
};

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [updatingId, setUpdatingId] = useState(null);

    const statusHandler = async (statusValue, applicationId) => {
        try {
            setUpdatingId(applicationId);
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status: statusValue });
            if (res.data.success) {
                toast.success(`Status updated to ${statusValue}`);
                // Optional: refetch applicants or update local state
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of applicants for this job</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-bold">Full Name</TableHead>
                        <TableHead className="font-bold">Email</TableHead>
                        <TableHead className="font-bold">Contact</TableHead>
                        <TableHead className="font-bold">Resume</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => {
                            const statusBadge = getStatusBadge(item?.status);
                            return (
                                <TableRow key={item._id} className="hover:bg-gray-50 transition">
                                    <TableCell className="font-medium">{item?.applicant?.fullname}</TableCell>
                                    <TableCell>{item?.applicant?.email}</TableCell>
                                    <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                    <TableCell>
                                        {
                                            item.applicant?.profile?.resume ? 
                                            <a 
                                                className="text-blue-600 hover:underline font-medium cursor-pointer" 
                                                href={item?.applicant?.profile?.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {item?.applicant?.profile?.resumeOriginalName}
                                            </a> 
                                            : <span className="text-gray-400">NA</span>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.color}`}>
                                            {getStatusIcon(item?.status)}
                                            {item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1) || "Pending"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger className="cursor-pointer hover:text-[#6A38C2]">
                                                <MoreHorizontal className='w-5 h-5' />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-56 p-3">
                                                <div className='flex flex-col gap-2'>
                                                    <p className='text-sm font-semibold text-gray-700 mb-2'>Update Status</p>
                                                    {
                                                        statusOptions.map((option) => (
                                                            <div 
                                                                key={option.value}
                                                                onClick={() => statusHandler(option.value, item?._id)}
                                                                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition hover:bg-gray-100 ${
                                                                    item?.status?.toLowerCase() === option.value ? `${option.color}` : 'text-gray-700'
                                                                }`}
                                                            >
                                                                {getStatusIcon(option.value)}
                                                                <span className='font-medium'>{option.label}</span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable