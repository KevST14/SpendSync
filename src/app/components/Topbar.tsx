import { initials } from "@/lib/settings";

export default function Topbar({ name }: { name: string }) {
  return (
    <div className="topbar">
      <span className="avatar" aria-hidden="true">
        {initials(name)}
      </span>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
