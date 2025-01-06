import React from "react";
import { Ban, CircleCheck, Loader } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn";

function RecentLog() {
  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <Card className="p-5">
          <ul className="flex flex-col gap-3">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div>{"서울"}발전소 400 kMh</div>
                <div>2시간 전</div>
              </div>
              <div className="flex gap-2 rounded-md bg-rose-400 p-2 text-rose-700">
                <Ban />
                <div>rejected</div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div>{"부산"}발전소 600 kMh</div>
                <div>3시간 전</div>
              </div>
              <div className="flex gap-2 rounded-md bg-amber-200 p-2 text-amber-700">
                <Loader />
                <div>pending</div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col">
                <div>{"대구"}발전소 1000 kMh</div>
                <div>4시간 전</div>
              </div>
              <div className="flex gap-2 rounded-md bg-green-400 p-2 text-green-700">
                <CircleCheck />
                <div>approve</div>
              </div>
            </div>
          </ul>
        </Card>
      </CardContent>
    </Card>
  );
}

export default RecentLog;
