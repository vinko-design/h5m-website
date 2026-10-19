import { Hand, RefreshCw, Users } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Create a shared space",
    description:
      "Bring everything that matters into one place and support each other's goals.",
  },
  {
    icon: RefreshCw,
    title: "Keep coming back",
    description:
      "Notice how reality compares with what you're striving for, then talk, adapt, and try again.",
  },
  {
    icon: Hand,
    title: "Celebrate the journey",
    description:
      "Create more high-five moments for the wins, big and small.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-16 md:py-24" aria-labelledby="features-heading">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2
            id="features-heading"
            className="text-3xl font-bold tracking-tight text-[var(--navy)] md:text-4xl"
          >
            How it works
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-3xl border-border/50 bg-white/80 shadow-sm backdrop-blur-sm [--card-spacing:--spacing(5)]"
            >
              <CardHeader className="space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--indigo)]/10">
                  <feature.icon
                    className="size-6 text-[var(--indigo)]"
                    aria-hidden="true"
                  />
                </div>
                <CardTitle className="text-xl text-[var(--navy)]">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
