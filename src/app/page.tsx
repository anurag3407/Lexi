import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    name: "Store your PDF Documents",
    description : "Keep all your important PDF files securely stored and easily accessible anytime , anywhere.",
    icon : GlobeIcon,
  },
  {
    name: "Smart AI Processing",
    description : "Advanced AI algorithms to analyze and extract insights from your documents.",
    icon : BrainCogIcon,
  },
  {
    name: "Real-time Preview",
    description : "View your documents instantly with our fast preview system.",
    icon : EyeIcon,
  },
  {
    name: "Cross-platform Access",
    description : "Access your documents from any device, anywhere in the world.",
    icon : MonitorSmartphoneIcon,
  },
  {
    name: "Server Management",
    description : "Robust server infrastructure to handle all your document needs.",
    icon : ServerCogIcon,
  },
  {
    name: "Lightning Fast",
    description : "Quick upload and processing times for maximum efficiency.",
    icon : ZapIcon,
  },
]



export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600 ">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-lg ">
        <div className="flex flex-col justify-center item-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 tracking-wide uppercase">
              Introducing "Lexi - Chat With PDF"
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your documents
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform offers a wide range of features to help you manage your documents efficiently and effectively.
            </p>
          </div>
          <Button asChild className="mt-10" >
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
        <div>
          <dl>
            {features.map((feature) => (
              <div key={feature.name} className="relative flex flex-col gap-6 p-6 rounded-lg border border-gray-200">
                <dt className="text-lg font-semibold leading-6 text-gray-900">
                  <feature.icon className="h-6 w-6 inline-block mr-2" />
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-6 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>

        </div>
      </div>
    </main>
  );
}
