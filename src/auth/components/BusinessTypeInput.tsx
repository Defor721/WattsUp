import { Dispatch } from "react";

import { Input, Label } from "@/components/shadcn";

interface BusinessTypeInputProps {
  businessType: "corporate" | "individual";
  corporateNumber: string;
  personalId: string;
  setBusinessType: Dispatch<React.SetStateAction<"corporate" | "individual">>;
  setCorporateNumber: Dispatch<React.SetStateAction<string>>;
  setPersonalId: Dispatch<React.SetStateAction<string>>;
}

export default function BusinessTypeInput({
  businessType,
  corporateNumber,
  personalId,
  setBusinessType,
  setCorporateNumber,
  setPersonalId,
}: BusinessTypeInputProps) {
  return (
    <div className="mt-2 flex flex-col gap-4">
      {/* 라디오 버튼 */}
      <div className="flex gap-3">
        <div className="flex gap-1">
          <input
            id="corporate"
            type="radio"
            name="businessType"
            value="corporate"
            checked={businessType === "corporate"}
            onChange={() => setBusinessType("corporate")}
          />
          <Label htmlFor="corporate">법인 사업자</Label>
        </div>
        <div className="flex gap-1">
          <input
            id="individual"
            type="radio"
            name="businessType"
            value="individual"
            checked={businessType === "individual"}
            onChange={() => setBusinessType("individual")}
          />
          <Label htmlFor="individual">개인 사업자</Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {businessType === "corporate" ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="corporateNumber">법인등록번호</Label>
            <Input
              id="corporateNumber"
              type="text"
              name="corporateNumber"
              placeholder="법인등록번호 13자리를 입력해주세요."
              maxLength={13}
              value={corporateNumber}
              onChange={(e) =>
                setCorporateNumber(e.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="personalId">주민등록번호</Label>
            <Input
              id="personalId"
              type="text"
              name="personalId"
              placeholder="주민등록번호 앞 6자리를 입력해주세요."
              maxLength={6}
              value={personalId}
              onChange={(e) =>
                setPersonalId(e.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
