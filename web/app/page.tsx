import WeatherApp from "@/components/main";
import Toolbar from "@/components/Toolbar";

export default function Page() {
  return (
    <>
      <Toolbar title="Weather" />
      <WeatherApp />
    </>
  );
}
