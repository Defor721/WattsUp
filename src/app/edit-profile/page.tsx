"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Building,
  Lock,
  Bell,
  BarChart,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { Switch } from "@/components/shadcn/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";

function EditMypage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "김터빈",
    email: "김터빈@gmail.com",
    phone: "010-1234-5678",
    company: "한국전력거래소",
  });
  const [notifications, setNotifications] = useState({
    tradeAlerts: true,
    marketUpdates: false,
    newsDigest: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    console.log("Updated profile data:", formData);
    console.log("Updated notification settings:", notifications);
    // Redirect back to the main profile page
    router.push("/mypage");
  };

  return (
    <div className="p-8">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-2xl bg-white/10">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src="/assets/images/logo.webp"
                  alt={formData.name}
                />
                <AvatarFallback>{formData.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">프로필 수정</CardTitle>
                <CardDescription>개인 정보를 업데이트하세요</CardDescription>
              </div>
            </div>
          </CardHeader>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">프로필</TabsTrigger>
              <TabsTrigger value="settings">설정</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="flex-1 bg-white/5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="flex-1 bg-white/5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 bg-white/5 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">회사</Label>
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-gray-500" />
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="flex-1 bg-white/5"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호 변경</Label>
                    <div className="flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-gray-500" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="새 비밀번호"
                        className="flex-1 bg-white/5"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/mypage")}
                    className="bg-transparent hover:bg-white/20"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[rgb(7,15,38)] text-white hover:bg-[rgb(15,30,75)]"
                  >
                    저장
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value="settings">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <Label htmlFor="trade-alerts">거래 알림</Label>
                  </div>
                  <Switch
                    id="trade-alerts"
                    checked={notifications.tradeAlerts}
                    onCheckedChange={() =>
                      handleNotificationChange("tradeAlerts")
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      notifications.tradeAlerts
                        ? "bg-[rgb(15,30,75)]" // 활성화 시 배경색
                        : "bg-gray-300" // 비활성화 시 배경색
                    }`}
                  >
                    {/* 스위치의 동그라미 */}
                    <span
                      className={`absolute left-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        notifications.tradeAlerts
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </Switch>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5 text-gray-500" />
                    <Label htmlFor="market-updates">시장 업데이트</Label>
                  </div>
                  <Switch
                    id="market-updates"
                    checked={notifications.marketUpdates}
                    onCheckedChange={() =>
                      handleNotificationChange("marketUpdates")
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <Label htmlFor="news-digest">뉴스 다이제스트</Label>
                  </div>
                  <Switch
                    id="news-digest"
                    checked={notifications.newsDigest}
                    onCheckedChange={() =>
                      handleNotificationChange("newsDigest")
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-[rgb(7,15,38)] text-white hover:bg-[rgb(15,30,75)]"
                >
                  설정 저장
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default EditMypage;
