"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Plot from "react-plotly.js";
import { Container, Row, Col, Dropdown, Card, Button } from "react-bootstrap";

// 데이터 타입 정의
interface PowerData {
  연도: number;
  "총발전량총계(GWh)": number;
  "발전설비총계(MW)": number;
  "이용율(%)": number;
  "수력(MW)": number;
  "화력(MW)": number;
  "원자력(MW)": number;
  "자가용(MW)": number;
  "수력(GWh)": number;
  "화력(GWh)": number;
  "원자력(GWh)": number;
  "자가용(GWh)": number;
  "송배전손실률(%)": number;
}

// 색상 팔레트
const colors = {
  background: "#2c2f33",
  cardBackground: "#3c3f41",
  text: "#ffffff",
  accent: "#77dd77",
  primary: "#4f8df7",
  secondary: "#ffb347",
  tertiary: "#ff6961",
};

const PowerDashboard: React.FC = () => {
  const [data, setData] = useState<PowerData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<PowerData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "/assets/dashboards/HOME_주요지표_전력지표.xlsx",
      );
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: PowerData[] = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setSelectedYear(jsonData[0].연도);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear && data.length > 0) {
      const filtered = data.find((item) => item.연도 === selectedYear);
      setFilteredData(filtered || null);
    }
  }, [selectedYear, data]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "전력지표");
    XLSX.writeFile(workbook, "전력지표_데이터.xlsx");
  };

  return (
    <Container
      fluid
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1 className="mb-4 text-center">전력지표 대시보드</h1>

      {/* 드롭다운 및 다운로드 */}
      <Row className="mb-4">
        <Col md={6}>
          <Dropdown onSelect={(e) => setSelectedYear(Number(e))}>
            <Dropdown.Toggle variant="secondary">
              연도 선택: {selectedYear}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {data.map((item) => (
                <Dropdown.Item key={item.연도} eventKey={item.연도}>
                  {item.연도}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" onClick={handleDownload}>
            데이터 다운로드
          </Button>
        </Col>
      </Row>

      {/* KPI 카드 */}
      {filteredData && (
        <Row className="mb-4 text-center">
          <Col>
            <Card
              style={{
                backgroundColor: colors.cardBackground,
                padding: "10px",
              }}
            >
              <Card.Body>
                <Card.Title>총 발전량</Card.Title>
                <h3>
                  {filteredData["총발전량총계(GWh)"].toLocaleString()} GWh
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              style={{
                backgroundColor: colors.cardBackground,
                padding: "10px",
              }}
            >
              <Card.Body>
                <Card.Title>발전설비 총계</Card.Title>
                <h3>{filteredData["발전설비총계(MW)"].toLocaleString()} MW</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              style={{
                backgroundColor: colors.cardBackground,
                padding: "10px",
              }}
            >
              <Card.Body>
                <Card.Title>이용률</Card.Title>
                <h3>{filteredData["이용율(%)"]}%</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 그래프 */}
      {filteredData && (
        <>
          <Row>
            <Col md={6}>
              <Plot
                data={[
                  {
                    x: ["수력", "화력", "원자력", "자가용"],
                    y: [
                      filteredData["수력(GWh)"],
                      filteredData["화력(GWh)"],
                      filteredData["원자력(GWh)"],
                      filteredData["자가용(GWh)"],
                    ],
                    type: "bar",
                    marker: {
                      color: [
                        colors.primary,
                        colors.secondary,
                        colors.tertiary,
                        colors.accent,
                      ],
                    },
                  },
                ]}
                layout={{
                  title: "발전량 분포",
                  paper_bgcolor: colors.background,
                  font: { color: colors.text },
                }}
              />
            </Col>
            <Col md={6}>
              <Plot
                data={[
                  {
                    labels: ["송배전 손실률 (%)", "이용률 (%)"],
                    values: [
                      filteredData["송배전손실률(%)"],
                      filteredData["이용율(%)"],
                    ],
                    type: "pie",
                    marker: { colors: [colors.tertiary, colors.accent] },
                  },
                ]}
                layout={{
                  title: "송배전 손실률 및 이용률",
                  paper_bgcolor: colors.background,
                  font: { color: colors.text },
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default PowerDashboard;
