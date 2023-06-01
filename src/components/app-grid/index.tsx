import styles from "./AppGrid.module.css";

const AppGrid = ({ children }: any) => {
  return (
    <div className={styles["app-grid"]}>
      <header />
      <main>
        <section>{children}</section>
      </main>
      <footer />
    </div>
  );
};

export default AppGrid;
