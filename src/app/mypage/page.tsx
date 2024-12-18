"use client";

import React from "react";
import Image from "next/image";
import {
  User,
  Settings,
  LogOut,
  BarChart2,
  FileText,
  Bell,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { Progress } from "@/components/shadcn/progress";

function Mypage() {
  return (
    <div className="p-8">
      <div className="container mx-auto p-6">
        <h1 className="mb-8 text-5xl font-bold">Mypage</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {/* User Profile Card */}
          <Card className="col-span-1 bg-white/10">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage src="/assets/images/logo.webp" alt="김터빈" />
                <AvatarFallback>김터빈</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">김터빈</CardTitle>
              <CardDescription>김터빈@gmail.com</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="bg-transparent hover:bg-white/20"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent hover:bg-white/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics and Activity Card */}
          <Card className="col-span-2 bg-white/10">
            <CardHeader>
              <CardTitle>Statistics & Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">Total Trades</span>
                  <span className="text-3xl font-bold">1,347</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">Trade Volume</span>
                  <span className="text-3xl font-bold">5.67 GWh</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between">
                    <span>Monthly Goal</span>
                    <span>75%</span>
                  </div>
                  <Progress
                    value={75}
                    className="h-2 [&::-webkit-progress-bar]:bg-white/20 [&::-webkit-progress-value]:bg-green-500"
                  />
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span>Efficiency Rating</span>
                    <span>92%</span>
                  </div>
                  <Progress
                    value={92}
                    className="h-2 [&::-webkit-progress-bar]:bg-white/20 [&::-webkit-progress-value]:bg-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="mt-6 bg-white/10">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                {
                  icon: BarChart2,
                  text: "Completed trade: 1.2 GWh at ₩75/kWh",
                  time: "2 hours ago",
                },
                {
                  icon: FileText,
                  text: "Submitted monthly report",
                  time: "1 day ago",
                },
                {
                  icon: Bell,
                  text: "New market announcement",
                  time: "3 days ago",
                },
                {
                  icon: User,
                  text: "Updated profile information",
                  time: "1 week ago",
                },
              ].map((activity, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Mypage;
