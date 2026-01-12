import React from 'react';
import { CompanySettings } from "@/components/providers/settings-provider";

interface DisbursementReceiptProps {
    data: any; // Relaxed type since we aren't using the data
    company: CompanySettings;
}

export const RegionalDisbursal = React.forwardRef<HTMLDivElement, DisbursementReceiptProps>(({ company }, ref) => {

    return (
        <div ref={ref} className="w-[210mm] h-[297mm] bg-white text-black font-serif px-12 py-8 relative flex flex-col mx-auto box-border" style={{ printColorAdjust: 'exact' }}>

            {/* Header: Logos and Title */}
            <div className="flex justify-between items-center mb-8 h-20">
                <div className="w-32 flex flex-col items-center">
                    {company.logoUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={company.logoUrl} alt="Logo" className="h-12 w-auto object-contain mb-1" />
                    )}
                    <span className="text-[10px] font-bold text-orange-600">{company.name}</span>
                </div>

                <div className="border-2 border-black px-8 py-2 bg-gray-100/50">
                    <h1 className="text-3xl font-extrabold tracking-wide">પ્રોમીસરી નોટ</h1>
                </div>

                <div className="w-32 flex flex-col items-center">
                    {company.logoUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={company.logoUrl} alt="Logo" className="h-12 w-auto object-contain mb-1" />
                    )}
                    <span className="text-[10px] font-bold text-orange-600">{company.name}</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 text-base leading-loose space-y-5">

                {/* Borrower Section */}
                <div className="space-y-4">
                    <div className="flex items-end">
                        <span className="font-bold min-w-[100px]">લખી લેનાર :</span>
                        <div className="border-b border-black flex-1 min-h-[1.5em]"></div>
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="flex items-end w-[30%]">
                            <span className="font-bold min-w-[40px]">જાતે:</span>
                            <div className="border-b border-black flex-1 min-h-[1.5em]"></div>
                        </div>
                        <div className="flex items-end w-[35%]">
                            <span className="font-bold min-w-[80px]">ઉમર આશરે:</span>
                            <div className="border-b border-black flex-1 min-h-[1.5em]"></div>
                        </div>
                        <div className="flex items-end w-[35%]">
                            <span className="font-bold min-w-[40px]">ધંધો:</span>
                            <div className="border-b border-black flex-1 min-h-[1.5em]"></div>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold min-w-[80px]">રહેવાસી :</span>
                        <div className="border-b border-black flex-1 min-h-[1.5em] leading-tight"></div>
                    </div>
                </div>

                {/* Lender Section */}
                <div className="space-y-4 mt-8">
                    <div className="flex items-end">
                        <span className="font-bold min-w-[100px]">લખી આપનાર:</span>
                        <div className="border-b border-black flex-1 min-h-[1.5em]"></div>
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="flex items-end w-[30%]">
                            <span className="font-bold min-w-[40px]">જાતે:</span>
                            <div className="border-b border-black flex-1 min-h-[1.5em]"></div>
                        </div>
                        <div className="flex items-end w-[35%]">
                            <span className="font-bold min-w-[80px]">ઉમર આશરે:</span>
                            <div className="border-b border-black flex-1 min-h-[1.5em]"></div>
                        </div>
                        <div className="flex items-end w-[35%]">
                            <span className="font-bold min-w-[40px]">ધંધો:</span>
                            <div className="border-b border-black flex-1 min-h-[1.5em]"></div>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold min-w-[80px]">રહેવાસી :</span>
                        <div className="border-b border-black flex-1 min-h-[1.5em] leading-tight"></div>
                    </div>
                </div>

                {/* Loan Details Text */}
                <div className="pt-8 space-y-6">
                    <div className="flex items-end">
                        <span className="font-bold mr-2 whitespace-nowrap">જત આજ રોજ અમોએ તમારી પાસેથી રૂ.</span>
                        <div className="border-b border-black px-4 min-w-[200px] flex-1 min-h-[1.5em]"></div>
                    </div>

                    <div className="flex items-end w-full">
                        <span className="font-bold mr-2 whitespace-nowrap">અંકે રૂપિયા:</span>
                        <div className="border-b border-black flex-1 italic font-bold min-h-[1.5em]"></div>
                        <span className="font-bold ml-2 whitespace-nowrap">રોકડા ધિરાણ પેટે લીધા છે.</span>
                    </div>

                    <p className="font-medium mt-4 leading-loose text-justify">
                        એ રૂપિયા તમે જ્યારે અને જ્યાં માંગો ત્યારે આપીએ તેની આ પ્રોમીસરી નોટ અમો તમને લખી આપી છે.
                    </p>

                    <div className="flex justify-between mt-12 pr-12">
                        <div className="flex items-end gap-2 w-1/2">
                            <span>સં ૨૦</span>
                            <div className="border-b border-black w-12 text-center min-h-[1.5em]"></div>
                            <span>ના</span>
                            <div className="border-b border-black w-24 min-h-[1.5em]"></div>
                            <span>ને</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between pt-6 pr-4">
                        <div className="flex items-end gap-2">
                            <span>વાર:</span>
                            <div className="border-b border-black w-32 text-center min-h-[1.5em]"></div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span>તા.</span>
                            <div className="border-b border-black w-16 text-center lg:w-24 min-h-[1.5em]"></div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span>માહે:</span>
                            <div className="border-b border-black w-24 text-center min-h-[1.5em]"></div>
                        </div>
                        <div className="flex items-end gap-2">
                            <span>સને ૨૦</span>
                            <div className="border-b border-black w-12 text-center min-h-[1.5em]"></div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Images/Signatures */}
            <div className="mt-8 h-[250px] relative">

                {/* Photo Box */}
                <div className="absolute left-10 top-0 w-[110px] h-[130px] border border-black flex flex-col items-center justify-center bg-gray-50/50">
                    {/* Blank Photo */}
                </div>

                {/* Amount Box */}
                <div className="absolute left-0 top-[140px] border border-black w-[150px] h-[45px] flex items-center">
                    <div className="w-[40px] h-full border-r border-black flex items-center justify-center text-2xl font-bold bg-gray-100">
                        ₹
                    </div>
                    <div className="flex-1 h-full flex items-center justify-center text-xl font-bold">
                        {/* Blank Amount */}
                    </div>
                </div>

                {/* Revenue Stamp */}
                <div className="absolute right-12 top-[80px] w-[90px] h-[100px] border border-black flex flex-col pt-1">
                    <div className="h-[60%] border-b border-black border-dashed flex items-center justify-center bg-gray-50">
                        <div className="text-[10px] text-center text-gray-400">Revenue<br />Stamp</div>
                    </div>
                    <div className="h-[40%] flex items-end justify-center pb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider transform -rotate-12 translate-y-4 -translate-x-4">Sign</span>
                    </div>
                </div>

                {/* Thumb Impressions */}
                <div className="absolute bottom-0 w-full flex justify-center gap-32 pl-12">
                    <div className="text-center relative">
                        {/* Thumb Placeholder */}
                        <div className="w-20 h-24 rounded-[40%] bg-blue-100/30 mx-auto transform -rotate-12 mb-1 border border-dashed border-blue-200"></div>
                        <div className="font-bold text-blue-900 uppercase text-sm tracking-wide">Left Hand<br />Thumb</div>
                    </div>
                    <div className="text-center relative">
                        {/* Thumb Placeholder */}
                        <div className="w-20 h-24 rounded-[40%] bg-blue-100/30 mx-auto transform rotate-12 mb-1 border border-dashed border-blue-200"></div>
                        <div className="font-bold text-blue-900 uppercase text-sm tracking-wide">Right Hand<br />Thumb</div>
                    </div>
                </div>
            </div>

        </div>
    );
});

RegionalDisbursal.displayName = "RegionalDisbursal";
