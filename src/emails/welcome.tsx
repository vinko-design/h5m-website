import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  siteUrl?: string;
}

export default function WelcomeEmail({
  siteUrl = "https://highfivemoments.app",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the list — high five!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={badge}>
            <Text style={badgeText}>✋ High Five Moments</Text>
          </Section>

          <Heading style={heading}>You&apos;re on the list — high five!</Heading>

          <Text style={paragraph}>
            Thanks for joining the waitlist. We&apos;re building a couples app to
            help you stay aligned, track shared goals, and plan your future
            together.
          </Text>

          <Text style={paragraph}>
            We&apos;ll email you when High Five Moments is ready for early
            access. No spam — just launch updates and the occasional peek at
            what we&apos;re building.
          </Text>

          <Section style={ctaSection}>
            <Button href={siteUrl} style={button}>
              Visit highfivemoments.app
            </Button>
          </Section>

          <Text style={footer}>
            High Five Moments · Planning your future together
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#FAFAF9",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "520px",
};

const badge = {
  marginBottom: "24px",
};

const badgeText = {
  color: "#F59E0B",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0",
};

const heading = {
  color: "#1E293B",
  fontSize: "28px",
  fontWeight: "700" as const,
  lineHeight: "1.3",
  margin: "0 0 20px",
};

const paragraph = {
  color: "#1E293B",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
  opacity: 0.85,
};

const ctaSection = {
  margin: "32px 0",
};

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "12px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600" as const,
  padding: "14px 28px",
  textDecoration: "none",
};

const footer = {
  color: "#1E293B",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "32px 0 0",
  opacity: 0.5,
};
