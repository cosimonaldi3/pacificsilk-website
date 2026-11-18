import Image from "next/image";
import type { TeamMember } from "@/content/about";

interface TeamMemberCardProps {
  member: TeamMember;
  /* "lead" for the management pair, "compact" for everyone else */
  size: "lead" | "compact";
}

export default function TeamMemberCard({ member, size }: TeamMemberCardProps) {
  const isLead = size === "lead";

  return (
    <div>
      {/* Photo area */}
      <div className="aspect-square w-full mb-6 overflow-hidden bg-psc-muted">
        {member.placeholder || !member.photo ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-h1 text-psc-gray">{member.initials}</span>
          </div>
        ) : (
          <Image
            src={member.photo}
            alt={member.name}
            width={600}
            height={600}
            sizes={isLead ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"}
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 15%",
              filter: "grayscale(100%) brightness(0.88) contrast(1.05)",
            }}
          />
        )}
      </div>
      {/* Company */}
      {/* Company: set in the logo's display serif, caps, wide tracking */}
      <div className="font-display text-[1.0625rem] font-semibold leading-none text-psc-red uppercase tracking-[0.18em] mb-2">
        {member.company}
      </div>
      {/* Name */}
      <div
        className={`font-display font-medium text-psc-ink mb-1 ${
          isLead ? "text-h3" : "text-[1.375rem] leading-snug"
        }`}
      >
        {member.name}
      </div>
      {/* Title */}
      <div className="font-sans text-small text-psc-gray mb-4">{member.title}</div>
      {/* Bio */}
      <p className="font-sans text-small leading-body text-psc-gray">{member.bio}</p>
    </div>
  );
}
