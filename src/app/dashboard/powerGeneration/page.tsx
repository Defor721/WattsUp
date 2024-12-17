"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  Button,
  Navbar,
} from "react-bootstrap";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import rawData from "../../../public/assets/dashboards/HOME_발전·판매_발전량_전원별.json"; // JSON 변환 필요

// 타입 정의
interface DataType {
  연도: number;
  수력소계: number;
  기력소계: number;
  원자력: number;
  신재생: number;
}

const PowerGenerationDashboard = () => {
  const router = useRouter();
  const [year, setYear] = useState<string>("전체");
  const [source, setSource] = useState<string>("전체");

  // 연도 및 발전원 필터링
  const years = [
    "전체",
    ...new Set(rawData.map((item: DataType) => item.연도)),
  ];
  const powerSources = ["수력소계", "기력소계", "원자력", "신재생"];

  const filteredData =
    year === "전체"
      ? rawData
      : rawData.filter((item: DataType) => item.연도.toString() === year);

  // KPI 계산
  const totalKPI = (source: string) =>
    filteredData.reduce((acc: number, curr: any) => acc + curr[source], 0);

  const chartData = {
    labels: filteredData.map((item: DataType) => item.연도),
    datasets: powerSources.map((power) => ({
      label: power,
      data: filteredData.map((item: DataType) => item[power]),
      backgroundColor: ["#4e79a7", "#f28e2c", "#59a14f", "#af7aa1"],
    })),
  };

  const handleDownload = () => {
    const jsonData = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "power_generation_data.json";
    link.click();
  };

  return (
    <div
      style={{
        backgroundColor: "#1e1e2f",
        color: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <Container fluid>
        {/* Header/Navbar */}
        <Navbar bg="primary" variant="dark" className="mb-4 px-3">
          <Navbar.Brand>발전량 전원별 대시보드</Navbar.Brand>
          <Button variant="light" onClick={() => router.push("/")}>
            홈
          </Button>
        </Navbar>

        {/* Dropdown Filters */}
        <Row className="mt-4">
          <Col md={6}>
            <Dropdown>
              <Dropdown.Toggle variant="secondary">
                연도 선택: {year}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {years.map((y) => (
                  <Dropdown.Item key={y} onClick={() => setYear(y)}>
                    {y}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={6}>
            <Dropdown>
              <Dropdown.Toggle variant="secondary">
                발전원 선택: {source}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSource("전체")}>
                  전체
                </Dropdown.Item>
                {powerSources.map((s) => (
                  <Dropdown.Item key={s} onClick={() => setSource(s)}>
                    {s}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        {/* KPI Cards */}
        <Row className="mt-4 text-center">
          {powerSources.map((power) => (
            <Col md={3} key={power}>
              <Card style={{ backgroundColor: "#28293e", color: "#ffffff" }}>
                <Card.Body>
                  <Card.Title>{power} (GWh)</Card.Title>
                  <Card.Text style={{ fontSize: "2rem" }}>
                    {totalKPI(power)} GWh
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts */}
        <Row className="mt-5">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>라인 차트</Card.Title>
                <Line data={chartData} options={{ responsive: true }} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>바 차트</Card.Title>
                <Bar data={chartData} options={{ responsive: true }} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>파이 차트</Card.Title>
                <Pie data={chartData} options={{ responsive: true }} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* CSV 다운로드 */}
        <Row className="mt-4">
          <Col className="text-center">
            <Button variant="success" onClick={handleDownload}>
              데이터 다운로드
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PowerGenerationDashboard;
