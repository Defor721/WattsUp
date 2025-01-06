import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";
import SignupForm from "@/auth/components/signup/SignupForm";
import ArrowBack from "@/components/common/ArrowBack";

function Signup() {
  return (
    <Card className="relative flex flex-col p-6">
      <ArrowBack />
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>회원가입을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <SignupForm />
    </Card>
  );
}

export default Signup;
