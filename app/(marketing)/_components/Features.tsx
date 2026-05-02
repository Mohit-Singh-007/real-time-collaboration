const features = [
  {
    icon: "⚡",
    name: "Real-time sync",
    desc: "Every keystroke synced instantly across all collaborators. No refresh, no merge conflicts, no lost work.",
  },
  {
    icon: "👥",
    name: "Live presence",
    desc: "See exactly where your teammates are in the document with live cursors and avatar indicators.",
  },
  {
    icon: "🔐",
    name: "Role-based access",
    desc: "Owner, editor, viewer — share exactly as much as you intend to with granular permissions.",
  },
  {
    icon: "📜",
    name: "Version history",
    desc: "Every change is tracked. Rewind to any point in your document's history with one click.",
  },
  {
    icon: "💬",
    name: "Inline comments",
    desc: "Leave threaded comments anchored to any part of the document. Resolve when done.",
  },
  {
    icon: "📤",
    name: "Export anywhere",
    desc: "Export your documents as PDF, Markdown, or DOCX with a single click.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-5xl mx-auto px-6 py-24">
      <p className="text-xs font-medium uppercase tracking-widest text-[#c8601a] mb-4">
        Why Collab
      </p>
      <h2
        className="text-3xl sm:text-4xl leading-tight tracking-tight max-w-[20ch] mb-16"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Everything your team needs to think clearly
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ icon, name, desc }) => (
          <div
            key={name}
            className="p-8 rounded-xl border border-[#ddd8cd] bg-white hover:-translate-y-1 hover:shadow-lg hover:border-[#f0d4bb] transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f0d4bb] flex items-center justify-center text-lg mb-5">
              {icon}
            </div>
            <div className="text-sm font-medium mb-2">{name}</div>
            <div className="text-sm text-[#8a8070] leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
