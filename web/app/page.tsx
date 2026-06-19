import type { Metadata } from "next";
import styles from "./page.module.css";

export default function Home() {
  return (
<main className={styles.main}>
  <h1>Hello world!</h1> 
  <p>Vamora Weather is under development</p> 
</main>
  );
}
