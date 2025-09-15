import { cn } from "@/lib/utils";
import {
  IconBrain,
  IconRobot,
  IconChartBar,
  IconPigMoney,
  IconWallet,
  IconChartPie,
  IconPalette,
  IconShield,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "AI-Powered Insights",
      description:
        "Get personalized financial insights and recommendations powered by Google Gemini AI.",
      icon: <IconBrain />,
    },
    {
      title: "Real-time Chatbot",
      description:
        "24/7 AI assistant to help you with financial queries and guidance.",
      icon: <IconRobot />,
    },
    {
      title: "Transaction Tracking",
      description:
        "Automatically track and categorize your transactions in real-time.",
      icon: <IconChartBar />,
    },
    {
      title: "Savings Goals",
      description:
        "Set and manage your savings goals with smart progress tracking.",
      icon: <IconPigMoney />,
    },
    {
      title: "Budget Planning",
      description:
        "Create and monitor budgets with intelligent spending insights.",
      icon: <IconWallet />,
    },
    {
      title: "Financial Analytics",
      description:
        "Interactive charts and analytics to visualize your financial health.",
      icon: <IconChartPie />,
    },
    {
      title: "Modern Interface",
      description:
        "Beautiful UI with dark/light mode support using shadcn/ui components.",
      icon: <IconPalette />,
    },
    {
      title: "Secure Platform",
      description:
        "Built with Supabase Auth and hosted on AWS for maximum security.",
      icon: <IconShield />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-border w-4xl",
        (index === 0 || index === 4) && "lg:border-l border-border",
        index < 4 && "lg:border-b border-border"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-accent to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-accent to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-muted-foreground">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-muted group-hover/feature:bg-ring transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
