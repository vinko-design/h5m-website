import {
  Blocks,
  Flag,
  Handshake,
  MessageCircle,
  PartyPopper,
  Sun,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const useCases = [
  {
    icon: Sun,
    title: "Everyday moments",
    description:
      "Notice the small things that shape your relationship over time.",
  },
  {
    icon: Flag,
    title: "Personal ambitions",
    description:
      "Support each other's goals and make steady progress together.",
  },
  {
    icon: Handshake,
    title: "Shared commitments",
    description: "What you both agreed to, kept where you can talk about it.",
  },
  {
    icon: Blocks,
    title: "The life you're building",
    description: "See whether the day-to-day is adding up to it.",
  },
  {
    icon: MessageCircle,
    title: "Better conversations",
    description: "Turn assumptions into shared understanding.",
  },
  {
    icon: PartyPopper,
    title: "Celebrating progress",
    description: "Notice wins that might otherwise go unnoticed.",
  },
];

export function UseCases() {
  return (
    <section
      className="px-6 py-16 md:py-24"
      aria-labelledby="use-cases-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2
            id="use-cases-heading"
            className="text-3xl font-bold tracking-tight text-[var(--navy)] md:text-4xl"
          >
            What High Five Moments is for
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            From everyday moments to shared goals, High Five Moments helps
            couples notice progress, stay aligned, and celebrate wins both big
            and small.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <Card
              key={useCase.title}
              className="rounded-3xl border-border/50 bg-white/80 shadow-sm backdrop-blur-sm [--card-spacing:--spacing(5)]"
            >
              <CardHeader className="space-y-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gold-subtle">
                  <useCase.icon
                    className="size-6 text-[var(--gold)]"
                    aria-hidden="true"
                  />
                </div>
                <CardTitle className="text-xl text-[var(--navy)]">
                  {useCase.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {useCase.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
