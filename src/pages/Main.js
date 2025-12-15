import styled from "styled-components";

const MainImg = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  width: 1150px;
  height: 765px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Main = () => {
  return (
    <>
      <MainImg>
        <img src="/images/Component1.png" alt="dd" />
      </MainImg>
    </>
  );
};

export default Main;
