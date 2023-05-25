import { NavLink } from "react-router-dom";
import styles from "./Dashboard.module.css";
import Dialog from "../../components/dialog";
const Dashboard = () => {
  return (
    <>
      {/* <Dialog
        title="Transaction in progress"
        subtitle={<p>0.001</p>}
        buttonTitle="Confirm"
        dismiss={true}
      /> */}
      <div className={styles["grid"]}>
        <header>
          <div>
            <img alt="brand" src="./assets/brand.svg" />
            <h6>Vestr</h6>
          </div>
          <div />
        </header>
        <main>
          <section>bla bloo bla</section>
        </main>
        <footer>
          <nav>
            <NavLink
              to="/contracts"
              className={({ isActive }) => (isActive ? styles.isActive : "")}
            >
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_9_3544"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="33"
                  height="32"
                >
                  <rect x="0.166748" width="32" height="32" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_9_3544)">
                  <path
                    d="M16.2917 29L3.29175 18.6194L4.92741 17.342L16.2917 26.395L27.6561 17.342L29.2917 18.6194L16.2917 29ZM16.2917 22.7612L3.29175 12.3806L16.2917 2L29.2917 12.3806L16.2917 22.7612ZM16.2917 20.1562L26.0388 12.3806L16.2917 4.61548L6.54474 12.3806L16.2917 20.1562Z"
                    fill="#E9E9EB"
                  />
                </g>
              </svg>

              <p>Contracts</p>
            </NavLink>
            <NavLink
              to="/calculate"
              className={({ isActive }) => (isActive ? styles.isActive : "")}
            >
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_7_2444"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="33"
                  height="32"
                >
                  <rect x="0.5" width="32" height="32" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_7_2444)">
                  <path
                    d="M11.2727 23.9934H12.7V21.1917H15.5017V19.7644H12.7V16.9713H11.2727V19.7644H8.47955V21.1917H11.2727V23.9934ZM18.1873 22.908H24.4573V21.4943H18.1873V22.908ZM18.1873 19.4618H24.4573V18.0345H18.1873V19.4618ZM19.3359 14.1165L21.2795 12.1644L23.2317 14.1165L24.2504 13.0892L22.2983 11.1405L24.2504 9.18833L23.2317 8.16956L21.2795 10.1131L19.3359 8.16956L18.3086 9.18833L20.2607 11.1405L18.3086 13.0892L19.3359 14.1165ZM8.88981 11.8499H15.0829V10.4225H8.88981V11.8499ZM7.25221 27.3336C6.67915 27.3336 6.1883 27.1293 5.77968 26.7207C5.37106 26.312 5.16675 25.8212 5.16675 25.2481V6.75246C5.16675 6.17939 5.37106 5.68855 5.77968 5.27993C6.1883 4.8713 6.67915 4.66699 7.25221 4.66699H25.7479C26.3209 4.66699 26.8118 4.8713 27.2204 5.27993C27.629 5.68855 27.8333 6.17939 27.8333 6.75246V25.2481C27.8333 25.8212 27.629 26.312 27.2204 26.7207C26.8118 27.1293 26.3209 27.3336 25.7479 27.3336H7.25221ZM7.25221 25.6584H25.7479C25.8505 25.6584 25.9445 25.6157 26.0299 25.5302C26.1154 25.4447 26.1582 25.3507 26.1582 25.2481V6.75246C26.1582 6.64988 26.1154 6.55586 26.0299 6.47039C25.9445 6.38491 25.8505 6.34216 25.7479 6.34216H7.25221C7.14964 6.34216 7.05561 6.38491 6.97015 6.47039C6.88466 6.55586 6.84191 6.64988 6.84191 6.75246V25.2481C6.84191 25.3507 6.88466 25.4447 6.97015 25.5302C7.05561 25.6157 7.14964 25.6584 7.25221 25.6584Z"
                    fill="#E9E9EB"
                  />
                </g>
              </svg>

              <p>Calculate</p>
            </NavLink>
          </nav>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
