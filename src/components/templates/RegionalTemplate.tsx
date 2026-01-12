import React from "react";
import { CompanySettings } from "@/components/providers/settings-provider";

interface ReceiptProps {
    data: any; // Relaxed type
    company: CompanySettings;
}

export const RegionalTemplate = ({ company }: ReceiptProps) => {

    return (
        <div className="w-[210mm] h-[297mm] bg-white text-black font-sans p-8 relative flex flex-col mx-auto box-border" style={{ printColorAdjust: 'exact' }}>
            {/* Outline Box */}
            <div className="border border-black h-full flex flex-col p-6 relative">

                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <div className="w-1/4 pt-2">
                        {company.logoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={company.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
                        ) : (
                            <div className="h-16 w-16 bg-gray-100 flex items-center justify-center font-bold">{company.name}</div>
                        )}
                        <span className="text-xs font-bold text-orange-600 block mt-1">{company.name}</span>
                    </div>

                    <div className="flex-1 text-center pt-4">
                        <h1 className="text-4xl font-normal uppercase tracking-widest block">VOUCHER</h1>
                    </div>

                    <div className="w-1/4 text-right pt-8 text-sm font-bold">
                        <div className="mb-2">
                            No. <span className="font-normal inline-block min-w-[60px] text-center"></span>
                        </div>
                        <div>
                            Date: <span className="font-normal inline-block min-w-[80px] text-center"></span>
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-black mb-4 mx-[-24px]"></div>

                {/* Main Body */}
                <div className="flex-1 flex flex-col relative">

                    {/* Top Fields */}
                    <div className="space-y-4 mb-6 pr-[160px]">
                        <div className="flex items-end">
                            <span className="font-bold w-[100px] text-sm">Paid to :</span>
                            <div className="font-medium text-sm flex-1"></div> {/* Blank */}
                        </div>
                        <div className="flex items-end">
                            <span className="font-bold w-[100px] text-sm">Debit:</span>
                            <div className="text-sm flex-1"></div> {/* Blank */}
                        </div>
                        <div className="flex items-start mt-4">
                            <span className="font-bold w-[100px] text-sm pt-1">Particulars:</span>
                            <div className="text-sm leading-relaxed p-1 h-32 flex-1">
                                {/* Blank Particulars */}
                            </div>
                        </div>
                    </div>

                    {/* Left Bottom Amount Field */}
                    <div className="mt-auto mb-[250px] flex items-end">
                        <span className="font-bold w-[100px] text-sm">Rupees:</span>
                        <div className="text-sm italic flex-1 border-b border-black border-dashed"></div> {/* Blank Line */}
                    </div>

                    {/* Right Side Table - Positioned Absolute */}
                    <div className="absolute right-0 top-0 w-[150px] h-[300px] border-l border-b border-black flex flex-col">
                        {/* Header */}
                        <div className="h-8 border-b border-black flex">
                            <div className="w-3/4 border-r border-black flex items-center justify-center font-bold text-xs bg-gray-50">Rupees</div>
                            <div className="w-1/4 flex items-center justify-center font-bold text-xs bg-gray-50">Ps</div>
                        </div>

                        {/* Empty Rows */}
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex-1 border-b border-black/50 flex">
                                <div className="w-3/4 border-r border-black"></div>
                                <div className="w-1/4"></div>
                            </div>
                        ))}

                        {/* Total Row */}
                        <div className="h-8 flex">
                            <div className="w-3/4 border-r border-black flex items-center justify-end px-2 text-xs font-bold">Total:</div>
                            <div className="w-1/4 flex items-center justify-center text-xs font-bold"></div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="absolute bottom-0 w-full">
                        <div className="grid grid-cols-2 gap-x-12 gap-y-8 text-sm mb-4">
                            {/* Left Column */}
                            <div className="space-y-8">
                                <div className="flex items-center">
                                    <span className="w-[120px]">Authorised by:</span>
                                    <div className="flex-1"></div>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-[180px]">Paid Cash/Cheque drwan on:</span>
                                    <div className="flex-1"></div>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-[100px]">Cheque No.:</span>
                                    <div className="flex-1 border-b border-black border-dashed"></div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8 relative">
                                <div className="flex items-center">
                                    <span className="w-[80px]">Passes By:</span>
                                    <div className="flex-1"></div>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-[60px]">Dated:</span>
                                    <div className="flex-1 border-b border-black border-dashed"></div>
                                </div>
                                <div className="text-right pr-4 pt-12">
                                    <span className="text-xs font-bold border-t border-black px-4 pt-1">Receiver's Signature</span>
                                </div>

                                {/* Stamp */}
                                <div className="absolute top-12 right-20 w-[60px] h-[70px] border border-black flex items-center justify-center bg-red-50/30">
                                    <div className="text-[9px] text-center text-gray-400 leading-tight">Revenue<br />Stamp</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thumb Impressions - Bottom Overlay */}
                <div className="absolute bottom-8 left-0 w-full flex justify-center gap-32 pointer-events-none">
                    <div className="text-center">
                        <div className="w-16 h-20 bg-blue-100/30 rounded-[40%] mx-auto mb-1 transform -rotate-12"></div>
                        <div className="font-bold text-blue-900 text-[10px] uppercase">Left Hand<br />Thumb</div>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-20 bg-blue-100/30 rounded-[40%] mx-auto mb-1 transform rotate-12"></div>
                        <div className="font-bold text-blue-900 text-[10px] uppercase">Right Hand<br />Thumb</div>
                    </div>
                </div>

            </div>
        </div>
    );
};
