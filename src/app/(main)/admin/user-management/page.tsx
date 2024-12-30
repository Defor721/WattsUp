"use client";

import React, { useState } from "react";

import Loading from "@/app/loading";

const users = [
  {
    id: "test1@naver.com",
    businessName: "윤경민",
    tradeName: "(주)팀장",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
  {
    id: "test2@naver.com",
    businessName: "김하영",
    tradeName: "(주)팀대표자",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
  {
    id: "test3@naver.com",
    businessName: "김성우",
    tradeName: "(주)팀원",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
  {
    id: "test4@naver.com",
    businessName: "노지훈",
    tradeName: "(주)팀원",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
  {
    id: "test5@naver.com",
    businessName: "윤재성",
    tradeName: "(주)팀원",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
];

function UserManagement() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">사용자 관리</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border-b px-4 py-2">사용자 아이디</th>
              <th className="border-b px-4 py-2">사업자명</th>
              <th className="border-b px-4 py-2">상호명</th>
              <th className="border-b px-4 py-2">사업자등록번호</th>
              <th className="border-b px-4 py-2">법인등록번호</th>
              <th className="border-b px-4 py-2">가입날짜</th>
              <th className="border-b px-4 py-2">마지막 로그인 시간</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center hover:bg-gray-50">
                <td className="border-b px-4 py-2">{user.id}</td>
                <td className="border-b px-4 py-2">{user.businessName}</td>
                <td className="border-b px-4 py-2">{user.tradeName}</td>
                <td className="border-b px-4 py-2">
                  {user.businessRegistrationNumber}
                </td>
                <td className="border-b px-4 py-2">
                  {user.corporateRegistrationNumber}
                </td>
                <td className="border-b px-4 py-2">{user.joinDate}</td>
                <td className="border-b px-4 py-2">{user.lastLoginTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
