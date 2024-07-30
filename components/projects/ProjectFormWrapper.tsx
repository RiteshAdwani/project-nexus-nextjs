import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ProjectFormWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
}

export const ProjectFormWrapper = ({
  children,
  headerLabel,
}: ProjectFormWrapperProps) => {
  return (
    <Card className="w-[350px] md:w-[600px] shadow-md my-5">
      <CardHeader>
        <p className="mx-auto font-semibold text-lg">{headerLabel}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
