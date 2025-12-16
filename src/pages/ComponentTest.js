import ChatComponent from "../components/common/ChatComponent";
import TimerComponent from "../components/common/TimerComponent";

const ComponentTest = () => {
  return (
    <>
      <TimerComponent end={"2025-12-17T02:29:00"}></TimerComponent>
      <ChatComponent></ChatComponent>
    </>
  );
};

export default ComponentTest;
