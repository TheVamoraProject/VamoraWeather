import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Vamora Weather",
  description: "Weather forecasts powered by Vamora",
};

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Hello world!</h1>
      <p>Vamora Weather is under development</p>
    </main>
  );
}
