"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Plot from "react-plotly.js";
import { Dropdown, Button, Container, Row, Col, Card } from "react-bootstrap";

// 데이터 인터페이스
interface EnergyData {
  연도: number;
  "에너지 항목": string;
  소비량: number;
}

const EnergyDashboard: React.FC = () => {
  const [data, setData] = useState<EnergyData[]>([]);
  const [filteredData, setFilteredData] = useState<EnergyData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("전체");
  const [selectedEnergy, setSelectedEnergy] = useState<string>("전체");

  const [totalEnergy, setTotalEnergy] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/assets/HOME_주요지표_에너지지표.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData: EnergyData[] = XLSX.utils
        .sheet_to_json(worksheet)
        .map((row: any) => ({
          연도: row["연도"],
          "에너지 항목": row["에너지 항목"],
          소비량: row["소비량"],
        }));

      setData(jsonData);
      setFilteredData(jsonData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;

    if (selectedYear !== "전체") {
      filtered = filtered.filter(
        (item) => item.연도.toString() === selectedYear,
      );
    }

    if (selectedEnergy !== "전체") {
      filtered = filtered.filter(
        (item) => item["에너지 항목"] === selectedEnergy,
      );
    }

    const total = filtered.reduce((acc, curr) => acc + curr.소비량, 0);
    const totalAll = data.reduce((acc, curr) => acc + curr.소비량, 0);
    const percentage = (total / totalAll) * 100;

    setFilteredData(filtered);
    setTotalEnergy(total);
    setPercentage(percentage);
  }, [selectedYear, selectedEnergy, data]);

  // 연도 및 에너지 항목 옵션
  const years = ["전체", ...new Set(data.map((item) => item.연도))];
  const energyTypes = [
    "전체",
    ...new Set(data.map((item) => item["에너지 항목"])),
  ];

  return (
    <Container
      fluid
      style={{ backgroundColor: "#1C1F2B", color: "white", minHeight: "100vh" }}
    >
      <h1 className="my-4 text-center">에너지 소비 대시보드</h1>

      {/* 필터 */}
      <Row className="mb-4">
        <Col md={6}>
          <Dropdown onSelect={(e) => setSelectedYear(e || "전체")}>
            <Dropdown.Toggle variant="secondary">
              연도 선택: {selectedYear}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {years.map((year) => (
                <Dropdown.Item key={year} eventKey={year}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={6}>
          <Dropdown onSelect={(e) => setSelectedEnergy(e || "전체")}>
            <Dropdown.Toggle variant="secondary">
              에너지 항목 선택: {selectedEnergy}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {energyTypes.map((type) => (
                <Dropdown.Item key={type} eventKey={type}>
                  {type}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* KPI */}
      <Row className="mb-4 text-center">
        <Col>
          <Card className="bg-dark text-white">
            <Card.Body>
              <Card.Title>총 에너지 소비량</Card.Title>
              <Card.Text>{totalEnergy.toLocaleString()} (1000톤)</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="bg-dark text-white">
            <Card.Body>
              <Card.Title>비율 (%)</Card.Title>
              <Card.Text>{percentage.toFixed(2)}%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 차트 */}
      <Row>
        <Col md={6}>
          <Plot
            data={[
              {
                x: filteredData.map((item) => item.연도),
                y: filteredData.map((item) => item.소비량),
                type: "line",
                mode: "lines+markers",
                marker: { color: "#4e79a7" },
              },
            ]}
            layout={{
              title: "에너지 소비 추이",
              paper_bgcolor: "#1C1F2B",
              plot_bgcolor: "#1C1F2B",
              font: { color: "white" },
            }}
          />
        </Col>
        <Col md={6}>
          <Plot
            data={[
              {
                x: filteredData.map((item) => item.연도),
                y: filteredData.map((item) => item.소비량),
                type: "bar",
                marker: { color: "#FF5733" },
              },
            ]}
            layout={{
              title: "에너지 소비 비교",
              paper_bgcolor: "#1C1F2B",
              plot_bgcolor: "#1C1F2B",
              font: { color: "white" },
            }}
          />
        </Col>
      </Row>

      {/* 데이터 다운로드 */}
      <div className="mt-4 text-center">
        <Button
          variant="success"
          onClick={() => {
            const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
              type: "application/json",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "energy_data.json";
            link.click();
          }}
        >
          데이터 다운로드
        </Button>
      </div>
    </Container>
  );
};

export default EnergyDashboard;
