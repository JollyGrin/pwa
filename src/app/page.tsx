import { InstallPrompt } from "@/components/atom/InstallPrompt";

export default function Home() {
  return (
    <div className="h-screen grid place-items-center bg-gray-600 text-white">
      <div>
        <p>This is a pwa</p>
        <hr />
        <InstallPrompt />
      </div>
    </div>
  );
}
