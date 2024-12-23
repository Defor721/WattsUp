"use client";

export default function Page() {
  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit}>
      <h1>추가 정보 입력</h1>
      <label>
        회사명
        <input type="text" required />
      </label>
      <label>
        사업자 번호
        <input type="text" required />
      </label>
      <button type="submit">제출</button>
    </form>
  );
}
