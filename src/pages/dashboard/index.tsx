import { NavLink, Outlet } from "react-router-dom";
import styles from "./Dashboard.module.css";
import useGetInnerHeight from "../../hooks/useGetInnerHeight";
// @ts-ignore
import { useKeyboardOffset } from "virtual-keyboard-offset";
const Dashboard = () => {
  const innerHeight = useGetInnerHeight();
  // get the height when the virtual keyboard is open

  const { keyBoardOffset, windowHeight } = useKeyboardOffset();
  console.log(keyBoardOffset, windowHeight);

  return (
    <>
      <div
        className={`${styles.grid}`}
        style={{
          height: `${
            keyBoardOffset.length ? windowHeight + "px" : innerHeight + "px"
          }`,
        }}
      >
        <header>
          <div>
            <img alt="brand" src="./assets/brand.svg" />
            <h6>Vestr</h6>
          </div>
          <div />
        </header>
        <main>
          <section>
            <section></section>
            <Outlet />
          </section>
        </main>
        <footer>
          <section>
            <nav>
              <NavLink
                to="creator"
                className={({ isActive }) => (isActive ? styles.isActive : "")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <mask
                    id="mask0_33_7681"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="25"
                    height="24"
                  >
                    <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_33_7681)">
                    <path
                      d="M5.09813 20.4614C4.7802 20.5319 4.50649 20.4524 4.27699 20.2229C4.0475 19.9934 3.96802 19.7197 4.03853 19.4018L4.87506 15.3864L9.11346 19.6248L5.09813 20.4614ZM9.11346 19.6248L4.87506 15.3864L16.0943 4.1672C16.4392 3.82233 16.8661 3.6499 17.375 3.6499C17.884 3.6499 18.3109 3.82233 18.6558 4.1672L20.3327 5.8441C20.6776 6.18897 20.85 6.61589 20.85 7.12485C20.85 7.63382 20.6776 8.06073 20.3327 8.4056L9.11346 19.6248ZM17.1635 5.22103L6.93848 15.4364L9.06349 17.5614L19.2789 7.3364C19.3366 7.2787 19.3654 7.20658 19.3654 7.12005C19.3654 7.0335 19.3366 6.96138 19.2789 6.90368L17.5962 5.22103C17.5385 5.16333 17.4664 5.13448 17.3798 5.13448C17.2933 5.13448 17.2212 5.16333 17.1635 5.22103Z"
                      fill="#E9E9EB"
                    />
                  </g>
                </svg>

                <p>Creator</p>
              </NavLink>
              <NavLink
                to="collector"
                className={({ isActive }) => (isActive ? styles.isActive : "")}
              >
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_33_8002"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="25"
                    height="24"
                  >
                    <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_33_8002)">
                    <path
                      d="M14.4015 21.7617L6.71818 19.545V20.9079H2.01953V11.8926H9.06946L15.2772 14.2016C15.6857 14.3516 16.031 14.6087 16.313 14.973C16.5951 15.3373 16.7361 15.8314 16.7361 16.4554H19.6554C20.3058 16.4554 20.8304 16.6861 21.2291 17.1475C21.6278 17.6089 21.8271 18.2278 21.8271 19.0041V19.4694L14.4015 21.7617ZM3.27591 19.6515H5.44513V13.149H3.27591V19.6515ZM14.3246 20.4515L20.5169 18.5541C20.4614 18.269 20.3587 18.0574 20.2089 17.9191C20.0591 17.7809 19.8746 17.7118 19.6554 17.7118H14.7272C14.2537 17.7118 13.7994 17.68 13.3644 17.6166C12.9293 17.5531 12.5238 17.46 12.1477 17.3374L10.1682 16.7079L10.6272 15.4861L12.4849 16.1156C12.8605 16.2421 13.2485 16.3304 13.649 16.3804C14.0494 16.4304 14.6438 16.4554 15.4323 16.4554C15.4323 16.2011 15.3844 15.978 15.2887 15.7861C15.193 15.5942 15.0472 15.4601 14.8515 15.3836L8.86948 13.149H6.71818V18.2284L14.3246 20.4515Z"
                      fill="#E9E9EB"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.7426 10.9319C18.7639 10.9319 20.4026 9.29324 20.4026 7.27188C20.4026 5.25051 18.7639 3.61188 16.7426 3.61188C14.7212 3.61188 13.0826 5.25051 13.0826 7.27188C13.0826 9.29324 14.7212 10.9319 16.7426 10.9319ZM16.7426 12.3719C19.5592 12.3719 21.8426 10.0885 21.8426 7.27188C21.8426 4.45522 19.5592 2.17188 16.7426 2.17188C13.9259 2.17188 11.6426 4.45522 11.6426 7.27188C11.6426 10.0885 13.9259 12.3719 16.7426 12.3719Z"
                      fill="#E9E9EB"
                    />
                  </g>
                </svg>

                <p>Collector</p>
              </NavLink>
              <NavLink
                to="about"
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
                    id="mask0_14_3002"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="33"
                    height="32"
                  >
                    <rect x="0.833496" width="32" height="32" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_14_3002)">
                    <path
                      d="M16.9179 23.3745C17.2416 23.3745 17.5158 23.2604 17.7406 23.0323C17.9654 22.8042 18.0778 22.5282 18.0778 22.2045C18.0778 21.8865 17.9652 21.6137 17.7399 21.386C17.5146 21.1584 17.2401 21.0446 16.9164 21.0446C16.5927 21.0446 16.317 21.1587 16.0894 21.3868C15.8618 21.6149 15.7479 21.8879 15.7479 22.206C15.7479 22.5297 15.862 22.8054 16.0901 23.033C16.3182 23.2606 16.5941 23.3745 16.9179 23.3745ZM15.9872 18.7266H17.6248C17.6362 18.1454 17.725 17.6444 17.891 17.2236C18.0572 16.8028 18.4733 16.297 19.1393 15.7061C19.7769 15.1198 20.2412 14.5701 20.5321 14.057C20.8229 13.5439 20.9684 12.9657 20.9684 12.3225C20.9684 11.2079 20.5913 10.3174 19.8372 9.65103C19.0831 8.98465 18.1382 8.65146 17.0026 8.65146C15.9741 8.65146 15.0848 8.91912 14.3347 9.45443C13.5845 9.98976 13.0374 10.6645 12.6932 11.4788L14.194 12.0668C14.4168 11.5215 14.7496 11.0684 15.1923 10.7074C15.6351 10.3464 16.2134 10.1659 16.9274 10.1659C17.7337 10.1659 18.3523 10.3863 18.7834 10.8271C19.2144 11.2678 19.43 11.7922 19.43 12.4002C19.43 12.8714 19.2964 13.307 19.0291 13.707C18.7619 14.107 18.3907 14.5124 17.9154 14.9232C17.1907 15.5717 16.6881 16.1617 16.4078 16.6933C16.1274 17.2249 15.9872 17.9027 15.9872 18.7266ZM16.8356 28.6668C15.0928 28.6668 13.4521 28.3343 11.9134 27.6694C10.3747 27.0045 9.03156 26.0985 7.88385 24.9513C6.73614 23.8041 5.82969 22.4615 5.16451 20.9235C4.49934 19.3855 4.16675 17.7451 4.16675 16.0024C4.16675 14.2505 4.49919 12.6037 5.16408 11.0622C5.82897 9.5207 6.73501 8.17979 7.88221 7.0395C9.02941 5.89919 10.372 4.99644 11.91 4.33126C13.448 3.66609 15.0884 3.3335 16.8311 3.3335C18.5831 3.3335 20.2298 3.66594 21.7713 4.33083C23.3128 4.99572 24.6537 5.89805 25.794 7.03783C26.9343 8.17763 27.8371 9.51795 28.5022 11.0588C29.1674 12.5996 29.5 14.246 29.5 15.9979C29.5 17.7407 29.1676 19.3814 28.5027 20.9201C27.8378 22.4588 26.9355 23.802 25.7957 24.9497C24.6559 26.0974 23.3156 27.0038 21.7747 27.669C20.2339 28.3342 18.5875 28.6668 16.8356 28.6668ZM16.8334 26.9916C19.8955 26.9916 22.4929 25.9229 24.6257 23.7856C26.7585 21.6483 27.8249 19.0531 27.8249 16.0001C27.8249 12.938 26.7585 10.3406 24.6257 8.20783C22.4929 6.07505 19.8955 5.00866 16.8334 5.00866C13.7804 5.00866 11.1852 6.07505 9.04791 8.20783C6.91058 10.3406 5.84191 12.938 5.84191 16.0001C5.84191 19.0531 6.91058 21.6483 9.04791 23.7856C11.1852 25.9229 13.7804 26.9916 16.8334 26.9916Z"
                      fill="#E9E9EB"
                    />
                  </g>
                </svg>

                <p>About</p>
              </NavLink>
            </nav>
          </section>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
