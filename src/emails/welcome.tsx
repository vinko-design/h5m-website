import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import {
  FOUNDER_NAME,
  FOUNDER_TITLE,
  FOUNDER_X_URL,
  SITE_NAME,
} from "@/lib/site-config";
import { BRAND_INDIGO, LOGO_VIEWBOX } from "@/lib/logo-paths";

interface WelcomeEmailProps {
  siteUrl?: string;
  unsubscribeUrl: string;
  mailingAddress: string;
  contactEmail: string;
}

const LOGO_HEIGHT = 36;
const LOGO_WIDTH = Math.round(
  (LOGO_VIEWBOX.width / LOGO_VIEWBOX.height) * LOGO_HEIGHT,
);

export default function WelcomeEmail({
  siteUrl = "https://highfivemoments.app",
  unsubscribeUrl,
  mailingAddress,
  contactEmail,
}: WelcomeEmailProps) {
  const logoUrl = `${siteUrl}/high-five-moments-logo-email.png`;

  return (
    <Html>
      <Head />
      <Preview>Thanks for joining the waitlist.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandSection} align="center">
            <Row align="center" width="auto">
              <Column align="right" style={logoColumn}>
                <Img
                  src={logoUrl}
                  alt=""
                  width={LOGO_WIDTH}
                  height={LOGO_HEIGHT}
                  style={logo}
                />
              </Column>
              <Column align="left" style={brandNameColumn}>
                <Text style={brandName}>{SITE_NAME}</Text>
              </Column>
            </Row>
          </Section>

          <Heading style={heading}>
            You&apos;re on the list - high five! 🖐️
          </Heading>

          <Text style={paragraph}>Thanks for joining the waitlist.</Text>

          <Text style={paragraph}>
            We&apos;re building an app that helps couples create more high-five
            moments.
          </Text>

          <Text style={paragraph}>
            You&apos;ll be among the first to hear when early access opens.
            Until then, I&apos;ll occasionally share meaningful updates as I
            build. No spam, just progress worth sharing.
          </Text>

          <Text style={paragraph}>
            Thanks for believing in what we&apos;re building. It genuinely means
            a lot.
          </Text>

          <Text style={signOff}>
            {FOUNDER_NAME}
            <br />
            {FOUNDER_TITLE}
          </Text>

          <Text style={footer}>
            <Link href={FOUNDER_X_URL} style={footerLink}>
              Follow the journey on X
            </Link>
          </Text>

          <Text style={complianceFooter}>
            {mailingAddress}
            <br />
            {contactEmail}
            <br />
            <Link href={unsubscribeUrl} style={footerLink}>
              Unsubscribe from launch updates
            </Link>
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
  padding: "48px 24px 56px",
  maxWidth: "480px",
};

const brandSection = {
  margin: "0 0 40px",
};

const logoColumn = {
  width: `${LOGO_WIDTH}px`,
  paddingRight: "10px",
};

const brandNameColumn = {
  width: "auto",
};

const logo = {
  display: "block",
};

const brandName = {
  color: BRAND_INDIGO,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: "18px",
  fontWeight: "800" as const,
  letterSpacing: "-0.02em",
  lineHeight: `${LOGO_HEIGHT}px`,
  margin: "0",
};

const heading = {
  color: "#1E293B",
  fontSize: "24px",
  fontWeight: "600" as const,
  lineHeight: "1.35",
  margin: "0 0 28px",
  letterSpacing: "-0.01em",
};

const paragraph = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "1.7",
  margin: "0 0 20px",
};

const signOff = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "36px 0 0",
};

const footer = {
  textAlign: "center" as const,
  margin: "48px 0 0",
};

const complianceFooter = {
  color: "#64748B",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "32px 0 0",
  textAlign: "center" as const,
};

const footerLink = {
  color: "#6366F1",
  fontSize: "13px",
  textDecoration: "underline",
};
