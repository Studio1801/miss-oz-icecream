import "./_group.css";
import "./Current.css";
import MeetOz from "./_shared/MeetOz";
import Story from "./_shared/Story";

export function Current() {
  return (
    <main className="page-content-gutter min-h-screen">
      <MeetOz />
      <Story />
    </main>
  );
}
