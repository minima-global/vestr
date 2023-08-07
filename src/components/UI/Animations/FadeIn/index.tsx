import { useTransition, animated } from "@react-spring/web";

interface IProps {
  children: any;
  delay: number;
  loop?: boolean;
  isOpen?: boolean;
}

const FadeIn = ({ isOpen = true, children, delay, loop = false }: IProps) => {
  const transition = useTransition(isOpen, {
    from: {
      opacity: 0,
    },
    enter: {
      display: "flex",
      opacity: 1,
      height: "100%",
      zIndex: "42",
    },
    leave: {
      opacity: 0,
    },
    delay: delay,
    loop: loop,
  });

  return (
    <>
      {transition(
        // @ts-ignore
        (style, isOpen) =>
          !!isOpen && <animated.div style={style}>{children}</animated.div>
      )}
    </>
  );
};

export default FadeIn;
